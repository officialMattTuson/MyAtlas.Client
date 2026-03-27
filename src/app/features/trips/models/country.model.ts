import { Coordinates } from "../../../core/models/coordinates.model";

export interface Country {
    countryCode: string;
    countryName: string;
    continents: string[];
    coordinates: Coordinates;
}
