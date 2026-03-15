import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RRadiobuttonComponent } from './rradiobutton.component';

describe('RadiobuttonComponent', () => {
  let component: RRadiobuttonComponent;
  let fixture: ComponentFixture<RRadiobuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RRadiobuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RRadiobuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
