
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DoctorsService } from './doctors/doctors.service';
import { LocationsService } from './locations/locations.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get service instances
  const doctorsService = app.get(DoctorsService);
  const locationsService = app.get(LocationsService);

  console.log('Starting database seeding...');

  try {
    // Clear existing data
    await doctorsService.clearAllDoctors();
    console.log('Cleared existing doctors data');

    // Initialize locations first
    await locationsService.onModuleInit();
    console.log('Locations data seeded successfully');

    // Initialize doctors
    await doctorsService.onModuleInit();
    console.log('Doctors data seeded successfully');

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
