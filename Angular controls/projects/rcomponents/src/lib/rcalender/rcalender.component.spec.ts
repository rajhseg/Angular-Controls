import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RCalenderComponent } from './rcalender.component';

describe('CalenderComponent', () => {
  let component: RCalenderComponent;
  let fixture: ComponentFixture<RCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RCalenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
