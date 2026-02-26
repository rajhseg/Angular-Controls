import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStepperVerticalComponent } from './rstepper-vertical.component';

describe('RstepperVerticalComponent', () => {
  let component: RStepperVerticalComponent;
  let fixture: ComponentFixture<RStepperVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RStepperVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RStepperVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
