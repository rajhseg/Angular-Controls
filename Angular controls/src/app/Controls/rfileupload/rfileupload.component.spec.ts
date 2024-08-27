import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfileuploadComponent } from './rfileupload.component';

describe('RfileuploadComponent', () => {
  let component: RfileuploadComponent;
  let fixture: ComponentFixture<RfileuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfileuploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfileuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
