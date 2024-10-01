import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RpiechartComponent } from './rpiechart.component';

describe('RpiechartComponent', () => {
  let component: RpiechartComponent;
  let fixture: ComponentFixture<RpiechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpiechartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RpiechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
