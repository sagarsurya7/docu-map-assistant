import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Doctor } from './schemas/doctor.schema';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

  // Existing function: Find doctors by specialties, sorted by rating and experience
  async findBySpecialties(specialties: string[]) {
    return this.doctorModel
      .find({ specialty: { $in: specialties } })
      .sort({ rating: -1, experience: -1 })
      .exec();
  }

  // Get all doctors
  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  // Add a new doctor
  async create(doctor: Doctor): Promise<{ message: string; doctor: Doctor }> {
    const newDoctor = new this.doctorModel(doctor);
    await newDoctor.save();
    return { message: 'Doctor added successfully', doctor: newDoctor };
  }
}
