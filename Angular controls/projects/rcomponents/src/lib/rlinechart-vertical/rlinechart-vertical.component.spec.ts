import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RLineChartVerticalComponent } from './rlinechart-vertical.component';

describe('RlinechartVerticalComponent', () => {
  let component: RLineChartVerticalComponent;
  let fixture: ComponentFixture<RLineChartVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RLineChartVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RLineChartVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
