import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LineChartItem, PopupChartItem } from '../Models/BarChartItem';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rlinechart-vertical',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, NgClass],
  templateUrl: './rlinechart-vertical.component.html',
  styleUrl: './rlinechart-vertical.component.css'
})
export class RLineChartVerticalComponent implements AfterViewInit {

  
  private _width: number = 300;
  private _height: number = 300;

  private _xAxisTitle: string = "";
  private _yAxisTitle: string = "";

  private _textColor: string = "gray";

  @Input()
  PlotItemSize: number = 3;

  @Input()
  public set TextColor(val: string) {
    this._textColor = val;
  }
  public get TextColor(): string {
    return this._textColor;
  }

  @Input()
  public set XAxisTitle(val: string) {
    this._xAxisTitle = val;
    this.RenderLineChart();
  }
  public get XAxisTitle(): string {
    return this._xAxisTitle;
  }

  @Input()
  public set YAxisTitle(val: string) {
    this._yAxisTitle = val;
    this.RenderLineChart();
  }
  public get YAxisTitle(): string {
    return this._yAxisTitle;
  }

  private _xAxisItemNames: string[] = [];

  @Input()
  public set xAxisItemNames(val: string[]){
    if (val == undefined || val == null || val.toString() != this._xAxisItemNames.toString()) {
      this._xAxisItemNames = val;
      this.RenderLineChart();
    }    
  }
  public get xAxisItemNames(): string[] {
    return this._xAxisItemNames;
  }

  public get NoOfSplitInXAxis(): number {
    return this._xAxisItemNames.length;
  }

  private _noOfSplitInYAxis: number = 4;

  @Input()
  public set NoOfSplitInYAxis(val: number) {
    this._noOfSplitInYAxis = val;
  }
  public get NoOfSplitInYAxis(): number {
    return this._noOfSplitInYAxis;
  }

  @Input()
  public set Width(val: number) {
    this._width = val;
    this.RenderLineChart();
  }
  public get Width(): number {
    return this._width;
  }

  private _marginX: number = 50;

  @Input()
  public set MarginX(val: number) {
    this._marginX = val;
  }
  public get MarginX(): number {
    return this._marginX;
  }


  private _marginY: number = 50;

  @Input()
  public set MarginY(val: number) {
    this._marginY = val;
  }
  public get MarginY(): number {
    return this._marginY;
  }

  @Input()
  public set Height(val: number) {
    this._height = val;
    this.RenderLineChart();
  }
  public get Height(): number {
    return this._height;
  }

  PopupItems: PopupChartItem[] = [];

  @Input()
  DataListHeight: number = 50;

  @Input()
  PopupBackColor: string = "lightgray";
  
  @Input()
  PopupForeColor: string | undefined = undefined;

  @Input()
  PopupBackgroundOpacity: number = 1;

  private _items: LineChartItem[] = [];

  @Input()
  public set Items(val: LineChartItem[]) {
    if (!this.IsLineItemListEqual(val, this._items)) {
      this._items = val;
      this.RenderLineChart();
    }
  }
  public get Items(): LineChartItem[] {
    return this._items;
  }

  @ViewChild('rbar', { read: ElementRef<HTMLCanvasElement>, static: false })
  bar: ElementRef<HTMLCanvasElement> | undefined = undefined;

  context: CanvasRenderingContext2D | null = null;

  public IsRendered: boolean = false;

  constructor(private winObj: WindowHelper, private cdr: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    if (this.winObj.isExecuteInBrowser()) {
      if (this.bar != undefined) {
        this.context = this.bar.nativeElement.getContext('2d');   
        this.bar.nativeElement.onmousemove = this.MouseMove.bind(this);     
        this.RenderLineChart();
      }
    }
  }

