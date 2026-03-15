import { TestBed } from '@angular/core/testing';

import { RPopupService } from './rpopup.service';

describe('PopupService', () => {
  let service: RPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
