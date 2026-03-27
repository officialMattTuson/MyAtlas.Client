import { Injectable } from '@angular/core';
import { Trip } from '../../trips/models/trip.model';
import { Country } from '../../trips/models/country.model';

@Injectable({
  providedIn: 'root',
})
export class MapHighlight {

  private highlighted: string[] = [];

  public updateHighlightedCountries(trip: Trip, map?: mapboxgl.Map): void {
    const countryCodes = trip.countriesVisited.map((c: Country) => c.countryCode);
    this.highlighted = countryCodes;

    if (map) {
      map.setFilter('countries-highlight-fill', [
        'in',
        ['get', 'iso_3166_1'],
        ['literal', this.highlighted],
      ]);
      map.setFilter('countries-highlight-outline', [
        'in',
        ['get', 'iso_3166_1'],
        ['literal', this.highlighted],
      ]);
    }
  }

  public addCountryHighlightLayers(map?: mapboxgl.Map): void {
    if (!map) return;

    map.addSource('countries', {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1',
    });

    map.addLayer({
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

    map.addLayer({
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
