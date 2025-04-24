
import { Module } from '@nestjs/common';
import { DoctorsController } from './doctors.controller';
import { DoctorsService } from './doctors.service';

@Module({
  imports: [
    // In a real application, you would import database modules here, like:
    // TypeOrmModule.forFeature([Doctor]), // For SQL databases
    // Or MongooseModule.forFeature([{ name: 'Doctor', schema: DoctorSchema }]), // For MongoDB
  ],
  controllers: [DoctorsController],
  providers: [
    DoctorsService,
    // You could add more providers like repositories or other services
  ],
  exports: [DoctorsService],
})
export class DoctorsModule {}
