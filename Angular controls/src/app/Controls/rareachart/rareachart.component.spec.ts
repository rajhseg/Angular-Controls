import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RAreaChartComponent } from './rareachart.component';

describe('RareachartComponent', () => {
  let component: RAreaChartComponent;
  let fixture: ComponentFixture<RAreaChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RAreaChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RAreaChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
