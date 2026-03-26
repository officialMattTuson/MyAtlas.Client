import { Visibility } from "../../../core/models/visibility.model";

export interface CreateMemoryRequest {
    tripId: number;
    title?: string;
    summary?: string;
    description?: string;
    occurredAt: string;
    longitude: number;
    latitude: number;
    placeName: string;
    city: string;
    country: string;
    countryCode: string;
    tags: string[];
    visibility: Visibility;
    coverImageBase64?: string;
}