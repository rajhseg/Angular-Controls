import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RCheckboxComponent } from './rcheckbox.component';

describe('CheckboxComponent', () => {
  let component: RCheckboxComponent;
  let fixture: ComponentFixture<RCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RCheckboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
