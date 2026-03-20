import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../../environments/environments';
import { TripsList } from '../../../trips/components/trips-list/trips-list';
import { TripState } from '../../../trips/services/trip-state';
import { Country } from '../../../trips/models/country.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Trip } from '../../../trips/models/trip.model';

@Component({
  selector: 'app-display-map',
  imports: [TripsList],
  templateUrl: './display-map.html',
  styleUrl: './display-map.scss',
})
export class DisplayMap implements AfterViewInit {
  private readonly tripState = inject(TripState);
  private readonly destroyRef = inject(DestroyRef);

  private map?: mapboxgl.Map;
  private highlighted: string[] = [];

  ngAfterViewInit(): void {
    mapboxgl.accessToken = environment.mapboxToken;

    this.map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/light-v11",
      center: [145, -37.8140],
      zoom: 2,
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.on('load', () => {
      this.addCountryHighlightLayers();
      
      this.tripState.selectedTrip$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(trip => {
        if (trip) {
          this.updateHighlightedCountries(trip);
        }
      });
    });
  }

  private updateHighlightedCountries(trip: Trip): void {
    const countryCodes = trip.countriesVisited.map((c: Country) => c.countryCode);
    this.highlighted = countryCodes;
    
    if (this.map) {
      this.map.setFilter('countries-highlight-fill', [
        'in',
        ['get', 'iso_3166_1'],
        ['literal', this.highlighted],
      ]);
      this.map.setFilter('countries-highlight-outline', [
        'in',
        ['get', 'iso_3166_1'],
        ['literal', this.highlighted],
      ]);

      if (trip.countriesVisited.length > 0) {
        const firstCountry = trip.countriesVisited[0];
        this.map.flyTo({
          center: [firstCountry.coordinates.longitude, firstCountry.coordinates.latitude],
          zoom: 2,
          duration: 1500,
          essential: true
        });
      }
    }
  }

  private addCountryHighlightLayers(): void {
    if (!this.map) return;

    this.map.addSource('countries', {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1',
    });

    // Fill highlight
    this.map.addLayer({
      id: 'countries-highlight-fill',
      type: 'fill',
      source: 'countries',
      'source-layer': 'country_boundaries',
      filter: [
        'in',
        ['get', 'iso_3166_1'],
        ['literal', this.highlighted],
      ],
      paint: {
        'fill-color': '#ffcc00',
        'fill-opacity': 0.45,
      },
    });

    this.map.addLayer({
      id: 'countries-highlight-outline',
      type: 'line',
      source: 'countries',
      'source-layer': 'country_boundaries',
      filter: [
        'in',
        ['get', 'iso_3166_1'],
        ['literal', this.highlighted],
      ],
      paint: {
        'line-color': '#ff8800',
        'line-width': 2,
      },
    });
  }
}
