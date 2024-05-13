import { NgClass, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ProgressBarDisplayType, ProgressBarType } from './progressbarType';

@Component({
  selector: 'rprogressbar',
  standalone: true,
  imports: [NgClass, NgStyle, NgIf],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent implements AfterViewInit {

  @ViewChild('flatitemProgress', {read:ElementRef, static: false})
   stLineElement: ElementRef | undefined = undefined;

  @Input()
  FloatInCenter: boolean = false;

  @Input()
  EnableBackDrop: boolean = false;

  _foreColor: string = 'rgba(27, 81, 199, 0.692)';

  _trackColor: string = 'rgb(214, 214, 219)';

  _straightLineHeight: string = '12px';

  @Input()
  set StraightLineTrackHeight(val: string) {
    this._straightLineHeight = val;
  }
  get StraightLineTrackHeight(){
    return this._straightLineHeight;
  }

  @Input()
  set TrackColor(val: string) {
    this._trackColor = val;
  }
  get TrackColor(){
    return this._trackColor;
  }

  @Input()
  set ForeColor(val: string) {
    this._foreColor = val;
  }
  get ForeColor(){
    return this._foreColor;
  }

  private _type: ProgressBarType = ProgressBarType.Infinite;

  allProgressBarTypes = ProgressBarType;
  allDisplayTypes = ProgressBarDisplayType;

  @Input()
  set Type(val: ProgressBarType){
    this._type = val;

    if(this.DisplayType == ProgressBarDisplayType.StraightLine && val == ProgressBarType.Progress)
    {
      this.RenderStraightLine();
    }
  }
  get Type(): ProgressBarType {
    return this._type;
  }

  private _displayType: ProgressBarDisplayType = ProgressBarDisplayType.StraightLine;

  private _width: string = '100px';

  @Input()
  set DisplayType(val: ProgressBarDisplayType){
    this._displayType =val;

    if(val== ProgressBarDisplayType.StraightLine && this.Type == ProgressBarType.Progress)
    {
      this.RenderStraightLine();
    }
  }
  get DisplayType(): ProgressBarDisplayType {
    return this._displayType;
  }

  @Input()
  set ProgressBarWidth(val: string){
    this._width =val;
  }
  get ProgressBarWidth(): string {
    return this._width;
  }

  get CircleColor(){
    return this.ForeColor+' '+this.TrackColor+' '+this.TrackColor+' '+this.TrackColor;
  }

  _percentage: number = 0.0;

  @Input()
  set Percentage(val: number){
    if(val>=100){
      val=100;
    }

    if(val<=0){
      val = 0;
    }

    this._percentage =val;
    this.RenderStraightLine();
  }
  get Percentage(){
    return this._percentage;
  }

  RenderStraightLine(){
    let _size = this.calculateStraightLineWidth();
    if(this.stLineElement!=undefined){
      this.stLineElement.nativeElement.style.width = _size+'px';
    }
  }

  calculateStraightLineWidth() : number {
    let percentage = this._percentage;
    let _w = this.ProgressBarWidth.split('px')[0];

    if(this.DisplayType==this.allDisplayTypes.StraightLine && this.Type==this.allProgressBarTypes.Progress){
     _w = (parseFloat(_w) * (88/100)).toString();
    }

    if(_w!=undefined && _w!=null){
      let calPercentage = 100;

      let size = parseFloat(_w) * (percentage/calPercentage)
      return size;
    }
    return 0;
  }

  ngAfterViewInit(): void {
    this.calculateStraightLineWidth();
  }

}
