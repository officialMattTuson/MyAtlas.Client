import { TestBed } from '@angular/core/testing';

import { MemoryState } from './memory-state';

describe('MemoryState', () => {
  let service: MemoryState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MemoryState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
