import { TestBed } from '@angular/core/testing';

import { MapHighlight } from './map-highlight';

describe('MapHighlight', () => {
  let service: MapHighlight;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapHighlight);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
