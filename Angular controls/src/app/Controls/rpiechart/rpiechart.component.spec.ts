import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RPieChartComponent } from './rpiechart.component';

describe('RpiechartComponent', () => {
  let component: RPieChartComponent;
  let fixture: ComponentFixture<RPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RPieChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
