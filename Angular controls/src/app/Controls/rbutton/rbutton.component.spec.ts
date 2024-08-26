import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbuttonComponent } from './rbutton.component';

describe('RbuttonComponent', () => {
  let component: RbuttonComponent;
  let fixture: ComponentFixture<RbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RbuttonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
