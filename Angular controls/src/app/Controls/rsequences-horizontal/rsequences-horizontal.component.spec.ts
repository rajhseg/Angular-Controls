import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStateHorizontalComponent } from './rsequences-horizontal.component';

describe('RStepperHorizontalComponent', () => {
  let component: RStateHorizontalComponent;
  let fixture: ComponentFixture<RStateHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RStateHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RStateHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
