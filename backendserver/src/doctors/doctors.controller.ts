
import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorDto, DoctorFilterDto } from './dto/doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async findAll(@Query() filters: DoctorFilterDto) {
    return this.doctorsService.findAll(filters);
  }

  @Get('filters')
  async getFilterOptions() {
    return this.doctorsService.getFilterOptions();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @Post()
  async create(@Body() doctorDto: DoctorDto) {
    return this.doctorsService.create(doctorDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() doctorDto: Partial<DoctorDto>) {
    return this.doctorsService.update(id, doctorDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}
