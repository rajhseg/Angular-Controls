import { AfterContentChecked, AfterContentInit, Component, ContentChild, ElementRef, EventEmitter, forwardRef, HostBinding, inject, Injector, Input, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ROptionsTemplateDirective, RSelectItemModel } from './rselectModel';
import { CommonModule, NgClass, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownModel } from '../dropdown/dropdownmodel';
import { IPopupCloseInterface } from '../popup.service';
import { WindowHelper, WINDOWOBJECT } from '../windowObject';
import { CheckboxEventArgs } from '../checkbox/checkbox.service';
import { RCheckboxComponent } from '../checkbox/checkbox.component';
import { RTextboxComponent } from '../rtextbox/rtextbox.component';
import { RDropdownFilterPipe } from '../dropdown-filter.pipe';

@Component({
  selector: 'rselectdropdown',
  standalone: true,
  imports: [ROptionsTemplateDirective, RDropdownFilterPipe, RTextboxComponent, CommonModule, NgIf, FormsModule, NgForOf, NgClass, RCheckboxComponent],
  templateUrl: './rselectdropdown.component.html',
  styleUrl: './rselectdropdown.component.css',
  providers:[
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> RSelectDropdownComponent),
      multi: true
    }
  ],
  host: {
    "(window:click)": "windowOnClick($event)"
  }
})
export class RSelectDropdownComponent implements AfterContentInit, OnDestroy, OnInit, ControlValueAccessor,
AfterContentInit, AfterContentChecked, OnDestroy, IPopupCloseInterface {
  
  onChange: any = () => { }
  onTouch: any = () => { }
  private selectedElementRef: ElementRef | undefined = undefined;
  private isFocusDone: boolean = false;

  SearchItem: string = "";

  @HostBinding('style.display')
  @Input() set styleDisplay(val: any) {

  }
  
  @Input()
  EnableFilterOption: boolean = true;
  
  @Input()
  EnableShadowOnDropdown: boolean = true;

  @Input()
  DropDownContentHeight: number = 200;

  @ContentChild(ROptionsTemplateDirective, {read: TemplateRef<any>}) 
  OptionsTemplate!: TemplateRef<any>;

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
  Opened = new EventEmitter<boolean>(); 

  @Output()
  Closed = new EventEmitter<boolean>(); 

  @Input()
  ParentComponent: any | undefined = undefined;

  @Input()
  public set Items(value: DropdownModel[] | string[] | number[]) {
    this.ComplexItems = [];

    if (value) {
      value.forEach((x: DropdownModel | string | number) => {
        if (x instanceof DropdownModel) {
          let _citem = new RSelectItemModel(x.Value, x.DisplayValue);
          this.ComplexItems.push(_citem);
        } else {
          let _citem = new RSelectItemModel(x, x.toString());
          this.ComplexItems.push(_citem);
        }
      });
    }
  }

  public ComplexItems: RSelectItemModel[] = [];

  isSelectAllChecked: boolean = false;

  @Input()
  Width: number = 80;

  @Input()
  DropDownContentWidth: number = 120;

  @Output()
  change = new EventEmitter<any>(); 

  private _show: boolean = false;

  @Input()
  set IsDropDownOpen(value: boolean) {

    if (this._show && !value) {
      this._show = value;
      this.SearchItem = "";
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
  
  @ViewChild('openbtn', { read: ElementRef}) openBtn!: ElementRef;
  @ViewChild('myDropdown', { read: ElementRef}) mydropDown!: ElementRef;
  @ViewChild('startElement', { read: ElementRef}) startElement!: ElementRef;


  constructor(private windowHelper: WindowHelper) {
    this.Id = windowHelper.GenerateUniqueId();    
    this.winObj = inject(WINDOWOBJECT);
  }

  getFilterBoxWidth(str: string): number{
    var regex   = /\d+/g;
    if(str){
      let num = regex.exec(str);
      if(num)
      {
        return parseInt(num["0"]);
      }
    }

    return 100;
  }

  FocusItem($evt: Event) {
    this.isFocusDone = true;
  }

  scrollHandler(event: Event) {
    this.isFocusDone = true;
  }

  ngAfterContentChecked(): void {

  }

  selectSingleValue($event: Event, selValue: RSelectItemModel) {

    $event.preventDefault();
    $event.stopPropagation();

    this.ComplexItems.forEach(x => x.IsSelected = false);

    this.SelectedIndex = this.ComplexItems.findIndex((x) => this.ObjEquals(x, selValue));

    if (this.SelectedIndex > -1) {
      this.SelectedItem = new DropdownModel(selValue.Value, selValue.DisplayValue);
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
          this.isSelectAllChecked = this.ComplexItems.every(x=>x.IsSelected);

        }
      } else {

        this.ComplexItems.forEach(x => x.IsSelected = false);

        if (obj instanceof DropdownModel) {
          indexOfObj = this.ComplexItems.findIndex((x) => {
            return this.ObjEquals(x.Value, obj.Value)
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

  checkValue($event: CheckboxEventArgs, value: RSelectItemModel) {
    $event.event?.preventDefault();
    $event.event?.stopPropagation();

    this.AssignItems(value, $event.isChecked);
    this.loadSelectedItems();
    this.NotifyToModel();    
  }

  selectallFromSpan($event: Event){
    $event.stopPropagation();
    $event.preventDefault();

    this.isSelectAllChecked = !this.isSelectAllChecked;
    this.selectall({event: $event, isChecked : this.isSelectAllChecked});
  }

  selectall($event: CheckboxEventArgs) {
    $event.event?.stopPropagation();
    $event.event?.preventDefault();

    this.ComplexItems.forEach(x => {
      this.AssignItems(x, this.isSelectAllChecked);
    });

    this.loadSelectedItems();
    this.NotifyToModel();    
  }

  loadSelectedItems() {
    if (this.IsMulti) {
      this.SelectedItems = [];
      this.SelectedIndexes = [];

      this.ComplexItems.forEach((x: any, index: number) => {
        if (x instanceof RSelectItemModel) {
          let eleR = x as RSelectItemModel;
          if (eleR && eleR.IsSelected) {
            this.SelectedItems.push(new DropdownModel(eleR.Value, eleR.DisplayValue));
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
    $event.preventDefault();
    $event.stopPropagation();
         
    let i =15;
    let element = $event.srcElement;
    let sameelementClicked: boolean = false;
    let elementId: string | undefined = undefined;

    while(element!=undefined && i>-1){
      if((element as HTMLElement).classList.contains('rselectdropdownWindowClose')){
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
  }

  openDropdown(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();
      
    var currentValueToSet = !this.IsDropDownOpen;
    if (currentValueToSet) {

    }
   
    this.IsChildOfAnotherControlClicked = false;

    if (this.firstTimeInit) {
      this.firstTimeInit = false;
    }

    this.IsDropDownOpen = currentValueToSet;    
  }

  
  AttachDropdown(){
    let windowHeight = this.winObj.innerHeight;    
    if(this.openBtn.nativeElement && this.mydropDown.nativeElement){
      let btn = this.openBtn.nativeElement as HTMLElement;
      let dropDownElement = this.mydropDown.nativeElement as HTMLElement;
      let dropDownHeight = dropDownElement.clientHeight;
      let btnPosTop = btn.getBoundingClientRect().top;

      if(windowHeight - btnPosTop < dropDownHeight){
        dropDownElement.style.bottom = '120%';
        dropDownElement.style.top = 'auto';
      } else {
        dropDownElement.style.top = '110%';
        dropDownElement.style.bottom = 'auto';        
        
      }
    }

    let windowWidth = this.winObj.innerWidth;
    if(this.startElement.nativeElement && this.mydropDown.nativeElement){
      let start = this.startElement.nativeElement as HTMLElement;
      let dropDownElement = this.mydropDown.nativeElement as HTMLElement;
      let dropDownWidth = dropDownElement.clientWidth;
      let startPos = start.getBoundingClientRect();      
      
      if(windowWidth - startPos.left < dropDownWidth){
        dropDownElement.style.left = (startPos.right - startPos.left - dropDownWidth) - 5 + 'px';
      } else {
        dropDownElement.style.left ='0px';        
      }
    }
  }

  AssignItems(item: RSelectItemModel, val: boolean) {

    if (item instanceof RSelectItemModel) {
      item.IsSelected = val;
    }

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    this.SelectedItem = new DropdownModel(item.Value, item.DisplayValue);
  }

  SelectItem(item: RSelectItemModel | string | number) {

    if (item instanceof RSelectItemModel) {
      item.IsSelected = true;
    }

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    if(item instanceof RSelectItemModel){
      this.SelectedItem = new DropdownModel(item.Value, item.DisplayValue);
    } else {
      this.SelectedItem = item;
    }

    if (item instanceof RSelectItemModel) {
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

      this.SearchItem = "";
  }

  ObjEquals(xValue: any, yValue: any): boolean {
    'use strict';

    if (xValue === null || xValue === undefined || yValue === null || yValue === undefined) { 
      return xValue === yValue; 
    }

    if (xValue.constructor !== yValue.constructor) { 
      return false; 
    }

    if (xValue instanceof Function) { 
      return xValue === yValue; 
    }

    if (xValue instanceof RegExp) { 
      return xValue === yValue; 
    }

    if (Array.isArray(xValue) && xValue.length !== yValue.length) { 
      return false; 
    }

    if (xValue === yValue || xValue.valueOf() === yValue.valueOf()) { 
      return true; 
    }

    if (xValue instanceof Date) { 
      return false; 
    }

    if (!(xValue instanceof Object)) { 
      return false; 
    }

    if (!(yValue instanceof Object)) { 
      return false; 
    }

    var p = Object.keys(xValue);
    
    return Object.keys(yValue).every((i) => { return p.indexOf(i) !== -1; }) &&
      p.every((i) => { return this.ObjEquals(xValue[i], yValue[i]); });
  }



}
