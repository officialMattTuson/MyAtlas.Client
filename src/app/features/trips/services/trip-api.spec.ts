import { TestBed } from '@angular/core/testing';

import { TripApi } from './trip-api';

describe('TripApi', () => {
  let service: TripApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TripApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
