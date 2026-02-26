import { ComponentFixture, TestBed } from '@angular/core/testing';

import { REventsCalenderComponent } from './reventscalender.component';

describe('ReventscalenderComponent', () => {
  let component: REventsCalenderComponent;
  let fixture: ComponentFixture<REventsCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [REventsCalenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(REventsCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
