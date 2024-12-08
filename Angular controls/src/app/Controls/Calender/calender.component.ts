import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Inject, Injector, Input, OnDestroy, OnInit, Output, ViewChild, afterNextRender, forwardRef, inject, output } from '@angular/core';
import { Day, Month, Week } from './CalenderModels';
import { NgFor, NgClass, CommonModule, NgIf, NgStyle, DatePipe } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RDropdownComponent } from '../dropdown/dropdown.component';

import { DropdownService } from '../dropdown/dropdownservice.service';
import { CalenderService } from './calender.service';
import { CloseService, IDropDown, IPopupCloseInterface, PopupService } from '../popup.service';
import { WINDOWOBJECT, WindowHelper } from '../windowObject';
import { DropdownModel } from '../dropdown/dropdownmodel';
import { RTextboxComponent } from '../rtextbox/rtextbox.component';
import { CssUnit, CssUnitsService, RelativeUnitType } from '../css-units.service';

@Component({
  selector: 'rcalender',
  standalone: true,
  imports: [NgFor, NgIf, NgClass,
    NgStyle, FormsModule, RTextboxComponent, ReactiveFormsModule,
    RDropdownComponent],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CalenderComponent)
    },
    DatePipe
  ],
  host: {
    "(window:click)": "windowOnClick($event)"
  }
})
export class CalenderComponent implements IDropDown, OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, IPopupCloseInterface {

  self: CalenderComponent = this;
  isDropdownChild: boolean = true;
  selectedDate: Date | null = null;
  currentMonth: Month | null = null;
  selectedMonthInString: string = '';

  IsMonthDropdownOpen: boolean = false;
  IsYearDropdownOpen: boolean = false;

  private injector = inject(Injector);

  _value: string = '';
  IsValueChanged: boolean = false;

  set Value(val: string) {
    if(val != this._value && !this.ReadOnly){
      this._value = val; 
    }   
  }

  get Value(): string {
    return this._value;
  }

  totalYears: DropdownModel[] = [];
  monthNames = [
    new DropdownModel(0, "Jan"),
    new DropdownModel(1, "Feb"),
    new DropdownModel(2, "Mar"),
    new DropdownModel(3, "Apr"),
    new DropdownModel(4, "May"),
    new DropdownModel(5, "Jun"),
    new DropdownModel(6, "Jul"),
    new DropdownModel(7, "Aug"),
    new DropdownModel(8, "Sep"),
    new DropdownModel(9, "Oct"),
    new DropdownModel(10, "Nov"),
    new DropdownModel(11, "Dec")
  ];

  isSelectDayTriggered: boolean = false;
  Id: string = '';

  @Input()
  ParentDropDownId: string = '';

  month: DropdownModel = this.monthNames[0];
  year: DropdownModel | undefined = this.totalYears.find(x => x.Value == new Date().getFullYear());


  onChange: any = () => { };
  onTouch: any = () => { };

  @Input()
  Font: string = '';

  @Input()
  ReadOnly: boolean = false;

  @Input()
  Disabled: boolean = false;

  @Input()
  Width: string = '170px';

  @Input()
  DateFormat: string = 'MM-dd-yyyy';

  @Input()
  Height: string = '15px';

  @Output()
  onDateSelected = new EventEmitter<Date>(); // output<Date>();

  @ViewChild('calmodal', { read: ElementRef }) calModal!: ElementRef;

  @Input()
  EnableFilterOptionForYear: boolean = true;

  @Input()
  EnableFilterOptionForMonth: boolean = true;

  @Input()
  IsChildOfAnotherControl: boolean = false;

  @ViewChild('openbtn', { read: ElementRef }) openBtn!: ElementRef;
  @ViewChild('startElement', { read: ElementRef }) startElement!: ElementRef;


  IsChildOfAnotherControlClicked: boolean = false;

  IsWindowsOs: boolean = false;

  IsLinuxOs: boolean = false;

  DDEBottom: string = '';

  DDETop: string = '';

  DDELeft: string = '';

  DDERight: string = '';

  get DDEWidth() : string {
    return  '285px';
  }

  get DDEHeight(): string {
    if(this.currentMonth?.weeks.length == 6) {
      return '235px';
    } else {
      return '205px';
    }
  }

  @Input()
  ParentComponent: any | undefined = undefined;

