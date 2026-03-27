import { TestBed } from '@angular/core/testing';

import { AirportApi } from './airport-api';

describe('AirportApi', () => {
  let service: AirportApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AirportApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
