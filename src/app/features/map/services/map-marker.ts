import { ApplicationRef, createComponent, DestroyRef, EnvironmentInjector, inject, Injectable } from '@angular/core';
import mapboxgl, { Marker } from 'mapbox-gl';
import { MemoryState } from '../../memories/services/memory-state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapPopup } from '../components/map-popup/map-popup';
import { BehaviorSubject } from 'rxjs';
import { Coordinates } from '../../../core/models/coordinates.model';

@Injectable({
  providedIn: 'root',
})
export class MapMarker {

  private readonly memoryStateService = inject(MemoryState);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private destroyRef = inject(DestroyRef);
  private markers: Marker[] = [];

  private readonly _markers = new BehaviorSubject<Marker[]>([]);
  public $markers = this._markers.asObservable();

  private readonly _markerToHover = new BehaviorSubject<Marker | undefined>(undefined);
  public $markerToHover = this._markerToHover.asObservable()
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(marker => {
      if (!marker) {
        const markers = this._markers.getValue();
        markers.forEach(marker => {
          const popup = marker.getPopup();
          popup?.remove();
        })
      } else {
        marker.togglePopup();
      }
    });

  public addMarkerToMap(map: mapboxgl.Map): void {
    this.memoryStateService.$memories.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (memories) => {
        memories.forEach((memory) => {
          const popupOptions: mapboxgl.PopupOptions = {
            closeButton: false,
            closeOnClick: false,
            offset: 25,
            className: "memory-marker-popup",
            maxWidth: "280px"
          };

          const popupComponent = createComponent(MapPopup, {
            environmentInjector: this.injector
          });
          popupComponent.setInput('memory', memory);
          this.appRef.attachView(popupComponent.hostView);
          const popupElement: Node = popupComponent.location.nativeElement;

          const popup = new mapboxgl.Popup(popupOptions).setDOMContent(popupElement);

          const marker = new mapboxgl.Marker()
            .setLngLat([memory.longitude, memory.latitude])
            .setPopup(popup)
            .addTo(map);

          const markerElement = marker.getElement();
          markerElement.addEventListener('mouseenter', () => marker.togglePopup());
          markerElement.addEventListener('mouseleave', () => marker.togglePopup());
          markerElement.addEventListener('click', (e) => {
            e.stopPropagation();
          });
          this.markers.push(marker);
        });
        this.setMapMarkers(this.markers);
      }
    })
  }

  public clearMapMarkers(): void {
    const markers = this.getMapMarkers();
    markers.forEach(marker => marker.remove());
    this._markers.next([]);
  }

  public setMapMarkers(markers: Marker[]): void {
    this._markers.next(markers);
  }

  public getMapMarkers(): Marker[] {
    return this._markers.getValue();
  }

  public getMarkerByCoordinates(coordinates: Coordinates | null): void {
    if (!coordinates) {
      this._markerToHover.next(undefined);
      return;
    }
    const markers = this._markers.getValue();
    const markerToHover = markers.find(marker => marker.getLngLat().lat === coordinates.latitude && marker.getLngLat().lng === coordinates.longitude);
    this._markerToHover.next(markerToHover);
  }
}
