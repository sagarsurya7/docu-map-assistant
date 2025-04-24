
import { Injectable } from '@nestjs/common';
import { DoctorDto, FilterOptionsDto, DoctorFilterDto } from './dto/doctor.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class DoctorsService {
  private doctors: DoctorDto[] = [];
  private readonly dataPath = path.join(__dirname, '../../data/doctors.json');

  constructor() {
    this.loadDoctors().catch(err => {
      console.error('Failed to load doctors:', err);
      // Initialize with empty array if file doesn't exist yet
      this.doctors = [];
    });
  }

  private async loadDoctors() {
    try {
      // Create data directory if it doesn't exist
      const dataDir = path.dirname(this.dataPath);
      await fs.mkdir(dataDir, { recursive: true });
      
      // Try to read the doctors file
      const data = await fs.readFile(this.dataPath, 'utf8');
      this.doctors = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet, initialize with empty array
      this.doctors = [];
      // Create the file with empty array
      await fs.writeFile(this.dataPath, JSON.stringify([], null, 2));
    }
  }

  private async saveDoctors() {
    await fs.writeFile(this.dataPath, JSON.stringify(this.doctors, null, 2));
  }

  async findAll(filters: DoctorFilterDto = {}): Promise<DoctorDto[]> {
    let filteredDoctors = [...this.doctors];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.area.toLowerCase().includes(searchTerm) ||
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

    return filteredDoctors;
  }

  async findOne(id: string): Promise<DoctorDto | undefined> {
    return this.doctors.find(doctor => doctor.id === id);
  }

  async getFilterOptions(): Promise<FilterOptionsDto> {
    const specialties = [...new Set(this.doctors.map(doctor => doctor.specialty))];
    const cities = [...new Set(this.doctors.map(doctor => doctor.city))];
    const areas = [...new Set(this.doctors.map(doctor => doctor.area))];

    return { specialties, cities, areas };
  }

  // Methods for future CRUD operations
  async create(doctorDto: DoctorDto): Promise<DoctorDto> {
    this.doctors.push(doctorDto);
    await this.saveDoctors();
    return doctorDto;
  }

  async update(id: string, doctorDto: Partial<DoctorDto>): Promise<DoctorDto | undefined> {
    const index = this.doctors.findIndex(doctor => doctor.id === id);
    if (index === -1) {
      return undefined;
    }

    this.doctors[index] = { ...this.doctors[index], ...doctorDto };
    await this.saveDoctors();
    return this.doctors[index];
  }

  async remove(id: string): Promise<boolean> {
    const index = this.doctors.findIndex(doctor => doctor.id === id);
    if (index === -1) {
      return false;
    }

    this.doctors.splice(index, 1);
    await this.saveDoctors();
    return true;
  }
}
