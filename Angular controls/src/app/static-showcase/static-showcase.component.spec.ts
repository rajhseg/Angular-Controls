import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaticShowcaseComponent } from './static-showcase.component';
import { DropdownModel } from 'rcomponents';

// JSDOM SVG polyfill for RCssUnitsService
if (typeof document !== 'undefined') {
  const origCreateNS = document.createElementNS.bind(document);
  (document as any).createElementNS = function (ns: string, tag: string) {
    const el: any = origCreateNS(ns as any, tag);
    if (tag === 'rect') {
      (el as any).width = {
        baseVal: {
          SVG_LENGTHTYPE_PX: 1,
          SVG_LENGTHTYPE_MM: 3.7795,
          SVG_LENGTHTYPE_IN: 96,
          SVG_LENGTHTYPE_PT: 1.3333,
          SVG_LENGTHTYPE_CM: 37.795,
          SVG_LENGTHTYPE_PC: 16,
          value: 100,
        },
      };
      (el as any).height = {
        baseVal: {
          SVG_LENGTHTYPE_PX: 1,
          SVG_LENGTHTYPE_MM: 3.7795,
          SVG_LENGTHTYPE_IN: 96,
          SVG_LENGTHTYPE_PT: 1.3333,
          SVG_LENGTHTYPE_CM: 37.795,
          SVG_LENGTHTYPE_PC: 16,
          value: 100,
        },
      };
    }
    return el;
  };
}

describe('StaticShowcaseComponent', () => {
  let component: StaticShowcaseComponent;
  let fixture: ComponentFixture<StaticShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticShowcaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StaticShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the StaticShowcaseComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial form model values', () => {
    expect(component.selectedCountry).toBe('usa');
    expect(component.selectedState).toBe('ca_state');
    expect(component.selectedCity).toBe('sf');
    expect(component.textboxVal).toBe('Alex Chen');
    expect(component.numericVal).toBe(16);
    expect(component.sliderVal).toBe(75);
    expect(component.colorPickerVal).toBe('#3b82f6');
  });

  it('should reactively cascade Country change to State and City', () => {
    component.onCountryChange('de');
    expect(component.selectedCountry).toBe('de');
    expect(component.currentStates.length).toBeGreaterThan(0);
    expect(component.selectedState).toBe('by_state');
    expect(component.currentCities.length).toBeGreaterThan(0);
    expect(component.selectedCity).toBe('muc');
  });

  it('should reactively cascade India country selection', () => {
    component.onCountryChange('in');
    expect(component.selectedCountry).toBe('in');
    expect(component.selectedState).toBe('ka_state');
    expect(component.selectedCity).toBe('blr');
  });

  it('should cascade Department change to Job Roles', () => {
    component.onDepartmentChange('prod');
    expect(component.selectedDepartment).toBe('prod');
    expect(component.currentRoles.length).toBeGreaterThan(0);
    expect(component.selectedRole).toBe('dir_prod');
  });

  it('should load preset data correctly', () => {
    component.loadPreset('germany');
    expect(component.selectedCountry).toBe('de');
    expect(component.textboxVal).toBe('Klaus Müller');
    expect(component.numericVal).toBe(24);
    expect(component.sliderVal).toBe(90);
    expect(component.colorPickerVal).toBe('#10b981');

    component.loadPreset('japan');
    expect(component.selectedCountry).toBe('jp');
    expect(component.textboxVal).toBe('Kenji Takahashi');
    expect(component.numericVal).toBe(18);
    expect(component.sliderVal).toBe(95);
    expect(component.colorPickerVal).toBe('#ec4899');
  });

  it('should handle button click increment', () => {
    expect(component.buttonClickCount).toBe(0);
    component.onButtonClick();
    expect(component.buttonClickCount).toBe(1);
    expect(component.lastButtonClickMsg).toContain('RButton clicked 1 time(s)');
  });

  it('should filter category tabs', () => {
    component.setCategory('charts');
    expect(component.activeCategoryTab).toBe('charts');
    component.setCategory('form-cva');
    expect(component.activeCategoryTab).toBe('form-cva');
  });

  it('should have 12 chart datasets initialized', () => {
    expect(component.pieChartItems.length).toBe(4);
    expect(component.donutChartItems.length).toBe(4);
    expect(component.barChartItems.length).toBe(4);
    expect(component.areaChartItems.length).toBe(2);
    expect(component.lineChartItems.length).toBe(2);
    expect(component.scatterChartItems.length).toBe(2);
    expect(component.allocatedBarItems.length).toBe(2);
    expect(component.seriesChartItems.length).toBe(2);
  });
});
