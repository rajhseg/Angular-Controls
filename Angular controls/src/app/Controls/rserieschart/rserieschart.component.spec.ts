import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSeriesChartComponent } from './rserieschart.component';

describe('RserieschartComponent', () => {
  let component: RSeriesChartComponent;
  let fixture: ComponentFixture<RSeriesChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RSeriesChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RSeriesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
