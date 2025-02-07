import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { BarChartItem, DrawTextItem, PopupChartItem, SpaceBetweenBars } from '../Models/BarChartItem';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rstackedrangebarchart-vertical',
  standalone: true,
  imports: [NgIf, NgStyle, NgForOf],
  templateUrl: './rstackedrangebarchart-vertical.component.html',
  styleUrl: './rstackedrangebarchart-vertical.component.css'
})
export class RStackedRangeBarChartVerticalComponent implements AfterViewInit {


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

  private _xAxisItemNames: string[] = [];

  @Input()
  public set xAxisItemNames(val: string[]) {
    if (val == undefined || val == null || val.toString() != this._xAxisItemNames.toString()) {
      this._xAxisItemNames = val;
      this.RenderBarChart();
    }
  }
  public get xAxisItemNames(): string[] {
    return this._xAxisItemNames;
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

  @Input()
  PopupBackColor: string = "lightgray";

  @Input()
  PopupForeColor: string | undefined = undefined;

  @Input()
  PopupBackgroundOpacity: number = 1;

  PopupItems: PopupChartItem[] = [];

  context: CanvasRenderingContext2D | null = null;

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
        let met = this.context.measureText(this.xAxisItemNames[item.ValueIndex].toString());
        let met1 = this.context.measureText(lineItem.Values[item.ValueIndex].toString());

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
    let splitValueAxis = this.NoOfSplitInValueAxis;

    if (this.bar && this.context && this.Columns.length > 0 && this.xAxisItemNames.length > 0) {
      let min: number | undefined = undefined;
      let max: number | undefined = undefined;

      this.context.clearRect(0, 0, this.Width, this.Height);
      
      let spaceFromTopYAxis = 25;

      var valueList = [];
      var minusValuesList = [];

      for (let index = 0; index < this.xAxisItemNames.length; index++) {
        const element = this.xAxisItemNames[index];

        var itm = 0;
        var minusitm = 0;
        for (let col = 0; col < this.Columns.length; col++) {
          const clmn = this.Columns[col];

          if (clmn.Values[index] != undefined) {
            if(clmn.Values[index] < 0){
              minusitm = minusitm - clmn.Values[index];
            } else {
              itm += clmn.Values[index];
            }
          }
            
        }

        minusValuesList.push(minusitm);
        valueList.push(itm);
      }

      min = -this.MaxArray(minusValuesList);
      max = this.MaxArray(valueList);

      var distance: number = 0;
      var itemCount = this.xAxisItemNames.length;
      let noOfMinusValue = 0;
      let fromIndexForMinus = this.NoOfSplitInValueAxis +1;
      
      
      if (min != undefined && max != undefined) {
        if(min<0){
          let noOfsplit = Math.ceil(this.NoOfSplitInValueAxis/2);          
          //distance = (-min + max) / this.NoOfSplitInValueAxis;
          distance = (max) / this.NoOfSplitInValueAxis;
        } else {
          distance = (max) / this.NoOfSplitInValueAxis;
        }
      }

      if(min < 0) {
        noOfMinusValue = -Math.ceil(-min/distance);
        this.NoOfSplitInValueAxis = this.NoOfSplitInValueAxis - noOfMinusValue;
        fromIndexForMinus = this.NoOfSplitInValueAxis + noOfMinusValue; 
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
      
      /* Draw y axis line */
      let vDistance = (StartY - spaceFromTopYAxis) / this.NoOfSplitInValueAxis;
      let decValue = noOfMinusValue;

      /* Draw Y Axis */
      let minusInc = 0;
      for (let index = 0; index <= this.NoOfSplitInValueAxis; index++) {

        let yDisplayValue = 0;

        if(index > fromIndexForMinus){
          yDisplayValue = distance * --minusInc;
          decValue++;
        } else {
          yDisplayValue = Math.round(distance * (this.NoOfSplitInValueAxis - index + decValue));
        }

        let yPoint = Math.round((vDistance * index) + spaceFromTopYAxis);

        this.HorizontalLineInYAxis(StartX, yPoint);
        this.DrawHorizontalLine(StartX, yPoint);
        this.HorizontalLineDisplayValueInYAxis(yDisplayValue.toString(), StartX, yPoint);
      }

      /* Draw the x Axis */
      let maxBarsPerGroup = 1;
      var eachBarGroupLength = (this.Width - StartX) / itemCount;
      var eachBarLength = eachBarGroupLength / (maxBarsPerGroup + this.GapBetweenBars);
      let xPoint = StartX;
      let zeroPoint  = this.GetZeroYPoint(noOfMinusValue, vDistance, spaceFromTopYAxis);

      let drawTexts: DrawTextItem[] = [];

      for (let index = 0; index < itemCount; index++) {

        let xAxisName = this.xAxisItemNames[index];

        if (this.GapBetweenBars == 1) {
          xPoint += eachBarLength / 2;
        } else {
          xPoint += eachBarLength;
        }

        let nameWidth = this.context.measureText(xAxisName);
        let remWidth = eachBarGroupLength - nameWidth.width - (eachBarLength * this.GapBetweenBars);

        let halfXPoint = remWidth / 2;

        /* Draw name on xAxis */
        this.DrawXAxisName(xAxisName, xPoint + halfXPoint, this.Height - this._marginY + 15);

        let previousPlusY: number | undefined = noOfMinusValue < 0 ? 
                  this.GetZeroYPoint(noOfMinusValue, vDistance, spaceFromTopYAxis) : StartY;
        
        let PreviousMinusY: number | undefined = this.GetZeroYPoint(noOfMinusValue, vDistance, spaceFromTopYAxis);

        let ComputedValue = 0;
        let minusComputedValue = 0;

        let halfValueXPoint: number | undefined = undefined;

        for (let x = 0; x < this.Columns.length; x++) {
          const element = this.Columns[x];
          let value = element.Values[index];

          if (value != undefined) {
            let y = this.GetYStartPoint(noOfMinusValue, value, distance, itemCount, vDistance, spaceFromTopYAxis);

            let color = typeof element.barItemsBackColor === 'string' ?
              element.barItemsBackColor : element.barItemsBackColor.length > 0 && element.barItemsBackColor[index] ?
                element.barItemsBackColor[index] : "purple";

            /* Draw Bar */
            let diff = 0;

            if(noOfMinusValue < 0) {              
              diff = zeroPoint - y;
            } else {
             diff = StartY - y;
            }

            let yPoint = 0;

            if (previousPlusY != undefined)
              yPoint = previousPlusY - diff;

            if(value > 0 && noOfMinusValue < 0){
              this.DrawBar(xPoint, yPoint, eachBarLength, diff, color);

              this.PopupItems.push(new PopupChartItem(xPoint, yPoint, xPoint + eachBarLength, 
                yPoint+diff, element, index, x, color));
  
            }
            else if(value< 0 && noOfMinusValue < 0){              
              this.DrawBar(xPoint, PreviousMinusY, eachBarLength, -diff, color);

              this.PopupItems.push(new PopupChartItem(xPoint, PreviousMinusY, xPoint + eachBarLength, 
                yPoint - diff, element, index, x, color));
  
            }
            else {
              this.DrawBar(xPoint, yPoint, eachBarLength, diff, color);
              
              this.PopupItems.push(new PopupChartItem(xPoint, yPoint, xPoint + eachBarLength, 
                yPoint + diff, element, index, x, color));
  
            }

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
                                    
            if(value < 0) {
              yTextOnBar = PreviousMinusY - (diff/2) + textHeight/2;              
              drawTexts.push(new DrawTextItem(value.toString(), xPoint+halfValueXPoint, yTextOnBar, foreColor));            
            } else {
              yTextOnBar = yPoint + diff/2 + textHeight/2;
              drawTexts.push(new DrawTextItem(value.toString(), xPoint+halfValueXPoint, yTextOnBar, foreColor));            
            }

            if(value < 0) {
              PreviousMinusY = PreviousMinusY - diff;
              minusComputedValue += value;
            } else {
              previousPlusY = yPoint;
              ComputedValue += value;
            }

          }
        }

        /* Draw total value on top of plus Bar */
        let valueXpoint = this.getWidthFromString(ComputedValue.toString());
        let remXWidth = eachBarLength - valueXpoint;
        halfValueXPoint = remXWidth / 2;

        if (halfValueXPoint) {
          if(ComputedValue > 0)
              this.DrawText(ComputedValue.toString(), xPoint + halfValueXPoint, previousPlusY - 5, this.TextColor);
        }

        /* Draw total value on top of minus bar */
        valueXpoint = this.getWidthFromString(minusComputedValue.toString());
        remXWidth = eachBarLength - valueXpoint;
        halfValueXPoint = remXWidth / 2;

        if (halfValueXPoint) {
          if(minusComputedValue < 0)
            this.DrawText(minusComputedValue.toString(), xPoint + halfValueXPoint, PreviousMinusY + 10, this.TextColor);
        }

        /* Create Gap */
        if (this.GapBetweenBars == 1) {
          xPoint += eachBarLength + eachBarLength / 2;
        } else {
          xPoint += eachBarLength + eachBarLength;
        }

      }

      for (let index = 0; index < drawTexts.length; index++) {
        const ele = drawTexts[index];
        this.DrawText(ele.value.toString(), ele.x, ele.y, ele.color);
      }
      
      this.IsRendered = true;
      this.cdr.detectChanges();
    }

    this.NoOfSplitInValueAxis = splitValueAxis;
  }

  private GetRoundToTenDigit(distance: number) {
    let j = distance / 10;
    let roundedJ = Math.ceil(j);
    distance = roundedJ * 10;

    return distance;
  }

  private GetZeroYPoint(noOfMinus: number, vDistance: number, spaceFromTopYAxis: number){
    let index = noOfMinus + this.NoOfSplitInValueAxis;
    let yPoint = Math.round((vDistance * index) + spaceFromTopYAxis);
    return yPoint;
  }

  private GetYStartPoint(noOfMinus: number, displayValue: number, distance: number, itemcount: number, vDistance: number, spaceFromTopYAxis: number) {
    let index = -(displayValue / distance) + this.NoOfSplitInValueAxis + noOfMinus;
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
      this.context.lineWidth = 0.4;
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
