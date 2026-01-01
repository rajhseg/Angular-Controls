import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, inject, Input, Output, ViewChild } from '@angular/core';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";
import { RbuttonComponent } from "../rbutton/rbutton.component";
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { DropDownItemModel, DropdownModel } from '../dropdown/dropdownmodel';
import { RDropdownComponent } from '../dropdown/dropdown.component';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { WindowHelper, WINDOWOBJECT } from '../windowObject';
import { CloseService, IDropDown } from '../popup.service';
import { RBaseComponent } from '../Models/RBaseComponent';

@Component({
  selector: 'rtimeselector',
  standalone: true,
  imports: [RTextboxComponent, NgIf, FormsModule, ReactiveFormsModule,
    NgClass, NgForOf, RbuttonComponent, RDropdownComponent, NgStyle],
  templateUrl: './rtimeselector.component.html',
  styleUrl: './rtimeselector.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RTimeSelectorComponent),
      multi: true
    }
  ],
  host: {
    
  }
})
export class RTimeSelectorComponent extends RBaseComponent<string> implements IDropDown, ControlValueAccessor {

  IsDropDownOpen: boolean = false;

  defaultText: string = "   HH  :  MM";

  public displayText: string = "   HH  :  MM";

  public outputValue: string = "";

  hours: DropDownItemModel[] = [];
  minutes: DropDownItemModel[] = [];
  modes: DropDownItemModel[] = [];

  selectedHour!: DropDownItemModel;
  selectedMinute!: DropDownItemModel;
  selectedMode!: DropDownItemModel;

  @Input()
  ParentDropDownId: string = '';

  @Input()
  LabelText: string = "";
  
  @Input()
  public Is24HourFormat: boolean = false;

  @Input()
  TextBottomLineColor: string = "blue";

  @Input()
  ButtonBackgroundColor: string = "blue";

  @Input()
  ButtonForeColor: string = "white";

  @Input()
  SelectedItemBackgroundColor: string = "blue";

  @Input()
  SetCurrentTimeAsDefaultOnLoad: boolean = true;

  @Input()
  SelectedItemForeColor: string = "white";


  onChanged: Function = () => { };
  onTouched: Function = () => { };

  @ViewChild('openbtn', { read: ElementRef }) openBtn!: ElementRef;
  @ViewChild('startElement', { read: ElementRef }) startElement!: ElementRef;

  windowObj!: Window;

  DDEBottom: string = '';

  DDETop: string = '';

  DDELeft: string = '';

  DDERight: string = '';

  get DDEWidth() : string {
    return  this.Is24HourFormat ? '122px': '122px'
  }

  get DDEHeight(): string {
    return '150px';    
  }

  cls!: CloseService;

  constructor(private windowHelper: WindowHelper, private eleRef: ElementRef, 
    private cdr: ChangeDetectorRef) {
    super(windowHelper);
    this.windowObj = inject(WINDOWOBJECT);
    this.cls = CloseService.GetInstance();
    this.LoadValues();
    this.Id = this.windowHelper.GenerateUniqueId();
    this.cls.AddInstance(this);    
  }

  writeValue(obj: any): void {
    this.RenderUIFromModel(obj);   
  }

