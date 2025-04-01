import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SymptomController } from './symptom.controller';
import { SymptomService } from './symptom.service';
import { Symptom, SymptomSchema } from './schemas/symptom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Symptom.name, schema: SymptomSchema }])
  ],
  controllers: [SymptomController],
  providers: [SymptomService],
})
export class SymptomModule {}