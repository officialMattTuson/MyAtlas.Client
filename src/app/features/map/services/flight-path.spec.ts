import { TestBed } from '@angular/core/testing';
import { FlightPathService } from './flight-path';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('FlightPathService', () => {
  let service: FlightPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(FlightPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
