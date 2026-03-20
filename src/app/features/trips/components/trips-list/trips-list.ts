import { Component, inject, OnInit, signal } from '@angular/core';
import { TripApi } from '../../services/trip-api';
import { Trip } from '../../models/trip.model';
import { DisplayTrip } from '../display-trip/display-trip';

@Component({
  selector: 'app-trips-list',
  imports: [DisplayTrip],
  templateUrl: './trips-list.html',
  styleUrl: './trips-list.scss',
})
export class TripsList implements OnInit {
  private readonly tripApiService = inject(TripApi);

  trips = signal<Trip[]>([]);

  ngOnInit(): void {
    this.tripApiService.getAllTrips().subscribe({
      next: (trips) => {
        this.trips.set(trips);
      }
    })
  }

  selectTrip(trip: Trip): void {
    console.log(trip)
  }
}
