import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Memory } from '../models/memory-model';
import { CreateMemoryRequest } from '../models/create-memory-request.model';

@Injectable({
  providedIn: 'root',
})
export class MemoryApi {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = "http://localhost:5073/api";

  public GetMemoriesByTripId(tripId: string): Observable<Memory[]> {
    return this.httpClient.get<Memory[]>(`${this.apiUrl}/memories/trip/${tripId}`);
  }

  public CreateMemory(request: CreateMemoryRequest): Observable<Memory> {
    return this.httpClient.post<Memory>(`${this.apiUrl}/memories`, request);
  }
}
