import { TestBed } from '@angular/core/testing';

import { DropdownserviceService } from './dropdownservice.service';

describe('DropdownserviceService', () => {
  let service: DropdownserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropdownserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
