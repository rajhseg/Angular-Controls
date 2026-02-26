import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RProgressbarComponent } from './progressbar.component';

describe('ProgressbarComponent', () => {
  let component: RProgressbarComponent;
  let fixture: ComponentFixture<RProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RProgressbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
