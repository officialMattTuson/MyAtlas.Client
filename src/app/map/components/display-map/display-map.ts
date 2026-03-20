import { AfterViewInit, Component } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environments';

@Component({
  selector: 'app-display-map',
  imports: [],
  templateUrl: './display-map.html',
  styleUrl: './display-map.scss',
})
export class DisplayMap implements AfterViewInit {

  private map?: mapboxgl.Map;
  private readonly highlighted: string[] = ['AUS', 'NZL', 'USA'];

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
    });
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
        ['get', 'iso_3166_1_alpha_3'],
        ['literal', this.highlighted],
      ],
      paint: {
        'fill-color': '#ffcc00',
        'fill-opacity': 0.45,
      },
    });

    // Optional outline
    this.map.addLayer({
      id: 'countries-highlight-outline',
      type: 'line',
      source: 'countries',
      'source-layer': 'country_boundaries',
      filter: [
        'in',
        ['get', 'iso_3166_1_alpha_3'],
        ['literal', this.highlighted],
      ],
      paint: {
        'line-color': '#ff8800',
        'line-width': 2,
      },
    });
  }
}
