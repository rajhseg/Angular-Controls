import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RFilterComponent } from './rfilter.component';

describe('RfilterComponent', () => {
  let component: RFilterComponent;
  let fixture: ComponentFixture<RFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
