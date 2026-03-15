import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTimeSelectorComponent } from './rtimeselector.component';

describe('RtimeselectorComponent', () => {
  let component: RTimeSelectorComponent;
  let fixture: ComponentFixture<RTimeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RTimeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RTimeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
