import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSliderComponent } from './rslider.component';

describe('SliderComponent', () => {
  let component: RSliderComponent;
  let fixture: ComponentFixture<RSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
