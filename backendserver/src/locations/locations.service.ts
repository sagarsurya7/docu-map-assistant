
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { City } from './schemas/location.schema';
import { Area } from './schemas/location.schema';
import { CityDto, AreaDto, LocationFilterDto } from './dto/location.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocationsService implements OnModuleInit {
  constructor(
    @InjectModel(City.name) private cityModel: Model<City>,
    @InjectModel(Area.name) private areaModel: Model<Area>
  ) {}

  async onModuleInit() {
    // Check if we have any cities in the database
    const citiesCount = await this.cityModel.countDocuments();
    console.log(`Database initialization: Found ${citiesCount} cities in MongoDB`);
    
    if (citiesCount === 0) {
      // Import initial data from the project's TypeScript files
      try {
        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune'];
        
        // Create cities
        for (const cityName of cities) {
          await this.cityModel.create({ name: cityName });
        }
        console.log(`Seeded database with ${cities.length} cities`);
        
        // Import areas from the TypeScript file structure
        const projectRoot = path.join(__dirname, '..', '..', '..');
        const locationsPath = path.join(projectRoot, 'src', 'data', 'locations.ts');
        
        if (fs.existsSync(locationsPath)) {
          console.log(`Found locations.ts file at: ${locationsPath}`);
          const fileData = fs.readFileSync(locationsPath, 'utf8');
          
          // Extract areas for each city using regex
          const extractAreas = (cityName: string, fileContent: string) => {
            const cityLower = cityName.toLowerCase();
            const regex = new RegExp(`export const ${cityLower}Areas = \\[([^\\]]+)\\]`, 'i');
            const match = fileContent.match(regex);
            
            if (match && match[1]) {
              return match[1]
                .split(',')
                .map(area => area.trim().replace(/'/g, '').replace(/"/g, ''))
                .filter(area => area);
            }
            return [];
          };
          
          // Import areas for each city
          for (const cityName of cities) {
            const areas = extractAreas(cityName, fileData);
            
            for (const areaName of areas) {
              if (areaName) {
                await this.areaModel.create({ 
                  name: areaName, 
                  city: cityName 
                });
              }
            }
            
            console.log(`Imported ${areas.length} areas for ${cityName}`);
          }
        } else {
          console.log('locations.ts file not found. Only cities were seeded.');
        }
      } catch (error) {
        console.error('Error seeding the locations database:', error);
      }
    }
  }

  async findAllCities(): Promise<CityDto[]> {
    return this.cityModel.find().exec();
  }

  async findAreasByCity(city: string): Promise<AreaDto[]> {
    return this.areaModel.find({ city }).exec();
  }

  async findAllAreas(filters: LocationFilterDto = {}): Promise<AreaDto[]> {
    const query = this.areaModel.find();
    
    if (filters.city) {
      query.where('city').equals(filters.city);
    }
    
    return query.exec();
  }
}
