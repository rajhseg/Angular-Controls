import { ChangeDetectorRef, Directive, TemplateRef, ViewContainerRef, Input, ElementRef, EmbeddedViewRef, OnInit, Output } from "@angular/core";
import { RWindowHelper } from "../rwindowObject";
import { RCssUnitsService, RelativeUnitType } from "../rcss-units.service";

import { InjectionToken } from '@angular/core';
import { BehaviorSubject } from "rxjs";

export const RSPLIT_ITEM = new InjectionToken<any>('RSPLIT_ITEM');

export interface IRSplitterInterface {
  IsSplitObj: boolean,
  TemplateRef: TemplateRef<any> | null,
  Id: string;
  InitialWidth: string;
  InitialHeight: string;
  InstanceContext: object;
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

  private _instanceContext: object = {};

  public set InstanceContext(value: object) {
    this._instanceContext = {
      $implicit: value
    };
  }

  @Input('rpagecontentInstanceContext')
  public set RPageContentInstanceContext(value: object) {
    this.InstanceContext = value;
  }

  public get InstanceContext(): object {
    return this._instanceContext;
  }

  @Output()
  ValueChanged: BehaviorSubject<any> = new BehaviorSubject({});

  constructor(public TemplateRef: TemplateRef<unknown>, public vcr: ViewContainerRef, 
        public cdr: ChangeDetectorRef, public winObj: RWindowHelper) {
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

  InstanceContext: object = {};

  constructor(public winObj: RWindowHelper, private type: RSplitterType, private obj: any) {
    this.Id = this.winObj.GenerateUniqueId();
    this.InitialWidth = obj.width;
    this.InitialHeight = obj.height;
  }
}

export enum RSplitterType {
  Vertical = 0,
  Horizontal
}
