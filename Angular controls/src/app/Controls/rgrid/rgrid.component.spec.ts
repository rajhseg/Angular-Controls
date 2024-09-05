import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RgridComponent } from './rgrid.component';

describe('RgridComponent', () => {
  let component: RgridComponent;
  let fixture: ComponentFixture<RgridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RgridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
