import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Airport } from '../models/airport.model';

@Injectable({
  providedIn: 'root',
})
export class AirportApi {

  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:5073/api';
  
  getAirportByIataCode(iataCode: string): Observable<Airport> {
    return this.httpClient.get<Airport>(`${this.baseUrl}/airports/code?code=${iataCode}`);
  }
}