  RenderUIFromModel(obj: any){
    if (obj == null || obj == undefined) {
      obj = "";
    }

    let val: string = obj as string;

    if (val.trim() == "".trim()) {
      this.LoadValues();
      if (this.SetCurrentTimeAsDefaultOnLoad) {
        this.setCurrentTime();
        this.SetDisplayText();
        this.NotifyToModel();
      } else {
        this.outputValue = "";
        this.displayText = this.defaultText;
        this.valueChanged.emit("");
      }
      return;
    }

    if (val) {
      let timestring = "";

      let modes = val.split(' ');
      if (modes.length == 2 && (modes[1].toLowerCase() == "am" || modes[1].toLowerCase() =="pm")) {
        this.Is24HourFormat = false;
        this.LoadValues();

        this.modes.forEach(x => x.IsSelected = false);

        this.modes.forEach((x) => {
          if (x.DisplayValue.toLowerCase() == modes[1].toLowerCase()) {
            x.IsSelected = true;
            this.selectedMode = x;
          }
        });
      }
      else {
        this.Is24HourFormat = true;
        this.LoadValues();
      }

      timestring = modes[0];
      let values = timestring.split(":").map(x => x.trim());

      if (values.length == 2) {
        this.hours.forEach(x => x.IsSelected = false);
        this.minutes.forEach(x => x.IsSelected = false);

        values[0] = values[0].length == 1 ? "0" + values[0] : values[0];
        values[1] = values[1].length == 1 ? "0" + values[1] : values[1];

        this.hours.forEach(x => {
          if (x.DisplayValue.toLowerCase() == values[0].toLowerCase()) {
            x.IsSelected = true;
            this.selectedHour = x;
          }
        });

        this.minutes.forEach(x => {
          if (x.DisplayValue.toLowerCase() == values[1].toLowerCase()) {
            x.IsSelected = true;
            this.selectedMinute = x;
          }
        });
        
        this.SetDisplayText();
        this.valueChanged.emit(this.outputValue);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  NotifyToModel() {
    if ((this.Is24HourFormat && this.selectedHour && this.selectedMinute && this.selectedMode)
      || (!this.Is24HourFormat && this.selectedHour && this.selectedMinute)) {
      this.onChanged(this.outputValue);
      this.onTouched(this.outputValue);
      this.valueChanged.emit(this.outputValue);
    }
  }

  closeDropdown(): void {
    this.IsDropDownOpen =false;    
    this.cdr.detectChanges();
  }

  windowOnClick($event: Event) {

    this.cls.PrintLog();

    if (this.IsDropDownOpen) {
      let i = 15;
      let element = $event.srcElement;
      let sameelementClicked: boolean = false;
      let elementId: string | undefined = undefined;

      while (element != undefined && i > -1) {
        if ((element as HTMLElement).classList.contains('rtimeselectorwindowclose')) {
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


  setCurrentTime() {
    let date = new Date();
    let _hour = date.getHours();
    let _minute = date.getMinutes();

    let _hourValue = 0;
    let _minuteValue = 0;
    let _mode: string = "";

    if (!this.Is24HourFormat) {
      if (_hour == 0) {
        _hourValue = 12;
        _mode = "AM";
      } else {
        _hourValue = _hour > 12 ? _hour - 12 : _hour;
        _mode = _hour > 12 ? "PM" : "AM";
      }

      _minuteValue = _minute;
    } else {
      _hourValue = _hour;
      _minuteValue = _minute;
    }

    this.hours.forEach(x => {
      if (x.Value == _hourValue) {
        x.IsSelected = true;
        this.selectedHour = x;
      }
    });

    this.minutes.forEach(x => {
      if (x.Value == _minuteValue) {
        x.IsSelected = true;
        this.selectedMinute = x;
      }
    });

    if (!this.Is24HourFormat) {
      this.modes.forEach(x => {
        if (x.Value == _mode) {
          x.IsSelected = true;
          this.selectedMode = x;
        }
      });
    }
  }

  LoadValues() {
    this.hours = [];
    this.minutes = [];
    this.modes = [];

    if (this.Is24HourFormat) {
      for (let index = 0; index < 24; index++) {
        let display = index.toString().length == 1 ? "0" + index.toString() : index.toString();
        this.hours.push(new DropDownItemModel(index, display));
      }
    }
    else {
      for (let index = 1; index < 13; index++) {
        let display = index.toString().length == 1 ? "0" + index.toString() : index.toString();
        this.hours.push(new DropDownItemModel(index, display));
      }
    }

    for (let index = 0; index < 60; index++) {
      let display = index.toString().length == 1 ? "0" + index.toString() : index.toString();
      this.minutes.push(new DropDownItemModel(index, display));
    }

    this.modes.push(new DropDownItemModel("AM", "AM"));
    this.modes.push(new DropDownItemModel("PM", "PM"));
  }

  SelectMode(item: DropDownItemModel) {

    this.modes.forEach(x => x.IsSelected = false);

    if(this.Is24HourFormat) {
      return;
    }
  
    item.IsSelected = true;
    this.selectedMode = item;
    this.SetDisplayText();
    this.NotifyToModel();
  }

  SelectHour(item: DropDownItemModel) {
    this.hours.forEach(x => x.IsSelected = false);
    item.IsSelected = true;
    this.selectedHour = item;
    this.SetDisplayText();
    this.NotifyToModel();
  }

  SelectMinute(item: DropDownItemModel) {
    this.minutes.forEach(x => x.IsSelected = false);
    item.IsSelected = true;
    this.selectedMinute = item;
    this.SetDisplayText();
    this.NotifyToModel();
  }

  openDropdown($event: Event) {
    $event.stopPropagation();
    $event.preventDefault();

    this.IsDropDownOpen = !this.IsDropDownOpen;
    if(this.IsDropDownOpen){
      this.cls.CloseAllPopups(this);
      this.AttachDropdown();
    }
  }
  
  AttachDropdown() {
    let windowHeight = this.windowObj.innerHeight;

    if (this.openBtn.nativeElement) {

      const exp = /(-?[\d.]+)([a-z%]*)/;
      
      let isInTab = false;
      let tabHeight = 0, tabWidth = 0;

      let element: HTMLElement | null = this.eleRef.nativeElement as HTMLElement;
      let tabTop, tabLeft =0;
      let i =15;

      let tabEle : any = undefined;

      while(element && element != null && i > 0){
        if(element.nodeName.toLowerCase() == 'rflattabs' 
          || element.nodeName.toLowerCase() == 'rtabs'
          || element.nodeName.toLowerCase() == 'rstepper-vertical' 
          || element.nodeName.toLowerCase() == 'rstepper-horizontal'
          || element.nodeName.toLowerCase() == 'rgroup-panel' ){
          isInTab = true;
          break;
        }
        
        i--;
        tabEle = element;
        element = element.parentElement;
      }

      if(isInTab && element) {
        let tabContentEle = element.getElementsByClassName("tabcontent");          
        let tabRect = tabEle.getBoundingClientRect();
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

          if(this.LabelText.trim()!=''){
            this.DDEBottom = '77%';
          } else {
          this.DDEBottom = '105%';
          }

          this.DDETop = 'auto';
        } else {
          this.DDETop = '95%';
          this.DDEBottom = 'auto';
        }
      }

    }
  }

  IsOpen(): boolean {
    return this.IsDropDownOpen;
  }

  SetDisplayText() {
    if (this.selectedHour && this.selectedMinute && (this.Is24HourFormat || (!this.Is24HourFormat && this.selectedMode))) {
      if (this.Is24HourFormat) {
        this.displayText = "  " + this.selectedHour.DisplayValue + "  :   " + this.selectedMinute.DisplayValue;
      } else {
        this.displayText = "  " + this.selectedHour.DisplayValue + " : " + this.selectedMinute.DisplayValue + "  " + this.selectedMode.DisplayValue;
      }

      if (this.Is24HourFormat) {
        this.outputValue = this.selectedHour.DisplayValue + ":" + this.selectedMinute.DisplayValue;
      }
      else {
        this.outputValue = this.selectedHour.DisplayValue + ":" + this.selectedMinute.DisplayValue + " " + this.selectedMode.DisplayValue;
      }
    }
  }
}
