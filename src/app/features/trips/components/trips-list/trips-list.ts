import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { Trip } from '../../models/trip.model';
import { TripCard } from '../trip-card/trip-card';
import { TripState } from '../../services/trip-state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-trips-list',
  imports: [TripCard],
  templateUrl: './trips-list.html',
  styleUrl: './trips-list.scss',
})
export class TripsList implements OnInit {
  private readonly tripState = inject(TripState);
  private readonly destroyRef = inject(DestroyRef);

  trips = signal<Trip[]>([]);
  currentIndex = signal<number>(0);

  constructor() {
    effect(() => {
      const index = this.currentIndex();
      const trips = this.trips();
      if (trips.length > 0 && index >= 0 && index < trips.length) {
        this.tripState.setSelectedTrip(trips[index]);
      }
    });
  }

  ngOnInit(): void {
    this.tripState.getTrips().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (trips) => {
        this.trips.set(trips);
        if (trips.length > 0) {
          this.currentIndex.set(0);
        }
      },
      error: ((error: HttpErrorResponse) => console.error(error))
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
