import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef, Input, ElementRef, EmbeddedViewRef, OnInit, Output } from "@angular/core";
import { WindowHelper } from "../windowObject";
import { CssUnitsService, RelativeUnitType } from "../css-units.service";

import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from "rxjs";

export const RSPLIT_ITEM = new InjectionToken<any>('RSPLIT_ITEM');

export interface IRSplitterInterface {
  IsSplitObj: boolean,
  TemplateRef: TemplateRef<any> | null,
  Id: string;
  InitialWidth: string;
  InitialHeight: string;
}

@Directive({
  selector: '[rpagecontent]',
  standalone: true
})
export class RPageContentDirective implements IRSplitterInterface, OnInit {

  IsSplitObj: boolean = false;

  Id: string = '';

  _initialWidth: string = '';
  _initialHeight: string = '';

  @Input()
  set InitialWidth(value: string) {
    this._initialWidth = value;
    this.ValueChanged.next(value);
  }
  get InitialWidth(): string {
    return this._initialWidth;
  }

  @Input()
  set InitialHeight(value: string) {
    this._initialHeight = value;
    this.ValueChanged.next(value);
  }
  get InitialHeight(): string {
    return this._initialHeight;
  }
  
  @Output()
  ValueChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(public TemplateRef: TemplateRef<unknown>, public vcr: ViewContainerRef, 
        public cdr: ChangeDetectorRef, public winObj: WindowHelper) {
    this.Id = this.winObj.GenerateUniqueId();
  }

  ngOnInit(): void {

  }
}

export class RSplitterObj implements IRSplitterInterface {

  TemplateRef: TemplateRef<any> | null = null;

  IsSplitObj: boolean = true;

  Id: string = '';

  InitialHeight: string = '';

  InitialWidth: string = '';

  constructor(public winObj: WindowHelper, private type: RSplitterType, private obj: any) {
    this.Id = this.winObj.GenerateUniqueId();
    this.InitialWidth = obj.width;
    this.InitialHeight = obj.height;
  }
}

export enum RSplitterType {
  Vertical = 0,
  Horizontal
}
