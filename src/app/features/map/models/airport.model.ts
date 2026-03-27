export interface Airport {
    iataCode: string;
    name: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
}

export interface FlightSegment {
    from: Airport;
    to: Airport;
}
