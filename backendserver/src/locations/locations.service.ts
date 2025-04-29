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
      try {
        // Import all location data from the project's TypeScript files
        const projectRoot = path.join(__dirname, '..', '..', '..');
        const locationsPath = path.join(projectRoot, 'src', 'data', 'locations.ts');
        
        if (fs.existsSync(locationsPath)) {
          console.log(`Found locations.ts file at: ${locationsPath}`);
          const fileData = fs.readFileSync(locationsPath, 'utf8');
          
          // Extract cities and their areas
          await this.importCitiesAndAreas(fileData);
        } else {
          // Fallback to hardcoded cities if file not found
          await this.seedDefaultCities();
          console.log('locations.ts file not found. Only default cities were seeded.');
        }
      } catch (error) {
        console.error('Error seeding the locations database:', error);
        // Ensure at least the basic cities are created even if there's an error
        await this.seedDefaultCities();
      }
    }
  }

  private async seedDefaultCities() {
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune'];
    for (const cityName of cities) {
      await this.cityModel.create({ name: cityName });
    }
    console.log(`Seeded database with ${cities.length} default cities`);
  }

  private async importCitiesAndAreas(fileContent: string) {
    // First, extract the cityToAreas object if available
    const cityMapRegex = /export\s+const\s+cityToAreas\s*=\s*{([^}]+)}/s;
    const cityMapMatch = fileContent.match(cityMapRegex);
    
    let cities: string[] = [];
    
    if (cityMapMatch && cityMapMatch[1]) {
      // Extract cities from the cityToAreas object
      const citiesInMap = cityMapMatch[1]
        .split(',')
        .map(line => {
          const match = line.match(/'([^']+)'|"([^"]+)"/);
          return match ? (match[1] || match[2]) : null;
        })
        .filter(Boolean);
      
      if (citiesInMap.length > 0) {
        cities = citiesInMap;
      }
    }
    
    // If we couldn't extract from cityToAreas, try to find city exports directly
    if (cities.length === 0) {
      const cityRegex = /export\s+const\s+(\w+)Areas\s*=\s*\[/g;
      let match;
      while ((match = cityRegex.exec(fileContent)) !== null) {
        const cityVar = match[1];
        // Convert camelCase to proper city name (e.g., puneAreas -> Pune)
        const cityName = cityVar.replace(/([A-Z])/g, ' $1').replace('Areas', '').trim();
        if (cityName) {
          cities.push(cityName.charAt(0).toUpperCase() + cityName.slice(1));
        }
      }
    }
    
    // Default cities if nothing was found
    if (cities.length === 0) {
      cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune'];
    }
    
    // Create cities in database
    for (const cityName of cities) {
      await this.cityModel.create({ name: cityName });
      console.log(`Created city: ${cityName}`);
      
      // For each city, extract and create its areas
      const areas = this.extractAreasForCity(cityName, fileContent);
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
  }

  private extractAreasForCity(cityName: string, fileContent: string): string[] {
    // Try to match different patterns for area definitions
    const cityLower = cityName.toLowerCase();
    const patterns = [
      // Pattern for export const mumbaiAreas = ['area1', 'area2']
      new RegExp(`export\\s+const\\s+${cityLower}Areas\\s*=\\s*\\[([^\\]]+)\\]`, 'i'),
      // Pattern for 'Mumbai': ['area1', 'area2']
      new RegExp(`['"]${cityName}['"]\\s*:\\s*\\[([^\\]]+)\\]`, 'i')
    ];
    
    for (const regex of patterns) {
      const match = fileContent.match(regex);
      if (match && match[1]) {
        return match[1]
          .split(',')
          .map(area => area.trim().replace(/'/g, '').replace(/"/g, ''))
          .filter(area => area);
      }
    }
    
    return [];
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
  
  // Add a method to check if a location name is a valid city
  async isValidCity(cityName: string): Promise<boolean> {
    if (!cityName) return false;
    const city = await this.cityModel.findOne({ 
      name: { $regex: new RegExp(`^${cityName}$`, 'i') } 
    }).exec();
    return !!city;
  }
  
  // Add a method to check if a location name is a valid area
  async isValidArea(areaName: string): Promise<{isValid: boolean, city?: string}> {
    if (!areaName) return { isValid: false };
    
    const area = await this.areaModel.findOne({ 
      name: { $regex: new RegExp(`^${areaName}$`, 'i') }
    }).exec();
    
    if (area) {
      return { isValid: true, city: area.city };
    }
    return { isValid: false };
  }
}
