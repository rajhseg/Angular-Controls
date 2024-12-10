import { CdkDrag, CdkDragMove, CdkDragRelease, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Host, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rslider',
  standalone: true,
  imports: [CdkDrag, NgStyle, NgIf],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RSliderComponent),
      multi: true
    }
  ]
})
export class RSliderComponent implements ControlValueAccessor, OnInit {

  private offsetLeft: number = 0;
  private additionalSizeToAdd = 3;
  public currentDistance: number = 0;
  private resize: number = 0;

  public RangeValue: number = 0;

  @ViewChild('slider', { read: ElementRef }) sliderElement!: ElementRef;

  @Input()
  public ShowDecimalValues: boolean = false;

  @Input()
  public MinValue: number = 0;

  @Input()
  public MaxValue: number = 100;

  @Output()
  OnValueChanged = new EventEmitter<number>();

  @Input()
  IsDisplayValue: boolean = true;

  @Input()
  EnablePathColor: boolean = true;

  @Input()
  BackgroundColor: string = "blue";

  @Input()
  SliderWidth: number = 200;

  private sliderFromStart: boolean = false;
  private clickonInitHaveValues: boolean = true;

  public SliderValue: number = 0;

  private LeftBoundry: number = this.offsetLeft + this.additionalSizeToAdd + 1;
  private rightBoundary: number = this.LeftBoundry + this.SliderWidth + 20 - 1;

  onChange: Function = (value: number) => { };

  onTouch: Function = (value: number) => { };

  Id: string = '';
  
  @HostBinding('id')
  HostElementId: string = this.winObj.GenerateUniqueId();

  constructor(@Host() private ele: ElementRef, private winObj: WindowHelper) {
    this.Id = this.winObj.GenerateUniqueId();
    this.offsetLeft = (this.ele.nativeElement as HTMLElement).offsetLeft;
    // 12 offsetLeft + 2 + 1 +first position 1 = 16 
    // 16 + 200 = 216 + 20 = 236-1; layerX    
  }

  ngOnInit(): void {
    if (this.SliderValue == 0) {
      this.RangeValue = this.MinValue;
    }
  }

  writeValue(obj: any): void {
    if (obj == null)
      return;

    if (obj < this.MinValue || obj > this.MaxValue) {
      this.SliderValue = 0;
      this.RangeValue = 0;
      throw Error("Invalid Value between slider range");
      return;
    }

    let number = Number.parseFloat(obj);

    this.SliderValue = number;

    let total = this.SliderWidth - 20 + 2;

    let percentage = (this.SliderValue - this.MinValue) / (this.MaxValue - this.MinValue);

    let width = total * percentage;

    this.currentDistance = Number.parseInt(width.toString());

    if (this.sliderElement) {
      (this.sliderElement.nativeElement as HTMLElement).style.transform = `translateX(${this.currentDistance}px)`;
    }

    if (this.ShowDecimalValues) {
      this.RangeValue = parseFloat(parseFloat(this.SliderValue.toString()).toFixed(2));
    } else {
      this.RangeValue = parseInt(this.SliderValue.toString());
    }

    this.OnValueChanged.emit(this.RangeValue);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  dragStarted($event: CdkDragStart) {
    this.sliderFromStart = true;
  }

  clickOnBar($event: MouseEvent) {

    $event.preventDefault();
    $event.stopPropagation();

    let total = this.SliderWidth - 20 + 2;
    this.currentDistance = ($event as MouseEvent).offsetX;

    this.AdjustSlideBasedOnCurrentDistance(total);

    (this.sliderElement.nativeElement as HTMLElement).style.transform = "0px";
    (this.sliderElement.nativeElement as HTMLElement).style.transform = "translateX("+this.currentDistance+"px)"; //this.currentDistance+"px";
  }

  dragMove($event: CdkDragMove) {
    
    $event.event.preventDefault();
    $event.event.stopPropagation();

    let total = this.SliderWidth - 20 + 2;

    if (this.sliderFromStart) {
      this.resize = this.currentDistance;
      this.sliderFromStart = false;
    }

    this.currentDistance = this.resize + $event.distance.x;
    this.AdjustSlideBasedOnCurrentDistance(total);

    (this.sliderElement.nativeElement as HTMLElement).style.transform = "0px";
    (this.sliderElement.nativeElement as HTMLElement).style.transform = "translateX("+this.currentDistance+"px)"; //this.currentDistance+"px";
  }

  AdjustSlideBasedOnCurrentDistance(total: number) {

    if (this.currentDistance > total) {
      this.currentDistance = total;
    }

    if (this.currentDistance < 0) {
      this.currentDistance = 0;
    }

    this.SliderValue = Number.parseInt(((this.currentDistance * 100) / total).toString());

    let percentageValue = (((this.MaxValue - this.MinValue) * this.SliderValue) / 100) + this.MinValue;

    if (this.ShowDecimalValues) {
      this.RangeValue = parseFloat(parseFloat(percentageValue.toString()).toFixed(2));
    } else {
      this.RangeValue = parseInt(percentageValue.toString());
    }

    this.notifyToModel();
  }

  notifyToModel() {
    this.onChange(this.RangeValue);
    this.onTouch(this.RangeValue);
    this.OnValueChanged.emit(this.RangeValue);
  }

  dragEnded($event: CdkDragRelease) {
    // console.log("drag released");
    // console.log($event);

    // let mEvent = ($event.event as MouseEvent);
    // let value = 0;

    // if(mEvent.layerX>this.rightBoundary)
    //   value = this.rightBoundary;
    // else if(mEvent.layerX < this.LeftBoundry)
    //   value = this.LeftBoundry;
    // else
    //   value = mEvent.layerX;

    //this.SliderValue = ((value - this.LeftBoundry) * 100) / (this.rightBoundary - this.LeftBoundry)    
  }
}
