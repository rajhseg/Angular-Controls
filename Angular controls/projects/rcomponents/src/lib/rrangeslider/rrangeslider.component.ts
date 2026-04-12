import { CdkDrag, CdkDragEnd, CdkDragMove, CdkDragRelease, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';
import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Host, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RWindowHelper } from '../rwindowObject';
import { CssUnit, RCssUnitsService, RelativeUnitType } from '../rcss-units.service';
import { RBaseComponent, RRangeSliderData } from '../rmodels/RBaseComponent';


@Component({    
    selector: "rrangeslider",
    standalone: true,
    imports: [CdkDrag, NgStyle, NgIf, DragDropModule],
    templateUrl: "./rrangeslider.component.html",
    styleUrls: ["./rrangeslider.component.css"],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RRangeSliderComponent),
            multi: true
    }]
})
export class RRangeSliderComponent extends RBaseComponent<RRangeSliderData> implements ControlValueAccessor, OnInit {

  public currentDistance2: number = 0;
  private resize: number = 0;

  public Slider2Value: number = 90;

  public Slider1Value: number = 0;

  @ViewChild('slider2', { read: ElementRef }) sliderElement2!: ElementRef;

  @ViewChild('slider1', { read: ElementRef }) sliderElement1!: ElementRef;

  @Input()
  public ShowDecimalValues: boolean = false;

  @Input()
  public MinValue: number = 0;

  @Input()
  public MaxValue: number = 100;

  @Input()
  IsDisplayValue: boolean = true;

  @Input()
  EnablePathColor: boolean = true;

  @Input()
  EnableEmptyPathColor: boolean = true;

  @Input()
  Slider1Color: string = "darkblue";

  @Input()
  Slider2Color: string = "darkblue";

  @Input()
  TrackColor: string = "darkblue";

  @Input()
  EmptyTrackColor: string = "lightblue";

  _sliderBarWidth: string = "200px";
  _sliderBarWidthVM: string = "200px";
  _sliderBarWidthValue: number = 200;
  _totalWidth: string = "240px";

