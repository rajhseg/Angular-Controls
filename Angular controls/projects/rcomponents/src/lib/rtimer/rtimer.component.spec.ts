import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtimerComponent } from './rtimer.component';

describe('RtimerComponent', () => {
  let component: RtimerComponent;
  let fixture: ComponentFixture<RtimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtimerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
