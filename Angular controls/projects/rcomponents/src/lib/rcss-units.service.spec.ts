import { TestBed } from '@angular/core/testing';

import { RCssUnitsService } from './rcss-units.service';

describe('CssUnitsService', () => {
  let service: RCssUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RCssUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
