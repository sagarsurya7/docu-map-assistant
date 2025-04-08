import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { DoctorService } from './doctor.service';
import { Doctor } from './schemas/doctor.schema';

@ApiTags('Doctors') // Group API under "Doctors" in Swagger
@Controller('api/doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('recommend')
  @ApiOperation({ summary: 'Recommend doctors based on specialties' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        specialties: {
          type: 'array',
          items: { type: 'string' },
          example: ['Cardiologist', 'Neurologist'],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Returns a list of recommended doctors' })
  async recommendDoctors(@Body() body: { specialties: string[] }) {
    return this.doctorService.findBySpecialties(body.specialties);
  }

  @Get()
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'Returns a list of all doctors' })
  async getAllDoctors(): Promise<Doctor[]> {
    return this.doctorService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add a new doctor' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Dr. John Doe' },
        specialty: { type: 'string', example: 'Cardiologist' },
        experience: { type: 'number', example: 15 },
        rating: { type: 'number', example: 4.7 },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Doctor added successfully' })
  async addDoctor(@Body() doctor: Doctor) {
    return this.doctorService.create(doctor);
  }
}
