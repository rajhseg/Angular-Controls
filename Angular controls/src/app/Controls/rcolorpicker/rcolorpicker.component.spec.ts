import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RColorPickerComponent } from './rcolorpicker.component';

describe('RcolorpickerComponent', () => {
  let component: RColorPickerComponent;
  let fixture: ComponentFixture<RColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RColorPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
