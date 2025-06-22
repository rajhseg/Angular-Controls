
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Inject, Injector, Input, OnDestroy, OnInit, Output, ViewChild, afterNextRender, forwardRef, inject, output } from '@angular/core';
import { DaysEnum } from '../Calender/CalenderModels';
import { NgFor, NgClass, CommonModule, NgIf, NgStyle, DatePipe } from '@angular/common';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RDropdownComponent } from '../dropdown/dropdown.component';

import { DropdownService } from '../dropdown/dropdownservice.service';
import { CloseService, IDropDown, IPopupCloseInterface, PopupService } from '../popup.service';
import { WINDOWOBJECT, WindowHelper } from '../windowObject';
import { DropdownModel } from '../dropdown/dropdownmodel';
import { RTextboxComponent } from '../rtextbox/rtextbox.component';
import { CssUnit, CssUnitsService, RelativeUnitType } from '../css-units.service';
import { RTimeSelectorComponent } from "../rtimeselector/rtimeselector.component";
import { RColorPickerComponent } from "../rcolorpicker/rcolorpicker.component";
import { RbuttonComponent } from "../rbutton/rbutton.component";
import { RGrouppanelComponent } from "../grouppanel/grouppanel.component";
import { RGridComponent } from "../rgrid/rgrid.component";
import { RColumnComponent } from '../rgrid/rcolumn/rcolumn.component';
import { ReadViewTemplateDirective } from '../rgrid/view-template.directive';
import { EditViewTemplateDirective } from '../rgrid/edit-template.directive';

@Component({
  selector: 'revents-calender',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, CommonModule,
    NgStyle, FormsModule, RTextboxComponent, ReactiveFormsModule,
    RDropdownComponent, RTimeSelectorComponent, RColorPickerComponent, 
    RbuttonComponent, RGrouppanelComponent, RGridComponent,
    RColumnComponent, ReadViewTemplateDirective, EditViewTemplateDirective],
  templateUrl: './reventscalender.component.html',
  styleUrl: './reventscalender.component.css',
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => REventsCalenderComponent)
    },
    DatePipe
  ]
})
export class REventsCalenderComponent implements IDropDown, OnInit, AfterViewInit, OnDestroy, ControlValueAccessor, IPopupCloseInterface {

  self: REventsCalenderComponent = this;
  isDropdownChild: boolean = true;
  selectedDate: Date | null = null;
  currentMonth: EventMonth | null = null;
  selectedMonthInString: string = '';

  IsMonthDropdownOpen: boolean = false;
  IsYearDropdownOpen: boolean = false;

  private injector = inject(Injector);

  _value: string = '';
  IsValueChanged: boolean = false;

