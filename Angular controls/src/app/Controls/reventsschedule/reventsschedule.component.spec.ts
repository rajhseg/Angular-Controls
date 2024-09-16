import { ComponentFixture, TestBed } from '@angular/core/testing';

import { REventsScheduleComponent } from './reventsschedule.component';

describe('ReventsscheduleComponent', () => {
  let component: REventsScheduleComponent;
  let fixture: ComponentFixture<REventsScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [REventsScheduleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(REventsScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
