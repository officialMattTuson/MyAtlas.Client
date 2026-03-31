import { AfterViewInit, Component, DestroyRef, inject, signal } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../../environments/environments';
import { TripsList } from '../../../trips/components/trips-list/trips-list';
import { TripState } from '../../../trips/services/trip-state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Trip } from '../../../trips/models/trip.model';
import { ActivatedRoute } from '@angular/router';
import { DisplayTrip } from '../../../trips/components/display-trip/display-trip';
import { FlightPathService } from '../../services/flight-path';
import { combineLatest } from 'rxjs';
import { MapHighlight } from '../../services/map-highlight';
import { MapMarker } from '../../services/map-marker';

@Component({
  selector: 'app-display-map',
  imports: [TripsList, DisplayTrip],
  templateUrl: './display-map.html',
  styleUrl: './display-map.scss',
})
export class DisplayMap implements AfterViewInit {
  private readonly tripState = inject(TripState);
  private readonly destroyRef = inject(DestroyRef);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly flightPathService = inject(FlightPathService);
  private readonly mapHighlightService = inject(MapHighlight);
  private readonly mapMarkerService = inject(MapMarker);

  tripId = signal<string | null>(null);
  private map?: mapboxgl.Map;
  private currentTripId: string | null = null;
  private lastAnimatedTripId: string | null = null;
  private isAnimating: boolean = false;
  private pendingZoomToFour: boolean = false;

  showTripDetails(tripId: string): void {
    this.tripId.set(tripId);
    if (this.isAnimating) {
      this.pendingZoomToFour = true;
    } else {
      this.map?.flyTo({ zoom: 4, duration: 1000 });
      this.map && this.mapMarkerService.addMarkerToMap(this.map);
    }
  }

  showTripsList(): void {
    this.tripId.set(null);
    this.pendingZoomToFour = false;
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.tripId.set(params['tripId'] || null);
    });

    mapboxgl.accessToken = environment.mapboxToken;
    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center: [145, -37.8140],
      zoom: 2,
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('load', () => {
      this.mapHighlightService.addCountryHighlightLayers(this.map);
      this.tripState.selectedTrip$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(trip => {
        if (trip) {
          this.mapHighlightService.updateHighlightedCountries(trip, this.map);
          if (this.map) {
          }
          this.animateFlightPathsForTrip(trip);
        } else {
          if (this.map) {
            this.flightPathService.clearFlightPaths(this.map);
            this.lastAnimatedTripId = null;
            this.isAnimating = false;
            this.pendingZoomToFour = false;
          }
        }
      });
    });
  }

  private animateFlightPathsForTrip(trip: Trip): void {
    if (!this.map) return;

    if (trip.id === this.lastAnimatedTripId) {
      return;
    }

    this.isAnimating = false;
    // Set pending zoom for when loading from URL (when tripId signal is already set)
    if (this.tripId()) {
      this.pendingZoomToFour = true;
    }

    this.map.stop();
    this.flightPathService.clearFlightPaths(this.map);

    this.currentTripId = trip.id;
    const tripIdAtStart = trip.id;

    if (!trip.departureAirportCode || !trip.arrivalAirportCode) {
      return;
    }

    const airportRequests = {
      departure: this.flightPathService.getAirportByIataCode(trip.departureAirportCode),
      arrival: this.flightPathService.getAirportByIataCode(trip.arrivalAirportCode),
    };

    combineLatest(airportRequests).subscribe({
      next: (airports) => {
        if (!this.map || this.currentTripId !== tripIdAtStart) return;

        const departureCoords: [number, number] = [
          airports.departure.longitude,
          airports.departure.latitude
        ];

        this.map.flyTo({
          center: departureCoords,
          zoom: 2,
          duration: 1500,
          essential: true
        });

        this.map.once('moveend', () => {
          if (!this.map || this.currentTripId !== tripIdAtStart) return;

          this.isAnimating = true;

          const outbound = {
            from: airports.departure,
            to: airports.arrival,
          };

          this.flightPathService.animateFlightForTrip(this.map, outbound, () => {
            this.isAnimating = false;

            if (this.pendingZoomToFour && this.map) {
              this.map.flyTo({ zoom: 4, duration: 1000 });
              this.mapMarkerService.addMarkerToMap(this.map);
              this.pendingZoomToFour = false;
            }
          });

          this.lastAnimatedTripId = tripIdAtStart;
        });
      },
      error: (error) => {
        console.error('Failed to fetch airport details:', error);
      },
    });
  }
}
