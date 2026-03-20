export interface Country {
    countryCode: string;
    countryName: string;
    continents: string[];
    coordinates: Coordinates;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}