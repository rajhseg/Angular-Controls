import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RSwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  let component: RSwitchComponent;
  let fixture: ComponentFixture<RSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RSwitchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
