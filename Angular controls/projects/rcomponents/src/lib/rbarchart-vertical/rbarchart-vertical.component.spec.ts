import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RBarChartVerticalComponent } from './rbarchart-vertical.component';

describe('RbarchartVerticalComponent', () => {
  let component: RBarChartVerticalComponent;
  let fixture: ComponentFixture<RBarChartVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RBarChartVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RBarChartVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
