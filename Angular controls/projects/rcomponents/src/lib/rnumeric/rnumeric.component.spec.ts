import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RNumericComponent } from './rnumeric.component';

describe('RNumericComponent', () => {
  let component: RNumericComponent;
  let fixture: ComponentFixture<RNumericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RNumericComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RNumericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
