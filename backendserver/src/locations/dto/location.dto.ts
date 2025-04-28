
export class CityDto {
  name: string;
}

export class AreaDto {
  name: string;
  city: string;
}

export class LocationFilterDto {
  city?: string;
  skipLocationPrompt?: boolean; // Add this to allow skipping location prompts
}
