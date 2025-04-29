import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorsModule } from './doctors/doctors.module';
import { ChatModule } from './chat/chat.module';
import { HealthModule } from './health/health.module';
import { LocationsModule } from './locations/locations.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/symptom-analyzer'),
    DoctorsModule,
    ChatModule,
    HealthModule,
    LocationsModule
  ],
})
export class AppModule {}
