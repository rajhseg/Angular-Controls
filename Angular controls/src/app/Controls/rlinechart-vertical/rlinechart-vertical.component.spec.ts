import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RlinechartVerticalComponent } from './rlinechart-vertical.component';

describe('RlinechartVerticalComponent', () => {
  let component: RlinechartVerticalComponent;
  let fixture: ComponentFixture<RlinechartVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RlinechartVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RlinechartVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
