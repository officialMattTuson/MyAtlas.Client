import { Component, inject, OnInit, signal } from '@angular/core';
import { TripApi } from '../../services/trip-api';

@Component({
  selector: 'app-trips-list',
  imports: [],
  templateUrl: './trips-list.html',
  styleUrl: './trips-list.scss',
})
export class TripsList implements OnInit {
  private readonly tripApiService = inject(TripApi);

  private trips = signal([]);

  ngOnInit(): void {
    this.tripApiService.getAllTrips().subscribe({
      next: (trips) => {
        this.trips = trips;
        console.log(trips)
      }
    })
  }
}
