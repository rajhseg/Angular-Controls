import { AfterViewInit, Component, ElementRef, Inject, Injector, Input, OnDestroy, OnInit, ViewChild, afterNextRender, forwardRef, inject, output } from '@angular/core';
import { Day, Month, Week } from './CalenderModels';
import { NgFor, NgClass, CommonModule, NgIf, NgStyle } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { optionTemplate } from '../dropdown/optiontemplate.component';
import { DropdownService } from '../dropdown/dropdownservice.service';
import { CalenderService } from './calender.service';
import { IPopupCloseInterface, PopupService } from '../popup.service';
import { WINDOWOBJECT, WindowHelper } from '../windowObject';

@Component({
  selector: 'rcalender',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, NgStyle, FormsModule, DropdownComponent, optionTemplate],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css',
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(()=> CalenderComponent)
    }
  ],
  host:{
     "(window:click)":"windowOnClick($event)"
  }
})
export class CalenderComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, IPopupCloseInterface {

self: CalenderComponent = this;
isDropdownChild: boolean = true;
selectedDate: Date | null= null;
currentMonth: Month | null = null;
selectedMonthInString: string = '';
month: number  = 0;
year: number = 0;
IsMonthDropdownOpen: boolean = false;
IsYearDropdownOpen: boolean =false;

private injector = inject(Injector);

_value: string = '';
IsValueChanged: boolean =false;

set Value(val: string){
  if(this._value!=val){
    this.IsValueChanged = true;
    this._value = val;
  }
}
get Value(): string{
 return this._value;
}

totalYears : number[]= []; 
monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

isSelectDayTriggered: boolean = false;
Id: string = '';

onChange: any = ()=>{};
onTouch: any = ()=> {};
onDateSelected = output<Date>();

@ViewChild('calmodal') calModal!: ElementRef;

@Input()
IsChildOfAnotherControl: boolean = false;

IsChildOfAnotherControlClicked: boolean = false;

IsWindowsOs: boolean = false;

IsLinuxOs: boolean = false;

@Input()
ParentComponent: any | undefined = undefined;

private _selectedItemBackColor: string = 'rgb(255 0 104 / 90%)';

@Input()
set SelectedItemBackGroundColor(color: string){
  this._selectedItemBackColor = color;
}
get SelectedItemBackGroundColor(): string {
  return this._selectedItemBackColor;
}


private _showCalender: boolean = false;

@Input()
set IsCalenderOpen(value: boolean){      

  if(this._showCalender && !value){
    this._showCalender = value;
    if(this.Closed)
      this.Closed.emit(true);    
  }   

  if(value){
    this._showCalender = value;
    if(this.Opened)
      this.Opened.emit(true);    
  } else {
    this._showCalender = value;
  }    
}

get IsCalenderOpen(): boolean {
  return this._showCalender;
}

Opened = output<boolean>();

Closed = output<boolean>();

private winObj!: Window;

@ViewChild('monthdropdown', {read: DropdownComponent}) monthDropDownControl!: DropdownComponent;

@ViewChild('yeardropdown', {read: DropdownComponent}) yearDropDownControl!: DropdownComponent;

dateReg = /^\d{2}[./-]\d{2}[./-]\d{4}$/

constructor(private calService: CalenderService, private popupService: PopupService,   
  private windowHelper: WindowHelper){

  if(this.windowHelper.isExecuteInBrowser()){
    this.IsWindowsOs =  navigator.platform=="Win32";
    this.IsLinuxOs = navigator.platform.toLowerCase().includes("linux");
  }
  
  this.Id = this.windowHelper.GenerateUniqueId();
  this.selectedDate = null;
  this.loadYears(new Date().getFullYear());  
  this.calService.AddInstance(this);  
  this.winObj = inject(WINDOWOBJECT);
  this.LoadMonth(new Date(), false);
 }  

  ngAfterViewInit(): void {
    
  }

 
 windowOnClick(evt: Event){
   var tar: any = evt.target;

  if (!tar.matches('.calIcon') 
    && !tar.matches('.dropdown-content-template')
    && !tar.matches('.around')
    && !tar.matches('.inpdrop') 
    && !tar.matches('.dayheader')
    && !tar.matches('.calender')
    && !tar.matches('.week')
    && !tar.matches('.mnyr')
    && !tar.matches('.notactive')  
  ) {    
    this.closeAllDropdowns(null, true);   
    this.IsCalenderOpen = false;     
  }
  
}

 isMonthDropdownClosed($evt: any){
  
 }

 isMonthDropdownOpened($event: any) {
  

 }

