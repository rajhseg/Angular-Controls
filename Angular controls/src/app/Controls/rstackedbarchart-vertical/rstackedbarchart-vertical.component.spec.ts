import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RstackedbarchartVerticalComponent } from './rstackedbarchart-vertical.component';

describe('RstackedbarchartVerticalComponent', () => {
  let component: RstackedbarchartVerticalComponent;
  let fixture: ComponentFixture<RstackedbarchartVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RstackedbarchartVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RstackedbarchartVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