  private _selectedItemBackColor: string = 'rgb(255 0 104 / 90%)';

  @Input()
  set SelectedItemBackGroundColor(color: string) {
    this._selectedItemBackColor = color;
  }
  get SelectedItemBackGroundColor(): string {
    return this._selectedItemBackColor;
  }

  private _showCalender: boolean = false;

  @Input()
  set IsCalenderOpen(value: boolean) {

    if (this._showCalender && !value) {
      this._showCalender = value;
      if (this.Closed)
        this.Closed.emit(true);
    }

    if (value) {
      this._showCalender = value;
      if (this.Opened)
        this.Opened.emit(true);
    } else {
      this._showCalender = value;
    }
  }

  get IsCalenderOpen(): boolean {
    return this._showCalender;
  }

  private _iconSizeHeight: string = "";
  private _iconVal: string = '';

  public get IconSize(): string {

    if(this._iconSizeHeight != this.Height) {      
      if (this.eleRef.nativeElement) {        
        let val = this.cssUnitSer.ToPxValue(this.Height, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
        this._iconSizeHeight = this.Height;
        this._iconVal = (val + 7) + CssUnit.Px.toString();
      }
    }

    return this._iconVal;
  }

  private _topPxHeight: string = '';
  private _topVal: string = '';

  public get TopPx(): string {

    if(this._topPxHeight!=this.Height) {
      if (this.eleRef.nativeElement) {
        let val = this.cssUnitSer.ToPxValue(this.Height, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
        let rem = val / 10;
        this._topPxHeight = this.Height;
        this._topVal = '-' + (rem * 2) + CssUnit.Px.toString();
      }
    }

    return this._topVal;
  }

  @Output()
  Opened = new EventEmitter<boolean>(); // output<boolean>();

  @Output()
  Closed = new EventEmitter<boolean>(); //output<boolean>();

  private winObj!: Window;

  @ViewChild('monthdropdown', { read: RDropdownComponent }) monthDropDownControl!: RDropdownComponent;

  @ViewChild('yeardropdown', { read: RDropdownComponent }) yearDropDownControl!: RDropdownComponent;

  dateReg = /^\d{2}[./-]\d{2}[./-]\d{4}$/

  @HostBinding('id')
  HostElementId: string = '';

  cls!: CloseService;

  constructor(private calService: CalenderService, private popupService: PopupService,
    private windowHelper: WindowHelper, private datePipe: DatePipe, private eleRef: ElementRef,
    private cdr: ChangeDetectorRef, private cssUnitSer: CssUnitsService) {

    this.cls = CloseService.GetInstance();

    if (this.windowHelper.isExecuteInBrowser()) {
      this.IsWindowsOs = navigator.platform == "Win32";
      this.IsLinuxOs = navigator.platform.toLowerCase().includes("linux");
    }

    this.HostElementId = this.windowHelper.GenerateUniqueId();
    this.Id = this.windowHelper.GenerateUniqueId();
    this.selectedDate = null;
    this.loadYears(new Date().getFullYear());
    this.calService.AddInstance(this);
    this.winObj = inject(WINDOWOBJECT);
    this.LoadMonth(new Date(), false);
    this.cls.AddInstance(this);
  }

  ngAfterViewInit(): void {

  }


  windowOnClick(evt: MouseEvent) {
    var tar: any = evt.target;

    if (this.IsCalenderOpen) {
      let i = 15;
      let element = evt.srcElement;
      let sameelementClicked: boolean = false;
      let elementId: string | undefined = undefined;

      while (element != undefined && i > -1) {
        if ((element as HTMLElement).classList.contains('rcalenderWindowsClose')) {
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
        this.IsCalenderOpen = false;

    }
  }

  
  IsOpen(): boolean {
    return this.IsCalenderOpen;
  }

  closeDropdown(): void {
    this.IsCalenderOpen = false;
  }

  isMonthDropdownClosed($evt: any) {

  }

  isMonthDropdownOpened($event: any) {


  }

  OnBlur($event: any) {
    if (this.selectedDate != undefined && this.selectedDate != null && this.Value.trim() != '') {

      let nospaceObj = this.Value.replace(/\s/g, '');
      let nospaceFormat = this.DateFormat.replace(/\s/g, '');

      if (nospaceObj.length == nospaceFormat.length) {
        let dstr = this.datePipe.transform(nospaceObj, nospaceFormat);

        if (dstr)
          this.selectedDate = new Date(Date.parse(dstr));
      }

      this.SetDate(this.selectedDate);
      this.cdr.detectChanges();
    } else {
      if (this.Value.trim() == '') {
        this.clearDate();
      }
    }
  }

  RenderUI(obj: string | Date) {
    try {
      if (obj != undefined && obj != '') {
        if (typeof (obj) === 'string') {

          let nospaceObj = obj.replace(/\s/g, '');
          let nospaceFormat = this.DateFormat.replace(/\s/g, '');

          if (nospaceObj.length == nospaceFormat.length) {
            let dstr = this.datePipe.transform(nospaceObj, nospaceFormat);

            if (dstr)
              this.selectedDate = new Date(Date.parse(dstr));
          }

        } else if (obj instanceof Date) {
          this.selectedDate = obj;
        } else {
          this.selectedDate = null;
        }
      } else {
        this.selectedDate = null;
      }

      if (this.selectedDate != null) {
        let _yr = this.selectedDate.getFullYear();

        if (this.totalYears.findIndex(x => x.Value == _yr) == -1)
          this.loadYears(_yr);

        this.year = this.totalYears.find(x => x.Value == _yr);


        let _mth = this.selectedDate.getMonth();
        this.month = this.monthNames[_mth];

        this.LoadMonth(this.selectedDate, true);

      } else {
        let _yr = new Date().getFullYear();

        if (this.totalYears.findIndex(x => x.Value == _yr) == -1)
          this.loadYears(_yr);

        this.year = this.totalYears.find(x => x.Value == _yr);

        let _mth = new Date().getMonth();
        this.month = this.monthNames[_mth];

        this.LoadMonth(new Date(), false);
      }

      if (this.selectedDate == undefined || this.selectedDate == null) {
        this.clearDate();
      }
    } catch (error) {
      this.clearDate();
    }
  }

  clearDate() {
    this.selectedDate = null;
    this._value = '';
    this.onChange(this._value);
    this.onTouch(this._value);
    this.onDateSelected.emit(undefined);

    if (this.currentMonth) {
      for (let index = 0; index < this.currentMonth.weeks.length; index++) {
        const _vk = this.currentMonth.weeks[index];
        for (let _vkindex = 0; _vkindex < _vk.days.length; _vkindex++) {
          const element = _vk.days[_vkindex];
          element.isSelected = false;
        }
      }
    }

  }

  writeValue(obj: string | Date): void {  
    let rd = this.ReadOnly;
    
    try {
      this.ReadOnly = false;
      this.RenderUI(obj);
      this.NotifyToUI();      
    }
    catch{

    }

    this.ReadOnly = rd;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.Disabled = isDisabled;
  }

  ngOnDestroy(): void {

    if (this.windowHelper.isExecuteInBrowser()) {
      if (this.winObj) {
        this.winObj.removeEventListener('click', this.WindowClick.bind(this));
      }
    }

  }

  ngOnInit(): void {

    if (this.selectedDate != null)
      this.LoadMonth(this.selectedDate, true);

    if (this.windowHelper.isExecuteInBrowser()) {

    }

  }

  WindowClick(event: any) {

  }

  openCalenderFromInput($evt: Event) {
    $evt.stopPropagation();
    $evt.preventDefault();

    this.openCalender($evt, true);
  }

  openCalender($evt: Event, isopenFromInput: boolean = false) {
    $evt.stopPropagation();
    $evt.preventDefault();

    this.IsChildOfAnotherControlClicked = false;

    var currentValueToSet = false;

    this.popupService.CloseAllPopupsOnOpen(this);

    if (isopenFromInput) {
      currentValueToSet = !this.IsCalenderOpen; //true;
    } else {
      currentValueToSet = !this.IsCalenderOpen;
    }

    //this.closeAllDropdowns(this);
    this.IsCalenderOpen = currentValueToSet;
    this.IsMonthDropdownOpen = false;
    this.IsYearDropdownOpen = false;

    if(this.IsCalenderOpen) {
      this.RenderUI(this.Value);
      this.NotifyToModel();    
      this.cls.CloseAllPopups(this);
      this.AttachDropdown();
    }
  }


  AttachDropdown() {
    let windowHeight = this.winObj.innerHeight;

    if (this.openBtn.nativeElement) {

      const exp = /(-?[\d.]+)([a-z%]*)/;

      let isInTab = false;
      let element: HTMLElement | null = this.eleRef.nativeElement as HTMLElement;
      let tabTop, tabLeft = 0;
      let i =15;

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

      let tabHeight = 0;
      let tabWidth = 0;

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

      let btn = this.openBtn.nativeElement as HTMLElement;
      let res = this.DDEHeight.match(exp);

      if (res) {
        let dropDownHeight = parseFloat(res[1].toString());
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
  }

  closeCalender() {

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    this.monthDropDownControl.closeDropdown();
    this.yearDropDownControl.closeDropdown();
    this.IsCalenderOpen = false;
  }

  addPrevYears($evt: Event) {
    $evt.preventDefault();
    $evt.stopPropagation();

    if (this.totalYears.length > 0) {
      let value = this.totalYears[0].Value;
      for (let i: number = value - 1; i >= (value - 20); i--) {
        this.totalYears.splice(0, 0, new DropdownModel(i, i.toString()));
      }
    }
  }

  addNextYears($evt: Event) {
    $evt.preventDefault();
    $evt.stopPropagation();

    if (this.totalYears.length > 0) {
      let value = this.totalYears[this.totalYears.length - 1].Value;
      for (let i: number = value + 1; i <= (value + 20); i++) {
        this.totalYears.push(new DropdownModel(i, i.toString()));
      }
    }
  }

  loadYears(year: number) {

    this.totalYears = [];

    for (let i = year - 100; i <= year; i++) {
      this.totalYears.push(new DropdownModel(i, i.toString()));
    }

    for (let i = year + 1; i < year + 100; i++) {
      this.totalYears.push(new DropdownModel(i, i.toString()));
    }
  }

  selectDate($evt: Event, day: Day) {

    if (!this.ReadOnly) {
      $evt.stopPropagation();
      $evt.preventDefault();

      if (this.IsChildOfAnotherControl) {
        this.IsChildOfAnotherControlClicked = true;
      }

      this.isSelectDayTriggered = true;

      this.monthDropDownControl.closeDropdown();
      this.yearDropDownControl.closeDropdown();

      if (day.isActiveMonth) {
        if (!day.isSelected && this.year) {
          let cdate = new Date(this.year.Value, this.month.Value, day.num);
          this.selectedDate = cdate;
          this.SetDate(this.selectedDate);
        } else {
          day.isSelected = false;
          this.selectedDate = null;
          this._value = '';
          this.onChange(this.Value);
          this.onTouch(this.Value);
          this.onDateSelected.emit(undefined);
        }

        this.IsCalenderOpen = false;
      }
    }
  }

  changeMonth(month: DropdownModel) {
    let monint = this.monthNames.indexOf(month.Value);
    if (monint != undefined && this.year) {
      let pre = new Date(this.year.Value, this.month.Value, 1);
      this.LoadMonth(pre);
    }

  }

  changeYear(year: DropdownModel) {
    if (year != undefined && this.year) {
      let _yr = parseInt(year.Value);
      let pre = new Date(this.year.Value, this.month.Value, 1);
      this.LoadMonth(pre);
    }
  }

  onBlur() {
    this.IsCalenderOpen = false;
  }

  previousMonth($evt: Event) {

    $evt.preventDefault();
    $evt.stopPropagation();

    if (this.year) {
      if (this.month.Value == 0) {
        this.month = this.monthNames[11];
        let yrmin = this.year.Value - 1;
        this.year = new DropdownModel(yrmin, yrmin.toString())
      } else {
        this.month = this.monthNames[this.month.Value - 1];
      }

      let pre = new Date(this.year.Value, this.month.Value, 1);
      this.LoadMonth(pre);
    }
  }

  nextMonth($evt: Event) {
    $evt.stopPropagation();
    $evt.preventDefault();

    if (this.year) {
      if (this.month.Value == 11) {
        this.month = this.monthNames[0];
        let yradd = this.year.Value + 1;
        this.year = new DropdownModel(yradd, yradd.toString());
      } else {
        let madd = this.month.Value + 1;
        this.month = this.monthNames[madd];
      }

      let next = new Date(this.year.Value, this.month.Value, 1);
      this.LoadMonth(next);
    }
  }

  LoadMonth(date: Date, isSelect: boolean = true) {

    if (this.IsChildOfAnotherControl) {
      this.IsChildOfAnotherControlClicked = true;
    }

    this.isSelectDayTriggered = false;

    let _mth = date.getMonth();

    let dateinNumber = date.getDate();
    let monthinNumber = date.getMonth();
    let year = date.getFullYear();

    let firstday = new Date(year, monthinNumber, 1);
    let firstdayInWeek = firstday.getDay() + 1;

    let lastDay = new Date(year, monthinNumber + 1, 0);
    let lastDayInWeek = lastDay.getDay();
    let lastDate = lastDay.getDate();

    let firstWeekRemainingDays = 7 - firstdayInWeek + 1;
    let monthremaindays = lastDate - firstWeekRemainingDays;
    let numberOfWeeks = monthremaindays / 7;

    if (monthremaindays % 7 > 0) {
      numberOfWeeks = numberOfWeeks + 1;
    }

    let allWeeks: Week[] = [];
    let firstWeekDays: Day[] = [];

    for (let i = firstdayInWeek - 1; i >= 1; i--) {
      let prevMonth = new Date(year, monthinNumber, 1 - i);
      firstWeekDays.push(new Day(prevMonth.getDate(), prevMonth.getDay()));
    }

    for (let i = 1; i <= firstWeekRemainingDays; i++) {
      let curMonth = new Date(year, monthinNumber, i);
      let a = new Day(curMonth.getDate(), curMonth.getDay());
      a.isActiveMonth = true;

      if (this.isDateEqual(curMonth, this.selectedDate!) && isSelect)
        a.isSelected = true;

      firstWeekDays.push(a);
    }

    let currentDay: number = firstWeekRemainingDays;
    allWeeks.push(new Week(firstWeekDays));

    for (let i = 1; i <= numberOfWeeks; i++) {

      let currentWeek: Day[] = [];

      for (let j = 1; j <= 7; j++) {
        currentDay = currentDay + 1;

        if (currentDay > lastDate) {
          let curMonth = new Date(year, monthinNumber + 1, currentDay - lastDate);
          let a = new Day(curMonth.getDate(), curMonth.getDay());
          currentWeek.push(a);
        } else {

          let curMonth = new Date(year, monthinNumber, currentDay);
          let a = new Day(curMonth.getDate(), curMonth.getDay());
          a.isActiveMonth = true;

          if (this.isDateEqual(this.selectedDate!, curMonth) && isSelect)
            a.isSelected = true;

          currentWeek.push(a);
        }
      }

      allWeeks.push(new Week(currentWeek));
    }

    this.currentMonth = new Month(allWeeks);

    if (this.selectedDate) {
      this._value = this.getDateString(this.selectedDate);
    }

  }

  NotifyToModel() {
    if (this.selectedDate) {
      this.onChange(this.Value);
      this.onTouch(this.Value);
      this.onDateSelected.emit(this.selectedDate);
    }
  }

  NotifyToUI() {
    if (this.selectedDate) {
      this.onDateSelected.emit(this.selectedDate);
    }
  }

  SetDate(date: Date) {

    this.selectedDate = date;

    this.currentMonth?.weeks.forEach((w) => {
      w.days.forEach((d) => {
        if (d.isActiveMonth && this.selectedDate?.getDate() == d.num)
          d.isSelected = true;
        else
          d.isSelected = false;
      })
    });

    if (this.selectedDate) {
      this._value = this.getDateString(this.selectedDate);
      this.onChange(this.Value);
      this.onTouch(this.Value);
      this.onDateSelected.emit(this.selectedDate);
    }
  }

  getDateString(date: Date): string {
    // const today = date;
    // const yyyy = today.getFullYear();
    // let mm: any = today.getMonth() + 1;
    // let dd: any = today.getDate();

    // if (dd < 10) dd = '0' + dd;
    // if (mm < 10) mm = '0' + mm;

    // const formattedToday = dd + '-' + mm + '-' + yyyy;

    // return formattedToday;

    let formatDate = this.datePipe.transform(date, this.DateFormat);
    return formatDate ?? '';
  }

  isDateEqual(a: Date, b: Date) {
    if (a != null && b != null) {
      return a.getDate() == b.getDate() && a.getMonth() == b.getMonth() && a.getFullYear() == b.getFullYear();
    } else {
      return false;
    }
  }
}
