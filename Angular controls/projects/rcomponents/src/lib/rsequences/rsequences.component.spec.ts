import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStateVerticalComponent } from './rsequences.component';

describe('SequencesComponent', () => {
  let component: RStateVerticalComponent;
  let fixture: ComponentFixture<RStateVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RStateVerticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RStateVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
