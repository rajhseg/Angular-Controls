import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfilterComponent } from './rfilter.component';

describe('RfilterComponent', () => {
  let component: RfilterComponent;
  let fixture: ComponentFixture<RfilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
