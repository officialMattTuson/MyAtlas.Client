import { inject, Injectable } from '@angular/core';
import { Airport } from '../models/airport.model';
import { Trip } from '../../trips/models/trip.model';
import { Observable, take } from 'rxjs';
import { AirportApi } from './airport-api';

@Injectable({
  providedIn: 'root',
})
export class FlightPathService {
 
  private readonly airportApiService = inject(AirportApi);
  private animationFrameId?: number;
  private activeAnimations: Set<string> = new Set();

  getAirportByIataCode(airportCode: string): Observable<Airport> {
    return this.airportApiService.getAirportByIataCode(airportCode).pipe(take(1));
  }

  getFlightSegmentsFromTrip(trip: Trip): { outbound?: [string, string]; return?: [string, string] } {
    const segments: { outbound?: [string, string]; return?: [string, string] } = {};

    if (trip.departureAirportCode && trip.arrivalAirportCode) {
      segments.outbound = [trip.departureAirportCode, trip.arrivalAirportCode];
    }

    if (trip.returnDepartureAirportCode && trip.returnArrivalAirportCode) {
      segments.return = [trip.returnDepartureAirportCode, trip.returnArrivalAirportCode];
    }

    return segments;
  }

  animatePlane(
    map: mapboxgl.Map,
    from: [number, number],
    to: [number, number],
    planeId: string = 'plane',
    duration: number = 3000,
    onComplete?: () => void
  ): void {
    const animationKey = `${planeId}-${from.join(',')}-${to.join(',')}`;
    const routeId = `route-${planeId}`;
    
    if (this.activeAnimations.has(animationKey)) {
      return;
    }

    this.activeAnimations.add(animationKey);

    if (map.getLayer(planeId)) {
      map.removeLayer(planeId);
    }
    if (map.getSource(planeId)) {
      map.removeSource(planeId);
    }

    if (map.getLayer(routeId)) {
      map.removeLayer(routeId);
    }
    if (map.getSource(routeId)) {
      map.removeSource(routeId);
    }

    const plane = {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: from,
      },
      properties: {},
    };

    const route = {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: [from],
      },
      properties: {},
    };

    map.addSource(planeId, {
      type: 'geojson',
      data: plane,
    });

    map.addSource(routeId, {
      type: 'geojson',
      data: route,
    });

    map.addLayer({
      id: routeId,
      type: 'line',
      source: routeId,
      paint: {
        'line-width': 3,
        'line-color': '#007bff',
        'line-opacity': 0.8,
      },
    });

    map.addLayer({
      id: planeId,
      type: 'circle',
      source: planeId,
      paint: {
        'circle-radius': 8,
        'circle-color': '#FF0000',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#FFFFFF',
      },
    });

    const startTime = Date.now();
    const traveledCoords: [number, number][] = [from];
    let lastLineUpdate = 0;
    const lineUpdateInterval = 16; 

    let cameraLng = from[0];
    let cameraLat = from[1];
    const smoothingFactor = 0.15;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        this.activeAnimations.delete(animationKey);
        const finalRoute = {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: [...traveledCoords, to],
          },
          properties: {},
        };
        const routeSource = map.getSource(routeId) as mapboxgl.GeoJSONSource;
        if (routeSource) {
          routeSource.setData(finalRoute);
        }
        
        if (onComplete) {
          onComplete();
        }
        return;
      }

      const eased = this.easeInOutCubic(progress);

      const lng = from[0] + (to[0] - from[0]) * eased;
      const lat = from[1] + (to[1] - from[1]) * eased;
      const currentPosition: [number, number] = [lng, lat];

      const planePosition = {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: currentPosition,
        },
        properties: {},
      };

      const planeSource = map.getSource(planeId) as mapboxgl.GeoJSONSource;
      if (planeSource) {
        planeSource.setData(planePosition);
      }

      const now = Date.now();
      if (now - lastLineUpdate >= lineUpdateInterval) {
        traveledCoords.push(currentPosition);
        
        const routeUpdate = {
          type: 'Feature' as const,
          geometry: {
            type: 'LineString' as const,
            coordinates: traveledCoords,
          },
          properties: {},
        };

        const routeSource = map.getSource(routeId) as mapboxgl.GeoJSONSource;
        if (routeSource) {
          routeSource.setData(routeUpdate);
        }
        
        lastLineUpdate = now;
      }

      cameraLng += (lng - cameraLng) * smoothingFactor;
      cameraLat += (lat - cameraLat) * smoothingFactor;

      map.setCenter([cameraLng, cameraLat]);
      map.setZoom(2);

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  animateFlightForTrip(
    map: mapboxgl.Map,
    outbound: { from: Airport; to: Airport },
    onComplete?: () => void
  ): void {
    const outboundFrom: [number, number] = [outbound.from.longitude, outbound.from.latitude];
    const outboundTo: [number, number] = [outbound.to.longitude, outbound.to.latitude];

    this.animatePlane(map, outboundFrom, outboundTo, 'plane-outbound', 8000, onComplete);
  }

  clearFlightPaths(map: mapboxgl.Map): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    this.activeAnimations.clear();

    const layersToRemove = ['plane-outbound', 'route-plane-outbound'];
    
    layersToRemove.forEach(id => {
      if (map.getLayer(id)) {
        map.removeLayer(id);
      }
      if (map.getSource(id)) {
        map.removeSource(id);
      }
    });
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
