import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RGridComponent } from './rgrid.component';

describe('RgridComponent', () => {
  let component: RGridComponent;
  let fixture: ComponentFixture<RGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
