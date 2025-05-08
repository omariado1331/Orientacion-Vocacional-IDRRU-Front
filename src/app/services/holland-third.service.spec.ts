import { TestBed } from '@angular/core/testing';

import { HollandThirdService } from './holland-third.service';

describe('HollandThirdService', () => {
  let service: HollandThirdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HollandThirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
