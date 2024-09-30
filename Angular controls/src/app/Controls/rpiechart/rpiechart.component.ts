import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { WindowHelper } from '../windowObject';
import { NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rpiechart',
  standalone: true,
  imports: [NgStyle, NgForOf, NgIf],
  templateUrl: './rpiechart.component.html',
  styleUrl: './rpiechart.component.css'
})
export class RPieChartComponent implements AfterViewInit {

  @Input()
  ChartWidth: number = 200;

  public IsRendered: boolean = false;

  @Input()
  DataListHeight: number = 100;

  @Input()
  ShadowColor: string = 'blue';

  @ViewChild('procan', { read: ElementRef<HTMLCanvasElement>, static: false })
  progressCanvas: ElementRef<HTMLCanvasElement> | undefined = undefined;

  private _items: RRenderPieChartItem[] = [];

  @Input()
  public Opacity: string = '1';

  private _lineWidth: number = 0;
  
  public get LineWidth(): number {
    this._lineWidth = (this.ChartWidth/3)- 12 ;
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

  GetXYForText(x: number, y: number, length: number, angle: number): {X: number, Y: number} {    
    let x2 = x + length * Math.cos(angle);
    let y2 = y + length * Math.sin(angle);
    return {X: x2, Y: y2};
  }

  RenderChart() {
    this.IsRendered = false;
    if (this.progressCanvas && this.context && this._items.length > 0) {

      this.context.clearRect(0, 0, this.progressCanvas.nativeElement.width, this.progressCanvas.nativeElement.height);
      this.context.restore();
      let x = this.ChartWidth / 2;
      let y = this.ChartWidth / 2;

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
        let end1 = (percentage/100 ) * 359.98 * (Math.PI / 180);

        element.Percentage = percentage;
        this.context.fillStyle = element.BackgroundColor;
        this.context?.beginPath();
        this.context.lineWidth = this.LineWidth;
                
        this.context?.arc(x, y, this.ChartWidth / 3, previousAngle, (previousAngle + end1), false);                        
        this.context.strokeStyle = element.BackgroundColor;
                
        this.context.shadowBlur = 10;
        this.context.shadowColor = this.ShadowColor;
        this.context?.stroke();
        this.context.closePath();
                
        let pos = this.GetXYForText(x, y, 70, (previousAngle));        
        
        // this.context.fillText(element.Title, pos.X, pos.Y);
        // this.context.fillStyle = element.ForeColor;
        // this.context.save();
        // this.context.restore();
        
        previousAngle = previousAngle + end1;
      }
                
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
