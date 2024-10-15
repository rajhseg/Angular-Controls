import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RScatterChartComponent } from './rscatterchart.component';

describe('RscatterchartComponent', () => {
  let component: RScatterChartComponent;
  let fixture: ComponentFixture<RScatterChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RScatterChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RScatterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
