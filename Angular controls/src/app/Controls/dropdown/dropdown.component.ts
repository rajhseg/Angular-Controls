import { CommonModule, NgClass } from '@angular/common';
import { AfterContentChecked, AfterContentInit, AfterRenderPhase, Component, ContentChild, ContentChildren, ElementRef, HostBinding, HostListener, Injector, Input, OnDestroy, OnInit, Output, QueryList, ViewEncapsulation, afterNextRender, forwardRef, inject, output } from '@angular/core';
import { DropdownModel } from './dropdownmodel';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { optionTemplate } from './optiontemplate.component';
import { DropdownService } from './dropdownservice.service';
import { EventEmitter } from 'stream';
import { IPopupCloseInterface, PopupService } from '../popup.service';

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
  selectedElementRef: ElementRef | undefined = undefined;
  isFocusDone: boolean = false;
  
  @ContentChildren(optionTemplate) optionTemps:  QueryList<optionTemplate> | null = null;

  @HostBinding('style.display') 
  @Input() set styleDisplay(val:any) 
  { 
    
  } 

  @Input()
  IsChildOfAnotherComponent: boolean = false;
  
  IsChildOfAnotherComponentClicked: boolean = false;

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
  firstTimeInit: boolean = true;
  Id: string = '';

  constructor(private ddservice: DropdownService, private popupService: PopupService){
    this.Id = popupService.GenerateUniqueId();
    this.ddservice.AddInstance(this);   
    this.popupService.AddPopupModalClassName('dropdown-content');
  }

  FocusItem($evt:Event){
    this.isFocusDone = true;    
  }

  scrollHandler(event: Event) {
    this.isFocusDone = true;
  }

  ngAfterContentChecked(): void {
    this.optionTemps?.forEach((x)=>{
      if(x.OptionSelected && !this.isFocusDone) {
        x.eleRef.nativeElement.scrollIntoView({ block: 'center',  behavior: 'smooth' });        
      }
    })
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
        if(index==indexOfObj){                      
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
      if(window && this.popupService.CanAddWindowClickToComponent('rdropdown')){
        window.addEventListener('click', (evt)=> this.WindowClick(evt), false); 
        this.popupService.AddWindowClickToComponent('rdropdown')
      }       
  }

  WindowClick(event:any){
    let isClickedAsChild: boolean =false;

     this.ddservice.GetAllInstance().forEach(x=>{
      if(x.IsChildOfAnotherComponentClicked){
        isClickedAsChild = true;
      }
     });

    if (!event.target.matches('.dropdownbtn') && !isClickedAsChild) {
      this.closeAllDropdowns(null, true);      
    }
  }

  closeAllDropdowns(ins: DropdownComponent | null, onwindowClick: boolean = false){

    this.popupService.ClosePopupsOnWindowsClick(ins, onwindowClick);
  
    // let drps = document.querySelectorAll('.dropdown-content');

    // drps.forEach((x)=>{
    //   if(x.classList.contains('show'))
    //     {
    //       x.classList.toggle('show');
    //     }
    // });

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
    
    // afterNextRender(()=>{    
    //   if(window){
    //     window.removeEventListener('click', this.WindowClick);
    //   }
    // },{ injector: inject(Injector), phase:AfterRenderPhase.Write});
  }

  ngAfterContentInit(): void {
   this.optionTemps?.forEach(x=>x.clicked.subscribe((z: optionTemplate)=>{

    if(this.selectedElementRef!=undefined){
      this.selectedElementRef.nativeElement.firstChild.classList.remove('dropdown-content-selected');
    };

    this.optionTemps?.forEach(y=>y.OptionSelected=false);
    z.OptionSelected = true;
    
    this.selectedElementRef = z.eleRef;
    
    this.SelectItem(z.Item);
   }));
  }

  onBlur($evt:Event){
    // this.show = false;    
    // console.log($evt);
  }

  openDropdown(evt: Event){
   
    this.closeAllDropdowns(this);
    this.IsChildOfAnotherComponentClicked = false;

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

    if(this.IsChildOfAnotherComponent){
      this.IsChildOfAnotherComponentClicked = true;
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
