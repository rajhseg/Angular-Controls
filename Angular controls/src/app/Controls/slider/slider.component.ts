import { CdkDrag, CdkDragMove, CdkDragRelease, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, Host, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rslider',
  standalone: true,
  imports: [CdkDrag, NgStyle, NgIf],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> RSliderComponent),
      multi: true
    }
  ]
})
export class RSliderComponent implements ControlValueAccessor {

  private offsetLeft: number = 0;
  private additionalSizeToAdd = 3;
  public currentDistance: number = 0;
  private resize: number = 0;

  @ViewChild('slider', {read: ElementRef}) sliderElement!: ElementRef;

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

  public SliderValue: number = 0;

  private LeftBoundry: number = this.offsetLeft + this.additionalSizeToAdd + 1;
  private rightBoundary: number = this.LeftBoundry + this.SliderWidth + 20 - 1;

  onChange: Function = (value: number)=>{};

  onTouch: Function = (value: number) => {};

  constructor(@Host() private ele: ElementRef) {
    this.offsetLeft = (this.ele.nativeElement as HTMLElement).offsetLeft;
    // 12 offsetLeft + 2 + 1 +first position 1 = 16 
    // 16 + 200 = 216 + 20 = 236-1; layerX
  }

  writeValue(obj: any): void {
    if(obj==null)
      return;

    let number = Number.parseInt(obj);

    this.SliderValue = number;

    let total = this.SliderWidth - 20 + 2;

    let width = (total * this.SliderValue)/ 100;
    
    this.currentDistance = Number.parseInt(width.toString());

    if(this.sliderElement){
      (this.sliderElement.nativeElement as HTMLElement).style.transform = `translateX(${this.currentDistance}px)`;
    }

    this.notifyToUI();
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

  dragMove($event: CdkDragMove) {

    let total = this.SliderWidth - 20 + 2;

    if (this.sliderFromStart) {
      this.resize = this.currentDistance;
      this.sliderFromStart = false;
    }

    this.currentDistance = this.resize + $event.distance.x;

    if (this.currentDistance > total) {
      this.currentDistance = total;
    }

    if (this.currentDistance < 0) {
      this.currentDistance = 0;
    }

    this.SliderValue = Number.parseInt(((this.currentDistance * 100) / total).toString());

    this.notifyToUI();

  }

  notifyToUI(){
    this.onChange(this.SliderValue);
    this.onTouch(this.SliderValue);
    this.OnValueChanged.emit(this.SliderValue);
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
