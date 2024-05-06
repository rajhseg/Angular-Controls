import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProgressBarDisplayType, ProgressBarType } from './progressbarType';

@Component({
  selector: 'rprogressbar',
  standalone: true,
  imports: [NgClass, NgStyle, NgIf],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent {

  @Input()
  FloatInCenter: boolean = false;

  @Input()
  EnableBackDrop: boolean = false;

  _foreColor: string = 'rgba(27, 81, 199, 0.692)';

  _trackColor: string = 'rgb(214, 214, 219)';

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

  private _width: string = '500px';

  private _type: ProgressBarType = ProgressBarType.Infinite;
  
  allProgressBarTypes = ProgressBarType;
  allDisplayTypes = ProgressBarDisplayType;
  
  @Input()
  set Type(val: ProgressBarType){
    this._type = val;
  }
  get Type(): ProgressBarType {
    return this._type;
  }

  private _displayType: ProgressBarDisplayType = ProgressBarDisplayType.StraightLine;

  @Input()
  set DisplayType(val: ProgressBarDisplayType){
    this._displayType =val;
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
}