  @Input()
  set SliderBarWidth(val: string) {

    if(this.ele.nativeElement) {
      let sh = this.cssunit.ToPxValue(val, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
      this._sliderBarWidthVM = sh + CssUnit.Px.toString();
      this._totalWidth =  (sh + 40) + CssUnit.Px.toString(); 
      this._sliderBarWidthValue = sh;
    }

    this._sliderBarWidth = val;
  }
  get SliderBarWidth(): string {
    return this._sliderBarWidth;
  }

  _sliderBarHeight: string = "6px";
  
  _sliderBarHeightVM: string ="6px";

  @Input()
  set SliderBarHeight(val: string) {
    if (this.ele.nativeElement) {
      let sh = this.cssunit.ToPxValue(val, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
      if (sh < 2) {
        sh = 2;
      }
      
      this._sliderBarHeightVM = sh + CssUnit.Px.toString();
      this._sliderBarHeight = val;
    }
  }
  get SliderBarHeight(): string {
    return this._sliderBarHeight;
  }

  _sliderMarkerSize: string = "20px";
  _sliderMarkerSizeVM: string = "20px";
  
  @Input()
  set SliderMarkerSize(val: string) {
    if (this.ele.nativeElement) {
      let sh = this.cssunit.ToPxValue(val, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
      if (sh < 12) {
        sh = 12;
      }

      this._sliderMarkerSizeVM = sh + CssUnit.Px.toString();
      this._sliderMarkerSize = val;
    }
  }
  get SliderMarkerSize(): string {
    return this._sliderMarkerSize;
  }

  @Input()
  IsDisplayLabel: boolean = true;

  @Input()
  DisplayLabelFontSize: string = "12px";

  @Input()  
  DisplayLabelColor: string = "#999";

  @Input()
  DisplayLabelFontFamily: string = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

  @Input()
  DisplayValueForeColor: string = "#000";


  private slider2FromStart: boolean = false;
  private slider1FromStart: boolean = false;

  private clickonInitHaveValues: boolean = true;

  public MaxSliderValue: number = 0;

  public MinSliderValue: number = 0;

  onChange: Function = (value: RRangeSliderData) => { };

  onTouch: Function = (value: RRangeSliderData) => { };

  Slider1MarginLeft: string = '';

  Resize1: number = 0;

  currentDistance1: number = 0;
  
  TotalMinWidthOfSlider1: number = 0;

  TotalMaxWidthOfSlider2: number = 0;

  MiddleBarWidth: number = 0;

  constructor(@Host() private ele: ElementRef, winObj: RWindowHelper, private cssunit: RCssUnitsService) {
    super(winObj);
    this.Id = this.winObj.GenerateUniqueId();
  }

  ngOnInit(): void {
    if (this.MaxSliderValue == 0) {
      this.Slider2Value = this.MinValue;
    }
    if(this.MinSliderValue == 0){
      this.Slider1Value = this.MinValue;
    }
  }

  writeValue(obj: RRangeSliderData): void {
    if (obj == null || obj == undefined || obj.FromValue == undefined || obj.ToValue == undefined)
      return;

    if (obj.ToValue != undefined && (obj.ToValue < this.MinValue || obj.ToValue > this.MaxValue)) {
      this.MaxSliderValue = 0;
      this.Slider2Value = 0;
      throw Error("Invalid Value between slider range");
      return;
    }

    if (obj.FromValue !=undefined && (obj.FromValue < this.MinValue || obj.FromValue > this.MaxValue)) {
      this.MinSliderValue = 0;
      this.Slider1Value = 0;
      throw Error("Invalid Value between slider range");
      return;
    }

    let number2 = Number.parseFloat(obj.ToValue.toString());

    let number1 = Number.parseFloat(obj.FromValue.toString());

    this.MinSliderValue = number1;
    this.MaxSliderValue = number2;

    let marker = this.cssunit.ToPxValue(this.SliderMarkerSize, this.ele.nativeElement.parentElement, RelativeUnitType.Width);

    let total2 = this._sliderBarWidthValue - marker + 3;
    let percentage2 = (this.MaxSliderValue - this.MinValue) / (this.MaxValue - this.MinValue);
    let width2 = total2 * percentage2;

    let _dmin = Math.min(width2, total2);
    let _limitMax = this.getMinWidthToMove(marker, _dmin);
   
    this.currentDistance2 = Number.parseFloat(_limitMax.toString());
    
    let total1 = this._sliderBarWidthValue -  marker + 3;
    let percentage1 = (this.MinSliderValue - this.MinValue) / (this.MaxValue - this.MinValue);
    let width1 = total1 * percentage1;
    
    let _min = Math.max(0, width1);
    let _max = this.getMaxWidthToMove(marker, _min);

    this.currentDistance1 = Number.parseFloat(_max.toString());
    
    this.calculateMiddleBar(marker);

    this.Slider1MarginLeft = (this.currentDistance1 + marker -2) + 'px';
   
    if (this.sliderElement1) {
      (this.sliderElement1.nativeElement as HTMLElement).style.transform = `translateX(${this.currentDistance1}px)`;
    }

    if (this.sliderElement2) {
      (this.sliderElement2.nativeElement as HTMLElement).style.transform = `translateX(${this.currentDistance2}px)`;
    }

    if (this.ShowDecimalValues) {
      this.Slider1Value = parseFloat(parseFloat(this.MinSliderValue.toString()).toFixed(2));
      this.Slider2Value = parseFloat(parseFloat(this.MaxSliderValue.toString()).toFixed(2));
    } else {
      this.Slider1Value = parseInt(this.MinSliderValue.toString());
      this.Slider2Value = parseInt(this.MaxSliderValue.toString());
    }

    this.Slider1MarginLeft = (this.currentDistance1 + marker - 2) + 'px';
    this.valueChanged.emit(new RRangeSliderData(this.Slider1Value, this.Slider2Value));
  }

  calculateMiddleBar(marker: number) {
    if(this.currentDistance2 - this.currentDistance1 < 1){
      this.MiddleBarWidth = 0;
    } else {
      this.MiddleBarWidth = this.currentDistance2 - this.currentDistance1 - marker + 4;
    }
  }

  getMarkerTop(): string {
    if (this.ele.nativeElement) {
      let markerHeight = this.cssunit.ToPxValue(this.SliderMarkerSize, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
      let halfSize = markerHeight / 2;
      let sliderHeight = this.cssunit.ToPxValue(this.SliderBarHeight, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
      let top = halfSize - (sliderHeight / 2);
      return "-" + (top + CssUnit.Px.toString());
    }

    return "0px";
  }

  getDisplayValueTop(): string {
    if (this.ele.nativeElement) {
      let sliderHeight = this.cssunit.ToPxValue(this.SliderBarHeight, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
      let top = (sliderHeight / 2);
      top = 8 - top;
      return "-" + (top + CssUnit.Px.toString());
    }

    return "0px";
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  dragStarted1($event: CdkDragStart) {
    this.slider1FromStart = true;
  }

  dragMove1($event: CdkDragMove) {
        
    $event.event.preventDefault();
    $event.event.stopPropagation();

    if (this.slider1FromStart) {
      this.Resize1 = this.currentDistance1;
      this.slider1FromStart = false;
    }    

    let marker = this.cssunit.ToPxValue(this.SliderMarkerSize, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
    
    let total = this._sliderBarWidthValue - marker + 3;
    
    let _dist = this.Resize1 + $event.distance.x;

    let _min = Math.max(0, _dist);
    let _max = this.getMaxWidthToMove(marker, _min);

    this.currentDistance1 = _max;
     
    this.calculateMiddleBar(marker);

    this.Slider1MarginLeft = (this.currentDistance1 + marker -2) + 'px';
    this.AdjustSlider1BasedOnCurrentDistance(total);

    (this.sliderElement1.nativeElement as HTMLElement).style.zIndex = (this.sliderElement2.nativeElement as HTMLElement).style.zIndex + 1;

    (this.sliderElement1.nativeElement as HTMLElement).style.transform = "0px";
    (this.sliderElement1.nativeElement as HTMLElement).style.transform = "translateX(" + this.currentDistance1 + "px)"; 
  }

  private getMinWidthToMove(_marker: number, _max: number){
    let _val = Math.max(this.currentDistance1, _max);
    return _val;
  }

  
  private getMaxWidthToMove(_marker: number, _min: number){
    let _val = Math.min(this.currentDistance2,  _min);
    return _val;
  }

  dragEnded1($event: CdkDragRelease) {
    this.slider1FromStart = false;
  }

  dragStarted($event: CdkDragStart) {
    this.slider2FromStart = true;
  }

  dragMove($event: CdkDragMove) {

    $event.event.preventDefault();
    $event.event.stopPropagation();

    let marker = this.cssunit.ToPxValue(this.SliderMarkerSize, this.ele.nativeElement.parentElement, RelativeUnitType.Width);

    let total = this._sliderBarWidthValue - marker + 3;
    
    if (this.slider2FromStart) {
      this.resize = this.currentDistance2;
      this.slider2FromStart = false;
    }    

    let _max = this.resize + $event.distance.x;
    let _min = Math.min(_max, total);
    let _limitMax = this.getMinWidthToMove(marker, _min);
    this.currentDistance2 = _limitMax;
    
    this.calculateMiddleBar(marker);

    this.Slider1MarginLeft = (this.currentDistance1 + marker - 2) + 'px';

    this.AdjustSlider2BasedOnCurrentDistance(total);

    (this.sliderElement2.nativeElement as HTMLElement).style.zIndex = (this.sliderElement1.nativeElement as HTMLElement).style.zIndex + 1;

    (this.sliderElement2.nativeElement as HTMLElement).style.transform = "0px";
    (this.sliderElement2.nativeElement as HTMLElement).style.transform = "translateX(" + this.currentDistance2 + "px)"; //this.currentDistance+"px";
  }

  clickOnBar($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    let marker = this.cssunit.ToPxValue(this.SliderMarkerSize, this.ele.nativeElement.parentElement, RelativeUnitType.Width);

    let isSilder1: boolean = true;

    if($event.offsetX < this.currentDistance1){
      isSilder1 = true;
    } else {
      isSilder1 = false;
    }

    let total = this._sliderBarWidthValue - marker + 3;

    if(isSilder1) {
      this.currentDistance1 = ($event as MouseEvent).offsetX;

      this.calculateMiddleBar(marker);

      this.Slider1MarginLeft = (this.currentDistance1 + marker -2) + 'px';

      this.AdjustSlider1BasedOnCurrentDistance(total);

      (this.sliderElement1.nativeElement as HTMLElement).style.transform = "0px";
      (this.sliderElement1.nativeElement as HTMLElement).style.transform = "translateX(" + this.currentDistance1 + "px)"; 
    } else {

      this.currentDistance2 = ($event as MouseEvent).offsetX;

      this.calculateMiddleBar(marker);

      this.Slider1MarginLeft = (this.currentDistance1 + marker -2) + 'px';

      this.AdjustSlider2BasedOnCurrentDistance(total);

      (this.sliderElement2.nativeElement as HTMLElement).style.transform = "0px";
      (this.sliderElement2.nativeElement as HTMLElement).style.transform = "translateX(" + this.currentDistance2 + "px)"; 
    }
  
  }
  
  AdjustSlider1BasedOnCurrentDistance(total: number) {

    if (this.currentDistance1 > total) {
      this.currentDistance1 = total;
    }

    if (this.currentDistance1 < 0) {
      this.currentDistance1 = 0;
    }

    this.MinSliderValue = Number.parseInt(((this.currentDistance1 * 100) / total).toString());

    let percentageValue = (((this.MaxValue - this.MinValue) * this.MinSliderValue) / 100) + this.MinValue;

    if (this.ShowDecimalValues) {
      this.Slider1Value = parseFloat(parseFloat(percentageValue.toString()).toFixed(2));
    } else {
      this.Slider1Value = parseInt(percentageValue.toString());
    }

    this.notifyToModel();
  }

  AdjustSlider2BasedOnCurrentDistance(total: number) {

    if (this.currentDistance2 > total) {
      this.currentDistance2 = total;
    }

    if (this.currentDistance2 < 0) {
      this.currentDistance2 = 0;
    }

    this.MaxSliderValue = Number.parseInt(((this.currentDistance2 * 100) / total).toString());

    let percentageValue = (((this.MaxValue - this.MinValue) * this.MaxSliderValue) / 100) + this.MinValue;

    if (this.ShowDecimalValues) {
      this.Slider2Value = parseFloat(parseFloat(percentageValue.toString()).toFixed(2));
    } else {
      this.Slider2Value = parseInt(percentageValue.toString());
    }

    this.notifyToModel();
  }

  notifyToModel() {
    this.onChange(new RRangeSliderData(this.Slider1Value, this.Slider2Value));
    this.onTouch(new RRangeSliderData(this.Slider1Value, this.Slider2Value));
    this.valueChanged.emit(new RRangeSliderData(this.Slider1Value, this.Slider2Value));
  }

  dragEnded($event: CdkDragRelease) {
    
  }
}