import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RColumnComponent } from './rcolumn.component';

describe('ColumnComponent', () => {
  let component: RColumnComponent;
  let fixture: ComponentFixture<RColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
