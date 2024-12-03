import { ChangeDetectorRef, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { BarChartItem, Graph, PopupChartItem, YSeriesChartItem, GraphSeriesChartItem } from '../Models/BarChartItem';
import { WindowHelper } from '../windowObject';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rserieschart',
  standalone: true,
  imports: [NgIf, NgStyle, NgClass, NgForOf],
  templateUrl: './rserieschart.component.html',
  styleUrl: './rserieschart.component.css'
})
export class RSeriesChartComponent {


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
  }
  public get XAxisTitle(): string {
    return this._xAxisTitle;
  }

  @Input()
  public set YAxisTitle(val: string) {
    this._yAxisTitle = val;
  }
  public get YAxisTitle(): string {
    return this._yAxisTitle;
  }

  private _noOfSplitInXAxis: number = 4;

  @Input()
  public set NoOfSplitInXAxis(val: number) {

    if (val < 3) {
      val = 3;
    }

    this._noOfSplitInXAxis = val;
  }
  public get NoOfSplitInXAxis(): number {
    return this._noOfSplitInXAxis;
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
  }
  public get Height(): number {
    return this._height;
  }

  @Input()
  DataListHeight: number = 50;

  @Input()
  PopupBackColor: string = "lightgray";
  
  @Input()
  PopupForeColor: string | undefined = undefined;

  @Input()
  PopupBackgroundOpacity: number = 1;

  public IsYSeriesChart: boolean = false;

  @Input()
  FillAreaColor: boolean = false;

  private _items: YSeriesChartItem[] | GraphSeriesChartItem[] = [];
  
  @Input()
  public set Items(val: YSeriesChartItem[] | GraphSeriesChartItem[]) {
    if (!this.IsScatterItemListEqual(val, this._items)) {
      this._items = val;
      this.RenderSeriesChart();
    }
  }
  public get Items(): any {
    return this._items;
  }

  @ViewChild('rbar', { read: ElementRef<HTMLCanvasElement>, static: false })
  bar: ElementRef<HTMLCanvasElement> | undefined = undefined;

  context: CanvasRenderingContext2D | null = null;

  PopupItems: PopupChartItem[] = [];

  public IsRendered: boolean = false;

  Id: string = '';
  
  @HostBinding('id')
  HostElementId: string = this.winObj.GenerateUniqueId();

  constructor(private winObj: WindowHelper, private cdr: ChangeDetectorRef) {
    this.Id = this.winObj.GenerateUniqueId();
  }

  ngAfterViewInit(): void {
    if (this.winObj.isExecuteInBrowser()) {
      if (this.bar != undefined) {
        this.context = this.bar.nativeElement.getContext('2d');
        this.bar.nativeElement.onmousemove = this.MouseMove.bind(this);
        this.RenderSeriesChart();
      }
    }
  }

  
  MouseMove(event: MouseEvent) {
    if(this.context && this.bar){            
      this.context?.beginPath();      
      this.context.clearRect(0, 0, this.Width, this.Height);
      this.context.closePath();

      this.RenderSeriesChart();

      let item = this.MouseOnTopOfItem(event.offsetX, event.offsetY);

      if(item) {      
        let lineItem = item.Item as any;
        let x = event.offsetX + 10;
        let y = event.offsetY;
        let yaxisChart = !(lineItem.Values[item.ValueIndex] instanceof Graph);

        let met : TextMetrics | undefined = undefined;
        let met1 : TextMetrics | undefined = undefined;

        if(!this.IsYSeriesChart){
           met = this.context.measureText((lineItem.Values[item.ValueIndex] as Graph).xPoint.toString());
           met1 = this.context.measureText((lineItem.Values[item.ValueIndex] as Graph).yPoint.toString());  
        } else {
           met = this.context.measureText(lineItem.Values[item.ValueIndex].toString());           
        }

        let xtitle = this.context.measureText(this.XAxisTitle);
        let ytitle = this.context.measureText(this.YAxisTitle);

        let w1 = met.width + xtitle.width;
        let w2 = 0;

        if(met1!=undefined)
          w2 = met1.width + ytitle.width;

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

        if(this.IsYSeriesChart) {
          this.context.fillText(" "+this.XAxisTitle+" : "+ lineItem.Values[item.ValueIndex], x + 5, y + 15);
        } else {
          this.context.fillText(" "+this.XAxisTitle+" : "+ (lineItem.Values[item.ValueIndex] as Graph).xPoint, x + 5, y + 15);
          this.context.fillText(" "+this.YAxisTitle+" : "+ (lineItem.Values[item.ValueIndex] as Graph).yPoint, x + 5, y + 35);
        }        

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

  getNameIndicator(itm: BarChartItem) {
    return typeof itm.barItemsBackColor === 'string' ? itm.barItemsBackColor : itm.barItemsBackColor.length > 0 ?
      itm.barItemsBackColor[0] : "orangered";
  }

  isPropString(prop: any) {
    return typeof prop === 'string';
  }

  RenderSeriesChart() {
    this.IsRendered = false;
    
    if (this.bar && this.context && this.Items && this.Items.length > 0) {
      let min: number | undefined = undefined;
      let max: number | undefined = undefined;
      
      this.context.clearRect(0, 0, this.Width, this.Height);      

      let spaceFromTopYAxis = 25;
      let spaceFromRightXAxis = 25;

      if(this.Items[0] instanceof YSeriesChartItem)
        this.IsYSeriesChart = true;

      let xValues: number[] = [];
      let yValues: number[] = [];

      for (let index = 0; index < this.Items.length; index++) {
        
        const element = this.IsYSeriesChart ? 
                  this.Items[index] as YSeriesChartItem : 
                  this.Items[index] as GraphSeriesChartItem;

        let _x = element.Values.map(x => x instanceof Graph ? x.xPoint : 0);
        let _y = element.Values.map(y => y instanceof Graph ? y.yPoint : y);

        xValues = [...xValues, ..._x];
        yValues = [...yValues, ..._y];

      }

      if (xValues && yValues) {

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
        let xmin = this.MinArray(xValues);
        let xmax = this.MaxArray(xValues);
        let xdistance = 0;
        let isYSeriesChart = false;

        if(xmin == 0 && xmax == 0) {
          xdistance = (this.Width - StartX ) / yValues.length;
          isYSeriesChart = true;
        }        
        else if (xmin != undefined && xmax != undefined) {
          xdistance = (xmax) / this.NoOfSplitInXAxis;
        }

        xdistance = this.GetRoundToTenDigit(xdistance);
        let xvDistance = (this.Width - StartX - spaceFromRightXAxis) / this.NoOfSplitInXAxis;
        
        if(xmin == 0 && xmax == 0) {
          xvDistance = (this.Width - StartX ) / (yValues.length/this.Items.length);
        }       

        if(!isYSeriesChart){
          for (let index = 1; index <= this.NoOfSplitInXAxis; index++) {
            let xDisplayValue = xdistance * index;
            let xPoint = (xvDistance * index) + StartX;
            let yPoint = this.Height - this.MarginY;

            this.DrawVerticalLine(xPoint, yPoint);
            this.DrawVerticalLineInXAxis(xPoint, yPoint);
            this.DrawVerticalLineDisplayValueInXAxis(xDisplayValue.toString(), xPoint, yPoint);
          }
        }

        let prevX = undefined;
        let prevY = undefined;

        for (let index = 0; index < this.Items.length; index++) {
          const element = this.Items[index];
          let prevX = undefined;
          let prevY = undefined;
          
          let areaItems: PopupChartItem[] = [];
          
          for (let v = 0; v < element.Values.length; v++) {
            const item = element.Values[v];

            let indx = item instanceof Graph ? item.xPoint / xdistance : item;
            let xPoint = undefined;
            
            if(isYSeriesChart){
              xPoint = StartX +  (xvDistance * (v + 1));
            } else {
              xPoint = xvDistance * indx + StartX;
            }

            let yindx = -(item instanceof Graph ? item.yPoint / ydistance : item/ydistance  ) + this.NoOfSplitInYAxis;
            let yPoint = Math.round((yvDistance * yindx) + spaceFromTopYAxis);
                        
            /* Plot Line */
            if(prevX != undefined && prevY != undefined)
            {
              this.PlotLine(xPoint, yPoint, prevX, prevY, element.ItemColor);
            }
  
            prevX = xPoint;
            prevY = yPoint;

            this.PopupItems.push(new PopupChartItem(xPoint, yPoint, xPoint + this.PlotItemSize,
              yPoint + this.PlotItemSize, element, v, index, element.ItemColor
            ));

            areaItems.push(new PopupChartItem(xPoint, yPoint, xPoint + this.PlotItemSize, 
              yPoint + this.PlotItemSize, element, v, index, element.ItemColor));
            
          }

          /* Draw Area */
          if(areaItems.length > 0 && this.FillAreaColor) {
              
            let x1 = areaItems[0].x1;
            let y1 = areaItems[0].y1;
            let x2 = areaItems[areaItems.length - 1].x1;
            let y2 = areaItems[areaItems.length - 1].y1;
            
            this.context.beginPath();
            this.context.save();
            this.context.globalAlpha = 0.2;
            this.context.fillStyle =  areaItems[0].ItemColor;
            this.context.strokeStyle = areaItems[0].ItemColor;

            this.context.moveTo(x2, y2);
            this.context.lineTo(x2, StartY);
            this.context.stroke();

            this.context.lineTo(x1, StartY);
            this.context.stroke();

            this.context.lineTo(x1, y1);
            this.context.stroke();


            for (let index = 1; index < areaItems.length; index++) {
              const _popup = areaItems[index];
              this.context.lineTo(_popup.x1, _popup.y1);
            }

            this.context.fill();
            this.context.restore();      
            this.context.closePath();      
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
      this.context.save();
      this.context.lineWidth = 0.5;
      this.context.strokeStyle = color;
      this.context.moveTo(prevX, prevY);
      this.context.lineTo(xPoint, yPoint);
      this.context.stroke();
      this.context.restore();
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

  private IsScatterItemListEqual(a: YSeriesChartItem[] | GraphSeriesChartItem[] | null | undefined, b: YSeriesChartItem[] | GraphSeriesChartItem[] |  null | undefined) {

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
        element1.Values.map(x => (x instanceof Graph) ? x.xPoint : x).toString() != element2.Values.map(x => x instanceof Graph ? x.xPoint : x).toString() ||
        element1.Values.map(x => (x instanceof Graph) ? x.yPoint : x).toString() != element2.Values.map(x => x instanceof Graph ? x.yPoint : x).toString()
      ) {
        return false;
      }
    }

    return true;
  }


}
