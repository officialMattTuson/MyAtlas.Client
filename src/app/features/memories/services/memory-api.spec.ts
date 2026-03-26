import { TestBed } from '@angular/core/testing';

import { MemoryApi } from './memory-api';

describe('MemoryApi', () => {
  let service: MemoryApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
