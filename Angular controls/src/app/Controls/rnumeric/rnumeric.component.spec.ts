import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RnumericComponent } from './rnumeric.component';

describe('RnumericComponent', () => {
  let component: RnumericComponent;
  let fixture: ComponentFixture<RnumericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RnumericComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RnumericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
