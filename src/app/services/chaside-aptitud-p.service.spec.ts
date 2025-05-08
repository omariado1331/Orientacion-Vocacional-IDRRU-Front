import { TestBed } from '@angular/core/testing';

import { ChasideAptitudPService } from './chaside-aptitud-p.service';

describe('ChasideAptitudPService', () => {
  let service: ChasideAptitudPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChasideAptitudPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
