import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtimeselectorComponent } from './rtimeselector.component';

describe('RtimeselectorComponent', () => {
  let component: RtimeselectorComponent;
  let fixture: ComponentFixture<RtimeselectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RtimeselectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RtimeselectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
