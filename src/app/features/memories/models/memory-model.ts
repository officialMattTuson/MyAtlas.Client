import { PlaceMetaData } from "../../../core/models/place-meta-data.model";
import { Visibility } from "../../../core/models/visibility.model";

export interface Memory {
    id: number;
    userId: number;
    tripId: number;
    title: string;
    summary?: string;
    description?: string;
    occurredAt: string;
    createdAt: string;
    updatedAt: string;
    visibility: Visibility;
    place: PlaceMetaData;
    tags: string[];
    longitude: number;
    latitude: number;
    coverImageUrl?: string;
    coverImageBlobUrl?: string;
    coverImageBlobName?: string;
}