import { CommonModule, NgClass, NgForOf, NgIf } from '@angular/common';
import { AfterContentChecked, EventEmitter, AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, HostBinding, HostListener, Inject, Injector, Input, OnDestroy, OnInit, Output, QueryList, ViewEncapsulation, afterNextRender, forwardRef, inject, output, ViewChild } from '@angular/core';
import { DropDownItemModel, DropdownModel } from './dropdownmodel';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DropdownService } from './dropdownservice.service';
import { CloseService, IDropDown, IPopupCloseInterface, PopupService } from '../popup.service';
import { WINDOWOBJECT, WindowHelper } from '../windowObject';
import { RCheckboxComponent } from "../checkbox/checkbox.component";
import { CheckboxEventArgs } from '../checkbox/checkbox.service';
import { RDropdownFilterPipe } from '../dropdown-filter.pipe';
import { RTextboxComponent } from '../rtextbox/rtextbox.component';
import { CssUnit, CssUnitsService, RelativeUnitType } from '../css-units.service';

@Component({
  selector: 'rdropdown',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule, RDropdownFilterPipe, RTextboxComponent, NgForOf, NgClass, RCheckboxComponent],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RDropdownComponent),
      multi: true
    }
  ],
  host: {
    "(window:click)": "windowOnClick($event)"
  }
})
export class RDropdownComponent implements IDropDown, AfterContentInit, OnDestroy, OnInit, ControlValueAccessor,
  AfterContentInit, AfterContentChecked, OnDestroy, IPopupCloseInterface {

  onChange: any = () => { }
  onTouch: any = () => { }
  private selectedElementRef: ElementRef | undefined = undefined;
  private isFocusDone: boolean = false;
  isSelectAllChecked: boolean = false;

  @ViewChild('openbtn', { read: ElementRef}) openBtn!: ElementRef;
  @ViewChild('myDropdown', { read: ElementRef}) mydropDown!: ElementRef;
  @ViewChild('startElement', { read: ElementRef}) startElement!: ElementRef;

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
          let _citem = new DropDownItemModel(x.Value, x.DisplayValue);
          this.ComplexItems.push(_citem);
        } else {
          let _citem = new DropDownItemModel(x, x.toString());
          this.ComplexItems.push(_citem);
        }
      });
    }
  }

  public ComplexItems: DropDownItemModel[] = [];

  
  @Input()
  EnableFilterOption: boolean = true;

  SearchItem: string = "";

  @Input()
  Width: string = '80px';

  dropDownContentWidth: string = '105px';

  @Input()
  public set DropDownContentWidth(value: string){
    this.dropDownContentWidth = value;
  }
  public get DropDownContentWidth(): string {
    return this.dropDownContentWidth;
  }

  @Input()
  DropDownContentHeight: string = '200px';

  @Input()
  EnableShadowOnDropdown: boolean = true;

  @Output()
  change = new EventEmitter<any>(); // output<any>();

  private _show: boolean = false;

  DDEBottom: string = '';

  DDETop: string = '';

  DDELeft: string = '';

  DDERight: string = '';
  
  private ddeWidth: string = '';
  private ddeWidthVal: string = '';

  get DDEWidth() : string {

    if(this.ddeWidth != this.DropDownContentWidth){
      let val = this.cssUnitSer.ToPxValue(this.DropDownContentWidth, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
      this.ddeWidth = this.DropDownContentWidth;
      this.ddeWidthVal = val+ CssUnit.Px.toString();
    }

    return this.ddeWidthVal;
  }

  private ddeHeightField: string = '';
  private ddeHeightVal: string = '';

  get DDEHeight(): string {
    if(this.ddeHeightField != this.DropDownContentHeight) {
      let val = this.cssUnitSer.ToPxValue(this.DropDownContentHeight, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
      this.ddeHeightField = this.DropDownContentHeight;
      this.ddeHeightVal = val+ CssUnit.Px.toString();
    }

    return  this.ddeHeightVal;
  }
  
  private _TextboxWidth: string = '';
  private _txtValue: string = '';

  get TextBoxWidth(): string {

    if(this._TextboxWidth!=this.Width) {
      let val = this.cssUnitSer.ToPxValue(this.Width, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
      this._TextboxWidth = this.Width;
      this._txtValue = val+ CssUnit.Px.toString();      
    }

    return this._txtValue;
  }

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


  public get ContainerWidth(): number {
    return this.getFilterBoxWidth(this.DropDownContentWidth +'px');
  }

  SelectedItems: DropdownModel[] | string[] | number[] | any[] = [];
  SelectedIndexes: number[] = [];

  SelectedItem: DropdownModel | string | any = '';
  SelectedIndex: number = -1;

  SelectedDisplay: string | number = '';
  private firstTimeInit: boolean = true;
  Id: string = '';

  @Input()
  public ParentDropDownId: string = '';

  private winObj!: Window;
  private injector = inject(Injector);

  @HostBinding('id')
  HostElementId: string = this.windowHelper.GenerateUniqueId();

  cls!:CloseService;

  constructor(private ddservice: DropdownService, private eleRef: ElementRef,
    private popupService: PopupService,
    private windowHelper: WindowHelper,
    private cssUnitSer: CssUnitsService    
  ) {    
    this.cls = CloseService.GetInstance();
    this.Id = windowHelper.GenerateUniqueId();
    this.ddservice.AddInstance(this);
    this.winObj = inject(WINDOWOBJECT);
    this.cls.AddInstance(this);
  }

  FocusItem($evt: Event) {
    this.isFocusDone = true;
  }

  scrollHandler(event: Event) {
    this.isFocusDone = true;
  }

  ngAfterContentChecked(): void {

  }

  selectSingleValue($event: Event, selValue: DropDownItemModel) {

    $event.stopPropagation();
    $event.preventDefault();

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

  checkValue($event: CheckboxEventArgs, value: DropDownItemModel) {
    $event.event?.stopPropagation();
    $event.event?.preventDefault();

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
        if (x instanceof DropDownItemModel) {
          let eleR = x as DropDownItemModel;
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

    if (this.IsDropDownOpen) {
      let i = 15;
      let element = $event.srcElement;
      let sameelementClicked: boolean = false;
      let elementId: string | undefined = undefined;

      while (element != undefined && i > -1) {
        if ((element as HTMLElement).classList.contains('rdropdownWindowClose')) {
          elementId = (element as HTMLElement).id;
          if (elementId == this.Id) {
            sameelementClicked = true;
          }
          break;
        }

        i--;
        element = (element as HTMLElement).parentElement;
      }

      if (!sameelementClicked)
        this.IsDropDownOpen = false;
    }
  }

  
  IsOpen(): boolean {
    return this.IsDropDownOpen;
  }
  
  openDropdown(evt: Event) {
    evt.stopPropagation();
    evt.preventDefault();

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

    if(this.IsDropDownOpen){
      this.cls.CloseAllPopups(this);
      this.AttachDropdown();
    }
    
  }

  AttachDropdown(){
    let windowHeight = this.winObj.innerHeight;    
    const exp = /(-?[\d.]+)([a-z%]*)/;
    
    let isInTab = false;
    let element: HTMLElement | null = this.eleRef.nativeElement as HTMLElement;
    let tabTop, tabLeft = 0;
    let  i = 15;

    while(element && element != null && i > 0){
      if(element.nodeName.toLowerCase() == 'rflattabs' 
          || element.nodeName.toLowerCase() == 'rtabs'
          || element.nodeName.toLowerCase() == 'rstepper-vertical' 
          || element.nodeName.toLowerCase() == 'rstepper-horizontal' ){
        isInTab = true;
        break;
      }

      i--;
      element = element.parentElement;
    }

    let tabHeight = 0, tabWidth = 0;
    
    if(isInTab && element) {
      let tabContentEle = element.getElementsByClassName("tabcontent");          
      let tabRect = tabContentEle[tabContentEle.length-1].getBoundingClientRect();
      tabTop = tabRect.top;
      tabLeft = tabRect.left;
      tabHeight = tabRect.height; 
      tabWidth = tabRect.width;       
    } else {
      tabTop = 0;          
    }

    if(this.openBtn.nativeElement && this.mydropDown.nativeElement){
      let btn = this.openBtn.nativeElement as HTMLElement;
      let dropDownElement = this.mydropDown.nativeElement as HTMLElement;
      let dropDownHeight = dropDownElement.clientHeight;
      let btnPosTop = btn.getBoundingClientRect().top;

      
      if (((isInTab && (tabTop+tabHeight) - btnPosTop < dropDownHeight)
              || (!isInTab&& windowHeight - btnPosTop < dropDownHeight ))
            && btnPosTop - tabTop > dropDownHeight) {  
        this.DDEBottom = '120%';
        this.DDETop = 'auto';
      } else {
        this.DDETop = '110%';
        this.DDEBottom = 'auto';
      }
    }
  
    let windowWidth = this.winObj.innerWidth;
    if (this.startElement.nativeElement) {
      let start = this.startElement.nativeElement as HTMLElement;
      let res = this.DDEWidth.match(exp);

      if (res) {
        let dropDownWidth = parseFloat(res[1].toString());

        // dropDownWidth = dropDownWidth + padding(left, right) + border + margin;
        dropDownWidth = dropDownWidth + (10 * 2) + (1 * 2) + 0;

        let startPos = start.getBoundingClientRect();

        if ((isInTab && (tabLeft+tabWidth) > dropDownWidth + startPos.left)
          || (!isInTab && windowWidth > dropDownWidth + startPos.left)) {        
          this.DDELeft = '0px';
          this.DDERight = 'auto';
        } else {
          let moveRight = dropDownWidth - startPos.width;
          this.DDELeft = 'auto';

          if (moveRight > 0)
            this.DDERight = '0px';
        }
      }
    }
  }

  AssignItems(item: DropDownItemModel, val: boolean) {

    if (item instanceof DropDownItemModel) {
      item.IsSelected = val;
    }

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    this.SelectedItem = new DropdownModel(item.Value, item.DisplayValue);
  }

  SelectItem(item: DropDownItemModel | string | number) {

    if (item instanceof DropDownItemModel) {
      item.IsSelected = true;
    }

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    if(item instanceof DropDownItemModel){
      this.SelectedItem = new DropdownModel(item.Value, item.DisplayValue);
    } else {
      this.SelectedItem = item;
    }

    if (item instanceof DropDownItemModel) {
      this.SelectedDisplay = item.DisplayValue;
    } else {
      this.SelectedDisplay = item;
    }
    this.IsDropDownOpen = false;   
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
