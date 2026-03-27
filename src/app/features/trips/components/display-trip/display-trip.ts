import { Component, inject, OnInit, signal } from '@angular/core';
import { TripState } from '../../services/trip-state';
import { Trip } from '../../models/trip.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, take, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MemoryState } from '../../../memories/services/memory-state';
import { Memory } from '../../../memories/models/memory-model';

@Component({
  selector: 'app-display-trip',
  imports: [],
  templateUrl: './display-trip.html',
  styleUrl: './display-trip.scss',
})
export class DisplayTrip implements OnInit {
  private readonly tripStateService = inject(TripState);
  private readonly memoryStateService = inject(MemoryState);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  tripData = signal<{ loading: boolean; trip?: Trip; memories?: Memory[] }>({
    loading: true
  });

  ngOnInit(): void {
    const tripId = this.getIdInRoute();
    this.getTrip(tripId);

  }

  getTrip(tripId: string): void {
    const trip = this.tripStateService.getSelectedTrip();
    if (trip && trip.id === tripId) {
      this.tripData.set({ loading: false, trip: trip });
      return;
    }
    this.getTripById(tripId);
  }

  getTripById(tripId: string): void {
    this.tripStateService.getTripById(tripId)
      .pipe(
        take(1),
        tap(trip => this.tripData.set({ loading: false, trip: trip })),
        switchMap((result: Trip) => {
          return this.getMemoriesByTripId(result.id)
        }))
      .subscribe({
        next: (result) => {
          const trip = this.tripData().trip;
          this.tripData.set({
            loading: false,
            trip: trip,
            memories: result
          });
          console.log(this.tripData())
        },
        error: (error: HttpErrorResponse) => {
          console.error(error)
          this.tripData.set({ loading: false });
        }
      })
  }

  getIdInRoute(): string {
    const id = this.activatedRoute.snapshot.params['tripId'];
    if (!id) {
      this.router.navigateByUrl("map");
      return '';
    }
    return id;
  }

  getMemoriesByTripId(tripId: string): Observable<Memory[]> {
    return this.memoryStateService.getMemoriesByTripId(tripId).pipe(take(1));
  }
}
