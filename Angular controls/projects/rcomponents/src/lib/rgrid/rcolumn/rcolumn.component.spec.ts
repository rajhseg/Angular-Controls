import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RcolumnComponent } from './rcolumn.component';

describe('RcolumnComponent', () => {
  let component: RcolumnComponent;
  let fixture: ComponentFixture<RcolumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RcolumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RcolumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
