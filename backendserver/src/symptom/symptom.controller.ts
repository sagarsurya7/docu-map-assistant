import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SymptomService } from './symptom.service';
import { Symptom } from './schemas/symptom.schema';

@ApiTags('Symptoms') // Groups APIs under "Symptoms" in Swagger
@Controller('api/symptoms')
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
        name: { type: 'string', example: 'Cough' },
        conditions: { 
          type: 'array', 
          items: { type: 'string' }, 
          example: ['Flu', 'Cold'] 
        },
        doctorSpecialties: { 
          type: 'object',
          additionalProperties: { type: 'string' },
          example: { 'Flu': 'General Practitioner', 'Cold': 'Pulmonologist' }
        }
      }
    }
  })
  @ApiResponse({ status: 201, description: 'Symptom added successfully' })
  async addSymptom(@Body() symptom: Symptom) {
    return this.symptomService.create(symptom);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze symptoms and recommend conditions & specialties' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        symptoms: {
          type: 'array',
          items: { type: 'string' },
          example: ['Fever', 'Cough'],
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Returns possible conditions and recommended specialties' })
  async analyzeSymptoms(@Body() body: { symptoms: string[] }) {
    return this.symptomService.analyzeSymptoms(body.symptoms);
  }
}
