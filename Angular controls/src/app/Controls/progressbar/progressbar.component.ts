import { NgClass, NgIf, NgStyle } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ProgressBarDisplayType, ProgressBarType } from './progressbarType';
import { WINDOWOBJECT, WindowHelper } from '../windowObject';

@Component({
  selector: 'rprogressbar',
  standalone: true,
  imports: [NgClass, NgStyle, NgIf],
  templateUrl: './progressbar.component.html',
  styleUrl: './progressbar.component.css'
})
export class ProgressbarComponent implements AfterViewInit, AfterViewChecked{

  @ViewChild('flatitemProgress', {read:ElementRef, static: false})
   stLineElement: ElementRef | undefined = undefined;

  @ViewChild('procan', {read: ElementRef<HTMLCanvasElement>, static : false})
  progressCanvas: ElementRef<HTMLCanvasElement> | undefined = undefined;

  @ViewChild('textcan',{ read: ElementRef<HTMLCanvasElement>, static: false})
  textCanvas: ElementRef<HTMLCanvasElement> | undefined = undefined;

  context: CanvasRenderingContext2D | null | undefined = null;
  isTypeInit: boolean = false;

  @Input()
  FloatInCenter: boolean = true;

  @Input()
  EnableBackDrop: boolean = false;

  _foreColor: string = 'blue';

  _trackColor: string = 'lightgray';

  _straightLineHeight: string = '16px';

  @Input()
  set StraightLineTrackHeight(val: string) {
    this._straightLineHeight = val;
    this.RenderStraightLine();
  }
  get StraightLineTrackHeight(){
    return this._straightLineHeight;
  }

  _circularLineWidth: string = '15px';

  get LeftPosition(): number {

    if(this.winobj.isExecuteInBrowser()){
      let _w = parseInt(this.ProgressBarWidth.split('px')[0]);
      let adjustLength = _w/2;
      let middlevalue = document.body.clientWidth/2;
      let left = middlevalue-adjustLength;
      return left;
    }

    return 0;
  }

  @Input()
  set CircularLineWidth(val: string){
    this._circularLineWidth = val;
    this.RenderProgressCircle();
  }
  get CircularLineWidth(): string{
    return this._circularLineWidth;
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
    this.isTypeInit = true;

    if(this.DisplayType == ProgressBarDisplayType.StraightLine && val == ProgressBarType.Progress)
    {
      this.RenderStraightLine();
    }


    if(this.DisplayType == ProgressBarDisplayType.Circle && val == ProgressBarType.Progress)
    {
      this.RenderProgressCircle();
    }
  }
  get Type(): ProgressBarType {
    return this._type;
  }

  private _displayType: ProgressBarDisplayType = ProgressBarDisplayType.Circle;

  private _width: string = '';

  @Input()
  set DisplayType(val: ProgressBarDisplayType){
    this._displayType =val;
    this.isTypeInit = true;

    if(val== ProgressBarDisplayType.StraightLine && this.Type == ProgressBarType.Progress)
    {
      this.RenderStraightLine();
    }


    if(val== ProgressBarDisplayType.Circle && this.Type == ProgressBarType.Progress)
    {
      this.RenderProgressCircle();
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

    if(this._width==''){
      return this.DisplayType==this.allDisplayTypes.Circle ? '150px' : '250px';
    }

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

    if(this.Type==this.allProgressBarTypes.Progress && this.DisplayType==this.allDisplayTypes.StraightLine){
      this.RenderStraightLine();
    }

    if(this.Type==this.allProgressBarTypes.Progress && this.DisplayType == this.allDisplayTypes.Circle){
      this.RenderProgressCircle();
    }
  }
  get Percentage(){
    return this._percentage;
  }

  _displayText: string = '';

  @Input()
  set DisplayText(val: string){
    this._displayText = val;
  }
  get DisplayText(): string {
    return this._displayText;
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

    // remove padding and border 4px from track width
    _w = (parseFloat(_w) - 4).toString();

    if(_w != undefined && _w != null) {
      let calPercentage = 100;
      let size = parseFloat(_w) * (percentage/calPercentage)
      return size;
    }

    return 0;
  }

  ngAfterViewInit(): void {
    this.calculateStraightLineWidth();

    if(this.progressCanvas!=undefined){
      this.context = this.progressCanvas.nativeElement.getContext('2d');
      this.RenderProgressCircle();
    }
  }

  RenderProgressCircle(){
    if(this.progressCanvas){
    let per = this.Percentage/100;
    let deg = per * 360.0 * (Math.PI/180);

    let _w = parseInt(this.ProgressBarWidth.split('px')[0]);
    let _linewidth = parseInt(this.CircularLineWidth.split('px')[0]);

    let radius = 0;

    radius = (_w/2) - _linewidth;;

    let a = this.progressCanvas.nativeElement.width/2;
    let b = this.progressCanvas.nativeElement.height/2;

    if(this.context==null){
      this.context = this.progressCanvas?.nativeElement.getContext('2d');
    }

    if(this.context){

      this.context.clearRect(0,0, this.progressCanvas.nativeElement.width, this.progressCanvas.nativeElement.height);
      this.context.restore();

      this.context.beginPath();
      this.context.lineWidth = _linewidth;
      this.context.arc(a,b,radius,0, 2*Math.PI);
      this.context.strokeStyle = this.TrackColor;
      this.context.stroke();
      this.context.closePath();

      this.context?.beginPath();
      this.context.lineWidth = _linewidth;
      this.context?.arc(a,b,radius,0, deg, false);

      console.log('deg '+deg);

      this.context.strokeStyle = this.ForeColor;
      this.context?.stroke();
      this.context.closePath();

      this.progressCanvas.nativeElement.style.transform = "rotate(-90deg)";
      this.progressCanvas.nativeElement.style.opacity = "0.7";

      if(this.textCanvas!=undefined){
        let txtctx = this.textCanvas.nativeElement.getContext('2d');

        if(txtctx!=null){
          txtctx.clearRect(0,0, this.textCanvas.nativeElement.width, this.textCanvas.nativeElement.height);
          txtctx.restore();

          txtctx.beginPath();
          txtctx.fillStyle = this.ForeColor;
          txtctx.font = 'bold 16px Arial, sans-serif';
          let _text = '';

          if(this._displayText == '') {
            _text = this.Percentage.toString()+" / "+"100";
          } else {
            _text = this._displayText;
          }

          let mt = txtctx.measureText(_text);
          let _maxSize = 0;
          let textX = 0;
          let textY = 0;

          if((this.textCanvas.nativeElement.width/2)-_linewidth > mt.width){
            _maxSize = mt.width;
          } else{
            _maxSize = (this.textCanvas.nativeElement.width/2)-_linewidth-5;
          }

          textX = a - (_maxSize/2);
          textY = b + 5;

          if(this.Percentage<10){
            txtctx.fillText(_text, textX, textY, _maxSize);
          } else{
            txtctx.fillText(_text, textX, textY, _maxSize);
          }

          txtctx.closePath();
        }
      }
    }
    }
  }

  constructor(private winobj: WindowHelper){

  }

  ngAfterViewChecked(): void {

    if(this.isTypeInit && this.progressCanvas!=undefined){
      this.context = this.progressCanvas.nativeElement.getContext('2d');
      this.RenderProgressCircle();
    }

    this.isTypeInit = false;
  }

  get InfiniteWidth(): string{
    let _pw = parseInt(this.ProgressBarWidth.split('px')[0]);

    let _w =  _pw - parseInt(this.CircularLineWidth.split('px')[0]);

    if(_pw > 75) {
      _w = _w - 50;
    }

    return (_w) + 'px';
  }

}
