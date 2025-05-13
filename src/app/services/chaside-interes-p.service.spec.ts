import { TestBed } from '@angular/core/testing';

import { ChasideInteresPService } from './chaside-interes-p.service';

describe('ChasideInteresPService', () => {
  let service: ChasideInteresPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChasideInteresPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
