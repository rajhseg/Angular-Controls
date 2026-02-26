import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDonutChartComponent } from './rpiechart.component';

describe('RpiechartComponent', () => {
  let component: RDonutChartComponent;
  let fixture: ComponentFixture<RDonutChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDonutChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RDonutChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
