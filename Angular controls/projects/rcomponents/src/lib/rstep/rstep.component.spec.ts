import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStepComponent } from './rstep.component';

describe('RstepComponent', () => {
  let component: RStepComponent;
  let fixture: ComponentFixture<RStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RStepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
