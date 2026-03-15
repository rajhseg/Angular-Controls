import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStackedBarChartVerticalComponent } from './rstackedbarchart-vertical.component';

describe('RstackedbarchartVerticalComponent', () => {
  let component: RStackedBarChartVerticalComponent;
  let fixture: ComponentFixture<RStackedBarChartVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RStackedBarChartVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RStackedBarChartVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
