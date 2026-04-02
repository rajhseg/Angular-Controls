import { DatePipe, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, HostBinding, inject, Input, Output, ViewChild } from '@angular/core';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";
import { RNumericComponent } from "../rnumeric/rnumeric.component";
import { RButtonComponent } from "../rbutton/rbutton.component";
import { RCalendarComponent } from "../rcalendar/rcalendar.component";
import { RWindowHelper, WINDOWOBJECT } from '../rwindowObject';
import { RSelectDropdownComponent } from "../rselectdropdown/rselectdropdown.component";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModel } from '../rdropdown/rdropdownmodel';
import { RCloseService, IRDropDown } from '../rpopup.service';
import { RBaseComponent } from '../rmodels/RBaseComponent';
import { ValidateCustomTypeProp, ValidateProp } from '../rvalidator';


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

@Component({
  selector: 'rfilter',
  standalone: true,
  imports: [NgIf, NgStyle, RTextboxComponent, RNumericComponent,
    RButtonComponent, RCalendarComponent, RSelectDropdownComponent,
    FormsModule, ReactiveFormsModule],
  templateUrl: './rfilter.component.html',
  styleUrl: './rfilter.component.css',
  host: {
   
  },
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> RFilterComponent),
      multi: true
    },
    DatePipe
  ]
})
export class RFilterComponent extends RBaseComponent<RFilterApplyModel> implements IRDropDown, ControlValueAccessor {

  @Input()
  @ValidateProp("label")
  DateFormat: string = 'MM-dd-yyyy';
  
  @ValidateProp("enum", RFilterDataType)
  _dataType:RFilterDataType = RFilterDataType.StringType;

  @Input()
  public set DataType(value: RFilterDataType){
    this._dataType = this.ValidEnum(value, RFilterDataType);
  }
  public get DataType(): RFilterDataType {
    return this._dataType;
  }

  @ValidateProp("number")
  public dropdownMaxChars: number = 178;

  @Input()
  @ValidateProp("label")
  ParentDropDownId: string = '';

  @Input()
  @ValidateProp("color")
  TextColor: string = 'gray';

  @Input()
  @ValidateProp("size")
  Width: string = '15px'

  @Input()
  @ValidateProp("size")
  Height: string = '15px';

  @Input()
  @ValidateProp("color")
  Color: string = 'grey';

  @ValidateProp("boolean")
  IsFilteredApplied: boolean = false;

  @ValidateProp("boolean")
  IsFilterOpen: boolean = false;

  @Input()
  @ValidateProp("color")
  BackgroundColor: string = 'white';

  @Input()
  @ValidateProp("enum", RFilterAlign)
  Align: RFilterAlign = RFilterAlign.Right;

  @Input()
  @ValidateProp("color")
  ForeColor: string = 'black';

  @Input()
  @ValidateProp("boolean")
  EnableShadowOnDropdown: boolean = true;

  @ValidateCustomTypeProp(DropdownModel)
  itemValues: DropdownModel[] = [];

  @Input()
  public set ItemValues(val: DropdownModel[]){
    this.itemValues = this.ValidCustomArrayType(val, DropdownModel);

    let wth = 0;

    for (let index = 0; index < val.length; index++) {
      const element = val[index];
      let len = element.DisplayValue.toString().length;
      if (len > wth) {
        wth = len;
      }
    }

    if (this.dropdownMaxChars < wth * 10)
      this.dropdownMaxChars = wth * 10;

  }

  public get ItemValues(): DropdownModel[] {
    return this.itemValues;
  }

  _itemModel: any = [];

  @Input()
  public set ItemModel(value: any) {
    this._itemModel = value;

    if (value == undefined || value == null)
      return;

    let values: any[] = [];
    let dValues: DropdownModel[] = [];

    if (value.length > 0) {
      for (let index = 0; index < value.length; index++) {
        const element = value[index];

        let val = undefined;

        let props = this.ColumnName.split(".");

        if (props.length > 1) {
          let _obj = undefined;
          let _fobj = element;

          for (let index = 0; index < props.length; index++) {
            const _p = props[index];
            _fobj = _fobj[_p];

            if (_fobj == undefined)
              break;

            _obj = _fobj;
          }

          val = _obj;

        } else {
          val = element[this.ColumnName];
        }

        if (values.find(x => x == val) == undefined) {
          if (this.DataType == RFilterDataType.NumberType) {
            let num = Number.parseInt(val);

            if (values.find(x => x == num) == undefined && num != undefined)
              values.push(num);

          } else if (this.DataType == RFilterDataType.DateType) {

            if (values.find(x => x.toString() == val.toString()) == undefined && val != undefined)
              values.push(val);

          } else {

            if (values.find(x => x.toString() == val.toString()) == undefined && val != undefined)
              values.push(val);

          }
        }
      }
    }

    if (this.DataType == RFilterDataType.NumberType)
      values = values.sort((a, b) => a - b);
    else
      values = values.sort();

    for (let index = 0; index < values.length; index++) {
      const element = values[index];
      dValues.push(new DropdownModel(element, element));
    }

    let wth = 0;

    for (let index = 0; index < dValues.length; index++) {
      const element = dValues[index];
      let len = element.DisplayValue.toString().length;
      if (len > wth) {
        wth = len;
      }
    }

    if (this.dropdownMaxChars < wth * 10)
      this.dropdownMaxChars = wth * 10;

    this.ItemValues = dValues;
  }

