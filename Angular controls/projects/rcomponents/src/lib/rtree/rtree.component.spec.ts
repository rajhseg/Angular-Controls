import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTreeComponent } from './rtree.component';

describe('TreeComponent', () => {
  let component: RTreeComponent;
  let fixture: ComponentFixture<RTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
