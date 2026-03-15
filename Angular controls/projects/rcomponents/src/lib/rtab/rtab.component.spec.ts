import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTabComponent } from './rtab.component';

describe('TabComponent', () => {
  let component: RTabComponent;
  let fixture: ComponentFixture<RTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RTabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
