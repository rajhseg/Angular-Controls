import { TestBed } from '@angular/core/testing';

import { RCalenderService } from './rcalender.service';

describe('CalenderService', () => {
  let service: RCalenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RCalenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
