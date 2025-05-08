import { TestBed } from '@angular/core/testing';

import { HollandFirstService } from './holland-first.service';

describe('HollandFirstService', () => {
  let service: HollandFirstService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HollandFirstService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
