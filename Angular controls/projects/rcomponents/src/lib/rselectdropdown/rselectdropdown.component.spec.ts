import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSelectDropdownComponent } from './rselectdropdown.component';

describe('RselectdropdownComponent', () => {
  let component: RSelectDropdownComponent;
  let fixture: ComponentFixture<RSelectDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RSelectDropdownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
