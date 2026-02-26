import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { WindowHelper } from '../windowObject';
import { NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rdonutchart',
  standalone: true,
  imports: [NgStyle, NgForOf, NgIf],
  templateUrl: './rdonutchart.component.html',
  styleUrl: './rdonutchart.component.css'
})
export class RDonutChartComponent implements AfterViewInit {


  @Input()
  FontSize: number = 10;

  @Input()
  TextForeColor: string = 'white';

  @Input()
  RotateTextToInlineAngle: boolean = false;

  @Input()
  ShowTextOnTopOfChartItem: boolean = true;

  @Input()
  MoveTextUpwardsFromCenterInPx: number = 0;

  @Input()
  ChartWidth: number = 200;

  public IsRendered: boolean = false;

  @Input()
  DataListHeight: number = 100;

  @Input()
  ShadowColor: string = 'blue';

  @Input()
  ShadowBlur: number = 10;

  @ViewChild('procan', { read: ElementRef<HTMLCanvasElement>, static: false })
  progressCanvas: ElementRef<HTMLCanvasElement> | undefined = undefined;

  private _items: RRenderDonutChartItem[] = [];

  @Input()
  public Opacity: string = '1';

  private _lineWidth: number = 0;

  public get LineWidth(): number {
    this._lineWidth = (this.ChartWidth / 3) - 12;
    return this._lineWidth;
  }

  @Input()
  public set Items(val: RDonutChartItem[]) {

    this._items = [];

    if (val) {
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        let itm = new RRenderDonutChartItem(element.Value, element.Title, element.BackgroundColor, element.ForeColor);
        this._items.push(itm);
      }

      this.RenderChart();
    }
  }
  public get Items(): RDonutChartItem[] {
    return this._items.map(x => x.ConverToItem());
  }

  context: CanvasRenderingContext2D | null | undefined = null;
  
  Id: string = '';

  @HostBinding('id')
  HostElementId: string = this.winObj.GenerateUniqueId();

  constructor(private winObj: WindowHelper, private cdr: ChangeDetectorRef) {
    this.Id = this.winObj.GenerateUniqueId();
  }

  ngAfterViewInit(): void {
    if (this.winObj.isExecuteInBrowser()) {
      if (this.progressCanvas != undefined) {
        this.context = this.progressCanvas.nativeElement.getContext('2d');
        this.RenderChart();
      }
    }
  }

  GetXYForText(x: number, y: number, length: number, angle: number): { X: number, Y: number } {
    let x2 = x + length * Math.cos(angle);
    let y2 = y + length * Math.sin(angle);
    return { X: x2, Y: y2 };
  }

  DrawText(context: CanvasRenderingContext2D, x: number, y: number, length: number, angle: number, color: string) {
    let rad = (angle * Math.PI) / 180;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + length * rad, y + length * rad);
    context.strokeStyle = color;
    context.stroke();
    context.closePath();
  }

  
  calculateTitleWidth(){
    var names = this.Items.map(x=>x.Title);
    var length = 0;

    if(this.context){
      for (let index = 0; index < names.length; index++) {
        const element = names[index];
        var mText = this.context?.measureText(element);
        if(mText.width > length){
            length = mText.width
        }
      }
    }

    if(length > 0)
      length = length+5;

    return length;
  }

  
  calculateValueWidth(){
    var names = this.Items.map(x=>x.Value.toString());
    var length = 0;

    if(this.context){
      for (let index = 0; index < names.length; index++) {
        const element = names[index];
        var mText = this.context?.measureText(element);
        if(mText.width > length){
            length = mText.width
        }
      }
    }

    if(length > 0)
      length = length+10;
    
    return length;
  }

  RenderChart() {
    this.IsRendered = false;
    if (this.progressCanvas && this.context && this._items.length > 0) {
      //this.context.reset();
      this.context.clearRect(0, 0, this.progressCanvas.nativeElement.width, this.progressCanvas.nativeElement.height);
      //this.context.restore();
      let x = this.ChartWidth / 2;
      let y = this.ChartWidth / 2;
      let radiusLength = (this.ChartWidth / 3) + (this.LineWidth / 2);

      let totalValues = this._items.map(x => x.Value);
      let TotalCount = 0;

      for (let index = 0; index < totalValues.length; index++) {
        const element = totalValues[index];
        TotalCount = TotalCount + element;
      }

      let start = 0 * Math.PI / 180;
      let previousAngle = start;

      for (let index = 0; index < this._items.length; index++) {
        const element = this._items[index];

        let percentage = (element.Value * 100) / TotalCount;
        let end1 = (percentage / 100) * 359.98 * (Math.PI / 180);

        element.Percentage = percentage;
        this.context.fillStyle = element.BackgroundColor;
        this.context?.beginPath();
        this.context.lineWidth = this.LineWidth;

        this.context?.arc(x, y, this.ChartWidth / 3, previousAngle, (previousAngle + end1), false);
        this.context.strokeStyle = element.BackgroundColor;

        this.context.shadowBlur = this.ShadowBlur;
        this.context.shadowColor = this.ShadowColor;
        this.context?.stroke();
        this.context.closePath();

        if (this.ShowTextOnTopOfChartItem) {
          let endAngle = previousAngle + end1;
          let avgAngle = (previousAngle + (endAngle > previousAngle ? endAngle : endAngle + ((Math.PI * 359.58) / 180))) / 2;

          let metrics = this.context.measureText(element.Title);
          let textRadiusLength = radiusLength - metrics.width - 5 + this.MoveTextUpwardsFromCenterInPx;

          let pos = this.GetXYForText(x, y, textRadiusLength, avgAngle);

          this.context.beginPath();

          this.context.save();
          this.context.textAlign = "center";
          this.context.textBaseline = "middle";

          this.context.translate(pos.X, pos.Y);

          if (this.RotateTextToInlineAngle) {
            this.context.rotate(avgAngle);
          } else {
            this.context.rotate(Math.PI / 2);
          }

          this.context.font = this.FontSize + 'px verdana';
          this.context.fillStyle = this.TextForeColor;
          this.context.fillText(element.Title, 0, 0);

          this.context.stroke();
          this.context.restore();
          this.context.closePath();

        }

        previousAngle = previousAngle + end1;
      }

      this.progressCanvas.nativeElement.style.transform = "rotate(-90deg)";
      this.progressCanvas.nativeElement.style.opacity = this.Opacity;

      this.IsRendered = true;
      this.cdr.detectChanges();
    }
  }

}

export class RDonutChartItem {
  constructor(
    public Value: number,
    public Title: string,
    public BackgroundColor: string,
    public ForeColor: string) {

  }
}

export class RRenderDonutChartItem extends RDonutChartItem {
  public Percentage: number = 0;

  ConvertToRenderItem(item: RDonutChartItem) {
    this.Value = item.Value;
    this.Title = item.Title;
    this.BackgroundColor = item.BackgroundColor;
    this.ForeColor = item.ForeColor;
  }

  ConverToItem(): RDonutChartItem {
    return new RDonutChartItem(this.Value, this.Title, this.BackgroundColor, this.ForeColor);
  }
}
