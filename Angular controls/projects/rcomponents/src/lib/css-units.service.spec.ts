import { TestBed } from '@angular/core/testing';

import { CssUnitsService } from './css-units.service';

describe('CssUnitsService', () => {
  let service: CssUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CssUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
