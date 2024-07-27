import { CommonModule, NgClass } from '@angular/common';
import { AfterContentChecked, AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, HostBinding, HostListener, Inject, Injector, Input, OnDestroy, OnInit, Output, QueryList, ViewEncapsulation, afterNextRender, forwardRef, inject, output } from '@angular/core';
import { DropdownModel } from './dropdownmodel';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { optionTemplate } from './optiontemplate.component';
import { DropdownService } from './dropdownservice.service';
import { EventEmitter } from 'stream';
import { IPopupCloseInterface, PopupService } from '../popup.service';
import { WINDOWOBJECT, WindowHelper } from '../windowObject';

@Component({
  selector: 'rdropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, optionTemplate, NgClass, optionTemplate],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  encapsulation:ViewEncapsulation.None,
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> DropdownComponent), 
      multi: true
    }
  ]
})
export class DropdownComponent implements AfterContentInit, OnDestroy, OnInit, ControlValueAccessor, 
                                AfterContentInit, AfterContentChecked, OnDestroy, IPopupCloseInterface {

  onChange: any = () => {}
  onTouch: any = () => {}
  private selectedElementRef: ElementRef | undefined = undefined;
  private isFocusDone: boolean = false;
  
  @ContentChildren(optionTemplate) optionTemps:  QueryList<optionTemplate> | null = null;

  @HostBinding('style.display') 
  @Input() set styleDisplay(val:any) 
  { 
    
  } 

  @Input()
  IsChildOfAnotherControl: boolean = false;
  
  IsChildOfAnotherControlClicked: boolean = false;

  Opened = output<boolean>();

  Closed = output<boolean>();

  @Input()
  ParentComponent: any | undefined = undefined;

  @Input()
  Items: DropdownModel[] | string[] | number[] = [];

  @Input()
  Width: string = '80px';

  @Input()
  DropDownContentWidth: string = '120px';

  change = output<any>();

  private _show: boolean = false;

  @Input()
  set IsDropDownOpen(value: boolean){        
        
    if(this._show && !value){
      this._show = value;
      this.Closed.emit(true);      
    }   

    if(value){
      this._show = value;
      this.Opened.emit(true);      
    }else{
      this._show = value;
    }     
  }

 get IsDropDownOpen(): boolean {
    return this._show;
  }

  bshow: boolean = false;

  SelectedItem: DropdownModel | string | any = '';
  SelectedDisplay: string | number = '';
  private firstTimeInit: boolean = true;
  Id: string = '';
  private winObj!:Window;
  private injector = inject(Injector);

  constructor(private ddservice: DropdownService, 
    private popupService: PopupService,
    private windowHelper: WindowHelper
  ){
    this.Id = windowHelper.GenerateUniqueId();
    this.ddservice.AddInstance(this);   
    this.popupService.AddPopupModalClassName('dropdown-content');
    this.winObj = inject(WINDOWOBJECT);
  }

  FocusItem($evt:Event){
    this.isFocusDone = true;    
  }

  scrollHandler(event: Event) {
    this.isFocusDone = true;
  }

  ngAfterContentChecked(): void {
    // this.optionTemps?.forEach((x)=>{
    //   if(x.OptionSelected && !this.isFocusDone) {
    //     if(x.eleRef 
    //       && x.eleRef.nativeElement
    //       && typeof x.eleRef.nativeElement.scrollIntoView === 'function'
    //     ) {
    //         // x.eleRef.nativeElement.scrollIntoView({ block: 'center',  behavior: 'smooth' });        
    //       }
    //   }
    // })
  }

  writeValue(obj: DropdownModel | string | number): void {
    if(obj!=null && obj!=undefined) {
      let indexOfObj = -1;

      if(obj instanceof DropdownModel){
        indexOfObj = this.Items.findIndex((x)=>{
          return this.ObjEquals(x,obj)
        });
      } else{
        indexOfObj = this.Items.findIndex((x)=>{
          return x===obj;
        });
      }

      this.optionTemps?.forEach((x,index)=>{

        let isCorrectObject: boolean;

        if(obj instanceof DropdownModel){
             isCorrectObject = this.ObjEquals(obj, x.Item);
        } else{
          isCorrectObject = (obj === x.Item);
        }

        if(isCorrectObject){                      
         x.OptionSelected = true;
         this.selectedElementRef = x.eleRef;   
         this.selectedElementRef.nativeElement.firstChild.classList.add('dropdown-content-selected');  
         x.eleRef.nativeElement.firstChild.focus();
        } else{
          x.OptionSelected = false;
          if(x.eleRef.nativeElement.firstChild.classList.contains('dropdown-content-selected'))
            {
              x.eleRef.nativeElement.firstChild.classList.remove('dropdown-content-selected');
            }
        }
      });

     this.isFocusDone = false;
     this.SelectItem(obj);
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
    if(this.windowHelper.isExecuteInBrowser()){
      if(this.winObj && this.popupService.CanAddWindowClickToComponent('rdropdown')){
        this.winObj.addEventListener('click', this.WindowClick.bind(this), false); 
        this.popupService.AddWindowClickToComponent('rdropdown')
      }
    }        
  }

  private WindowClick(event:any){
    let isClickedAsChild: boolean =false;

     this.ddservice.GetAllInstance().forEach(x=>{
      if(x.IsChildOfAnotherControlClicked){
        isClickedAsChild = true;
      }
     });

    if (!event.target.matches('.dropdownbtn') && !isClickedAsChild) {
      this.closeAllDropdowns(null, true);      
    }
  }

  private closeAllDropdowns(ins: DropdownComponent | null, onwindowClick: boolean = false){

    this.popupService.ClosePopupsOnWindowsClick(ins, onwindowClick);

    this.ddservice.GetAllInstance().forEach((x)=>{
      x.IsDropDownOpen = false;
      
        if(onwindowClick)
        {
          x.bshow = false;
        } 
        else if(!this.ObjEquals(ins, x)){
          x.bshow = false;
        }
        
    });
  
  }

  ngOnDestroy(): void {
    this.optionTemps?.forEach(x=>x.clicked.unsubscribe());
    
    if(this.windowHelper.isExecuteInBrowser()){
      if(this.winObj){
        this.winObj.removeEventListener('click', this.WindowClick.bind(this));
      }
    }
   
  }

  ngAfterContentInit(): void {
    this.BindClickEvent();

    this.optionTemps?.changes.forEach((x: QueryList<optionTemplate>) => {

      let arr = x.toArray();
      
      for (let index = 0; index < x.length; index++) {
        const element = arr[index];
        if(element.clicked.observers.length==0) {
          element.clicked.subscribe(this.BindOptionTemplateEvent.bind(this));
        }
      }             
    });
    
  }

  private BindClickEvent(){    
    this.optionTemps?.forEach(x=>x.clicked.subscribe(this.BindOptionTemplateEvent.bind(this)));
  }

  private BindOptionTemplateEvent(z: optionTemplate){

    if(this.selectedElementRef!=undefined){
      this.selectedElementRef.nativeElement.firstChild.classList.remove('dropdown-content-selected');
    };

    this.optionTemps?.forEach(y=>y.OptionSelected=false);
    z.OptionSelected = true;
    
    this.selectedElementRef = z.eleRef;
    
    this.SelectItem(z.Item);
   }

  onBlur($evt:Event){

  }

  closeDropdown(){
    
    if(this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    this.IsDropDownOpen = false;    
    this.bshow = this.IsDropDownOpen;   
  }

  openDropdown(evt: Event){
   
    this.closeAllDropdowns(this);
    this.IsChildOfAnotherControlClicked = false;

   if(this.firstTimeInit){
    this.optionTemps?.forEach(x=>{
      if(x.OptionSelected){
      x.IsInitItem = true;      
      }
    });

    this.firstTimeInit = false;

   }

   if(this.bshow) {
    this.IsDropDownOpen = this.bshow;    
    this.bshow = false;
   }

   this.IsDropDownOpen = !this.IsDropDownOpen;

   if(!this.bshow){
    this.bshow = this.IsDropDownOpen;
   }

   evt.stopPropagation();
  }

  SelectItem(item:DropdownModel|string | number){

    if(this.IsChildOfAnotherControl){
      this.IsChildOfAnotherControlClicked = true;
    }

    this.SelectedItem = item;
    if(item instanceof DropdownModel){
      this.SelectedDisplay = item.DisplayValue;
    } else {
      this.SelectedDisplay = item;
    }
    this.IsDropDownOpen =false;
    this.bshow = false;
    this.onChange(item);
    this.onTouch(item);
    this.change.emit(item as any);    
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
    return Object.keys(y).every( (i)=> { return p.indexOf(i) !== -1; }) &&
        p.every((i) =>{ return this.ObjEquals(x[i], y[i]); });
}

}
