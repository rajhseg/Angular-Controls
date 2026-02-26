import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbarchartVerticalComponent } from './rbarchart-vertical.component';

describe('RbarchartVerticalComponent', () => {
  let component: RbarchartVerticalComponent;
  let fixture: ComponentFixture<RbarchartVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RbarchartVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbarchartVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
