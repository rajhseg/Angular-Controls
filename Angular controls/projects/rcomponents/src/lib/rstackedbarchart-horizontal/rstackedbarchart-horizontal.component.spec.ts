import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStackedBarChartHorizontalComponent } from './rstackedbarchart-horizontal.component';

describe('RstackedbarchartHorizontalComponent', () => {
  let component: RStackedBarChartHorizontalComponent;
  let fixture: ComponentFixture<RStackedBarChartHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RStackedBarChartHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RStackedBarChartHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
