import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { Symptom } from './schemas/symptom.schema';
import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class SymptomService {
  private model: ChatOllama;

  constructor(
    @InjectModel(Symptom.name) private symptomModel: Model<Symptom>
  ) {
    this.model = new ChatOllama({
      model: 'llama3.2:1b',
    });
  }

  // Existing function: Find a symptom by name
  async findBySymptom(symptomName: string): Promise<Symptom> {
    return this.symptomModel.findOne({ name: symptomName }).exec();
  }

  // Existing function: Analyze symptoms and return conditions and specialties
  async analyzeSymptoms(symptoms: string[]) {
    const conditions = await Promise.all(
      symptoms.map(symptom => this.findBySymptom(symptom))
    );
    console.log("condi444",conditions)
    const conditionList = conditions
      .flatMap(condition => condition?.conditions || [] )
      .join(', ');

      console.log("condi123",conditionList)

    const response = await this.model.call([ 
      new HumanMessage(
        `A patient reports symptoms: ${symptoms.join(', ')}. 
         Possible conditions: ${conditionList}. 
         What do you recommend? Please provide a detailed analysis.`
      )
    ]);

    return {
      symptoms,
      possibleConditions: conditionList.split(', '),
      aiRecommendation: response,
      recommendedSpecialties: this.getRecommendedSpecialties(conditions),
    };
  }

  // New function to get recommended specialties from symptoms
  private getRecommendedSpecialties(symptoms: Symptom[]) {
    const specialties = new Set<string>();
    symptoms.forEach(symptom => {
      if (symptom?.doctorSpecialties) {
        symptom.doctorSpecialties.forEach((specialty) => {
          specialties.add(specialty);
        });
      }
    });
    return Array.from(specialties);
  }

  // New function: Get all symptoms
  async findAll(): Promise<Symptom[]> {
    return this.symptomModel.find().exec();
  }

  // New function: Add a new symptom
  async create(symptom: Symptom): Promise<{ message: string; symptom: Symptom }> {
    const newSymptom = new this.symptomModel(symptom);
    await newSymptom.save();
    return { message: 'Symptom added successfully', symptom: newSymptom };
  }
}
