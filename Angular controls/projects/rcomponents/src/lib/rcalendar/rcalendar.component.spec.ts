import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RCalendarComponent } from './rcalendar.component';

describe('CalenderComponent', () => {
  let component: RCalendarComponent;
  let fixture: ComponentFixture<RCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RCalendarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
