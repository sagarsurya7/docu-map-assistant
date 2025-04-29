import express from 'express';
import cors from 'cors';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import dotenv from 'dotenv';
import { doctors, searchDoctors, filterDoctors, getUniqueSpecialties, getUniqueCities, getUniqueAreas } from './data/doctors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Ollama model
const chat = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "llama2",
});

// Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    // Check if the message is about finding a doctor
    if (message.toLowerCase().includes('find') || 
        message.toLowerCase().includes('search') || 
        message.toLowerCase().includes('doctor')) {
      const searchResults = searchDoctors(message);
      if (searchResults.length > 0) {
        return res.json({
          response: `I found ${searchResults.length} doctors matching your search. Here are some details:\n\n${
            searchResults.map(doctor => 
              `- Dr. ${doctor.name} (${doctor.specialty})\n  Location: ${doctor.area}, ${doctor.city}\n  Rating: ${doctor.rating}/5\n  Experience: ${doctor.experience} years\n  Consultation Fee: ₹${doctor.consultationFee}`
            ).join('\n\n')
          }`
        });
      } else {
        return res.json({
          response: "I couldn't find any doctors matching your search criteria. Please try a different search term or location."
        });
      }
    }

    // Regular chat response
    const response = await chat.invoke([
      new SystemMessage("You are a helpful medical assistant. Provide accurate and helpful information about health-related queries."),
      new HumanMessage(message)
    ]);

    res.json({ response: response.content });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Doctor search endpoint
app.get('/api/doctors', (req, res) => {
  try {
    const { search, specialty, city, area, rating, available } = req.query;
    
    let results = [...doctors];

    // Apply text search if provided
    if (search) {
      results = searchDoctors(search as string);
    }

    // Apply filters
    results = filterDoctors({
      specialty: specialty as string,
      city: city as string,
      area: area as string,
      rating: rating ? Number(rating) : undefined,
      available: available === 'true'
    });

    res.json(results);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get filter options
app.get('/api/doctors/filters', (req, res) => {
  try {
    res.json({
      specialties: getUniqueSpecialties(),
      cities: getUniqueCities(),
      areas: getUniqueAreas()
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 