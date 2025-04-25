
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorDto, DoctorFilterDto } from './dto/doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async findAll(@Query() filters: DoctorFilterDto) {
    console.log('DoctorsController: findAll endpoint called with filters:', filters);
    try {
      console.log('DoctorsController: Calling doctorsService.findAll()...');
      const result = await this.doctorsService.findAll(filters);
      console.log(`DoctorsController: findAll completed successfully, returning ${result.length} doctors`);
      
      // Log a sample of the data being returned
      if (result.length > 0) {
        console.log('DoctorsController: Sample of first doctor:', JSON.stringify(result[0]).substring(0, 200) + "...");
      } else {
        console.log('DoctorsController: No doctors found in database');
      }
      
      return result;
    } catch (error) {
      console.error('DoctorsController: Error in findAll endpoint:', error);
      throw error;
    }
  }

  @Get('filters')
  async getFilterOptions() {
    console.log('DoctorsController: getFilterOptions endpoint called');
    try {
      const result = await this.doctorsService.getFilterOptions();
      console.log('DoctorsController: getFilterOptions completed successfully');
      console.log('DoctorsController: Filter options:', result);
      return result;
    } catch (error) {
      console.error('DoctorsController: Error in getFilterOptions endpoint:', error);
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`DoctorsController: findOne endpoint called with id: ${id}`);
    try {
      const result = await this.doctorsService.findOne(id);
      console.log('DoctorsController: findOne completed successfully');
      return result;
    } catch (error) {
      console.error(`DoctorsController: Error in findOne endpoint for id ${id}:`, error);
      throw error;
    }
  }

  @Post()
  async create(@Body() doctorDto: DoctorDto) {
    console.log('DoctorsController: create endpoint called');
    try {
      const result = await this.doctorsService.create(doctorDto);
      console.log('DoctorsController: Doctor created successfully');
      return result;
    } catch (error) {
      console.error('DoctorsController: Error in create endpoint:', error);
      throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() doctorDto: Partial<DoctorDto>) {
    console.log(`DoctorsController: update endpoint called for id: ${id}`);
    try {
      const result = await this.doctorsService.update(id, doctorDto);
      console.log('DoctorsController: Doctor updated successfully');
      return result;
    } catch (error) {
      console.error(`DoctorsController: Error in update endpoint for id ${id}:`, error);
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log(`DoctorsController: remove endpoint called for id: ${id}`);
    try {
      const result = await this.doctorsService.remove(id);
      console.log(`DoctorsController: Doctor with id ${id} removed successfully`);
      return result;
    } catch (error) {
      console.error(`DoctorsController: Error in remove endpoint for id ${id}:`, error);
      throw error;
    }
  }
  
  @Delete()
  async removeAll() {
    console.log('DoctorsController: removeAll endpoint called');
    try {
      await this.doctorsService.clearAllDoctors();
      console.log('DoctorsController: All doctors removed successfully');
      return { message: 'All doctors removed from database' };
    } catch (error) {
      console.error('DoctorsController: Error in removeAll endpoint:', error);
      throw error;
    }
  }
}
