import { NgIf, NgStyle, UpperCasePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnDestroy, Output, viewChild, ViewChild } from '@angular/core';
import { WindowHelper } from '../windowObject';
import { RectShape } from './rectShape';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rcolorpicker',
  standalone: true,
  imports: [NgStyle, NgIf, UpperCasePipe],
  templateUrl: './rcolorpicker.component.html',
  styleUrl: './rcolorpicker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(window:click)": "windowOnClick($event)"
  },
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> RColorPickerComponent),
      multi: true
    }
  ]
})
export class RColorPickerComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @ViewChild('variations', { read: ElementRef<HTMLCanvasElement>, static: false })
  variations: ElementRef<HTMLCanvasElement> | undefined = undefined;

  @ViewChild('colors', { read: ElementRef<HTMLCanvasElement>, static: false })
  colors: ElementRef<HTMLCanvasElement> | undefined = undefined;

  private _prevRectX: number | undefined = undefined;
  private _prevRectY: number | undefined = undefined;

  private _varprevRectX: number | undefined = undefined;
  private _varprevRectY: number | undefined = undefined;

  DisplayColorRGB: string = "";
  DisplayColorHex: string = "";
  DisplayColorR!: number;
  DisplayColorG!: number;
  DisplayColorB!: number;

  private mainColorClickEventBinded: boolean = false;
  private variationColorClickEventBinded: boolean = false;

  private colorsContext: CanvasRenderingContext2D | null = null;
  private varContext: CanvasRenderingContext2D | null = null;

  private mainColorRgb: string | undefined = undefined;
  private mainColorHex: string | undefined = undefined;

  private _selectedColorHex: string | undefined = undefined;

  public SelectedColorRgb: string | undefined = undefined;

  public set SelectedColorHex(value: string) {
    this._selectedColorHex = value;
  }
  public get SelectedColorHex(): string | undefined {
    return this._selectedColorHex?.toUpperCase();
  }

  public SelectedColorR: number = -1;
  public SelectedColorG: number = -1;
  public SelectedColorB: number = -1;

  private varRectShape: RectShape | undefined = undefined;
  private mainRectShape: RectShape | undefined = undefined;

  private varCanvasWidth: number = 250;
  private varCanvasHeight: number = 150;
  private colorCanvasWidth: number = 25;
  private colorCanvasHeight: number = 150;

  private varOffSetX: number = 0;
  private varOffSetY: number = 0;
  private colorOffSetX: number = 0;
  private colorOffSetY: number = 0;

  private varSelectorWidth: number = 10;
  private varSelectorHeight: number = 10;


  private mainSelectorWidth: number = 25;
  private mainSelectorHeight: number = 10;

  private varStartX: number = 0;
  private varStartY: number = 0;

  private mainStartX: number = 0;
  private mainStartY: number = 0;

  @Input()
  public EnableShadowEffect: boolean = true;

  // private _inputColorInHex: string | undefined = undefined;

  // @Input()
  // public set InputColorInHex(value: string) {
  //   if (value) {
  //     this._inputColorInHex = value;
  //     this.AssignColorsForInputColor(value);
  //   }
  // }
  // public get InputColorInHex(): string | undefined {
  //   return this._inputColorInHex;
  // }

  @Output()
  public ColorSelected = new EventEmitter<RColorPickerEventArgs>();

  @Input()
  public LabelText: string = "Color";

  @Input()
  public LabelTextForeColor: string = "blue";

  @Input()
  public DisplayColorInHex: boolean = false;

  @Input()
  public IsDisplayLabelText: boolean = false;

  @Input()
  public FontSize: string = "small";
  
  @Input()
  public IsDisplayColorCode: boolean = true;

  private isVariationsColorPickerDrag: boolean = false;
  private isMainColorPickerDrag: boolean = false;

  public Id: string = "";

  public get GetRGBColorInNumbers(): string {
    return this.SelectedColorR + "," + this.SelectedColorG + "," + this.SelectedColorB;
  }

  public get GetDisplayColorInNumbers(): string {
    return this.DisplayColorR + "," + this.DisplayColorG + "," + this.DisplayColorB;
  }

  private _mainColorGradients: CanvasGradient[] = [];

  public IsColorPickerOpen: boolean = false;

  onChanged: Function = ()=>{};
  onTocuhed: Function = ()=>{};

  constructor(private windowHelper: WindowHelper, private cdr: ChangeDetectorRef) {
    this.mainColorRgb = "rgb(255,0,0)";
    this.mainColorHex = this.RGBToHex(255, 0, 0);
    this._mainColorGradients = [];
    this.Id = this.windowHelper.GenerateUniqueId();    
  }

  writeValue(obj: any): void {
    if(obj){

      if(obj instanceof RColorPickerEventArgs){
        this.SetDisplayColorsUsingHex((obj as RColorPickerEventArgs).SelectedColorInHex);      
      } else {
      let col = obj as string;
      if(col[0] == "#"){
        this.SetDisplayColorsUsingHex(col);       
      } else{
        let colNums = col.match(/\d+/g);
        if(colNums) {
          let _hexValue = this.RGBToHex(parseInt(colNums[0]), parseInt(colNums[1]), parseInt(colNums[2]))
          this.SetDisplayColorsUsingHex(_hexValue);
        }
      }
    }

    if(this.DisplayColorRGB.trim()!="") {
      let args = new RColorPickerEventArgs(this.DisplayColorRGB, this.DisplayColorHex,
        this.DisplayColorR, this.DisplayColorG, this.DisplayColorB);
      this.ColorSelected.emit(args);
    }

    }
  }

  registerOnChange(fn: any): void {
   this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTocuhed = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

  AssignColorsForInputColor(value: string) {
    value = value.toString().toLowerCase();
    this.SelectedColorHex = value;
    this.SelectedColorRgb = this.HexToRgb(value);

    let nums = this.HexToRgbInNumbers(value);

    this.SelectedColorR = nums[0];
    this.SelectedColorG = nums[1];
    this.SelectedColorB = nums[2];
  }

  GetOffset() {
    if (this.variations) {
      let _offset = this.variations.nativeElement.getBoundingClientRect();
      this.varOffSetX = _offset.left;
      this.varOffSetY = _offset.top;
    }

    if (this.colors) {
      let _offset = this.colors.nativeElement.getBoundingClientRect();
      this.colorOffSetX = _offset.left;
      this.colorOffSetY = _offset.top;
    }
  }

  VariationsMouseDown($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();

    let _x = $event.offsetX;
    let _y = $event.offsetY;
    if (this.varRectShape && this.mouseIsOnTopOfRect(_x, _y, this.varRectShape)) {
      this.isVariationsColorPickerDrag = true;
    } else {
      this.isVariationsColorPickerDrag = false;
    }
  }

  VariationsMouseMove($event: MouseEvent) {

    $event.preventDefault();
    $event.stopPropagation();

    if (!this.isVariationsColorPickerDrag) {
      return;
    }

    let _x = $event.offsetX;// - this.varStartX ;
    let _y = $event.offsetY;// - this.varStartY;

    // this.GetActualColorFromVariartion({ offsetX: _x, offsetY: _y });
    
    this.GetActualColorFromVariationClick({ offsetX: _x, offsetY: _y });

    this.varStartX = _x;
    this.varStartY = _y;
  }

  mouseIsOnTopOfRect(x: number, y: number, shape: RectShape) {
    let Left = shape.x;
    let Right = shape.x + this.varSelectorWidth;
    let top = shape.y;
    let bottom = shape.y + this.varSelectorHeight;

    if (x > Left && x < Right && y > top && y < bottom) {
      return true;
    }

    return false;
  }

  VariationsMouseUp($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.isVariationsColorPickerDrag) {
      this.isVariationsColorPickerDrag = false;

      // if(this.SelectedColorHex)
      //   this._inputColorInHex = this.SelectedColorHex;      

      return;
    }
  }

  MainMouseDown($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();

    let _x = $event.offsetX;
    let _y = $event.offsetY;
    if (this.mainRectShape && this.mouseIsOnTopOfRectOfMain(_x, _y, this.mainRectShape)) {
      this.isMainColorPickerDrag = true;
    } else {
      this.isMainColorPickerDrag = false;
    }
  }

  MainMouseMove($event: MouseEvent) {

    $event.preventDefault();
    $event.stopPropagation();

    if (!this.isMainColorPickerDrag) {
      return;
    }

    let _x = $event.offsetX;// - this.mainStartX ;
    let _y = $event.offsetY;// - this.mainStartY;

    // this.GetRgb({ offsetX: 0, offsetY: _y });
    this.GetRgbClick({ offsetX: 0, offsetY: _y });

    this.mainStartX = 0;
    this.mainStartY = _y;
  }

  mouseIsOnTopOfRectOfMain(x: number, y: number, shape: RectShape) {
    let Left = shape.x;
    let Right = shape.x + this.mainSelectorWidth;
    let top = shape.y;
    let bottom = shape.y + this.varSelectorHeight;

    if (x > Left && x < Right && y > top && y < bottom) {
      return true;
    }

    return false;
  }

  MainMouseUp($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    if (this.isMainColorPickerDrag) {
      this.isMainColorPickerDrag = false;
      return;
    }
  }



  toggle($event: Event) {    
    this.IsColorPickerOpen = !this.IsColorPickerOpen;
  }

  windowOnClick($event: Event) {

    let i = 15;
    let element = $event.srcElement;
    let sameelementClicked: boolean = false;
    let elementId: string | undefined = undefined;

    while (element != undefined && i > -1) {
      if ((element as HTMLElement).classList.contains('rcolorpickerwindowclose')) {
        elementId = (element as HTMLElement).id;
        if (elementId == this.Id) {
          sameelementClicked = true;
        }
        break;
      }

      i--;
      element = (element as HTMLElement).parentElement;
    }

    if (!sameelementClicked)
      this.IsColorPickerOpen = false;
  }

  AddColorGradients() {

    if (this.colors) {
      if (this.colorsContext == undefined && this.windowHelper.isExecuteInBrowser()) {
        this.colorsContext = this.colors.nativeElement.getContext('2d', { willReadFrequently: true });
      }

      if (this.colorsContext) {
        let grad = this.colorsContext.createLinearGradient(0, 0, 0, 150 / 6);
        grad.addColorStop(0, 'red');
        grad.addColorStop(1, "yellow");

        this._mainColorGradients.push(grad);

        let grad1 = this.colorsContext.createLinearGradient(0, 150 / 6, 0, 150 / 6 * 2);
        grad1.addColorStop(0, 'yellow');
        grad1.addColorStop(1, "lime");
        this._mainColorGradients.push(grad1);

        let grad2 = this.colorsContext.createLinearGradient(0, 150 / 6 * 2, 0, 150 / 6 * 3);
        grad2.addColorStop(0, 'lime');
        grad2.addColorStop(1, "aqua");
        this._mainColorGradients.push(grad2);

        let grad3 = this.colorsContext.createLinearGradient(0, 150 / 6 * 3, 0, 150 / 6 * 4);
        grad3.addColorStop(0, 'aqua');
        grad3.addColorStop(1, "blue");
        this._mainColorGradients.push(grad3);

        let grad4 = this.colorsContext.createLinearGradient(0, 150 / 6 * 4, 0, 150 / 6 * 5);
        grad4.addColorStop(0, 'blue');
        grad4.addColorStop(1, "fuchsia");
        this._mainColorGradients.push(grad4);

        let grad5 = this.colorsContext.createLinearGradient(0, 150 / 6 * 5, 0, 150 / 6 * 6);
        grad5.addColorStop(0, 'fuchsia');
        grad5.addColorStop(1, "red");
        this._mainColorGradients.push(grad5);
      }
    }
  }

  ngAfterViewInit(): void {
    if (this.windowHelper.isExecuteInBrowser()) {
      this.AddColorGradients();
      this.RenderUI();
      this.LoadDefault();

      this.GetRgb({ offsetX: this._prevRectX, offsetY: this._prevRectY });
      this.GetActualColorFromVariartion({ offsetX: this._varprevRectX, offsetY: this._varprevRectY });

      if(this.SelectedColorHex)
        this.SetDisplayColorsUsingHex(this.SelectedColorHex);

      if (this.windowHelper.isExecuteInBrowser()) {
        window.onscroll = this.GetOffset;
        window.onresize = this.GetOffset;

        if (this.variations) {
          this.variations.nativeElement.onscroll = this.GetOffset.bind(this);
          this.variations.nativeElement.onresize = this.GetOffset.bind(this);
          this.variations.nativeElement.onmousedown = this.VariationsMouseDown.bind(this);
          this.variations.nativeElement.onmouseup = this.VariationsMouseUp.bind(this);
          this.variations.nativeElement.onmousemove = this.VariationsMouseMove.bind(this);
        }

        if (this.colors) {
          this.colors.nativeElement.onscroll = this.GetOffset.bind(this);
          this.colors.nativeElement.onresize = this.GetOffset.bind(this);
          this.colors.nativeElement.onmousedown = this.MainMouseDown.bind(this);
          this.colors.nativeElement.onmouseup = this.MainMouseUp.bind(this);
          this.colors.nativeElement.onmousemove = this.MainMouseMove.bind(this);
        }
      }

      // if(this._inputColorInHex){    
      //   this.AssignColorsForInputColor(this._inputColorInHex);
      // }

      setTimeout(() => {
        this.cdr.detectChanges();
      });
    }

  }

  HexToRgb(hex: string) {
    hex = hex.substring(1);

    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return 'rgb('+r + "," + g + "," + b+')';
  }


  HexToRgbInNumbers(hex: any) {
    hex = hex.substring(1);
    let num = [];
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    num.push(r);
    num.push(g);
    num.push(b);

    return num;
  }

  colorCodeToHex(c: any) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  RGBToHex(r: number, g: number, b: number) {
    return "#" + this.colorCodeToHex(r) + this.colorCodeToHex(g) + this.colorCodeToHex(b);
  }

  LoadDefault() {
    this._prevRectX = 0;
    this._prevRectY = 40;
    this._varprevRectX = 200;
    this._varprevRectY = 0;

    this.varStartX = 200;
    this.varStartY = 0;
  }

  RenderUI() {
    this.RenderColors();
    this.RenderVariations();
  }

  RenderVariations() {
    if (this.variations && this.windowHelper.isExecuteInBrowser()) {
      this.varContext = this.variations.nativeElement.getContext('2d', { willReadFrequently: true });

      // Horizontal Rendering of Selected Color
      if (this.varContext) {
        let grad = this.varContext.createLinearGradient(0, 0, 250, 0);
        grad.addColorStop(0, "white");

        if (this.mainColorRgb)
          grad.addColorStop(1, this.mainColorRgb);

        this.varContext.fillStyle = grad;
        this.varContext.fillRect(0, 0, 250, 150);
      }

      // Vertical Rendering of White to Black.
      if (this.varContext) {
        let grad = this.varContext.createLinearGradient(0, 0, 0, 150);
        grad.addColorStop(0, "rgba(0,0,0,0)"); // adding transperancy fourth parameter
        grad.addColorStop(1, "black");
        this.varContext.fillStyle = grad;
        this.varContext.fillRect(0, 0, 250, 150);
      }

      if (!this.variationColorClickEventBinded) {
        this.variations.nativeElement.addEventListener('click', this.GetActualColorFromVariationClick.bind(this), false);
        this.variationColorClickEventBinded = true;
      }
    }
  }

  RenderColors() {
    //red, yellow, lime , aqua, blue, fuchsia
    if (this.colors) {
      if (this.colorsContext) {
        // 150 is the height and 6 different colors
        for (let index = 0; index < this._mainColorGradients.length; index++) {
          const element = this._mainColorGradients[index];
          let yPosition = 150 / 6 * index;
          this.colorsContext.beginPath();
          this.colorsContext.fillStyle = element;
          this.colorsContext.fillRect(0, yPosition, 25, 150 / 6);
          this.colorsContext.closePath();
        }

        if (!this.mainColorClickEventBinded) {
          this.colors.nativeElement.addEventListener('click', this.GetRgbClick.bind(this), false);
          this.mainColorClickEventBinded = true;
        }
      }
    }
  }

  GetRgbClick(event: any) {

    this.GetRgbSub(event);

    if (this.SelectedColorRgb && this.SelectedColorHex) {

      let args = new RColorPickerEventArgs(this.SelectedColorRgb, this.SelectedColorHex,
        this.SelectedColorR, this.SelectedColorG, this.SelectedColorB);

      this.SetDisplayColorsUsingHex(this.SelectedColorHex);
      this.onChanged(this.DisplayColorHex);
      this.onTocuhed(this.DisplayColorHex);

      this.ColorSelected.emit(args);
    }
  }

  SetDisplayColorsUsingHex(colorInHex: string){
    this.DisplayColorHex = colorInHex;
    this.DisplayColorRGB = this.HexToRgb(colorInHex);
    
    let colorsInrgb = this.HexToRgbInNumbers(colorInHex);
    this.DisplayColorR = colorsInrgb[0];
    this.DisplayColorG = colorsInrgb[1];
    this.DisplayColorB = colorsInrgb[2];
  }

  GetRgb(event: any) {
    this.GetRgbSub(event);
  }
  GetRgbSub(event: any) {

    if (this.colorsContext) {
      this.colorsContext.clearRect(0, 0, 25, 150);
      this.RenderColors(); // redraw main color because of above line clear the selection

      let xPoint = event.offsetX;
      let yPoint = event.offsetY;
      this._prevRectX = xPoint;
      this._prevRectY = yPoint;

      let colorData = this.colorsContext.getImageData(xPoint, yPoint, 1, 1)['data'];
      let rgb = `rgb(${colorData[0]},${colorData[1]},${colorData[2]})`;

      this.mainColorRgb = rgb;
      this.mainColorHex = this.RGBToHex(colorData[0], colorData[1], colorData[2]);

      this.mainRectShape = new RectShape(0, yPoint);
      this.DrawMainRectShape(this.mainRectShape);

      // render the variations for each color
      this.RenderVariations();
      this.GetActualColorFromVariartion({ offsetX: this._varprevRectX, offsetY: this._varprevRectY })
    }
  }

  GetActualColorFromVariationClick(event: any) {
    this.GetActualColorFromVariartionSub(event);

    // if(this.SelectedColorHex)
    //   this._inputColorInHex = this.SelectedColorHex;

    if (this.SelectedColorRgb && this.SelectedColorHex) {

      let args = new RColorPickerEventArgs(this.SelectedColorRgb, this.SelectedColorHex,
        this.SelectedColorR, this.SelectedColorG, this.SelectedColorB);

      this.SetDisplayColorsUsingHex(this.SelectedColorHex);
      this.onChanged(this.DisplayColorHex);
      this.onTocuhed(this.DisplayColorHex);
      
      this.ColorSelected.emit(args);
    }
  }

  GetActualColorFromVariartionSub(event: any) {

    if (this.varContext) {
      this.varContext.clearRect(0, 0, 250, 150);
      this.RenderVariations(); // redraw main color because of above line clear the selection

      let xPoint = event.offsetX;
      let yPoint = event.offsetY;

      this._varprevRectX = xPoint;
      this._varprevRectY = yPoint;

      let colorData = this.varContext.getImageData(xPoint, yPoint, 1, 1)['data'];
      let rgb = `rgb(${colorData[0]},${colorData[1]},${colorData[2]})`;

      this.SelectedColorRgb = rgb;
      this.SelectedColorHex = this.RGBToHex(colorData[0], colorData[1], colorData[2]);
      this.SelectedColorR = colorData[0];
      this.SelectedColorG = colorData[1];
      this.SelectedColorB = colorData[2];

      this.varRectShape = new RectShape(xPoint, yPoint);
      this.DrawRectShape(this.varRectShape);
    }
  }

  GetActualColorFromVariartion(event: any) {
    this.GetActualColorFromVariartionSub(event);
  }

  DrawMainRectShape(shape: RectShape) {
    if (this.colorsContext) {
      this.colorsContext.beginPath();
      this.colorsContext.fillStyle = "transparent";
      this.colorsContext.strokeStyle = "black";
      this.colorsContext.lineWidth = 2;
      this.colorsContext.strokeRect(0, shape.y, this.mainSelectorWidth, this.mainSelectorHeight);
      this.colorsContext.closePath();
    }
  }

  DrawRectShape(shape: RectShape) {
    if (this.varContext) {
      this.varContext.beginPath();
      this.varContext.fillStyle = "transparent";
      this.varContext.strokeStyle = "white";
      this.varContext.lineWidth = 2;
      this.varContext.strokeRect(shape.x, shape.y, this.varSelectorWidth, this.varSelectorHeight);
      this.varContext.closePath();
    }
  }

  FindColorsInUI(colorValueInHex: string) {

    if (this.colorsContext) {
      let _loopY = this.colorCanvasHeight;
      let colorSelected = false;

      for (let index = 0; index <= _loopY; index += 10) {

        this.GetRgb({ offsetX: 0, offsetY: index });

        for (let _x = 0; _x <= this.varCanvasWidth; _x += 10) {
          for (let _y = 0; _y <= this.varCanvasHeight; _y += 10) {
            this.GetActualColorFromVariartion({ offsetX: _x, offsetY: _y });
            if (this.SelectedColorHex?.toLowerCase() == colorValueInHex.toLowerCase()) {
              colorSelected = true;
            }

            if (colorSelected)
              break;

          }

          if (colorSelected)
            break;

        }

        if (colorSelected)
          break;

      }
    }
  }


  ngOnDestroy(): void {
    if (this.windowHelper.isExecuteInBrowser()) {
      window.onscroll = null;
      window.onresize = null;

      if (this.variations) {
        this.variations.nativeElement.onscroll = null;
        this.variations.nativeElement.onresize = null;
        this.variations.nativeElement.onmousedown = null;
        this.variations.nativeElement.onmouseup = null;
        this.variations.nativeElement.onmousemove = null;
      }

      if (this.colors) {
        this.colors.nativeElement.onscroll = null;
        this.colors.nativeElement.onresize = null;
        this.colors.nativeElement.onmousedown = null;
        this.colors.nativeElement.onmouseup = null;
        this.colors.nativeElement.onmousemove = null;
      }
    }
  }

}

export class RColorPickerEventArgs {
  constructor(
    public SelectedColorInRGB: string,
    public SelectedColorInHex: string,
    public SelectedColorR: number,
    public SelectedColorG: number,
    public SelectedColorB: number
  ) { }
}