  MouseMove(event: MouseEvent) {
    if(this.context && this.bar){            
      this.context?.beginPath();      
      this.context.clearRect(0, 0, this.Width, this.Height);
      this.context.closePath();

      this.RenderLineChart();

      let item = this.MouseOnTopOfItem(event.offsetX, event.offsetY);

      if(item) {
        
        let lineItem = item.Item as LineChartItem;
        let x = event.offsetX + 10;
        let y = event.offsetY;
        let met = this.context.measureText(lineItem.Values[item.ValueIndex].toString());
        let met1 = this.context.measureText(this.xAxisItemNames[item.ValueIndex]);

        let xtitle = this.context.measureText(this.XAxisTitle);
        let ytitle = this.context.measureText(this.YAxisTitle);

        let w1 = met.width + xtitle.width;
        let w2 = met1.width + ytitle.width;

        let width = Math.max(w1, w2);

        let textWidth =  25 + width;

        if(x + textWidth > this.Width) {          
          x = x - textWidth - 20;
        }
          
        let height = 40;
        if(y + height > this.Height) {
          y = y - height;
        }

        this.context.beginPath();
        this.context.save();
        this.context.globalAlpha = this.PopupBackgroundOpacity;
        this.context.fillStyle = this.PopupBackColor;
        this.context.rect(x, y, textWidth, 40); 
        this.context.fill();
        this.context.restore();
        this.context.closePath();

        this.context.beginPath();            
        this.context.save();
        
        this.context.strokeStyle = this.PopupForeColor ?? item.ItemColor;
        this.context.fillStyle = this.PopupForeColor ?? item.ItemColor;
        this.context.fillText(" "+this.XAxisTitle+" : "+ this.xAxisItemNames[item.ValueIndex], x + 5, y + 15);
        this.context.fillText(" "+this.YAxisTitle+" : "+ lineItem.Values[item.ValueIndex], x + 5, y + 35);           
        this.context.stroke();
        
        this.context.restore();
        this.context?.closePath();            
      }
    }
  }

  MouseOnTopOfItem(x: number, y: number): PopupChartItem | undefined {

    let boundaryRange = 3;

    for (let index = 0; index < this.PopupItems.length; index++) {
      const element = this.PopupItems[index];
      if(x>= element.x1 - boundaryRange && x<= element.x2 + boundaryRange 
        && y>= element.y1 - boundaryRange && y <= element.y2 + boundaryRange){
        return element;
      }
    }

    return undefined;
  }

  getWidthFromString(value: string): number {
    if (this.context) {
      let metrics = this.context.measureText(value);
      return metrics.width;
    }

    return 50;
  }

  getTextHeight(met: TextMetrics) {
    return met.actualBoundingBoxAscent + met.actualBoundingBoxDescent;
  }

  isPropString(prop: any) {
    return typeof prop === 'string';
  }

