import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { DisplayTrip } from '../display-trip/display-trip';
import { TripState } from '../../services/trip-state';

@Component({
  selector: 'app-trips-list',
  imports: [DisplayTrip],
  templateUrl: './trips-list.html',
  styleUrl: './trips-list.scss',
})
export class TripsList implements OnInit {
  private readonly tripState = inject(TripState);

  trips = signal<Trip[]>([]);
  currentIndex = signal<number>(0);

  constructor() {
    // Auto-select trip when currentIndex changes
    effect(() => {
      const index = this.currentIndex();
      const trips = this.trips();
      if (trips.length > 0 && index >= 0 && index < trips.length) {
        this.tripState.setSelectedTrip(trips[index]);
      }
    });
  }

  ngOnInit(): void {
    this.tripState.getTrips().subscribe({
      next: (trips) => {
        this.trips.set(trips);
        if (trips.length > 0) {
          this.currentIndex.set(0);
        }
      }
    });
  }

  get currentTrip(): Trip | null {
    const trips = this.trips();
    const index = this.currentIndex();
    return trips.length > 0 ? trips[index] : null;
  }

  previousTrip(): void {
    if (this.currentIndex() == 0) {
      this.currentIndex.set(this.trips().length - 1);
      return;
    }
    this.currentIndex.update(i => i - 1);
  }

  nextTrip(): void {
    if (this.currentIndex() == this.trips().length - 1) {
      this.currentIndex.set(0);
      return;
    }
    this.currentIndex.update(i => i + 1);
  }

  selectTrip(trip: Trip): void {
    this.tripState.setSelectedTrip(trip);
  }
}
