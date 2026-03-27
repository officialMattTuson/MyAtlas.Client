import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TripApi } from './trip-api';
import { Trip } from '../models/trip.model';

@Injectable({
  providedIn: 'root',
})
export class TripState {

  private readonly tripApiService = inject(TripApi);

  private readonly _selectedTrip = new BehaviorSubject<Trip | null>(null);
  public selectedTrip$ = this._selectedTrip.asObservable();

  public getTrips(): Observable<Trip[]> {
    return this.tripApiService.getAllTrips();
  }

  public getTripById(tripId: string): Observable<Trip> {
    return this.tripApiService.getTripById(tripId);
  }

  public setSelectedTrip(trip: Trip): void {
    this._selectedTrip.next(trip);
  }

  public getSelectedTrip(): Trip | null {
    return this._selectedTrip.getValue();
  }
}