  RenderLineChart() {
    this.IsRendered = false;
    this.PopupItems = [];

    if (this.bar && this.context && this.Items && this.Items.length > 0) {
      let min: number | undefined = undefined;
      let max: number | undefined = undefined;
      this.context.clearRect(0, 0, this.Width, this.Height);
      
      let spaceFromTopYAxis = 25;
      let spaceFromRightXAxis = 25;
      
      let yValues: number[] = [];

      for (let index = 0; index < this.Items.length; index++) {
        const element = this.Items[index];        
        let _y = element.Values.map(y => y);        
        yValues = [...yValues, ..._y];
      }

      if (yValues) {

        min = this.MinArray(yValues);
        max = this.MaxArray(yValues);

        let ydistance = 0;
        if (min != undefined && max != undefined) {
          ydistance = (max) / this.NoOfSplitInYAxis;
        }

        ydistance = this.GetRoundToTenDigit(ydistance);

        var MinLimit = 0;
        var MaxLimit = ydistance * (this.NoOfSplitInYAxis);

        var StartX: number = this._marginX;
        var StartY: number = this.Height - this._marginY;

        /* Draw Vertical Line */
        this.context.beginPath();
        this.context.moveTo(StartX, StartY);
        this.context.lineTo(StartX, 0);
        this.context.strokeStyle = this.TextColor;
        this.context.stroke();

        /* Draw Horizontal Line */
        this.context.moveTo(StartX, StartY);
        this.context.lineTo(this.Width, StartY);
        this.context.strokeStyle = this.TextColor;
        this.context.stroke();
        this.context.closePath();


        /* Draw Title on x-axis */
        this.context.beginPath();

        let met = this.context.measureText(this.XAxisTitle);
        let xTextPoint = (this.Width - this.MarginX) / 2 + this.MarginX;
        xTextPoint = xTextPoint - (met.width / 2);
        let yTextPoint = this.Height - 10;

        this.context.save();
        this.context.fillStyle = this.TextColor;
        this.context.fillText(this.XAxisTitle, xTextPoint, yTextPoint);
        this.context.restore();

        this.context.closePath();

        /* Draw Title On Y axis */
        this.context.beginPath();
        this.context.save();

        met = this.context.measureText(this.XAxisTitle);
        yTextPoint = (this.Height - this.MarginY) / 2;
        yTextPoint = yTextPoint + (met.width / 2);
        xTextPoint = 15;
        this.context.fillStyle = this.TextColor;
        this.context.translate(xTextPoint, yTextPoint);
        this.context.rotate((Math.PI / 180) * 270);
        this.context.fillText(this.YAxisTitle, 0, 0);

        this.context.restore();
        this.context.closePath();


        /* Draw y axis line */
        let yvDistance = (StartY - spaceFromTopYAxis) / this.NoOfSplitInYAxis;

        /* Draw Y Axis */
        for (let index = 0; index <= this.NoOfSplitInYAxis; index++) {
          let yDisplayValue = Math.round(ydistance * (this.NoOfSplitInYAxis - index));
          let yPoint = Math.round((yvDistance * index) + spaceFromTopYAxis);

          this.HorizontalLineInYAxis(StartX, yPoint);
          this.DrawHorizontalLine(StartX, yPoint);
          this.HorizontalLineDisplayValueInYAxis(yDisplayValue.toString(), StartX, yPoint);
        }

        /* Draw X Axis Line */        
        let xdistance = 0;        
        xdistance = (this.Width - this.MarginX - spaceFromRightXAxis) / this.NoOfSplitInXAxis;
        
        xdistance = this.GetRoundToTenDigit(xdistance);
        let xvDistance = (this.Width - StartX - spaceFromRightXAxis) / this.NoOfSplitInXAxis;

        for (let index = 0; index < this.NoOfSplitInXAxis; index++) {
          let xDisplayValue = this.xAxisItemNames[index];
          let xPoint = ( xvDistance * (index +1) ) + StartX;
          let yPoint = this.Height - this.MarginY;

          this.DrawVerticalLine(xPoint, yPoint);
          this.DrawVerticalLineInXAxis(xPoint, yPoint);
          this.DrawVerticalLineDisplayValueInXAxis(xDisplayValue.toString(), xPoint, yPoint);
        }


        for (let index = 0; index < this.Items.length; index++) {
          const element = this.Items[index];

          let prevX = undefined;
          let prevY = undefined;
  
          for (let v = 0; v < element.Values.length; v++) {
            const item = element.Values[v];
            
            let xPoint = xvDistance * (v + 1) + this.MarginX;

            let yindx = -(item / ydistance) + this.NoOfSplitInYAxis;
            let yPoint = Math.round((yvDistance * yindx) + spaceFromTopYAxis);

            /* Plot Circle */
            this.Plot(xPoint, yPoint, element.ItemColor);

            this.PopupItems.push(new PopupChartItem(xPoint, yPoint, xPoint + this.PlotItemSize, 
                  yPoint + this.PlotItemSize, element, v, index, element.ItemColor));

            /* Plot Line */
            if(prevX != undefined && prevY != undefined)
            {
              this.PlotLine(xPoint, yPoint, prevX, prevY, element.ItemColor);
            }

            prevX = xPoint;
            prevY = yPoint;
          }

        }

      }

      this.IsRendered = true;
      this.cdr.detectChanges();
    }
  }

  private PlotLine(xPoint: number, yPoint: number, prevX: number, prevY: number, color: string){
    if(this.context){
      this.context.beginPath();
      this.context.strokeStyle = color;
      this.context.moveTo(prevX, prevY);
      this.context.lineTo(xPoint, yPoint);
      this.context.stroke();
      this.context.closePath();
    }
  }

  private Plot(x: number, y: number, color: string) {
    if (this.context) {
      this.context.beginPath();
      this.context.strokeStyle = color;
      this.context.fillStyle = color;
      this.context.ellipse(x, y, this.PlotItemSize, this.PlotItemSize, 0, 0, 2 * Math.PI);
      this.context.stroke();
      this.context.fill();
      this.context.closePath();      
    }
  }

