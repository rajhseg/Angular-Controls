import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BarChartItem, DrawTextItem, PopupChartItem, SpaceBetweenBars } from '../Models/BarChartItem';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rstackedbarchart-horizontal',
  standalone: true,
  imports: [NgIf, NgStyle, NgForOf],
  templateUrl: './rstackedbarchart-horizontal.component.html',
  styleUrl: './rstackedbarchart-horizontal.component.css'
})
export class RStackedBarChartHorizontalComponent {
  
  private _width: number = 300;
  private _height: number = 300;
  
  private _xAxisTitle: string = "";
  private _yAxisTitle: string = "";

  private _textColor: string = "gray";

  @Input()
  public set TextColor(val: string){
    this._textColor = val;
  }
  public get TextColor(): string {
    return this._textColor;
  }

  @Input()
  public set XAxisTitle(val: string){
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

  private _noOfSplitInValueAxis: number = 4;

  @Input()
  public set NoOfSplitInValueAxis(val: number) {

    if (val < 3) {
      val = 3;
    }

    this._noOfSplitInValueAxis = val;
  }
  public get NoOfSplitInValueAxis(): number {
    return this._noOfSplitInValueAxis;
  }


  @Input()
  public set Width(val: number) {
    this._width = val;
  }
  public get Width(): number {
    return this._width;
  }

  private _gapBetweenBars: SpaceBetweenBars = SpaceBetweenBars.OneBar;

  @Input()
  public set GapBetweenBars(val: SpaceBetweenBars) {
    this._gapBetweenBars = val;
    this.RenderBarChart();
  }
  public get GapBetweenBars(): number {
    return this._gapBetweenBars;
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

  private _yAxisItemNames: string[] = [];

  @Input()
  public set yAxisItemNames(val: string[]) {
    if (val == undefined || val == null || val.toString() != this._yAxisItemNames.toString()) {
      this._yAxisItemNames = val;
      this.RenderBarChart();
    }
  }
  public get yAxisItemNames(): string[] {
    return this._yAxisItemNames;
  }

  private _dataListHeight: number = 30;

  @Input()
  public set DataListHeight(val: number) {
    this._dataListHeight = val;
  }
  public get DataListHeight(): number {
    return this._dataListHeight;
  }

  private _columns: BarChartItem[] = [];

  @Input()
  public set Columns(val: BarChartItem[]) {
    if (!this.IsBarItemListEqual(val, this._columns)) {
      this._columns = val;
      this.RenderBarChart();
    }
  }
  public get Columns(): BarChartItem[] {
    return this._columns;
  }

  @ViewChild('rbar', { read: ElementRef<HTMLCanvasElement>, static: false })
  bar: ElementRef<HTMLCanvasElement> | undefined = undefined;

  context: CanvasRenderingContext2D | null = null;

  @Input()
  PopupBackColor: string = "lightgray";

  @Input()
  PopupForeColor: string | undefined = undefined;

  @Input()
  PopupBackgroundOpacity: number = 1;

  PopupItems: PopupChartItem[] = [];

  public IsRendered: boolean = false;

  constructor(private winObj: WindowHelper, private cdr: ChangeDetectorRef) {

  }

  ngAfterViewInit(): void {
    if (this.winObj.isExecuteInBrowser()) {
      if (this.bar != undefined) {
        this.context = this.bar.nativeElement.getContext('2d');
        this.bar.nativeElement.onmousemove = this.MouseMove.bind(this); 
        this.RenderBarChart();
      }
    }
  }

  
  MouseMove(event: MouseEvent) {
    if(this.context && this.bar){            
      this.context?.beginPath();      
      this.context.clearRect(0, 0, this.Width, this.Height);
      this.context.closePath();

      this.RenderBarChart();

      let item = this.MouseOnTopOfItem(event.offsetX, event.offsetY);

      if(item) {      
        let lineItem = item.Item as BarChartItem;
        let x = event.offsetX + 10;
        let y = event.offsetY;
        let met = this.context.measureText(lineItem.Values[item.ValueIndex].toString());
        let met1 = this.context.measureText(this.yAxisItemNames[item.ValueIndex].toString());

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
        this.context.fillText(" "+this.XAxisTitle+" : "+ lineItem.Values[item.ValueIndex], x + 5, y + 15);
        this.context.fillText(" "+this.YAxisTitle+" : "+ this.yAxisItemNames[item.ValueIndex], x + 5, y + 35);

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

  getTextHeight(met: TextMetrics){
    return met.actualBoundingBoxAscent + met.actualBoundingBoxDescent;
  }
  
  getNameIndicator(itm: BarChartItem) {
    return typeof itm.barItemsBackColor === 'string' ? itm.barItemsBackColor : itm.barItemsBackColor.length > 0 ?
      itm.barItemsBackColor[0] : "orangered";
  }

  isPropString(prop: any) {
    return typeof prop === 'string';
  }

  RenderBarChart() {
    this.IsRendered = false;

    if (this.bar && this.context && this.Columns.length > 0 && this.yAxisItemNames.length > 0) {
      let min: number | undefined = undefined;
      let max: number | undefined = undefined;

      let spaceFromRightXAxis = 25;

      var valueList = [];
      for (let index = 0; index < this.yAxisItemNames.length; index++) {
        const element = this.yAxisItemNames[index];

        var itm = 0;

        for (let col = 0; col < this.Columns.length; col++) {
          const clmn = this.Columns[col];

          if (clmn.Values[index] != undefined)
          {
            if(clmn.Values[index] < 0)
              itm = itm - clmn.Values[index];
            else
              itm += clmn.Values[index];
          }
        }

        valueList.push(itm);
      }

      min = this.MinArray(valueList);
      max = this.MaxArray(valueList);

      var distance: number = 0;
      var itemCount = this.yAxisItemNames.length;

      if (min != undefined && max != undefined) {
        distance = (max) / this.NoOfSplitInValueAxis;
      }

      distance = this.GetRoundToTenDigit(distance);

      var MinLimit = 0;
      var MaxLimit = distance * (this.NoOfSplitInValueAxis);

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
      let xTextPoint = (this.Width - this.MarginX)/2 + this.MarginX;
      xTextPoint = xTextPoint - (met.width/2);
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
      yTextPoint = (this.Height - this.MarginY)/2;
      yTextPoint = yTextPoint + (met.width/2);
      xTextPoint = 15;            
      this.context.fillStyle = this.TextColor;
      this.context.translate(xTextPoint, yTextPoint);
      this.context.rotate((Math.PI/180) * 270);
      this.context.fillText(this.YAxisTitle, 0, 0);      
      
      this.context.restore();
      this.context.closePath();      

      /* Draw x axis line */
      let vDistance = (this.Width - this.MarginX - spaceFromRightXAxis) / this.NoOfSplitInValueAxis;

     /* Draw x Axis */
      for (let index = 0; index <= this.NoOfSplitInValueAxis; index++) {
        let xDisplayValue = Math.round(distance * index);
        let xPoint = Math.round(vDistance * index) + this.MarginX;
        this.VerticalLineInXAxis(xPoint, StartY);
        this.DrawVerticalLine(xPoint, StartY);
        this.VerticalLineDisplayValueInXAxis(xDisplayValue.toString(), xPoint, StartY);
      }

      /* Draw the y Axis */
      let maxBarsPerGroup = 1;
      var eachBarGroupLength = (this.Height - this.MarginY) / itemCount;
      var eachBarLength = eachBarGroupLength / (maxBarsPerGroup + this.GapBetweenBars);
      let yPoint = StartY;

      console.log("Horizontal");

      let drawTexts: DrawTextItem[] = [];

      for (let index = 0; index < itemCount; index++) {

        let yAxisName = this.yAxisItemNames[index];

        if (this.GapBetweenBars == 1) {
          yPoint = yPoint - eachBarLength / 2;
        } else {
          yPoint = yPoint - eachBarLength;
        }

        let xPoint = StartX;
        let nameWidth = this.context.measureText(yAxisName);
        let nameHeight = this.getTextHeight(nameWidth);
        let remWidth = eachBarGroupLength - (eachBarLength * this.GapBetweenBars) - nameHeight/2;

        let halfYPoint = remWidth / 2;        

        /* Draw name on yAxis */
        this.DrawYAxisName(yAxisName, this.MarginX - 25 , yPoint - halfYPoint);        

        let previousX: number | undefined = StartX;
        let ComputedValue = 0;
        let halfValueXPoint: number | undefined = undefined;

        for (let x = 0; x < this.Columns.length; x++) {
          const element = this.Columns[x];
          let value = element.Values[index];

          if (value != undefined) {
            
            if(value<0)
              value = -value;

            let x = this.GetXStartPoint(value, distance, itemCount, vDistance, spaceFromRightXAxis);

            let color = typeof element.barItemsBackColor === 'string' ?
              element.barItemsBackColor : element.barItemsBackColor.length > 0 && element.barItemsBackColor[index] ?
                element.barItemsBackColor[index] : "purple";

            /* Draw Bar */
            let diff =  x - (StartX as any) as number; 
            
            if(diff < 0)
              diff = -diff;

            if (previousX != undefined)
               xPoint = previousX;
            
            this.DrawBar(xPoint, yPoint, x, eachBarLength, color);

            this.PopupItems.push(new PopupChartItem(xPoint, yPoint - eachBarLength, xPoint + x, 
              yPoint, element, index, x, color));

            /* Draw Text on top of Bar */
            let valueXpoint = this.getWidthFromString(value.toString());
            let remXWidth = eachBarLength - valueXpoint;

            let foreColor = typeof element.barItemsForeColor === 'string' ?
              element.barItemsForeColor : element.barItemsForeColor.length > 0 && element.barItemsForeColor[index] ?
                element.barItemsForeColor[index] : this.TextColor;

            halfValueXPoint = remXWidth / 2;

            let met = this.context.measureText(value.toString());
            let textHeight = this.getTextHeight(met);
            let yTextOnBar = 0;
            let rotate = false;

            yTextOnBar = (eachBarLength - textHeight)/2;
            
            if(met.width >  x){
              rotate = true;
            }

            if(rotate) {
              drawTexts.push(new DrawTextItem(value.toString(), xPoint + x - 2, yPoint, foreColor, rotate));            
            } else {
              drawTexts.push(new DrawTextItem(value.toString(), xPoint + x - met.width - 3, yPoint - yTextOnBar, foreColor, rotate));            
            }

            ComputedValue += value;
            previousX = xPoint + x;
          }
        }

        /* Draw total value on top of Bar */        
        let met = this.context.measureText(ComputedValue.toString());
        let valheight = this.getTextHeight(met);
        let remXWidth = eachBarLength - valheight;
        let halfValueYPoint = remXWidth / 2;

        if (halfValueYPoint) {
          this.DrawText(ComputedValue.toString(), previousX + 1, yPoint - halfValueYPoint, this.TextColor);
        }

        if (this.GapBetweenBars == 1) {
          yPoint = yPoint - eachBarLength - eachBarLength / 2;
        } else {
          yPoint = yPoint - eachBarLength - eachBarLength;
        }

      }

      for (let index = 0; index < drawTexts.length; index++) {
        const ele = drawTexts[index];
        this.DrawText(ele.value.toString(), ele.x, ele.y, ele.color, ele.rotate);
      }
      
      this.IsRendered = true;
      this.cdr.detectChanges();
    }

  }

  private GetRoundToTenDigit(distance: number) {
    let j = distance / 10;
    let roundedJ = Math.ceil(j);
    distance = roundedJ * 10;

    return distance;
  }

  private GetXStartPoint(displayValue: number, distance: number, itemcount: number, vDistance: number, spaceFromRightXAxis: number) {
    let index = (displayValue / distance);
    let xPoint = Math.round((vDistance * index));
    return xPoint;
  }

  private DrawYAxisName(name: string, xPoint: number, yPoint: number) {
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
      console.log(" startx : "+ startX +" starty: "+startY+ " xdistance: "+xdistance+" yDistance: "+yDistance);
      this.context.beginPath();
      this.context.fillStyle = color;
      this.context.fillRect(startX, startY - yDistance, xdistance, yDistance);
      this.context.fill();
      this.context.closePath();
    }
  }

  private VerticalLineDisplayValueInXAxis(value: string, x: number, ypoint: number) {
    if (this.context) {
      this.context.beginPath();
      let metrics = this.context.measureText(value);

      let StartX = x - metrics.width/2;
      let StartY = ypoint + 15;
      
      this.context.fillStyle = this.TextColor;
      this.context.moveTo(StartX, StartY);
      this.context.fillText(value, StartX, StartY);
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawVerticalLine(x: number, ypoint: number) {
    if (this.context) {
      this.context.beginPath();
      let startY = ypoint;
      let endY = 0;
      this.context.lineWidth = 0.4;
      this.context.strokeStyle = this.TextColor;
      this.context.moveTo(x, startY);
      this.context.lineTo(x, endY);
      this.context.stroke();
      this.context.closePath();
    }
  }

  private VerticalLineInXAxis(x: number, ypoint: number) {
    if (this.context) {
      this.context.beginPath();
      let StartX = x;
      let StartY = ypoint - 5;
      let EndX = x;
      let EndY = ypoint + 5;

      this.context.strokeStyle = this.TextColor;
      this.context.moveTo(StartX, StartY);
      this.context.lineTo(EndX, EndY);

      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawText(text: string, x: number, y: number, forecolor: string, rotate: boolean = false) {
    if (this.context) {
      this.context.beginPath();
      this.context.strokeStyle = forecolor;
      this.context.fillStyle = forecolor;

      if(rotate) {
        this.context.save();
        this.context.translate(x, y);
        this.context.rotate((Math.PI/180) * 270);
        this.context.fillText(text, 0, 0); 
        this.context.restore();
      }
      else {
        this.context.fillText(text, x, y);    
      }

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

  private IsBarItemListEqual(a: BarChartItem[], b: BarChartItem[]) {

    if ((a == null || a == undefined) && (b == null || b == undefined))
      return true;

    if (a == null || b == null || a == undefined || b == undefined)
      return false;

    if (a.length != b.length)
      return false;

    for (let index = 0; index < a.length; index++) {
      let element1 = a[index];
      let element2 = b[index];

      if (element1.DisplayName != element2.DisplayName ||
        element1.barItemsBackColor.toString() != element2.barItemsBackColor.toString() ||
        element1.barItemsForeColor.toString() != element2.barItemsForeColor.toString() ||
        element1.Values.toString() != element2.Values.toString()) {
        return false;
      }
    }

    return true;
  }

}
