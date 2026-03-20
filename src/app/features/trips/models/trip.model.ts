import { Country } from "./country.model";

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


}