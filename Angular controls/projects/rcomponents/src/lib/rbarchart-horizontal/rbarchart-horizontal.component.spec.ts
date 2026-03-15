import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RBarChartHorizontalComponent } from './rbarchart-horizontal.component';

describe('RbarchartHorizontalComponent', () => {
  let component: RBarChartHorizontalComponent;
  let fixture: ComponentFixture<RBarChartHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RBarChartHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RBarChartHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
