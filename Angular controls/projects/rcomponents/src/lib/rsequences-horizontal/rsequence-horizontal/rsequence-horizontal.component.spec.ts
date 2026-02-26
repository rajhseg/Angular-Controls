import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSequenceHorizontalComponent } from './rsequence-horizontal.component';

describe('RSequenceHorizontalComponent', () => {
  let component: RSequenceHorizontalComponent;
  let fixture: ComponentFixture<RSequenceHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RSequenceHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RSequenceHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
