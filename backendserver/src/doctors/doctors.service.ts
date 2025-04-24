
import { Injectable } from '@nestjs/common';
import { DoctorDto, FilterOptionsDto, DoctorFilterDto } from './dto/doctor.dto';

@Injectable()
export class DoctorsService {
  // In-memory cache of doctors to simulate a database
  private doctors: DoctorDto[] = [];

  constructor() {
    // Load initial doctors data
    this.loadInitialData();
  }

  private loadInitialData() {
    // This would normally be a database connection
    // For now we're using the same data but acting as if it comes from a DB
    try {
      // Simulate fetching from database
      console.log('Connecting to doctors database...');
      
      // Using require to import the JSON file only once during initialization
      // In a real implementation, this would be a database query
      const doctorsData = require('../../data/doctors.json');
      this.doctors = doctorsData;
      
      console.log(`Successfully loaded ${this.doctors.length} doctors from database`);
    } catch (error) {
      console.error('Database connection error:', error);
      this.doctors = [];
    }
  }

  async findAll(filters: DoctorFilterDto = {}): Promise<DoctorDto[]> {
    // Simulate database query with filters
    console.log('Executing database query with filters:', filters);
    
    let filteredDoctors = [...this.doctors];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.area?.toLowerCase().includes(searchTerm) ||
        doctor.city.toLowerCase().includes(searchTerm)
      );
    }

    // Apply other filters
    if (filters.specialty) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.specialty === filters.specialty
      );
    }

    if (filters.city) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.city === filters.city
      );
    }

    if (filters.area) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.area === filters.area
      );
    }

    if (filters.rating) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.rating >= filters.rating
      );
    }

    if (filters.available !== undefined) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.available === filters.available
      );
    }

    console.log(`Query returned ${filteredDoctors.length} results`);
    return filteredDoctors;
  }

  async findOne(id: string): Promise<DoctorDto | undefined> {
    // Simulate database findOne query
    console.log(`Looking up doctor with ID: ${id}`);
    return this.doctors.find(doctor => doctor.id === id);
  }

  async getFilterOptions(): Promise<FilterOptionsDto> {
    // Simulate aggregation queries that would normally be done in the database
    console.log('Retrieving filter options from database...');
    
    const specialties = [...new Set(this.doctors.map(doctor => doctor.specialty))];
    const cities = [...new Set(this.doctors.map(doctor => doctor.city))];
    const areas = [...new Set(this.doctors.map(doctor => doctor.area).filter(Boolean))];

    return { specialties, cities, areas };
  }

  // Methods for future CRUD operations
  async create(doctorDto: DoctorDto): Promise<DoctorDto> {
    // Simulate database insert operation
    console.log('Creating new doctor record:', doctorDto.name);
    this.doctors.push(doctorDto);
    return doctorDto;
  }

  async update(id: string, doctorDto: Partial<DoctorDto>): Promise<DoctorDto | undefined> {
    // Simulate database update operation
    console.log(`Updating doctor with ID: ${id}`);
    const index = this.doctors.findIndex(doctor => doctor.id === id);
    if (index === -1) {
      return undefined;
    }

    this.doctors[index] = { ...this.doctors[index], ...doctorDto };
    return this.doctors[index];
  }

  async remove(id: string): Promise<boolean> {
    // Simulate database delete operation
    console.log(`Deleting doctor with ID: ${id}`);
    const index = this.doctors.findIndex(doctor => doctor.id === id);
    if (index === -1) {
      return false;
    }

    this.doctors.splice(index, 1);
    return true;
  }
}