  _columnName: string = '';

  @Input()
  set ColumnName(val: string){
    this._columnName = this.ValidLabel(val);    
    this.ItemModel = this._itemModel;
  }
  get ColumnName(): string {
    return this._columnName;
  }
  
  @Input()
  @ValidateProp("color")
  BorderColor: string = 'lightgray';

  ContainsList: DropdownModel[] | undefined = undefined;
  LessThanNumber: number | undefined = undefined;
  LessThanDate: string | undefined = undefined;
  GreaterThanNumber: number | undefined = undefined;
  GreaterThanDate: string | undefined = undefined;

  @ValidateProp("size")
  DDEBottom: string = '';

  @ValidateProp("size")
  DDETop: string = '';

  @ValidateProp("size")
  DDELeft: string = '';

  @ValidateProp("size")
  DDERight: string = '';

  get DDEWidth() : string {
    return  '208px';
  }

  get DDEHeight(): string {
    return this.DataType== RFilterDataType.DateType ? "250px" : "210px";
  }

  @ViewChild('openbtn', { read: ElementRef }) private openBtn!: ElementRef;
  @ViewChild('startElement', { read: ElementRef }) private  startElement!: ElementRef;

  @ViewChild('myDropdown', { read: ElementRef}) private mydropDown!: ElementRef;

  private onChanged = (obj: RFilterApplyModel)=>{};
  private onTouched = (obj: RFilterApplyModel)=> {};


  cls!: RCloseService;
  windowObj!: Window;
  
  constructor(private windowHelper: RWindowHelper, private datePipe: DatePipe, 
    private eleRef: ElementRef, private cdr: ChangeDetectorRef){
    super(windowHelper);
    this.cls = RCloseService.GetInstance();
    this.Id = windowHelper.GenerateUniqueId();   
    this.cls.AddInstance(this);
    this.windowObj = inject(WINDOWOBJECT);
  }

  closeDropdown(): void {
    this.IsFilterOpen = false;
    this.cdr.detectChanges();
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
    evt.stopPropagation();
    evt.preventDefault();

    this.IsFilterOpen = !this.IsFilterOpen;
    if(this.IsFilterOpen){
      this.cls.CloseAllPopups(this);
      this.AttachDropdown();
    }
  }

  
  private AttachDropdown() {
    let windowHeight = this.windowObj.innerHeight;

    if (this.openBtn.nativeElement) {

      const exp = /(-?[\d.]+)([a-z%]*)/;
        
      let isInTab = false;
      let element: HTMLElement | null = this.eleRef.nativeElement as HTMLElement;
      let tabTop, tabLeft = 0;
      let  i = 15;

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

      let tabHeight=0, tabWidth = 0;
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
          this.DDEBottom = '120%';
          this.DDETop = 'auto';
        } else {
          this.DDETop = '110%';
          this.DDEBottom = 'auto';
        }
      }

      let windowWidth = this.windowObj.innerWidth;
      if (this.startElement.nativeElement) {
        let start = this.startElement.nativeElement as HTMLElement;
        let res = this.DDEWidth.match(exp);

        if (res) {
          let dropDownWidth = parseFloat(res[1].toString());

          // dropDownWidth = dropDownWidth + padding(left, right) + border + margin;
          dropDownWidth = dropDownWidth + (15 * 2) + (1 * 2) + 0;

          let startPos = start.getBoundingClientRect();

          if ((isInTab && (tabLeft+tabWidth) > dropDownWidth + startPos.left)
            || (!isInTab && windowWidth > dropDownWidth + startPos.left)) {           
            this.DDELeft = '0px';            
          } else {            
            this.DDELeft = '-195px';            
          }
        }

      }
    }
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

    if(this.LessThanNumber != undefined && this.LessThanNumber.toString().trim() ==''){
      this.LessThanNumber = undefined;
    }
    
    if(this.GreaterThanNumber != undefined && this.GreaterThanNumber.toString().trim() ==''){
      this.GreaterThanNumber = undefined;
    }

    if(this.DataType == RFilterDataType.NumberType && this.LessThanNumber){
      isFloatLesser = this.LessThanNumber?.toString().split(".").length > 1
    }
    
    if(this.DataType == RFilterDataType.NumberType && this.GreaterThanNumber){
      isFloatGreater = this.GreaterThanNumber?.toString().split(".").length > 1
    }

    
    if(this.ContainsList == undefined && this.LessThanNumber == undefined && 
      (this.LessThanDate == undefined || this.LessThanDate =='') &&
      this.GreaterThanNumber == undefined && 
      (this.GreaterThanDate == undefined || this.GreaterThanDate ==''))
    {
      this.IsFilteredApplied = false;
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

  
  IsOpen(): boolean {
    return this.IsFilterOpen;
  }

  private windowOnClick($event: Event) {

    this.cls.PrintLog();

    if (this.IsFilterOpen) {
      let i = 15;
      let element = $event.srcElement;
      let sameelementClicked: boolean = false;
      let elementId: string | undefined = undefined;

      while (element != undefined && i > -1) {
        if ((element as HTMLElement).classList.contains('rfilterclose')) {
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
        this.IsFilterOpen = false;
    }
  }

}

