import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RGrouppanelComponent} from './rgrouppanel.component';

describe('GrouppanelComponent', () => {
  let component: RGrouppanelComponent;
  let fixture: ComponentFixture<RGrouppanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RGrouppanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RGrouppanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
