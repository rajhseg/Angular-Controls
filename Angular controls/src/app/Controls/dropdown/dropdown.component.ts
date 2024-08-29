import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { AfterContentChecked, EventEmitter, AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, HostBinding, HostListener, Inject, Injector, Input, OnDestroy, OnInit, Output, QueryList, ViewEncapsulation, afterNextRender, forwardRef, inject, output } from '@angular/core';
import { DropdownModel } from './dropdownmodel';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DropdownService } from './dropdownservice.service';
import { IPopupCloseInterface, PopupService } from '../popup.service';
import { WINDOWOBJECT, WindowHelper } from '../windowObject';
import { RCheckboxComponent } from "../checkbox/checkbox.component";
import { CheckboxEventArgs } from '../checkbox/checkbox.service';

@Component({
  selector: 'rdropdown',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, NgForOf, NgClass, RCheckboxComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ],
  host: {
    "(window:click)": "windowOnClick($event)"
  }
})
export class DropdownComponent implements AfterContentInit, OnDestroy, OnInit, ControlValueAccessor,
  AfterContentInit, AfterContentChecked, OnDestroy, IPopupCloseInterface {

  onChange: any = () => { }
  onTouch: any = () => { }
  private selectedElementRef: ElementRef | undefined = undefined;
  private isFocusDone: boolean = false;

  @HostBinding('style.display')
  @Input() set styleDisplay(val: any) {

  }

  @Input()
  IsMulti: boolean = false;

  @Input()
  BackgroundColor: string = "white";

  @Input()
  ForeColor: string = "black";

  @Input()
  IsChildOfAnotherControl: boolean = false;

  IsChildOfAnotherControlClicked: boolean = false;

  @Output()
  Opened = new EventEmitter<boolean>(); // output<boolean>();

  @Output()
  Closed = new EventEmitter<boolean>(); // output<boolean>();

  @Input()
  ParentComponent: any | undefined = undefined;

  @Input()
  public set Items(value: DropdownModel[] | string[] | number[]) {
    this.ComplexItems = [];

    if (value) {
      value.forEach((x: DropdownModel | string | number) => {
        if (x instanceof DropdownModel) {
          this.ComplexItems.push(x);
        } else {
          let _citem = new DropdownModel(x, x.toString());
          this.ComplexItems.push(_citem);
        }
      });
    }
  }

  public ComplexItems: DropdownModel[] = [];

  @Input()
  Width: string = '80px';

  @Input()
  DropDownContentWidth: string = '120px';

  @Output()
  change = new EventEmitter<any>(); // output<any>();

  private _show: boolean = false;

  @Input()
  set IsDropDownOpen(value: boolean) {

    if (this._show && !value) {
      this._show = value;
      this.Closed.emit(true);
    }

    if (value) {
      this._show = value;
      this.Opened.emit(true);
    } else {
      this._show = value;
    }
  }

  get IsDropDownOpen(): boolean {
    return this._show;
  }


  SelectedItems: DropdownModel[] | string[] | number[] | any[] = [];
  SelectedIndexes: number[] = [];

  SelectedItem: DropdownModel | string | any = '';
  SelectedIndex: number = -1;

  SelectedDisplay: string | number = '';
  private firstTimeInit: boolean = true;
  Id: string = '';
  private winObj!: Window;
  private injector = inject(Injector);

  constructor(private ddservice: DropdownService,
    private popupService: PopupService,
    private windowHelper: WindowHelper
  ) {
    this.Id = windowHelper.GenerateUniqueId();
    this.ddservice.AddInstance(this);
    this.winObj = inject(WINDOWOBJECT);
  }

  FocusItem($evt: Event) {
    this.isFocusDone = true;
  }

  scrollHandler(event: Event) {
    this.isFocusDone = true;
  }

  ngAfterContentChecked(): void {

  }

  selectSingleValue($event: Event, selValue: DropdownModel) {

    this.ComplexItems.forEach(x => x.IsSelected = false);

    this.SelectedIndex = this.ComplexItems.findIndex((x) => this.ObjEquals(x, selValue));

    if (this.SelectedIndex > -1) {
      this.SelectedItem = selValue;
      this.SelectItem(selValue);
      this.NotifyToModel();
    }
  }

  writeValue(obj: DropdownModel | string | number | DropdownModel[] | string[] | number[]): void {

    if (obj != null && obj != undefined) {
      let indexOfObj = -1;
      if (Array.isArray(obj)) {

        this.isFocusDone = false;

        if (this.IsMulti) {

          this.ComplexItems.forEach(x => x.IsSelected = false);

          this.ComplexItems.forEach(x => {

            if (obj[0] instanceof DropdownModel) {
              indexOfObj = obj.findIndex((y: any) => this.ObjEquals(x.Value, y.Value));
              if (indexOfObj > -1) {
                this.AssignItems(x, true);
              }
            } else {
              indexOfObj = obj.findIndex((y: any) => this.ObjEquals(x.Value, y));
              if (indexOfObj > -1) {
                this.AssignItems(x, true);
              }
            }
          });

          this.loadSelectedItems();
          this.NotifyToUI();
        }
      } else {

        this.ComplexItems.forEach(x => x.IsSelected = false);

        if (obj instanceof DropdownModel) {
          indexOfObj = this.ComplexItems.findIndex((x) => {
            return this.ObjEquals(x, obj)
          });
        } else {
          if (obj != undefined) {
            indexOfObj = this.ComplexItems.findIndex((x) => {
              return x === obj as any;
            });
          }
        }

        this.isFocusDone = false;

        if (indexOfObj > -1) {
          this.SelectedIndex = indexOfObj;          
          this.SelectItem(this.ComplexItems[indexOfObj]);
          this.NotifyToUI();
        }
      }
    }
  }

  checkValue($event: CheckboxEventArgs, value: DropdownModel) {
    this.AssignItems(value, $event.isChecked);
    this.loadSelectedItems();
    this.NotifyToModel();
  }

  selectall($event: CheckboxEventArgs) {
    this.ComplexItems.forEach(x => {
      this.AssignItems(x, $event.isChecked);
    });

    this.loadSelectedItems();
    this.NotifyToModel();
  }

  loadSelectedItems() {
    if (this.IsMulti) {
      this.SelectedItems = [];
      this.SelectedIndexes = [];

      this.ComplexItems.forEach((x: any, index: number) => {
        if (x instanceof DropdownModel) {
          let eleR = x as DropdownModel;
          if (eleR && eleR.IsSelected) {
            this.SelectedItems.push(eleR);
            this.SelectedIndexes.push(index);
          }
        }
      });
      
      this.SelectedDisplay = this.SelectedItems.slice(0, 1).map(x => x.DisplayValue).join(",");

      if (this.SelectedDisplay != "") {
        if (this.SelectedItems.length > 1)
          this.SelectedDisplay += ", +(" + (this.SelectedItems.length - 1) + ")..."
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  ngOnInit(): void {
    if (this.windowHelper.isExecuteInBrowser()) {

    }
  }

  // private closeAllDropdowns(ins: DropdownComponent | null, onwindowClick: boolean = false) {


  //   this.ddservice.GetAllInstance().forEach((x) => {
  //     x.IsDropDownOpen = false;
  //   });

  // }

  ngOnDestroy(): void {

  }

  ngAfterContentInit(): void {

  }

  private BindClickEvent() {

  }

  private BindOptionTemplateEvent() {

  }

  onBlur($evt: Event) {

  }

  closeDropdown() {

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    this.IsDropDownOpen = false;
  }

  windowOnClick($event: Event) {
        
    let i =15;
    let element = $event.srcElement;
    let sameelementClicked: boolean = false;
    let elementId: string | undefined = undefined;

    while(element!=undefined && i>-1){
      if((element as HTMLElement).classList.contains('rdropdownWindowClose')){
        elementId = (element as HTMLElement).id;
        if(elementId==this.Id) {
          sameelementClicked = true;
        }
        break;
      }

      i--;
      element = (element as HTMLElement).parentElement;
    }

    if(!sameelementClicked)
        this.IsDropDownOpen = false;

    // let stopPropagation = false;
    // let parentElement = ($event.srcElement as any).parentElement;

    // let i = 10;
    // while (i >= 0 && parentElement != undefined) {
    //   if (parentElement.classList.contains('option-content')) {
    //     stopPropagation = true;
    //     break;
    //   }
    //   parentElement = parentElement.parentElement;
    //   i--;
    // }

    // if (!stopPropagation) {
    //   this.IsDropDownOpen = false;
    // } else {
    //   $event.stopPropagation();
    // }
  }

  openDropdown(evt: Event) {

    // this.popupService.CloseAllPopupsOnOpen(this);
    var currentValueToSet = !this.IsDropDownOpen;
    if (currentValueToSet) {

    }

    // this.closeAllDropdowns(this);
    this.IsChildOfAnotherControlClicked = false;

    if (this.firstTimeInit) {
      this.firstTimeInit = false;
    }

    this.IsDropDownOpen = currentValueToSet;
    //evt.stopPropagation();
  }

  AssignItems(item: DropdownModel, val: boolean) {

    if (item instanceof DropdownModel) {
      item.IsSelected = val;
    }

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    this.SelectedItem = item;
  }

  SelectItem(item: DropdownModel | string | number) {

    if (item instanceof DropdownModel) {
      item.IsSelected = true;
    }

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    this.SelectedItem = item;
    if (item instanceof DropdownModel) {
      this.SelectedDisplay = item.DisplayValue;
    } else {
      this.SelectedDisplay = item;
    }
    this.IsDropDownOpen = false;   
  }

  NotifyToModel(){       
    if (!this.IsMulti) {
      this.onChange(this.SelectedItem);
      this.onTouch(this.SelectedItem);
      this.change.emit(this.SelectedItem as any);
    }
    else{
      this.onChange(this.SelectedItems);
      this.onTouch(this.SelectedItems);
      this.change.emit(this.SelectedItems as any);
    }
  }

  NotifyToUI(){
    if (!this.IsMulti)
      this.change.emit(this.SelectedItem as any);
    else
      this.change.emit(this.SelectedItems as any);
  }

  ObjEquals(x: any, y: any): boolean {
    'use strict';

    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }

    if (x.constructor !== y.constructor) { return false; }

    if (x instanceof Function) { return x === y; }

    if (x instanceof RegExp) { return x === y; }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }
    if (Array.isArray(x) && x.length !== y.length) { return false; }

    if (x instanceof Date) { return false; }

    if (!(x instanceof Object)) { return false; }
    if (!(y instanceof Object)) { return false; }

    var p = Object.keys(x);
    return Object.keys(y).every((i) => { return p.indexOf(i) !== -1; }) &&
      p.every((i) => { return this.ObjEquals(x[i], y[i]); });
  }

}
