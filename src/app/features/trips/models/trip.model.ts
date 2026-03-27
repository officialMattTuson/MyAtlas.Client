import { Visibility } from "../../../core/models/visibility.model";
import { Memory } from "../../memories/models/memory-model";
import { Country } from "./country.model";
import { Status } from "./status.enum";
import { TravelMode } from "./travel-mode.enum";

export interface Trip {
    id: string;
    userId: string;
    title: string;
    description: string;
    countriesVisited: Country[];
    startDate: string;
    endDate: string;
    isArchived: boolean;
    coverImageUrl: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    memoryCount: number;
    departureAirportCode: string;
    arrivalAirportCode: string;
    returnDepartureAirportCode: string;
    returnArrivalAirportCode: string;
    status: Status;
    isFeatured: boolean;
    visibility: Visibility;
    travelMode: TravelMode;
}

export interface TripWithMemories {
    trip: Trip;
    memories: Memory[];
}

