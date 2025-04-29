
import { BaseMessage } from '@langchain/core/messages';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { RunnableSequence } from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export class SymptomAnalyzerAgent {
  private model: ChatOllama;
  
  constructor() {
    this.model = new ChatOllama({
      baseUrl: process.env.OLLAMA_BASE_URL,
      model: process.env.OLLAMA_MODEL,
    });
  }

  private readonly analyzeTemplate = ChatPromptTemplate.fromMessages([
    ["system", "You are a medical symptom analyzer. Given a set of symptoms, determine the most likely medical specialty needed."],
    ["human", "Symptoms: {symptoms}"],
  ]);

  async analyzeSymptoms(symptoms: string): Promise<string> {
    const chain = RunnableSequence.from([
      this.analyzeTemplate,
      this.model,
      new StringOutputParser(),
    ]);

    const response = await chain.invoke({
      symptoms,
    });

    return this.mapToSpecialty(response);
  }

  private mapToSpecialty(analysis: string): string {
    // Map common symptoms to specialties
    const specialtyMap: Record<string, string[]> = {
      dermatology: ['rash', 'skin', 'acne', 'itch'],
      cardiology: ['chest pain', 'heart', 'palpitation'],
      neurology: ['headache', 'migraine', 'dizziness'],
      orthopedics: ['joint pain', 'back pain', 'fracture'],
      // Add more mappings as needed
    };

    const lowerAnalysis = analysis.toLowerCase();
    for (const [specialty, symptoms] of Object.entries(specialtyMap)) {
      if (symptoms.some(symptom => lowerAnalysis.includes(symptom))) {
        return specialty;
      }
    }

    return 'general medicine'; // Default specialty
  }
}