  RenderUI(obj: string | Date){    
    if(obj!=undefined && obj!=''){
      if(typeof(obj) === 'string' && obj.match(this.dateReg)){
        let dateParts = null;

        dateParts = obj.split('-');

        if(dateParts.length==0)
          dateParts = obj.split('/');

        if(dateParts.length==0)
          dateParts = obj.split('.');

        this.selectedDate = new Date(parseInt(dateParts[2]), parseInt(dateParts[1])-1, parseInt(dateParts[0]));
      } else if(obj instanceof Date){
        this.selectedDate = obj;
      } else{
        this.selectedDate = null;
      }    
    } else{
      this.selectedDate = null;
    }

    if(this.selectedDate != null) {
      let _yr = this.selectedDate.getFullYear();
      
      if(this.totalYears.findIndex(x=>x==_yr)!=-1)
        this.loadYears(_yr);

      this.LoadMonth(this.selectedDate, true);
    } else{
      let _yr = new Date().getFullYear();
      
      if(this.totalYears.findIndex(x=>x==_yr)!=-1)
        this.loadYears(_yr);
            
      this.LoadMonth(new Date(), false);
    }
  }

  writeValue(obj: string | Date ): void {
    this.RenderUI(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

  ngOnDestroy(): void {
    
    if(this.windowHelper.isExecuteInBrowser()){
      if(this.winObj){
        this.winObj.removeEventListener('click', this.WindowClick.bind(this));
      }
    }

  }
  
ngOnInit(): void {

  if(this.selectedDate!=null)
    this.LoadMonth(this.selectedDate, true);

  if(this.windowHelper.isExecuteInBrowser()){
    
  }

}

WindowClick(event:any) {
  let tar: any = event.target; 
  let anyoneCalenderSelectIsTriggered: boolean = false;

  this.calService.GetAllInstance().forEach(x=>{
    if(x.isSelectDayTriggered){
        anyoneCalenderSelectIsTriggered = true;
    }
  });
  
  this.calService.GetAllInstance().forEach(x=>{
    x.isSelectDayTriggered = false;
  });

  let isClickedAsChild: boolean =false;

  this.calService.GetAllInstance().forEach(x=>{
   if(x.IsChildOfAnotherControlClicked){
     isClickedAsChild = true;
   }
  });
    
  if (!tar.matches('.calIcon') 
        && !tar.matches('.dropdown-content-template')
        && !tar.matches('.around')
        && !tar.matches('.inpdrop') 
        && !tar.matches('.dayheader')
        && !tar.matches('.calender')
        && !tar.matches('.week')
        && !tar.matches('.mnyr')
        && !tar.matches('.notactive')
      && !anyoneCalenderSelectIsTriggered
    ) {    
      this.closeAllDropdowns(null, true);        
  }
}

closeAllDropdowns(ins: CalenderComponent | null, onwindowClick: boolean = false){
  this.calService.GetAllInstance().forEach(x=>{
    x.IsCalenderOpen = false;
  });  
}

openCalenderFromInput($evt: Event){
  this.openCalender($evt, true);
}

openCalender($evt:Event, isopenFromInput: boolean = false){
  
  this.IsChildOfAnotherControlClicked = false;
  
  var currentValueToSet = false;
  
  this.popupService.CloseAllPopupsOnOpen(this);

  if(isopenFromInput){
    currentValueToSet = true;
  } else {
   currentValueToSet = !this.IsCalenderOpen;
  }

  this.closeAllDropdowns(this);
  this.IsCalenderOpen = currentValueToSet;
  this.IsMonthDropdownOpen = false;
  this.IsYearDropdownOpen = false;
  
  if(this.IsValueChanged)
  {
    this.RenderUI(this.Value);
    this.IsValueChanged = false;
  }

  $evt.stopPropagation();
}

closeCalender(){

  if(this.IsChildOfAnotherControl) {
    this.IsChildOfAnotherControlClicked = true;
  }

  this.monthDropDownControl.closeDropdown();
  this.yearDropDownControl.closeDropdown();
  this.IsCalenderOpen = false;  
}

addPrevYears($evt:Event){
  if(this.totalYears.length > 0){
    let value = this.totalYears[0];
    for(let i:number = value-1; i>= (value-20); i--){
      this.totalYears.splice(0, 0, i);
    }
  }
}

addNextYears($evt:Event){
  if(this.totalYears.length > 0){
    let value = this.totalYears[this.totalYears.length-1];
    for(let i:number = value+1; i<= (value+20); i++){
      this.totalYears.push(i);
    }
  }
}

loadYears(year:number){
  
  for(let i=year-100; i<=year; i++){
    this.totalYears.push(i);
  }

  for(let i=year+1; i< year+100; i++){
    this.totalYears.push(i);
  }
}

selectDate(day:Day){

  if(this.IsChildOfAnotherControl)
  {
    this.IsChildOfAnotherControlClicked = true;
  }

  this.isSelectDayTriggered = true;
  
  this.monthDropDownControl.closeDropdown();
  this.yearDropDownControl.closeDropdown();

  if(day.isActiveMonth) {
    if(!day.isSelected)
    {
      let cdate = new Date(this.year, this.month, day.num);
      this.selectedDate = cdate;
      this.SetDate(this.selectedDate);
    } else{
      day.isSelected = false;
      this.selectedDate = null;
      this.Value = '';
    }
  }
}

changeMonth(month: any){
  let monint = this.monthNames.indexOf(month);
  if(monint!=undefined){
    this.month = monint;
    let pre = new Date(this.year, this.month, 1);
    this.LoadMonth(pre);
  }

}

changeYear(year:any){  
  if(year!=undefined){
    this.year =  parseInt(year);
    let pre = new Date(this.year, this.month, 1);
    this.LoadMonth(pre);
  }
}

onBlur(){
  this.IsCalenderOpen = false;
}

previousMonth(){

  if(this.month==1){
    this.month = 12;
    this.year = this.year -1;
  } else {
    this.month = this.month -1;
  }

  let pre = new Date(this.year, this.month, 1);
  this.LoadMonth(pre);
}

nextMonth(){

  if(this.month==12){
    this.month = 1;
    this.year = this.year +1;
  } else {
    this.month = this.month + 1;
  }

  let next = new Date(this.year, this.month, 1);
  this.LoadMonth(next);
}

LoadMonth(date: Date, isSelect: boolean = true){

  if(this.IsChildOfAnotherControl)
  {
    this.IsChildOfAnotherControlClicked = true;
  }

  this.isSelectDayTriggered = false;  

  this.month = date.getMonth();
  let dateinNumber = date.getDate();
  let monthinNumber = date.getMonth();
  let year = date.getFullYear();
  
  this.year = year;

  let firstday = new Date(year, monthinNumber, 1);
  let firstdayInWeek = firstday.getDay()+1;

  let lastDay = new Date(year, monthinNumber+1, 0);
  let lastDayInWeek = lastDay.getDay();
  let lastDate = lastDay.getDate();

  let firstWeekRemainingDays = 7 - firstdayInWeek + 1;
  let monthremaindays = lastDate - firstWeekRemainingDays;
  let numberOfWeeks = monthremaindays/7;

  if(monthremaindays%7>0){
    numberOfWeeks= numberOfWeeks +1;
  }

  let allWeeks: Week[] = [];
  let firstWeekDays: Day[] = [];

  for(let i=firstdayInWeek-1; i>=1; i--){
    let prevMonth = new Date(year, monthinNumber, 1-i);
    firstWeekDays.push(new Day(prevMonth.getDate(), prevMonth.getDay()));
  }

  for(let i=1; i<=firstWeekRemainingDays; i++){
    let curMonth = new Date(year, monthinNumber, i);
    let a = new Day(curMonth.getDate(), curMonth.getDay());
    a.isActiveMonth = true;

    if(this.isDateEqual(curMonth, this.selectedDate!) && isSelect)
        a.isSelected = true;

    firstWeekDays.push(a);
  }

  let currentDay: number = firstWeekRemainingDays;
  allWeeks.push(new Week(firstWeekDays));

  for(let i=1; i<= numberOfWeeks; i++){   
    
    let currentWeek: Day[] = [];

    for(let j = 1; j<=7; j++){
      currentDay = currentDay +1;

      if(currentDay > lastDate){
        let curMonth = new Date(year, monthinNumber+1, currentDay - lastDate);
        let a = new Day(curMonth.getDate(), curMonth.getDay());
        currentWeek.push(a);
      } else {

          let curMonth = new Date(year, monthinNumber, currentDay);
          let a = new Day(curMonth.getDate(), curMonth.getDay());
          a.isActiveMonth = true;

          if(this.isDateEqual(this.selectedDate!, curMonth) && isSelect)
              a.isSelected = true;

          currentWeek.push(a);
    }
    }

    allWeeks.push(new Week(currentWeek));
  }

  this.currentMonth = new Month(allWeeks);

  if(this.selectedDate){    
     this.Value = this.getDateString(this.selectedDate);
     this.onChange(this.Value);
     this.onTouch(this.Value);
     this.onDateSelected.emit(this.selectedDate);
  }

 }
 
 SetDate(date: Date){
   
    this.selectedDate = date;

    this.currentMonth?.weeks.forEach((w)=> {
      w.days.forEach((d)=>{
        if(d.isActiveMonth && this.selectedDate?.getDate()== d.num)
            d.isSelected = true;
        else
            d.isSelected = false;
      })
    });  

    if(this.selectedDate){    
      this.Value = this.getDateString(this.selectedDate);
      this.onChange(this.Value);
      this.onTouch(this.Value);
      this.onDateSelected.emit(this.selectedDate);
  }
 }

 getDateString(date:Date): string {
  const today = date;
  const yyyy = today.getFullYear();
  let mm: any = today.getMonth() + 1;
  let dd: any = today.getDate();
  
  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;
  
  const formattedToday = dd + '-' + mm + '-' + yyyy;

  return formattedToday;
 }

 isDateEqual(a: Date, b: Date){
  if(a!=null && b!=null){
    return a.getDate()==b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear()==b.getFullYear();
  } else{
    return false;
  }
 }
}
