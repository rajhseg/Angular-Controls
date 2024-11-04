import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";
import { RNumericComponent } from "../rnumeric/rnumeric.component";
import { RbuttonComponent } from "../rbutton/rbutton.component";
import { CalenderComponent } from "../Calender/calender.component";
import { WindowHelper } from '../windowObject';
import { RSelectDropdownComponent } from "../rselectdropdown/rselectdropdown.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  }
})
export class RFilterComponent {

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
  ItemValues: string[] = [];

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

  constructor(private windowHelper: WindowHelper){
    this.Id = windowHelper.GenerateUniqueId();   
  }

  FilterToggle(evt: Event){
    evt.stopPropagation();
    evt.preventDefault();
    
    this.IsFilterOpen = !this.IsFilterOpen;
  }

  @Output()
  ApplyCallback = new EventEmitter<RFilterApplyModel>();

  Clear(){
    this.ContainsList = undefined;
    this.LessThanNumber = undefined;
    this.LessThanDate = undefined;
    this.GreaterThanNumber = undefined;
    this.GreaterThanDate = undefined;
    this.IsFilteredApplied = false;
  }

  Apply(){
    this.IsFilteredApplied = true;  
    let lesser = this.DataType == RFilterDataType.NumberType ? this.LessThanNumber : this.LessThanDate;
    let greater = this.DataType == RFilterDataType.NumberType ? this.GreaterThanNumber : this.GreaterThanDate;

    let model = new RFilterApplyModel(this.ColumnName, this.DataType, this.ContainsList, lesser, greater);
    this.ApplyCallback.emit(model);  
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