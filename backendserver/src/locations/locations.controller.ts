
import { Controller, Get, Param, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CityDto, AreaDto, LocationFilterDto } from './dto/location.dto';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('cities')
  async getAllCities(): Promise<CityDto[]> {
    return this.locationsService.findAllCities();
  }

  @Get('areas')
  async getAllAreas(@Query() filters: LocationFilterDto): Promise<AreaDto[]> {
    return this.locationsService.findAllAreas(filters);
  }

  @Get('cities/:city/areas')
  async getAreasByCity(@Param('city') city: string): Promise<AreaDto[]> {
    return this.locationsService.findAreasByCity(city);
  }
}
