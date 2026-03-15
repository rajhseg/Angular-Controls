import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RStarRatingComponent } from './rrating.component';

describe('RatingComponent', () => {
  let component: RStarRatingComponent;
  let fixture: ComponentFixture<RStarRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RStarRatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RStarRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
