import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { BarChartItem, SpaceBetweenBars } from '../Models/BarChartItem';
import { WindowHelper } from '../windowObject';
import { NgForOf, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rbarchart-vertical',
  standalone: true,
  imports: [NgIf, NgStyle, NgForOf],
  templateUrl: './rbarchart-vertical.component.html',
  styleUrl: './rbarchart-vertical.component.css'
})
export class RBarChartVerticalComponent implements AfterViewInit {

  private _width: number = 300;
  private _height: number = 300;

  @Input()
  public set Width(val: number) {
    this._width = val;
  }
  public get Width() : number {
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

  private _margin: number = 50;

  @Input()
  public set Margin(val: number){
    this._margin =val;
  }
  public get Margin(): number {
    return this._margin;
  }

  @Input()
  public set Height(val: number) {
    this._height = val;
  }
  public get Height(): number {
    return this._height;
  }

  private _xAxisItemNames: string [] = [];

  @Input()
  public set xAxisItemNames(val: string[]){
    if(val == undefined || val==null || val.toString() != this._xAxisItemNames.toString()){
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
  public set Columns(val: BarChartItem[]){
    if(!this.IsBarItemListEqual(val, this._columns)){
      this._columns = val;
      this.RenderBarChart();
    }
  }
  public get Columns(): BarChartItem[] {
    return this._columns;
  }

  @ViewChild('rbar', { read: ElementRef<HTMLCanvasElement> , static: false})
  bar: ElementRef<HTMLCanvasElement> | undefined = undefined;

  context: CanvasRenderingContext2D | null = null;

  public IsRendered: boolean = false;

  constructor(private winObj: WindowHelper) {
    
  }

  ngAfterViewInit(): void {
    if(this.winObj.isExecuteInBrowser()) {
      if(this.bar!=undefined){
        this.context = this.bar.nativeElement.getContext('2d');
        this.RenderBarChart();
      }
    }
  }

  getWidthFromString(value: string): number {
    if(this.context){
      let metrics = this.context.measureText(value);
      return metrics.width;
    }

    return 50;
  }

  getNameIndicator(itm: BarChartItem){
    return typeof itm.barItemsBackColor === 'string' ? itm.barItemsBackColor : itm.barItemsBackColor.length > 0 ?
                           itm.barItemsBackColor[0] : "orangered";
  }

  isPropString(prop: any){
    return typeof prop === 'string';
  }

  RenderBarChart(){
    this.IsRendered =false;

    if(this.bar && this.context && this.Columns.length > 0 && this.xAxisItemNames.length > 0){
      let min : number | undefined = undefined;
      let max : number | undefined = undefined;      

      let spaceFromTopYAxis = 10;

      for (let index = 0; index < this.Columns.length; index++) {
        const element = this.Columns[index];
        if(element){
          
          let list: number[] = element.Values;
          if(min != undefined && max != undefined) {
            min = this.MinArray([this.MinArray(list), min]);          
            max = this.MaxArray([this.MaxArray(list), max]);            
          } else{            
            min = this.MinArray(list);          
            max = this.MaxArray(list);
          }
        }
      }

      var distance: number = 0;      
      var itemCount  = this.xAxisItemNames.length;

      if(min!=undefined && max!=undefined) {
        distance = (max) / ( itemCount + 1)
      }
            
      distance = this.GetRoundToTenDigit(distance);

      var MinLimit = 0;
      var MaxLimit = distance * (itemCount + 1);

      var StartX: number = this._margin;
      var StartY: number = this.Height - this._margin;

      /* Draw Vertical Line */
      this.context.beginPath();
      this.context.moveTo(StartX, StartY);
      this.context.lineTo(StartX, 0);
      this.context.strokeStyle = "gray";
      this.context.stroke();
      
      /* Draw Horizontal Line */
      this.context.moveTo(StartX, StartY);
      this.context.lineTo(this.Width, StartY);
      this.context.strokeStyle = "gray";
      this.context.stroke();      
      this.context.closePath();

      /* Draw y axis line */
      let vDistance = (StartY - spaceFromTopYAxis) / (itemCount + 1);            

      /* Draw Y Axis */
      for (let index = 0; index <= (itemCount +1); index++) {
        let yDisplayValue = Math.round(distance * ((itemCount+1) - index));
        let yPoint = Math.round((vDistance * index) + spaceFromTopYAxis);        

        this.HorizontalLineInYAxis(StartX, yPoint);  
        this.DrawHorizontalLine(StartX, yPoint);
        this.HorizontalLineDisplayValueInYAxis(yDisplayValue.toString(), StartX, yPoint);      
      }

      /* Draw the x Axis */      
      var eachBarGroupLength = (this.Width - StartX)/ itemCount;
      var eachBarLength = eachBarGroupLength / (this.Columns.length + this.GapBetweenBars) ;
      let xPoint = StartX;

      for (let index = 0; index < itemCount; index++) {
        
        let xAxisName = this.xAxisItemNames[index];   
        
        if(this.GapBetweenBars==1){
          xPoint +=eachBarLength/2;
        } else {
          xPoint += eachBarLength;
        }

        let nameWidth = this.context.measureText(xAxisName);
        let remWidth = eachBarGroupLength - nameWidth.width - (eachBarLength * this.GapBetweenBars);
        
        let halfXPoint = remWidth/2;

        /* Draw name on xAxis */
        this.DrawXAxisName(xAxisName, xPoint + halfXPoint, this.Height - this._margin + 15);

        for (let x = 0; x < this.Columns.length; x++) {
          const element = this.Columns[x];
          let value = element.Values[index];
          let y = this.GetYStartPoint(value, distance, itemCount, vDistance, spaceFromTopYAxis);          

          let color = typeof element.barItemsBackColor === 'string' ? 
                        element.barItemsBackColor : element.barItemsBackColor.length > 0 ?
                        element.barItemsBackColor[index] : "purple";

          /* Draw Bar */
          this.DrawBar(xPoint, y, eachBarLength, StartY - y, color);
          
          /* Draw Text on top of Bar */
          let valueXpoint = this.getWidthFromString(value.toString());
          let remXWidth = eachBarLength - valueXpoint;
          let halfValueXPoint: number | undefined = undefined;

          let foreColor = typeof element.barItemsForeColor === 'string' ? 
                            element.barItemsForeColor :  element.barItemsForeColor.length > 0 ? 
                            element.barItemsForeColor[index] : "black";
        
          halfValueXPoint = remXWidth/2;

          this.DrawText(value.toString(), xPoint + halfValueXPoint, y + 15, foreColor);
          
          xPoint += eachBarLength;        
        }
        
        if(this.GapBetweenBars==1){
          xPoint +=eachBarLength/2;
        } else {
          xPoint += eachBarLength;
        }
                     
      }
      
      this.IsRendered = true;
    }
  }

  private GetRoundToTenDigit(distance: number){
    let j = distance/10;
    let roundedJ = Math.ceil(j);
    distance = roundedJ * 10;

      return distance;
  }

  private GetYStartPoint(displayValue: number, distance: number, itemcount: number, vDistance: number, spaceFromTopYAxis: number) {
    let index = -(displayValue/distance) + itemcount + 1;
    let yPoint = Math.round((vDistance * index) + spaceFromTopYAxis);
    return yPoint;
  }

  private DrawXAxisName(name: string, xPoint: number, yPoint: number){
    if(this.context){
      let startY = yPoint;
      this.context.beginPath
      this.context.moveTo(xPoint, startY);
      this.context.fillStyle = "gray";
      this.context.fillText(name, xPoint, startY);      
      this.context.fill();
      this.context.strokeStyle = "gray";
      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawBar(startX: number, startY: number, xdistance: number, yDistance: number, color: string){
    if(this.context){
      this.context.beginPath();
      this.context.fillStyle = color;      
      this.context.fillRect(startX, startY, xdistance, yDistance);
      this.context.fill();
      this.context.closePath();
    }
  }

  private HorizontalLineDisplayValueInYAxis(value: string, x: number, ypoint: number){
    if(this.context){
      this.context.beginPath(); 
      let metrics = this.context.measureText(value);
      
      let StartX = x - 7 - metrics.width;
      let StartY = ypoint + 3;
      let EndX = x - 7;
      let EndY = ypoint;

      this.context.fillStyle = "gray";
      this.context.moveTo(StartX, StartY);
      this.context.fillText(value, StartX, StartY);      
      this.context.fill();
      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawHorizontalLine(x: number, ypoint: number) {
    if(this.context) {
      this.context.beginPath();
      let startX = x;
      let endX = x + this.Width - this._margin;
      this.context.lineWidth = 0.4;
      this.context.strokeStyle = "gray";
      this.context.moveTo(startX, ypoint);
      this.context.lineTo(endX, ypoint);      
      this.context.stroke();
      this.context.closePath();
    }
  }

  private HorizontalLineInYAxis(x: number, ypoint: number){
    if(this.context){
      this.context.beginPath(); 
      let StartX = x - 5;
      let StartY = ypoint;
      let EndX = x + 5;
      let EndY = ypoint;

      this.context.strokeStyle = "gray";
      this.context.moveTo(StartX, StartY);
      this.context.lineTo(EndX, EndY);
      
      this.context.stroke();
      this.context.closePath();
    }
  }

  private DrawText(text: string, x: number, y: number, forecolor: string, rotate: number | undefined = undefined){
    if(this.context){
      this.context.beginPath();    
      
      this.context.strokeStyle = forecolor;
      this.context.fillStyle = forecolor;
      this.context.fillText(text, x, y);
      
      if(rotate!=undefined)
        this.context.rotate(rotate);

      this.context.fill();
      this.context.stroke();

      this.context.closePath();
    }
  }

  private MinArray(array: number[]): number {
    return array.reduce((x,y)=>  {
      return x < y ? x : y;
    });
  }

  private MaxArray(array: number[]): number {
    return array.reduce((x,y)=>{
      return x > y ? x: y;
    })
  }

  private IsBarItemListEqual(a: BarChartItem[], b: BarChartItem[]){

    if((a == null || a == undefined) && (b == null || b==undefined))
      return true;

    if(a == null || b == null || a == undefined || b == undefined)
      return false;

    if(a.length!= b.length)
      return false;

    for (let index = 0; index < a.length; index++) {
      let element1 = a[index];
      let element2 = b[index];
      
      if(element1.DisplayName != element2.DisplayName || 
        element1.barItemsBackColor.toString() != element2.barItemsBackColor.toString() ||
        element1.barItemsForeColor.toString() != element2.barItemsForeColor.toString() ||        
        element1.Values.toString() != element2.Values.toString()) {
          return false;
        }
    }

    return true;
  }
}