  private DrawVerticalLine(xPoint: number, yPoint: number) {
    if (this.context) {
      this.context.beginPath();
      this.context.lineWidth = 0.2;
      this.context.strokeStyle = this.TextColor;
      this.context.moveTo(xPoint, yPoint);
      this.context.lineTo(xPoint, 0);
      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawVerticalLineDisplayValueInXAxis(value: string, xPoint: number, yPoint: number) {
    if (this.context) {
      this.context.beginPath();

      let met = this.context.measureText(value);
      let endY: number = yPoint + 15;

      this.context.fillStyle = this.TextColor;
      this.context.fillText(value, (xPoint - (met.width / 2)), endY);
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawVerticalLineInXAxis(xPoint: number, yPoint: number) {
    if (this.context) {
      this.context.beginPath();
      let startY: number = yPoint - 5;
      let endY: number = yPoint + 5;
      this.context.lineWidth = 1;
      this.context.strokeStyle = this.TextColor;
      this.context.moveTo(xPoint, startY);
      this.context.lineTo(xPoint, endY);
      this.context.stroke();
      this.context.closePath();
    }
  }

  private GetRoundToTenDigit(distance: number) {
    let j = distance / 10;
    let roundedJ = Math.ceil(j);
    distance = roundedJ * 10;

    return distance;
  }

  private GetYStartPoint(displayValue: number, distance: number, itemcount: number, vDistance: number, spaceFromTopYAxis: number) {
    let index = -(displayValue / distance) + this.NoOfSplitInXAxis;
    let yPoint = Math.round((vDistance * index) + spaceFromTopYAxis);
    return yPoint;
  }

  private DrawXAxisName(name: string, xPoint: number, yPoint: number) {
    if (this.context) {
      let startY = yPoint;
      this.context.beginPath
      this.context.moveTo(xPoint, startY);
      this.context.fillStyle = this.TextColor;
      this.context.fillText(name, xPoint, startY);
      this.context.fill();
      this.context.strokeStyle = this.TextColor;
      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawBar(startX: number, startY: number, xdistance: number, yDistance: number, color: string) {
    if (this.context) {
      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.fillRect(startX, startY, xdistance, yDistance);
      this.context.fill();
      this.context.closePath();
    }
  }

  private HorizontalLineDisplayValueInYAxis(value: string, x: number, ypoint: number) {
    if (this.context) {
      this.context.beginPath();
      let metrics = this.context.measureText(value);

      let StartX = x - 7 - metrics.width;
      let StartY = ypoint + 3;
      let EndX = x - 7;
      let EndY = ypoint;

      this.context.fillStyle = this.TextColor;
      this.context.moveTo(StartX, StartY);
      this.context.fillText(value, StartX, StartY);
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawHorizontalLine(x: number, ypoint: number) {
    if (this.context) {
      this.context.beginPath();
      let startX = x;
      let endX = x + this.Width - this._marginX;
      this.context.lineWidth = 0.2;
      this.context.strokeStyle = this.TextColor;
      this.context.moveTo(startX, ypoint);
      this.context.lineTo(endX, ypoint);
      this.context.stroke();
      this.context.closePath();
    }
  }

  private HorizontalLineInYAxis(x: number, ypoint: number) {
    if (this.context) {
      this.context.beginPath();
      let StartX = x - 5;
      let StartY = ypoint;
      let EndX = x + 5;
      let EndY = ypoint;

      this.context.strokeStyle = this.TextColor;
      this.context.moveTo(StartX, StartY);
      this.context.lineTo(EndX, EndY);

      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawText(text: string, x: number, y: number, forecolor: string, rotate: number | undefined = undefined) {
    if (this.context) {
      this.context.beginPath();
      this.context.strokeStyle = forecolor;
      this.context.fillStyle = forecolor;
      this.context.fillText(text, x, y);
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
    }
  }

  private MinArray(array: number[]): number {
    return array.reduce((x, y) => {
      return x < y ? x : y;
    });
  }

  private MaxArray(array: number[]): number {
    return array.reduce((x, y) => {
      return x > y ? x : y;
    })
  }

  private IsLineItemListEqual(a: LineChartItem[] | null | undefined, b: LineChartItem[] | null | undefined) {

    if ((a == null || a == undefined) && (b == null || b == undefined))
      return true;

    if (a == null || b == null || a == undefined || b == undefined)
      return false;

    if (a.length != b.length)
      return false;

    for (let index = 0; index < a.length; index++) {
      let element1 = a[index];
      let element2 = b[index];

      if (element1.ItemName != element2.ItemName || element1.ItemColor != element2.ItemColor ||
        element1.Values.map(x => x).toString() != element2.Values.map(x => x).toString()) {
          return false;
      }
    }

    return true;
  }

}
