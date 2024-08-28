import { NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, viewChild, ViewChild } from '@angular/core';

@Component({
  selector: 'rcolorpicker',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './rcolorpicker.component.html',
  styleUrl: './rcolorpicker.component.css',
  host: {
    "(window:click)": "windowOnClick($event)"
  }
})
export class RColorPickerComponent implements AfterViewInit {

  @ViewChild('variations', { read: ElementRef<HTMLCanvasElement>, static: false })
  variations: ElementRef<HTMLCanvasElement> | undefined = undefined;

  @ViewChild('colors', { read: ElementRef<HTMLCanvasElement>, static: false })
  colors: ElementRef<HTMLCanvasElement> | undefined = undefined;

  private _prevRectX: number | undefined = undefined;
  private _prevRectY: number | undefined = undefined;

  private _varprevRectX: number | undefined = undefined;
  private _varprevRectY: number | undefined = undefined;


  private mainColorClickEventBinded: boolean = false;
  private variationColorClickEventBinded: boolean = false;

  private colorsContext: CanvasRenderingContext2D | null = null;
  private varContext: CanvasRenderingContext2D | null = null;

  private mainColorRgb: string | undefined = undefined;
  private mainColorHex: string | undefined = undefined;

  public SelectedColorRgb: string | undefined = undefined;
  public SelectedColorHex: string | undefined = undefined;
  public SelectedColorR: number = -1;
  public SelectedColorG: number = -1;
  public SelectedColorB: number = -1;

  @Input()
  public LabelText: string = "Color";

  @Input()
  public LabelTextForeColor: string = "blue";

  @Input()
  public DisplayColorInHex: boolean = false;

  @Input()
  public IsDisplayText: boolean = false;

  public get GetRGBColorInNumbers(): string {
    return this.SelectedColorR +","+this.SelectedColorG+","+this.SelectedColorB;
  }

  private _mainColorGradients: CanvasGradient[] = [];

  public IsColorPickerOpen: boolean = false;

  constructor() {
    this.mainColorRgb = "rgb(255,0,0)";
    this.mainColorHex = this.RGBToHex(255, 0, 0);
    this._mainColorGradients = [];
  }

  toggle($event: any){
    this.IsColorPickerOpen = !this.IsColorPickerOpen;
  }

  windowOnClick($event: Event) {    
    
    let i =6;
    let element = $event.srcElement;
    let sameelementClicked: boolean = false;

    while(element!=undefined && i>-1){
      if((element as HTMLElement).classList.contains('windowclose')){
        sameelementClicked = true;
        break;
      }

      i--;
      element = (element as HTMLElement).parentElement;
    }

    if(!sameelementClicked)
      this.IsColorPickerOpen = false;
  }

  AddColorGradients() {

    if (this.colors) {
      if (this.colorsContext == undefined) {
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
    this.AddColorGradients();
    this.RenderUI();
    this.LoadDefault();
    this.GetRgb({ offsetX: this._prevRectX, offsetY: this._prevRectY });
    this.GetActualColorFromVariartion({ offsetX: this._varprevRectX, offsetY: this._varprevRectY });
  }

  HexToRgb(hex: any) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return 'rgb(r + "," + g + "," + b+)';
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
  }

  RenderUI() {
    this.RenderColors();
    this.RenderVariations();
  }

  RenderVariations() {
    if (this.variations) {
      this.varContext = this.variations.nativeElement.getContext('2d', { willReadFrequently: true});

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
        this.variations.nativeElement.addEventListener('click', this.GetActualColorFromVariartion.bind(this), false);
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
          this.colors.nativeElement.addEventListener('click', this.GetRgb.bind(this), false);
          this.mainColorClickEventBinded = true;
        }
      }
    }
  }

  GetRgb(event: any) {

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

      this.colorsContext.beginPath();
      this.colorsContext.fillStyle = "transparent";
      this.colorsContext.strokeStyle = "black";
      this.colorsContext.lineWidth = 2;
      this.colorsContext.strokeRect(0, yPoint, 25, 10);
      this.colorsContext.closePath();

      // render the variations for each color
      this.RenderVariations();
      this.GetActualColorFromVariartion({ offsetX: this._varprevRectX, offsetY: this._varprevRectY })
    }
  }

  GetActualColorFromVariartion(event: any) {

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

      this.varContext.beginPath();
      this.varContext.fillStyle = "transparent";
      this.varContext.strokeStyle = "white";
      this.varContext.lineWidth = 2;
      this.varContext.strokeRect(xPoint, yPoint, 10, 10);
      this.varContext.closePath();
    }
  }

}
