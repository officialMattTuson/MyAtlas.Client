import { TestBed } from '@angular/core/testing';

import { MapMarker } from './map-marker';

describe('MapMarker', () => {
  let service: MapMarker;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapMarker);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
