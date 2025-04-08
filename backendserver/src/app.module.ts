import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SymptomModule } from './symptom/symptom.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/symptom-analyzer'),
    SymptomModule,
    DoctorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}