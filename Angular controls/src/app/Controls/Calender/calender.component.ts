import { AfterRenderPhase, Component, ElementRef, Injector, Input, OnDestroy, OnInit, ViewChild, afterNextRender, forwardRef, inject, output } from '@angular/core';
import { Day, Month, Week } from './CalenderModels';
import { NgFor, NgClass, CommonModule, NgIf } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { optionTemplate } from '../dropdown/optiontemplate.component';
import { DropdownService } from '../dropdown/dropdownservice.service';
import { CalenderService } from './calender.service';
import { IPopupCloseInterface, PopupService } from '../popup.service';

@Component({
  selector: 'rcalender',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, FormsModule, DropdownComponent, optionTemplate],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css',
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(()=> CalenderComponent)
    }
  ]
})
export class CalenderComponent implements OnInit, OnDestroy, ControlValueAccessor, IPopupCloseInterface {

self: CalenderComponent = this;
isDropdownChild: boolean = true;
selectedDate: Date | null= null;
currentMonth: Month | null = null;
selectedMonthInString: string = '';
month: number  = 0;
year: number = 0;
IsMonthDropdownOpen: boolean = false;
IsYearDropdownOpen: boolean =false;

Value: string = '';
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
IsChildOfAnotherComponent: boolean = false;

IsChildOfAnotherComponentClicked: boolean = false;

@Input()
ParentComponent: any | undefined = undefined;

private _showCalender: boolean = false;

set IsCalenderOpen(value: boolean){      

  if(this._showCalender && !value){
    this._showCalender = value;
    this.Closed.emit(true);    
  }   

  if(value){
    this._showCalender = value;
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

constructor(private calService: CalenderService, private popupService: PopupService){
  this.Id = this.popupService.GenerateUniqueId();
  this.selectedDate = new Date();
  this.loadYears(this.selectedDate.getFullYear());
  this.LoadMonth(this.selectedDate, true);
  this.calService.AddInstance(this);
  this.popupService.AddPopupModalClassName('calender');
 }  

 isMonthDropdownClosed($evt: any){
  
 }

 isMonthDropdownOpened($event: any) {
  

 }

  writeValue(obj: any): void {
    this.selectedDate = new Date(obj);
    this.loadYears(this.selectedDate.getFullYear());
    this.LoadMonth(this.selectedDate, true);    
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
    // afterNextRender(()=>{
    //   if(window){
    //     window.removeEventListener('click', this.WindowClick);
    //   }
    // }, { injector:inject(Injector), phase: AfterRenderPhase.Write});
  }
  
ngOnInit(): void {
  if(window && this.popupService.CanAddWindowClickToComponent('rcalender')) {
    window.addEventListener('click', (evt)=> this.WindowClick(evt), false);    
    this.popupService.AddWindowClickToComponent('rcalender')
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
   if(x.IsChildOfAnotherComponentClicked){
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

  this.popupService.ClosePopupsOnWindowsClick(ins, onwindowClick);

  // let drps = document.querySelectorAll('.calender');

  // drps.forEach((x)=>{
  //   if(x.classList.contains('show'))
  //     {
  //       x.classList.toggle('show');
  //     }
  // });

  // this.calService.GetAllInstance().forEach((x)=>{
  //   if(x!==ins){
  //     x.showCalendar = false; 
  //   }
  // });

}

openCal($evt:Event){
  this.IsChildOfAnotherComponentClicked = false;
  this.closeAllDropdowns(this);
  this.IsCalenderOpen = !this.IsCalenderOpen;
  this.IsMonthDropdownOpen = false;
  this.IsYearDropdownOpen = false;
  $evt.stopPropagation();
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

  if(this.IsChildOfAnotherComponent)
  {
    this.IsChildOfAnotherComponentClicked = true;
  }

  this.isSelectDayTriggered = true;
  this.IsMonthDropdownOpen = false;
  this.IsYearDropdownOpen = false;

  if(day.isActiveMonth) {
    if(!day.isSelected)
    {
      let cdate = new Date(this.year, this.month, day.num);
      this.selectedDate = cdate;
      this.SetDate(this.selectedDate);

      //this.LoadMonth(this.selectedDate);
      console.log(this.currentMonth, cdate)
    } else{
      day.isSelected = false;
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

  if(this.IsChildOfAnotherComponent)
  {
    this.IsChildOfAnotherComponentClicked = true;
  }

  this.isSelectDayTriggered = false;
  console.log(this.Id+" ,"+this.isSelectDayTriggered); 

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

    // if(dateinNumber==a.num && isSelect)
    //   a.isSelected = true;

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

          // if(dateinNumber==a.num && isSelect)
          //   a.isSelected = true;

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
  return a.getDate()==b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear()==b.getFullYear();
 }
}
