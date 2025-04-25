
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorDto, FilterOptionsDto, DoctorFilterDto } from './dto/doctor.dto';
import { Doctor } from './schemas/doctor.schema';

@Injectable()
export class DoctorsService implements OnModuleInit {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>
  ) {}

  async onModuleInit() {
    // Check if we have any doctors in the database
    const count = await this.doctorModel.countDocuments();
    if (count === 0) {
      // If no doctors exist, seed the database with initial data
      const initialData = require('../../data/doctors.json');
      await this.doctorModel.insertMany(initialData);
      console.log('Database seeded with initial doctors data');
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
      console.log(`Query returned ${doctors.length} results`);
      
      if (doctors.length === 0) {
        console.log('No doctors found. Checking if database has any doctors...');
        const totalDoctors = await this.doctorModel.countDocuments();
        console.log(`Total doctors in database: ${totalDoctors}`);
        
        if (totalDoctors === 0) {
          console.log('No doctors in database. Attempting to seed data...');
          await this.onModuleInit(); // Try to seed data again
          return this.findAll(filters); // Retry the query
        }
      }
      
      return doctors;
    } catch (error) {
      console.error('Error executing MongoDB query:', error);
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
