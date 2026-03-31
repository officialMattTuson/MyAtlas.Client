import { ApplicationRef, createComponent, DestroyRef, EnvironmentInjector, inject, Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { MemoryState } from '../../memories/services/memory-state';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MapPopup } from '../components/map-popup/map-popup';

@Injectable({
  providedIn: 'root',
})
export class MapMarker {

  private readonly memoryStateService = inject(MemoryState);
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private destroyRef = inject(DestroyRef);
  public addMarkerToMap(map: mapboxgl.Map): void {
    this.memoryStateService.$memories.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (memories) => {
        memories.forEach((memory) => {
          const popupOptions: mapboxgl.PopupOptions = {
            closeButton: false,
            closeOnClick: false,
            anchor: "bottom",
            offset: 35,
            className: "memory-marker-popup"
          }
          
          const popupComponent = createComponent(MapPopup, {
            environmentInjector: this.injector
          });
          popupComponent.setInput('memory', memory);
          this.appRef.attachView(popupComponent.hostView);
          const popupElement = popupComponent.location.nativeElement;
          
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
        })
      }
    })
  }
}
