import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { TripState } from '../../services/trip-state';
import { Trip } from '../../models/trip.model';
import { Observable, take } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MemoryState } from '../../../memories/services/memory-state';
import { Memory } from '../../../memories/models/memory-model';
import { DatePipe, Location } from '@angular/common';
import { DisplayMap } from '../../../map/components/display-map/display-map';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-display-trip',
  imports: [DatePipe],
  templateUrl: './display-trip.html',
  styleUrl: './display-trip.scss',
})
export class DisplayTrip implements OnInit {
  private readonly tripStateService = inject(TripState);
  private readonly memoryStateService = inject(MemoryState);
  private readonly destroyRef = inject(DestroyRef);
  readonly location = inject(Location);
  private readonly displayMap = inject(DisplayMap);

  tripData = signal<{ loading: boolean; trip?: Trip; memories?: Memory[] }>({
    loading: true
  });

  ngOnInit(): void {
    this.tripStateService.selectedTrip$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(trip => {
        if (trip) {
          this.loadTripData(trip);
        }
      });
  }

  loadTripData(trip: Trip): void {
    this.setTripData(false, trip);
    
    this.getMemoriesByTripId(trip.id)
      .subscribe({
        next: (memories) => {
          this.setTripData(false, trip, memories);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Failed to load memories:', error);
          this.setTripData(false, trip, []);
        }
      });
  }

  getMemoriesByTripId(tripId: string): Observable<Memory[]> {
    return this.memoryStateService.getMemoriesByTripId(tripId).pipe(take(1));
  }

  setTripData(loading: boolean, trip?: Trip, memories?: Memory[]): void {
    this.tripData.set({
      loading: loading,
      trip: trip,
      memories: memories
    })
  }

  goBack(): void {
    this.tripStateService.setSelectedTrip(null);
    this.location.replaceState('/map');
    this.displayMap.showTripsList();
  }
}
