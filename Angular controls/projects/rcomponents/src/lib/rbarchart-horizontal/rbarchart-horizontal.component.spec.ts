import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RbarchartHorizontalComponent } from './rbarchart-horizontal.component';

describe('RbarchartHorizontalComponent', () => {
  let component: RbarchartHorizontalComponent;
  let fixture: ComponentFixture<RbarchartHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RbarchartHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RbarchartHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
