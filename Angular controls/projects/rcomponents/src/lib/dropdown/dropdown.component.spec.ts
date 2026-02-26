import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: RDropdownComponent;
  let fixture: ComponentFixture<RDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RDropdownComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
