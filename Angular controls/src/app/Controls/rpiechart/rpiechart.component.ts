import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { WindowHelper } from '../windowObject';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rpiechart',
  standalone: true,
  imports: [NgStyle, NgClass, NgForOf, NgIf],
  templateUrl: './rpiechart.component.html',
  styleUrl: './rpiechart.component.css'
})
export class RPieChartComponent {

  @Input()
  FontSize: number = 10;

  @Input()
  TextForeColor: string = 'white';

  @Input()
  LineColorBetweenBars: string = 'white';

  @Input()
  RotateTextToInlineAngle: boolean = false;

  @Input()
  ShowTextOnTopOfChartItem: boolean = true;

  @Input()
  MoveTextUpwardsFromCenterInPx: number = 0 ;

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

  private _items: RRenderPieChartItem[] = [];

  @Input()
  public Opacity: string = '1';

  private _lineWidth: number = 0;

  public get LineWidth(): number {
    this._lineWidth = (this.ChartWidth / 3) - 12;
    return this._lineWidth;
  }

  @Input()
  public set Items(val: RPieChartItem[]) {

    this._items = [];

    if (val) {
      for (let index = 0; index < val.length; index++) {
        const element = val[index];
        let itm = new RRenderPieChartItem(element.Value, element.Title, element.BackgroundColor, element.ForeColor);
        this._items.push(itm);
      }

      this.RenderChart();
    }
  }
  public get Items(): RPieChartItem[] {
    return this._items.map(x => x.ConverToItem());
  }

  context: CanvasRenderingContext2D | null | undefined = null;

  constructor(private winObj: WindowHelper) {

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

  RenderChart() {
    this.IsRendered = false;
    if (this.progressCanvas && this.context && this._items.length > 0) {
      this.context.reset();
      this.context.clearRect(0, 0, this.progressCanvas.nativeElement.width, this.progressCanvas.nativeElement.height);
      this.context.restore();
      let x = this.ChartWidth / 2;
      let y = this.ChartWidth / 2;
      let radius = this.ChartWidth / 2;

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
        let end1 = (percentage / 100) * 359.85 * (Math.PI / 180);

        element.Percentage = percentage;
        this.context.fillStyle = element.BackgroundColor;
        this.context?.beginPath();
        this.context.lineWidth = 2;

        this.context.moveTo(x, y);
        this.context?.arc(x, y, radius - 10, previousAngle, (previousAngle + end1), false);
        this.context.fillStyle = element.BackgroundColor; 
        this.context.lineWidth = 0.4;       
        this.context.strokeStyle = this.LineColorBetweenBars;
        this.context.shadowBlur = this.ShadowBlur;
        this.context.shadowColor = this.ShadowColor;

        this.context.fill();
        this.context?.stroke();
        this.context.closePath();

        if (this.ShowTextOnTopOfChartItem) {
          let endAngle = previousAngle + end1;
          let avgAngle = (previousAngle + (endAngle > previousAngle ? endAngle : endAngle + ((Math.PI * 359.58) / 180))) / 2;

          let metrics = this.context.measureText(element.Title);
          let textRadiusLength = radius - metrics.width - 5 + this.MoveTextUpwardsFromCenterInPx;

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

      this.context.beginPath();
      this.context.moveTo(x, y);
      this.context.lineTo(x + x - 10, y);      
      this.context.lineWidth = 0.4;
      this.context.strokeStyle = this.LineColorBetweenBars;
      this.context.shadowBlur = 10;
      this.context.shadowColor = this.ShadowColor;
      this.context.stroke();
      this.context.fill();
      this.context.closePath();

      this.progressCanvas.nativeElement.style.transform = "rotate(-90deg)";
      this.progressCanvas.nativeElement.style.opacity = this.Opacity;

      this.IsRendered = true;
    }
  }

}



export class RPieChartItem {
  constructor(
    public Value: number,
    public Title: string,
    public BackgroundColor: string,
    public ForeColor: string) {

  }
}

export class RRenderPieChartItem extends RPieChartItem {
  public Percentage: number = 0;

  ConvertToRenderItem(item: RPieChartItem) {
    this.Value = item.Value;
    this.Title = item.Title;
    this.BackgroundColor = item.BackgroundColor;
    this.ForeColor = item.ForeColor;
  }

  ConverToItem(): RPieChartItem {
    return new RPieChartItem(this.Value, this.Title, this.BackgroundColor, this.ForeColor);
  }
}
