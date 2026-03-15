import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSequenceVerticalComponent } from './rsequence.component';

describe('SequenceComponent', () => {
  let component: RSequenceVerticalComponent;
  let fixture: ComponentFixture<RSequenceVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RSequenceVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RSequenceVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
