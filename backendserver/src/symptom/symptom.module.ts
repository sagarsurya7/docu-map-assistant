import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SymptomController } from './symptom.controller';
import { SymptomService } from './symptom.service';
import { Symptom, SymptomSchema } from './symptom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Symptom.name, schema: SymptomSchema }])
  ],
  controllers: [SymptomController],
  providers: [SymptomService],
  exports: [SymptomService]
})
export class SymptomModule {}