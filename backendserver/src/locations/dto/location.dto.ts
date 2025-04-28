
export class CityDto {
  name: string;
}

export class AreaDto {
  name: string;
  city: string;
}

export class LocationFilterDto {
  city?: string;
}