  set Value(val: string) {
    if (val != this._value && !this.ReadOnly) {
      this.IsValueChanged = true;
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


  onChange: any = (value: EventsCalenderModel) => { };
  onTouch: any = (value: EventsCalenderModel) => { };
  changemonthisCalled: boolean = false;

  @Input()
  Font: string = '';

  @Input()
  ReadOnly: boolean = false;

  @Input()
  Disabled: boolean = false;

  // @Input()
  // Width: string = '170px';

  @Input()
  DateFormat: string = 'MM-dd-yyyy';

  @Input()
  Height: string = '15px';

  @Output()
  onEventAdded = new EventEmitter<EventsCalenderModel>(); 

  @ViewChild('calmodal', { read: ElementRef }) calModal!: ElementRef;

  @Input()
  EnableFilterOptionForYear: boolean = true;

  @Input()
  EnableFilterOptionForMonth: boolean = true;

  @Input()
  IsChildOfAnotherControl: boolean = false;

  _eachDayWdh: string = '100px';

  @Input()
  set EachDayWidthInPx(val: string)
  {
    let _v = this.cssUnitSer.ToPxValue(val, null, null);
    if(_v < 100){
      val = '100px';
    }

    this._eachDayWdh = val;
  } 
  get EachDayWidthInPx(): string {
    return this._eachDayWdh;
  }

  get GridHeight(): string {
    let val = this.cssUnitSer.ToPxValue(this.DDEHeight, null, null);
    return (val - 360)+CssUnit.Px.toString();
  }

  _eachDayHgt: string = '100px';

  @Input()
  set EachDayHeightInPx(val: string){

    let _v = this.cssUnitSer.ToPxValue(val, null, null);
    if(_v < 100){
      val = '100px';
    }

    this._eachDayHgt = val;
  } 

  get EachDayHeightInPx(): string {
    return this._eachDayHgt;
  }

  @Output()
  ChangeMonthEvent: EventEmitter<CalenderChangeMonthInfo> = new EventEmitter<CalenderChangeMonthInfo>();

  IsChildOfAnotherControlClicked: boolean = false;

  IsWindowsOs: boolean = false;

  IsLinuxOs: boolean = false;

  DDEBottom: string = '';

  DDETop: string = '';

  DDELeft: string = '';

  DDERight: string = '';

  get DDEWidth(): string {
    let val =  this.cssUnitSer.ToPxValue(this.EachDayWidthInPx, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
    return (val * 7) + CssUnit.Px.toString();
  }

  get DDEHeight(): string {
    let val = this.cssUnitSer.ToPxValue(this.EachDayHeightInPx, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
    let noOfWeek = this.currentMonth?.weeks.length;

    if (noOfWeek) {
      return (val * noOfWeek) + CssUnit.Px.toString();      
    } else {
      return (val * 5) + CssUnit.Px.toString();      
    }
  }

  get dayWidth(): string {
    let val = this.cssUnitSer.ToPxValue(this.EachDayWidthInPx, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
    return (val - (8 * 2)) + CssUnit.Px.toString();
  }

  get dayHeight(): string {
    let val = this.cssUnitSer.ToPxValue(this.EachDayHeightInPx, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
    return (val - 5 - (9 * 2))+ CssUnit.Px.toString();
  }

  get weekHeight(): string {
    let val = this.cssUnitSer.ToPxValue(this.DDEHeight, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
        
    if (this.currentMonth) {
      return ((val - 34) / (this.currentMonth?.weeks.length + 1)) + CssUnit.Px.toString();      
    } else {
      return (val - 34) / 6 + CssUnit.Px.toString();      
    }

  }

  get SelectedDayLeftPx(): string {
    let val = this.cssUnitSer.ToPxValue(this.EachDayWidthInPx, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
    return ((val/2) - 13) + CssUnit.Px.toString();
  }
  
  get SelectedDayTopPx(): string {
    let val = this.cssUnitSer.ToPxValue(this.EachDayWidthInPx, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
    return "-"+ ((24/2)-9) + CssUnit.Px.toString();
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

    if (this._iconSizeHeight != this.Height) {
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

    if (this._topPxHeight != this.Height) {
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

  @Output()
  focus = new EventEmitter<any>();

  @Output()
  blur = new EventEmitter<any>();

  @Output()
  cut = new EventEmitter<any>();

  @Output()
  copy = new EventEmitter<any>();

  @Output()
  paste = new EventEmitter<any>();

  @Output()
  keydown = new EventEmitter<any>();

  @Output()
  keyup = new EventEmitter<any>();

  @Output()
  keypress = new EventEmitter<any>();

  @Output()
  click = new EventEmitter<any>();

  @Output()
  mouseenter = new EventEmitter<any>();

  @Output()
  mousedown = new EventEmitter<any>();

  @Output()
  mouseup = new EventEmitter<any>();

  @Output()
  mouseleave = new EventEmitter<any>();

  @Output()
  mousemove = new EventEmitter<any>();

  @Output()
  mouseout = new EventEmitter<any>();

  @Output()
  mouseover = new EventEmitter<any>();

  @Output()
  dblclick = new EventEmitter<any>();

  @Output()
  drag = new EventEmitter<any>();

  @Output()
  dragend = new EventEmitter<any>();

  @Output()
  dragenter = new EventEmitter<any>();

  @Output()
  dragleave = new EventEmitter<any>();

  @Output()
  dragover = new EventEmitter<any>();

  @Output()
  dragstart = new EventEmitter<any>();

  @Output()
  drop = new EventEmitter<any>();

  private winObj!: Window;

  @ViewChild('monthdropdown', { read: RDropdownComponent }) monthDropDownControl!: RDropdownComponent;

  @ViewChild('yeardropdown', { read: RDropdownComponent }) yearDropDownControl!: RDropdownComponent;

  dateReg = /^\d{2}[./-]\d{2}[./-]\d{4}$/

  @HostBinding('id')
  HostElementId: string = '';

  cls!: CloseService;
  isModalOpen: boolean = false;

  @Input()
  Items: EventsCalenderModel = new EventsCalenderModel();

  SelectedEventDay: EventDay | undefined = undefined;
  SelectedEventDate: Date | undefined = undefined;
  SelectedEventModel: EachDayEventsModel | undefined = undefined;
  NewEvent: AddEventModel = new AddEventModel(this.windowHelper.GenerateUniqueId(), "", "", "","#2D37D0");
  ItemsPerPage = new DropdownModel(10, "10");

  constructor(private popupService: PopupService,
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
    this.winObj = inject(WINDOWOBJECT);
    this.LoadMonth(new Date(), false);
    this.cls.AddInstance(this);

    this.RenderUI(new Date());
  }

  ngAfterViewInit(): void {

  }

  NotifyChangeMonth(){
    let monthInfo = new CalenderChangeMonthInfo(this.year?.Value, this.month.Value);
    this.ChangeMonthEvent.emit(monthInfo);
  }

  OnFocus($event: any) {
    this.focus.emit($event);
  }

  OnCut($event: any) {
    this.cut.emit($event);
  }

  OnCopy($event: any) {
    this.copy.emit($event);
  }

  OnPaste($event: any) {
    this.paste.emit($event);
  }

  OnKeyDown($event: any) {
    this.keydown.emit($event);
  }

  OnKeyUp($event: any) {
    this.keyup.emit($event);
  }

  OnKeyPress($event: any) {
    this.keypress.emit($event);
  }

  OnMouseEnter($event: any) {
    this.mouseenter.emit($event);
  }

  OnMouseDown($event: any) {
    this.mousedown.emit($event);
  }

  OnMouseUp($event: any) {
    this.mouseup.emit($event);
  }


  OnMouseLeave($event: any) {
    this.mouseleave.emit($event);
  }

  OnMouseMove($event: any) {
    this.mousemove.emit($event);
  }

  OnMouseOut($event: any) {
    this.mouseout.emit($event);
  }

  OnMouseOver($event: any) {
    this.mouseover.emit($event);
  }

  OnDoubleClick($event: any) {
    this.dblclick.emit($event);
  }

  OnDrag($event: any) {
    this.drag.emit($event);
  }

  OnDragEnd($event: any) {
    this.dragend.emit($event);
  }

  OnDragEnter($event: any) {
    this.dragenter.emit($event);
  }

  OnDragLeave($event: any) {
    this.dragleave.emit($event);
  }

  OnDragOver($event: any) {
    this.dragover.emit($event);
  }

  OnDragStart($event: any) {
    this.dragstart.emit($event);
  }

  OnDrop($event: any) {
    this.drop.emit($event);
  }

  windowOnClick(evt: MouseEvent) {
    var tar: any = evt.target;

    this.cls.PrintLog();

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
    this.cdr.detectChanges();
  }


  addEvent($evt: Event) {
    if(this.year) {      
      let _eventDay = this.Items.EachDay.find(x=>x.EventDate.toDateString() == this.SelectedEventModel?.EventDate.toDateString());

      if(_eventDay){
        _eventDay.Events.push(new AddEventModel(this.NewEvent.Id, this.NewEvent.Name,
          this.NewEvent.FromTime, this.NewEvent.ToTime, this.NewEvent.Indicator
        ));

        this.SelectedEventModel = _eventDay;        
        this.SelectedEventModel.Events = _eventDay.Events.slice();
      } 
      
      this.NewEvent = new AddEventModel(this.windowHelper.GenerateUniqueId(), "", "", "","#2D37D0");
    }

    this.NotifyToModel();
  }

  isMonthDropdownClosed($evt: any) {

  }

  isMonthDropdownOpened($event: any) {


  }
  closeModal($evt: Event){
    this.isModalOpen = false;
    let _x = this.Items.EachDay.filter(x => x.EventDate.toDateString() == this.SelectedEventDate?.toDateString());

    //Each date must have one entry, if its duplicate takes first item.
    _x = _x.slice(0, 1);

    let _evts = [];

    if(_x){
      for (let index = 0; index < _x.length; index++) {
        const element = _x[index];
        const eleEvts = element.Events.slice();
        for (let y = 0; y < eleEvts.length; y++) {
          const k = eleEvts[y];
          _evts.push(k);
        }
      }
    }

    this.Items.EachDay = this.Items.EachDay.filter(x=>x.EventDate.toDateString() != this.SelectedEventDate?.toDateString()).slice();

    if(this.SelectedEventDate)
      this.Items.EachDay.push(new EachDayEventsModel(this.SelectedEventDate, _evts));

    this.SelectedEventDay = undefined;
    this.SelectedEventDate = undefined;
    
    this.SelectedEventModel = undefined;
    this.cdr.detectChanges();
  }

  getEvents(day:EventDay): AddEventModel[] {
    if(this.year) {      
      let cdate = new Date(day.Year, day.Month, day.num);
      let _eventDay = this.Items?.EachDay?.find(x=>x.EventDate.toDateString()==cdate.toDateString());
      return _eventDay?.Events.slice(0, 5) ?? [];
    }

    return [];
  }

  openEvents($evt: Event, day: EventDay) {

    if (!day.isActiveMonth)
      return;

    this.isModalOpen = true;
    this.SelectedEventDay = day;
    
    if(this.year) {
      let cdate = new Date(day.Year, day.Month, day.num);
      let _eventDay = this.Items.EachDay.find(x=>x.EventDate.toDateString()==cdate.toDateString());

      if(_eventDay==undefined){
        _eventDay = new EachDayEventsModel(cdate,[]);
        this.Items.EachDay.push(_eventDay);
      }

      this.SelectedEventDate = cdate;
      this.SelectedEventModel = _eventDay;
    }
    this.cdr.detectChanges();
  }

  DeleteEvent($evt: Event, value: object|undefined){
    if(value && this.SelectedEventModel){      
      let _indx = this.SelectedEventModel.Events.findIndex(x=>x.Id==value.toString());
      if(_indx>-1){
        this.SelectedEventModel.Events.splice(_indx,1);
        this.SelectedEventModel.Events = this.SelectedEventModel.Events.slice();
        this.NotifyToModel();
      }
    }
    this.cdr.detectChanges();
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
    } catch (error) {
      
    }
  }

  writeValue(obj: EventsCalenderModel): void {
    let rd = this.ReadOnly;

    try {
      this.ReadOnly = false;
      this.Items = obj;
      this.NotifyToUI();
    }
    catch {

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

  selectDate($evt: Event, day: EventDay) {

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
      this.NotifyChangeMonth();      
    }    
  }

  changeYear(year: DropdownModel) {
    if (year != undefined && this.year) {
      let _yr = parseInt(year.Value);
      let pre = new Date(this.year.Value, this.month.Value, 1);
      this.LoadMonth(pre);
      
      if(!this.changemonthisCalled)
        this.NotifyChangeMonth();

      this.changemonthisCalled = false;
    }    
  }

  previousMonth($evt: Event) {

    $evt.preventDefault();
    $evt.stopPropagation();

    if (this.year) {
      this.changemonthisCalled = true;
      if (this.month.Value == 0) {
        this.month = this.monthNames[11];
        let yrmin = this.year.Value - 1;
        this.year = new DropdownModel(yrmin, yrmin.toString())

        let index = this.totalYears.findIndex(x=>x.Value==this.year?.Value);

        if(index==-1){
          for (let i = this.year.Value; i >= (this.year.Value - 100); i--) {
            let _PrevYr = new DropdownModel(i, i.toString())
            this.totalYears.unshift(_PrevYr);
          }

          this.totalYears = [...this.totalYears];
          this.year = new DropdownModel(yrmin, yrmin.toString())
          this.cdr.detectChanges();
        }

      } else {
        this.month = this.monthNames[this.month.Value - 1];
      }

      let pre = new Date(this.year.Value, this.month.Value, 1);
      this.LoadMonth(pre);
    }    

    this.changemonthisCalled = false;
  }

  nextMonth($evt: Event) {
    $evt.stopPropagation();
    $evt.preventDefault();

    if (this.year) {
      this.changemonthisCalled = true;

      if (this.month.Value == 11) {
        this.month = this.monthNames[0];
        let yradd = this.year.Value + 1;
        this.year = new DropdownModel(yradd, yradd.toString());

        let index = this.totalYears.findIndex(x=>x.Value==this.year?.Value);

        if(index==-1){
          for (let i = this.year.Value; i < (this.year.Value + 100); i++) {
            let _NextYr = new DropdownModel(i, i.toString())
            this.totalYears.push(_NextYr);
          } 

          this.totalYears = [...this.totalYears];
          this.year = new DropdownModel(yradd, yradd.toString());
          this.cdr.detectChanges();         
        }

      } else {
        let madd = this.month.Value + 1;
        this.month = this.monthNames[madd];
      }

      let next = new Date(this.year.Value, this.month.Value, 1);
      this.LoadMonth(next);
    }    

    this.changemonthisCalled = false;
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

    let allWeeks: EventWeek[] = [];
    let firstWeekDays: EventDay[] = [];

    for (let i = firstdayInWeek - 1; i >= 1; i--) {
      let prevMonth = new Date(year, monthinNumber, 1 - i);
      firstWeekDays.push(new EventDay(prevMonth.getDate(), prevMonth.getDay(), prevMonth.getMonth(), prevMonth.getFullYear()));
    }

    for (let i = 1; i <= firstWeekRemainingDays; i++) {
      let curMonth = new Date(year, monthinNumber, i);
      let a = new EventDay(curMonth.getDate(), curMonth.getDay(), curMonth.getMonth(), curMonth.getFullYear());
      a.isActiveMonth = true;

      if (this.isDateEqual(curMonth, this.selectedDate!) && isSelect)
        a.isSelected = true;

      firstWeekDays.push(a);
    }

    let currentDay: number = firstWeekRemainingDays;
    allWeeks.push(new EventWeek(firstWeekDays));

    for (let i = 1; i <= numberOfWeeks; i++) {

      let currentWeek: EventDay[] = [];

      for (let j = 1; j <= 7; j++) {
        currentDay = currentDay + 1;

        if (currentDay > lastDate) {
          let curMonth = new Date(year, monthinNumber + 1, currentDay - lastDate);
          let a = new EventDay(curMonth.getDate(), curMonth.getDay(), curMonth.getMonth(), curMonth.getFullYear());
          currentWeek.push(a);
        } else {

          let curMonth = new Date(year, monthinNumber, currentDay);
          let a = new EventDay(curMonth.getDate(), curMonth.getDay(), curMonth.getMonth(), curMonth.getFullYear());
          a.isActiveMonth = true;

          if (this.isDateEqual(this.selectedDate!, curMonth) && isSelect)
            a.isSelected = true;

          currentWeek.push(a);
        }
      }

      allWeeks.push(new EventWeek(currentWeek));
    }

    if (allWeeks.length >= 4 && allWeeks.length < 6) {
      
      var loopnum = 6 - allWeeks.length;
      let dateNum = 0;

      //if (currentDay > lastDate)
      monthinNumber = monthinNumber + 1;

      if (allWeeks.length == 5) {
        dateNum = currentDay - lastDate;
      }

      for (let k = 1; k <= loopnum; k++) {
        var cur: EventDay[] = [];

        for (let i = 1; i < 8; i++) {
          dateNum += 1;
          let nextMonth = new Date(year, monthinNumber, dateNum);
          cur.push(new EventDay(nextMonth.getDate(), nextMonth.getDay(), nextMonth.getMonth(), nextMonth.getFullYear()));
        }

        allWeeks.push(new EventWeek(cur));
      }
    }

    this.currentMonth = new EventMonth(allWeeks);

    if (this.selectedDate) {
      this._value = this.getDateString(this.selectedDate);
    }    
  }

  NotifyToModel() {    
    this.onChange(this.Items);
    this.onTouch(this.Items);
    this.onEventAdded.emit(this.Items);    
  }

  NotifyToUI() {    
    this.onEventAdded.emit(this.Items);    
  }

  SetDate(date: Date) {

    this.selectedDate = date;

    this.currentMonth?.weeks.forEach((w) => {
      w.days.forEach((d:EventDay) => {
        if (d.isActiveMonth && this.selectedDate?.getDate() == d.num)
          d.isSelected = true;
        else
          d.isSelected = false;
      })
    });

    if (this.selectedDate) {
      this._value = this.getDateString(this.selectedDate);      
    }
  }

  getDateString(date: Date): string {
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


export class AddEventModel {  

  constructor(public Id: string, public Name:string, public FromTime: string, public ToTime: string, public Indicator: string){

  }
}

export class EachDayEventsModel {
  constructor(public EventDate: Date, public Events: AddEventModel[] = []){

  }
}


export class EventsCalenderModel {
  constructor(public EachDay: EachDayEventsModel[] = []){

  }
}

export class CalenderChangeMonthInfo{
  constructor(public Year: number, public Month: number){

  }
}


export class EventDay {
    
    public isActiveMonth: boolean = false;
    public DayInString: string = "";
    public isSelected: boolean =false;
    public Month!: number;
    public Year!: number;

    constructor(public num:number, public dayInWeek: number, month: number, year: number){
        this.DayInString = DaysEnum[dayInWeek];
        this.Month = month;
        this.Year = year;
    }

}

export class EventWeek {
    constructor(public days:EventDay[]){
        if(days.length!=7){
           throw Error("invalid day");
        }
    }
}

export class EventMonth {
    constructor(public weeks: EventWeek[]){

    }
}
