import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorDto, FilterOptionsDto, DoctorFilterDto } from './dto/doctor.dto';
import { Doctor } from './schemas/doctor.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DoctorsService implements OnModuleInit {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>
  ) {}

  private getMockData(): any[] {
    return [
      {
        id: "pune-001",
        name: "Dr. Rajesh Sharma",
        specialty: "Cardiology",
        address: "123 FC Road, Pune",
        area: "FC Road",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        rating: 4.8,
        experience: 15,
        languages: ["English", "Hindi", "Marathi"],
        education: ["MBBS", "MD Cardiology"],
        available: true,
        consultationFee: 800,
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        gender: "male",
        location: { lat: 18.5204, lng: 73.8567 }
      },
      {
        id: "pune-002",
        name: "Dr. Priya Patel",
        specialty: "General Medicine",
        address: "456 Camp Area, Pune",
        area: "Camp",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        rating: 4.6,
        experience: 12,
        languages: ["English", "Hindi", "Gujarati"],
        education: ["MBBS", "MD Internal Medicine"],
        available: true,
        consultationFee: 600,
        imageUrl: "https://images.unsplash.com/photo-1594824204024-7e0b1c6bfb3b?w=150&h=150&fit=crop&crop=face",
        gender: "female",
        location: { lat: 18.5195, lng: 73.8553 }
      },
      {
        id: "pune-003",
        name: "Dr. Amit Desai",
        specialty: "Infectious Disease",
        address: "789 Kothrud, Pune",
        area: "Kothrud",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        rating: 4.7,
        experience: 10,
        languages: ["English", "Hindi", "Marathi"],
        education: ["MBBS", "MD Infectious Diseases"],
        available: true,
        consultationFee: 700,
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        gender: "male",
        location: { lat: 18.5074, lng: 73.8077 }
      },
      {
        id: "pune-004",
        name: "Dr. Meera Joshi",
        specialty: "Pediatrics",
        address: "321 Baner Road, Pune",
        area: "Baner",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        rating: 4.9,
        experience: 8,
        languages: ["English", "Hindi", "Marathi"],
        education: ["MBBS", "MD Pediatrics"],
        available: true,
        consultationFee: 650,
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        gender: "female",
        location: { lat: 18.5599, lng: 73.7769 }
      },
      {
        id: "pune-005",
        name: "Dr. Vikram Kulkarni",
        specialty: "Orthopedics",
        address: "654 Wakad, Pune",
        area: "Wakad",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        rating: 4.5,
        experience: 20,
        languages: ["English", "Hindi", "Marathi"],
        education: ["MBBS", "MS Orthopedics"],
        available: true,
        consultationFee: 900,
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        gender: "male",
        location: { lat: 18.5975, lng: 73.7898 }
      },
      {
        id: "mumbai-001",
        name: "Dr. Anand Rao",
        specialty: "Neurology",
        address: "123 Bandra West, Mumbai",
        area: "Bandra",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        rating: 4.8,
        experience: 18,
        languages: ["English", "Hindi", "Marathi"],
        education: ["MBBS", "DM Neurology"],
        available: true,
        consultationFee: 1200,
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        gender: "male",
        location: { lat: 19.0596, lng: 72.8295 }
      },
      {
        id: "mumbai-002",
        name: "Dr. Sunita Shah",
        specialty: "Dermatology",
        address: "456 Juhu, Mumbai",
        area: "Juhu",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        rating: 4.7,
        experience: 14,
        languages: ["English", "Hindi", "Gujarati"],
        education: ["MBBS", "MD Dermatology"],
        available: true,
        consultationFee: 1000,
        imageUrl: "https://images.unsplash.com/photo-1594824204024-7e0b1c6bfb3b?w=150&h=150&fit=crop&crop=face",
        gender: "female",
        location: { lat: 19.1075, lng: 72.8263 }
      },
      {
        id: "delhi-001",
        name: "Dr. Rohit Gupta",
        specialty: "General Medicine",
        address: "789 CP, New Delhi",
        area: "Connaught Place",
        city: "Delhi",
        state: "Delhi",
        country: "India",
        rating: 4.6,
        experience: 16,
        languages: ["English", "Hindi"],
        education: ["MBBS", "MD Internal Medicine"],
        available: true,
        consultationFee: 800,
        imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
        gender: "male",
        location: { lat: 28.6315, lng: 77.2167 }
      },
      {
        id: "bangalore-001",
        name: "Dr. Kavya Reddy",
        specialty: "Cardiology",
        address: "321 Koramangala, Bangalore",
        area: "Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        country: "India",
        rating: 4.9,
        experience: 12,
        languages: ["English", "Hindi", "Kannada"],
        education: ["MBBS", "DM Cardiology"],
        available: true,
        consultationFee: 900,
        imageUrl: "https://images.unsplash.com/photo-1594824204024-7e0b1c6bfb3b?w=150&h=150&fit=crop&crop=face",
        gender: "female",
        location: { lat: 12.9279, lng: 77.6271 }
      },
      {
        id: "pune-006",
        name: "Dr. Sanjay Patil",
        specialty: "ENT",
        address: "987 Pimpri, Pune",
        area: "Pimpri",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        rating: 4.4,
        experience: 9,
        languages: ["English", "Hindi", "Marathi"],
        education: ["MBBS", "MS ENT"],
        available: true,
        consultationFee: 550,
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
        gender: "male",
        location: { lat: 18.6298, lng: 73.7997 }
      }
    ];
  }

  async onModuleInit() {
    // Check if we have any doctors in the database
    const count = await this.doctorModel.countDocuments();
    console.log(`Database initialization: Found ${count} doctors in MongoDB`);
    
    if (count === 0) {
      console.log('No doctors found in database, seeding with mock data...');
      
      try {
        // First try to load from JSON file
        const dataFilePath = path.join(__dirname, '..', '..', 'data', 'doctors.json');
        
        if (fs.existsSync(dataFilePath)) {
          console.log(`Found doctors.json file at: ${dataFilePath}`);
          const fileData = fs.readFileSync(dataFilePath, 'utf8');
          const jsonData = JSON.parse(fileData);
          
          if (Array.isArray(jsonData) && jsonData.length > 0) {
            await this.doctorModel.insertMany(jsonData);
            console.log(`Database seeded with ${jsonData.length} doctors from JSON file`);
            return;
          }
        }
        
        // If JSON file doesn't exist or is empty, use mock data
        console.log('JSON file not found or empty, using mock data...');
        const mockData = this.getMockData();
        await this.doctorModel.insertMany(mockData);
        console.log(`Database seeded with ${mockData.length} mock doctors`);
        
        // Log Pune doctors specifically
        const puneCount = mockData.filter(doc => doc.city === 'Pune').length;
        console.log(`Mock data includes ${puneCount} Pune doctors`);
        
      } catch (error) {
        console.error('Error seeding the database:', error);
        
        // Fallback to mock data if JSON parsing fails
        try {
          const mockData = this.getMockData();
          await this.doctorModel.insertMany(mockData);
          console.log(`Fallback: Database seeded with ${mockData.length} mock doctors`);
        } catch (fallbackError) {
          console.error('Failed to seed with mock data as well:', fallbackError);
        }
      }
    } else {
      // Log existing Pune doctors
      const puneCount = await this.doctorModel.countDocuments({ city: 'Pune' });
      console.log(`Database already has data. Pune doctors count: ${puneCount}`);
    }
  }

  async findAll(filters: DoctorFilterDto = {}): Promise<DoctorDto[]> {
    console.log('Executing MongoDB query with filters:', filters);
    
    let query = this.doctorModel.find();
    
    // Add this for debugging
    console.log('MongoDB query before filters:', JSON.stringify(query.getFilter()));

    if (filters.search) {
      const searchRegex = new RegExp(filters.search, 'i');
      query = query.or([
        { name: searchRegex },
        { specialty: searchRegex },
        { area: searchRegex },
        { city: searchRegex }
      ]);
    }

    if (filters.specialty) {
      query = query.where('specialty').equals(filters.specialty);
    }

    if (filters.city) {
      query = query.where('city').equals(filters.city);
    }

    if (filters.area) {
      query = query.where('area').equals(filters.area);
    }

    if (filters.rating) {
      query = query.where('rating').gte(filters.rating);
    }

    if (filters.available !== undefined) {
      query = query.where('available').equals(filters.available);
    }

    // Add this for debugging
    console.log('MongoDB query after filters:', JSON.stringify(query.getFilter()));

    try {
      const doctors = await query.exec();
      console.log(`Query returned ${doctors.length} results from MongoDB`);
      
      // Log Pune doctors specifically
      const puneResults = doctors.filter(doc => doc.city === 'Pune');
      console.log(`Query returned ${puneResults.length} Pune doctors`);
      
      if (doctors.length === 0) {
        console.log('No doctors found. Checking if database has any doctors...');
        const totalDoctors = await this.doctorModel.countDocuments();
        console.log(`Total doctors in database: ${totalDoctors}`);
      }
      
      return doctors;
    } catch (error) {
      console.error('Error executing MongoDB query:', error);
      throw error;
    }
  }

  // Helper method to clear all doctors from database
  async clearAllDoctors(): Promise<void> {
    try {
      const result = await this.doctorModel.deleteMany({});
      console.log(`Cleared ${result.deletedCount} doctors from database`);
    } catch (error) {
      console.error('Error clearing doctors from database:', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<DoctorDto | undefined> {
    console.log(`Looking up doctor with ID: ${id}`);
    return this.doctorModel.findOne({ id }).exec();
  }

  async getFilterOptions(): Promise<FilterOptionsDto> {
    console.log('Retrieving filter options from database...');
    
    const [specialties, cities, areas] = await Promise.all([
      this.doctorModel.distinct('specialty'),
      this.doctorModel.distinct('city'),
      this.doctorModel.distinct('area')
    ]);

    return { 
      specialties, 
      cities, 
      areas: areas.filter(Boolean) 
    };
  }

  async create(doctorDto: DoctorDto): Promise<DoctorDto> {
    console.log('Creating new doctor record:', doctorDto.name);
    const newDoctor = new this.doctorModel(doctorDto);
    return newDoctor.save();
  }

  async update(id: string, doctorDto: Partial<DoctorDto>): Promise<DoctorDto | undefined> {
    console.log(`Updating doctor with ID: ${id}`);
    return this.doctorModel
      .findOneAndUpdate({ id }, doctorDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    console.log(`Deleting doctor with ID: ${id}`);
    const result = await this.doctorModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }
}
