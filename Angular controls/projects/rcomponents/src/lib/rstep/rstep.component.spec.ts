import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RstepComponent } from './rstep.component';

describe('RstepComponent', () => {
  let component: RstepComponent;
  let fixture: ComponentFixture<RstepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RstepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RstepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
