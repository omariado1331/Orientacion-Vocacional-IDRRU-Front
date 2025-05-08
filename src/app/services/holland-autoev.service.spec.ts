import { TestBed } from '@angular/core/testing';

import { HollandAutoevService } from './holland-autoev.service';

describe('HollandAutoevService', () => {
  let service: HollandAutoevService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HollandAutoevService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
