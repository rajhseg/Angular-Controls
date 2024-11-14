import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";
import { RNumericComponent } from "../rnumeric/rnumeric.component";
import { RbuttonComponent } from "../rbutton/rbutton.component";
import { CalenderComponent } from "../Calender/calender.component";
import { WindowHelper } from '../windowObject';
import { RSelectDropdownComponent } from "../rselectdropdown/rselectdropdown.component";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModel } from '../dropdown/dropdownmodel';

@Component({
  selector: 'rfilter',
  standalone: true,
  imports: [NgIf, NgStyle, RTextboxComponent, RNumericComponent,
    RbuttonComponent, CalenderComponent, RSelectDropdownComponent,
    FormsModule, ReactiveFormsModule],
  templateUrl: './rfilter.component.html',
  styleUrl: './rfilter.component.css',
  host: {
    "(window:click)": "windowOnClick($event)"
  },
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> RFilterComponent),
      multi: true
    }
  ]
})
export class RFilterComponent implements ControlValueAccessor {

  @Input()
  DataType: RFilterDataType = RFilterDataType.StringType;

  @Input()
  TextColor: string = 'gray';

  @Input()
  Width: string = '15px'

  @Input()
  Height: string = '15px';

  @Input()
  Color: string = 'grey';

  IsFilteredApplied: boolean = false;

  IsFilterOpen: boolean = false;

  @Input()
  BackgroundColor: string = 'white';

  @Input()
  Align: RFilterAlign = RFilterAlign.Right;

  @Input()
  ForeColor: string = 'black';

  @Input()
  EnableShadowOnDropdown: boolean = true;

  @Input()
  ItemValues: DropdownModel[] = [];

  @Input()
  public set ItemModel(value: any) {

    if(value==undefined || value==null)
      return;

    let values: any[] = [];
    let dValues: DropdownModel[] = [];

    if(value.length > 0){
      for (let index = 0; index < value.length; index++) {
        const element = value[index];
        let val = element[this.ColumnName];
        
        if(values.find(x=>x==val) == undefined) {
          if(this.DataType == RFilterDataType.NumberType) {
            let num = Number.parseInt(val);
            
            if(values.find(x=>x==num)==undefined && num!=undefined)
              values.push(num);            

          } else {
            
            if(values.find(x=>x.toString() == val.toString())==undefined && val!=undefined)
              values.push(val);            

          }
        }        
      }
    }

    if(this.DataType == RFilterDataType.NumberType)
      values = values.sort((a,b)=> a - b);
    else
      values = values.sort();

      for (let index = 0; index < values.length; index++) {
        const element = values[index];
        dValues.push(new DropdownModel(element, element));
      }

     this.ItemValues = dValues;
  }

  @Input()
  ColumnName: string = '';
  
  @Input()
  BorderColor: string = 'lightgray';

  Id: string = '';

  ContainsList: DropdownModel[] | undefined = undefined;
  LessThanNumber: number | undefined = undefined;
  LessThanDate: string | undefined = undefined;
  GreaterThanNumber: number | undefined = undefined;
  GreaterThanDate: string | undefined = undefined;

  @ViewChild('myDropdown', { read: ElementRef}) mydropDown!: ElementRef;

  onChanged = (obj: RFilterApplyModel)=>{};
  onTouched = (obj: RFilterApplyModel)=> {};

  @Output()
  valueChanged = new EventEmitter<RFilterApplyModel>();


  constructor(private windowHelper: WindowHelper){
    this.Id = windowHelper.GenerateUniqueId();   
  }

  writeValue(obj: RFilterApplyModel): void {
    if(obj != undefined && obj != null){
      this.ContainsList = obj.Contains;
      this.ColumnName = obj.ColumnName;
      this.DataType = obj.Type;

      if(this.DataType == RFilterDataType.DateType) {
        this.GreaterThanDate = obj.GreaterThan as string;
        this.LessThanDate = obj.LesserThan as string;
      }

      if(this.DataType == RFilterDataType.NumberType){
        this.GreaterThanNumber = obj.GreaterThan as number;
        this.LessThanNumber = obj.LesserThan as number;
      }

      this.IsFilteredApplied = obj.IsFiltered;
    }

    this.valueChanged.emit(obj);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

  FilterToggle(evt: Event){        
    this.IsFilterOpen = !this.IsFilterOpen;
  }

  @Output()
  ApplyCallback = new EventEmitter<RFilterApplyModel>();

  Clear($evt: Event){
    $evt.stopPropagation();
    $evt.preventDefault();

    this.ContainsList = undefined;
    this.LessThanNumber = undefined;
    this.LessThanDate = undefined;
    this.GreaterThanNumber = undefined;
    this.GreaterThanDate = undefined;
    this.IsFilteredApplied = false;

    let model = new RFilterApplyModel(true, false, this.ColumnName, this.DataType, this.ContainsList, undefined, undefined);
    this.ApplyCallback.emit(model);  
    
    this.onChanged(model);
    this.onTouched(model);
    this.valueChanged.emit(model);

    this.IsFilterOpen = false;
  }

  Apply($evt: Event){
    $evt.stopPropagation();
    $evt.preventDefault();
    
    let isFloatLesser = false;
    let isFloatGreater = false;

    if(this.DataType == RFilterDataType.NumberType && this.LessThanNumber){
      isFloatLesser = this.LessThanNumber?.toString().split(".").length > 1
    }
    
    if(this.DataType == RFilterDataType.NumberType && this.GreaterThanNumber){
      isFloatGreater = this.GreaterThanNumber?.toString().split(".").length > 1
    }

    
    if(this.ContainsList == undefined && this.LessThanNumber == undefined && this.LessThanDate == undefined &&
      this.GreaterThanNumber == undefined && this.GreaterThanDate == undefined) 
    {
      this.IsFilteredApplied == false;
    }
    else 
    {
      this.IsFilteredApplied = true;  
    }

    let lesser = this.DataType == RFilterDataType.NumberType ? 
        this.LessThanNumber==undefined ? undefined : 
            isFloatLesser ? parseFloat(this.LessThanNumber.toString()) 
              : parseInt(this.LessThanNumber.toString()) : this.LessThanDate;

    let greater = this.DataType == RFilterDataType.NumberType ? 
    this.GreaterThanNumber == undefined ? undefined : 
        isFloatGreater ? parseFloat(this.GreaterThanNumber.toString()) 
              : parseInt(this.GreaterThanNumber.toString()) : this.GreaterThanDate;

    let model = new RFilterApplyModel(false, true, this.ColumnName, this.DataType, this.ContainsList, lesser, greater);
    this.ApplyCallback.emit(model);  

    this.onChanged(model);
    this.onTouched(model);
    this.valueChanged.emit(model);
    
    this.IsFilterOpen = false;
  }
  
  windowOnClick($event: Event) {        
    let i =15;
    let element = $event.srcElement;
    let sameelementClicked: boolean = false;
    let elementId: string | undefined = undefined;

    while(element!=undefined && i>-1){
      if((element as HTMLElement).classList.contains('rfilterclose')){
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
        this.IsFilterOpen = false;
  }

}


export enum RFilterDataType {
  StringType = 'string',
  NumberType = 'number',
  DateType = 'date'
}

export class RFilterApplyModel {
  constructor(
    public IsCleared: boolean,
    public IsFiltered: boolean,
    public ColumnName: string, 
    public Type: RFilterDataType, 
    public Contains: DropdownModel[] |undefined,
    public LesserThan: number | string | undefined, 
    public  GreaterThan: number | string | undefined
  ){

  }
}

export enum RFilterAlign{
  Left = 0,
  Right,
}