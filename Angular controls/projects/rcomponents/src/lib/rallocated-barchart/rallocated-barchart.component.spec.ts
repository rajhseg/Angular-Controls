import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RAllocatedBarChartComponent } from './rallocated-barchart.component';

describe('RallocatedBarchartComponent', () => {
  let component: RAllocatedBarChartComponent;
  let fixture: ComponentFixture<RAllocatedBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RAllocatedBarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RAllocatedBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
