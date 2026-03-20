import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TripApi {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = "http://localhost:5073/api";

  public getAllTrips(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/trips`);
  }
}
