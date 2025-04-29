import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { Symptom } from './symptom.schema';
import { HumanMessage, BaseMessage } from '@langchain/core/messages';

@Injectable()
export class SymptomService {
  private model: ChatOllama;

  constructor(
    @InjectModel(Symptom.name) private symptomModel: Model<Symptom>
  ) {
    this.model = new ChatOllama({
      model: 'llama2:7b',
      baseUrl: 'http://localhost:11434',
      temperature: 0.7,
      topP: 0.9,
      repeatPenalty: 1.1
    });
  }

  async findByName(symptomName: string): Promise<Symptom | null> {
    return this.symptomModel.findOne({ name: symptomName }).exec();
  }

  async create(symptom: Symptom): Promise<Symptom> {
    const createdSymptom = new this.symptomModel(symptom);
    return createdSymptom.save();
  }

  async analyzeSymptoms(symptoms: string[]): Promise<{
    symptoms: string[];
    possibleConditions: string[];
    aiRecommendation: BaseMessage;
    recommendedSpecialties: string[];
  }> {
    const conditions = await Promise.all(
      symptoms.map(symptom => this.findByName(symptom))
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

  private getRecommendedSpecialties(symptoms: Symptom[]): string[] {
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

  async findAll(): Promise<Symptom[]> {
    return this.symptomModel.find().exec();
  }
}
