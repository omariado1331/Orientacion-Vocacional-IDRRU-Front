import { TestBed } from '@angular/core/testing';

import { HollandSecondService } from './holland-second.service';

describe('HollandSecondService', () => {
  let service: HollandSecondService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HollandSecondService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
