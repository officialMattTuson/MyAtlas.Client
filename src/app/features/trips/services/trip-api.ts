import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class TripApi {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = "http://localhost:5073/api";

  public getAllTrips(): Observable<Trip[]> {
    return this.httpClient.get<Trip[]>(`${this.baseUrl}/trips`);
  }

  public getTripById(tripId: string): Observable<Trip> {
    return this.httpClient.get<Trip>(`${this.baseUrl}/trips/${tripId}`)
  }
}
