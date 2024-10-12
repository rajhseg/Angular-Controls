import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStackedRangeBarChartVerticalComponent } from './rstackedrangebarchart-vertical.component';

describe('RstackedrangebarchartVerticalComponent', () => {
  let component: RStackedRangeBarChartVerticalComponent;
  let fixture: ComponentFixture<RStackedRangeBarChartVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RStackedRangeBarChartVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RStackedRangeBarChartVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
