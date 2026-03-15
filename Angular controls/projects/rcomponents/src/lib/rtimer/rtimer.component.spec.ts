import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTimerComponent } from './rtimer.component';

describe('RtimerComponent', () => {
  let component: RTimerComponent;
  let fixture: ComponentFixture<RTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RTimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
