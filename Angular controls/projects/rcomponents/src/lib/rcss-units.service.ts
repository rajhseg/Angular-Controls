import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class InputPropValidator {

  constructor() { }

  public isValidColor(value: string): boolean {
    const namedColor = /^[a-zA-Z]+$/;

    const hex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

    const rgb = /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/;

    const rgba = /^rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*(0|1|0?\.\d+)\s*\)$/;

    const hsl = /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/;

    const hsla = /^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*(0|1|0?\.\d+)\s*\)$/;

    const cssVar = /^var\(--[a-zA-Z0-9-_]+\)$/;

    return (
      namedColor.test(value) ||
      hex.test(value) ||
      rgb.test(value) ||
      rgba.test(value) ||
      hsl.test(value) ||
      hsla.test(value) ||
      cssVar.test(value)
    );
  }

  public isValidSize(value: string): boolean {
    const regex = /^(\d+(\.\d+)?)(px|%|em|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc)$/;
    const varRegex = /^var\(--[a-zA-Z0-9-_]+\)$/;

    return regex.test(value) || varRegex.test(value);
  }

  public isValidSizeInNumber(value: any): value is number {
    return (
      typeof value === 'number' &&
      !isNaN(value) &&
      isFinite(value)
    );
  }

  
  public sanitizeLabel(value: any, maxLength = 100): string {

    if (value === null || value === undefined) {
      return '';
    }

    let str = String(value);

    // Limit length
    if (str.length > maxLength) {
      str = str.substring(0, maxLength);
    }

    // Allow safe characters only
    str = str.replace(/[^a-zA-Z0-9\s.,\-_()]/g, '');

    return str;
  }

}

@Injectable({
  providedIn: 'root'
})
export class RCssUnitsService {

  constructor() { }

  ConvertToPxValue(value: number, fromCssUnit : CssUnit | string, parentElementForRelativeUnit: Element | null, 
        relativeTo: RelativeUnitType | null) : number {

    let returnValue: number;
    let from = fromCssUnit.toString();

    if(from.toLowerCase() == "px"){
      return value;
    }
    
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    let baseVal = rect.width.baseVal;

    if(from=="em" || from=="%")
      parentElementForRelativeUnit = parentElementForRelativeUnit || document.body;

    if(from=="%"){
      from = relativeTo == RelativeUnitType.Width ? '%width':'%height';
    }

    //ex ch needs to implement
    
    const units: any = {
                    "px": baseVal.SVG_LENGTHTYPE_PX,
                    "mm": baseVal.SVG_LENGTHTYPE_MM,
                    "in": baseVal.SVG_LENGTHTYPE_IN,
                    "pt": baseVal.SVG_LENGTHTYPE_PT,
                    // "%": baseVal.SVG_LENGTHTYPE_PERCENTAGE,
                    // "em": baseVal.SVG_LENGTHTYPE_EMS,
                    // "ex": baseVal.SVG_LENGTHTYPE_EXS,                                              
                    "cm": baseVal.SVG_LENGTHTYPE_CM,      
                    "pc": baseVal.SVG_LENGTHTYPE_PC,
                  };

    const RelativeUnitsToPx: any = {
        '%width': (value: number) => (value * parseFloat(getComputedStyle(parentElementForRelativeUnit as Element).width)) / 100,
        '%height': (value: number) => (value * parseFloat(getComputedStyle(parentElementForRelativeUnit as Element).height)) / 100,
        'rem': (value : number) => value * parseFloat(getComputedStyle(document.documentElement ).fontSize),
        'em': (value : number)  => value * parseFloat(getComputedStyle(parentElementForRelativeUnit as Element).fontSize),        
        'vw': (value : number)  => value / 100 * window.innerWidth,
        'vh': (value : number)  => value / 100 * window.innerHeight,
      }

    if(units[from]!=undefined) {      
      baseVal.newValueSpecifiedUnits(units[from] as number, value);
      baseVal.convertToSpecifiedUnits(units["px"] as number);          
      returnValue = baseVal.value;
    } else {
      if(RelativeUnitsToPx[from]!=undefined)
        returnValue = RelativeUnitsToPx[from](value);
      else
        throw Error("Not supported CssUnit "+ value+", unit from "+from);
    }

    return returnValue;
  }

  ConvertToPxString(value: number, fromCssUnit : CssUnit | string, parentElementForRelativeUnit: Element | null, 
    relativeTo: RelativeUnitType | null) : string {
    let val = this.ConvertToPxValue(value, fromCssUnit, parentElementForRelativeUnit, relativeTo);
    return val + CssUnit.Px.toString();
  }

  ToPxValue(value: string, relativeParentElement: Element | null, relativeToType: RelativeUnitType | null): number {
    let result = value.match(/(-?[\d.]+)([a-z%]*)/);
    if(result) {
      let num = parseFloat(result[1].toString());
      let unit = result[2];
      let returnValue = this.ConvertToPxValue(num, unit, relativeParentElement, relativeToType);
      return returnValue;
    }

    throw Error("Invalid value with CssUnit "+value)
  }

  ToPxString(value: string, relativeParentElement: Element | null, relativeToType: RelativeUnitType | null): string {
    let result = this.ToPxValue(value, relativeParentElement, relativeToType);
    return result + CssUnit.Px.toString();
  }

}


export enum RelativeUnitType {
  Width = 0,
  Height = 1
}

export enum CssUnit {
  Percentage = "%",
  Rem = "rem",
  Em = "em",
  Ex = "ex",
  Vw = "vw",
  Vh = "vh",
  Px = "px",
  Mm = "mm",
  In = "in",
  Pt = "pt",
  Cm = "cm",
  Pc = "pc"
}