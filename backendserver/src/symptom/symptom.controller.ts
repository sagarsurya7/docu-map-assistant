import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SymptomService } from './symptom.service';
import { Symptom } from './symptom.schema';
import { BaseMessage } from '@langchain/core/messages';

@ApiTags('Symptoms') // Groups APIs under "Symptoms" in Swagger
@Controller('symptoms')
export class SymptomController {
  constructor(private readonly symptomService: SymptomService) {}

  @Get()
  @ApiOperation({ summary: 'Get all symptoms' })
  @ApiResponse({ status: 200, description: 'Returns a list of all symptoms' })
  async getAllSymptoms(): Promise<Symptom[]> {
    return this.symptomService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Add a new symptom' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        severity: { type: 'number' },
        associatedConditions: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Symptom added successfully' })
  async addSymptom(@Body() symptom: Symptom): Promise<{ message: string; symptom: Symptom }> {
    const newSymptom = await this.symptomService.create(symptom);
    return { message: 'Symptom added successfully', symptom: newSymptom };
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze symptoms and recommend conditions & specialties' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symptoms: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  })
  @ApiResponse({ status: 200, description: 'Returns possible conditions and recommended specialties' })
  async analyzeSymptoms(@Body() body: { symptoms: string[] }): Promise<{
    symptoms: string[];
    possibleConditions: string[];
    aiRecommendation: BaseMessage;
    recommendedSpecialties: string[];
  }> {
    return this.symptomService.analyzeSymptoms(body.symptoms);
  }
}
