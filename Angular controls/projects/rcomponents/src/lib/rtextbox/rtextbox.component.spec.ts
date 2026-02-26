import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RTextboxComponent } from './rtextbox.component';

describe('RtextboxComponent', () => {
  let component: RTextboxComponent;
  let fixture: ComponentFixture<RTextboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RTextboxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
