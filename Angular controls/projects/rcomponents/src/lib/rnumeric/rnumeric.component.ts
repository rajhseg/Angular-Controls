import { Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { RButtonComponent } from "../rbutton/rbutton.component";
import { RWindowHelper } from '../rwindowObject';
import { CssUnit, RCssUnitsService, RelativeUnitType } from '../rcss-units.service';
import { RBaseComponent } from '../rmodels/RBaseComponent';

@Component({
  selector: 'rnumeric',
  standalone: true,
  imports: [RTextboxComponent, FormsModule, ReactiveFormsModule, NgStyle, RButtonComponent],
  templateUrl: './rnumeric.component.html',
  styleUrl: './rnumeric.component.css',
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(()=> RNumericComponent),
      multi: true
    }
  ]
})
export class RNumericComponent extends RBaseComponent<number> implements ControlValueAccessor {

  @Input()
  public LabelText: string = "";

  @Input()
  public LabelTextForeColor: string = "blue";

  @Input()
  public BottomLineColor: string = "blue";

  @Input()
  public TextBoxWidth: string = '150px';
  
  @Input()
  public TextBoxHeight: string = '20px';

  @Input()
  public EnableMarginTextBottom: boolean = false;

  private _value: number = 0;

  @Input()
  public EnableShadowEffect: boolean = false;

  @Input()
  PaddingLeft: string = '7px';

  @Input()
  PaddingRight: string = "7px";

  @Input()
  public MinusBackgroundColor: string = "blue";

  @Input()
  public PlusBackgroundColor: string = "blue";

  @Input()
  public MinusForeColor: string = "white";

  @Input()
  public PlusForeColor: string = "white";

  private _minValue: number = 0;
  private _maxValue: number = Number.MAX_SAFE_INTEGER;

  @Input()
  public set MinValue(value: number){

    if(value < 0 || value == undefined)
    {
      value = 0;
    }
    
    if(value > this._maxValue){
      value = this._maxValue;
    }

    if(value > Number.MAX_SAFE_INTEGER) {
      value = Number.MAX_SAFE_INTEGER;
    }

    this._minValue = value;
  }
  public get MinValue(): number {
    return this._minValue;
  }

  @Input()
  public set MaxValue(value: number){
    if(value == undefined || value > Number.MAX_SAFE_INTEGER)
    {
      value = Number.MAX_SAFE_INTEGER;
    }

    if(value < this._minValue){
      value = this._minValue;
    }

    if(value < 0) {
      value = 0;
    }

    this._maxValue = value;
  }
  public get MaxValue(): number {
    return this._maxValue;
  }

  onChanged: Function = () =>{};
  onTouched: Function = () => {};

  ErrorMessage: string = "";
  backupColor: string =  this.BottomLineColor;
  backupValue: number = this._value;

  public get ButtonHeight(): string {
    let value = this.cssUnitSer.ToPxValue(this.TextBoxHeight, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
    return (value + 4) + CssUnit.Px.toString();
  }

  public get ButtonPaddingLeft(): string {
    let value = this.cssUnitSer.ToPxValue(this.TextBoxWidth, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
    return (value - 38) + CssUnit.Px.toString();
  }

  @Input()
  public set Value(val: number){  

    val = Number(val.toString());
    
    if(val >= this.MinValue && val <= this.MaxValue) {   
      this._value = val;
      this.ErrorMessage = '';
      this.backupValue = this._value;
      this.BottomLineColor = this.backupColor;
      this.NotifyToModel();
    } else {
      if(val > this.MaxValue) {
        this.setMaxValue();
      } else {
        this.setBelowMinValue(val);
      }  
    }
    
  }
  public get Value(): number {
    return this._value;
  }

  constructor(winObj: RWindowHelper, private ele: ElementRef, private cssUnitSer: RCssUnitsService){
    super(winObj);
  }

  private setMaxValue(){
    this._value = this.MaxValue;
    this.backupValue = this._value;
    this.ErrorMessage = '';
    this.BottomLineColor = this.backupColor;
    this.NotifyToModel();
  }

  private setMinValue(){
    this._value = this.MinValue;
    this.backupValue = this._value;
    this.ErrorMessage = '';
    this.BottomLineColor = this.backupColor;
    this.NotifyToModel();
  }

  private setBelowMinValue(val: number){
    
    if(this.ErrorMessage == '') {
      this.backupColor = this.BottomLineColor;
      this.backupValue = this._value;
    }

    this._value = val;
    
    this.ErrorMessage = "Invalid min value";
    this.BottomLineColor = this.ErrorIndicatorColor;  
  }

  public Dec(){
    
    if(this._value==undefined)
      this._value = 0;

    let _num;

    if(this.ErrorMessage != '') {
      _num = Number.parseInt(this.backupValue.toString()) - 1;
    } else {
      _num = Number.parseInt(this._value.toString()) - 1;
    }

    this.validateNumValue(_num);
  }

  public Inc(){

    if(this._value==undefined)
      this._value = 0;

    let _num;

    if(this.ErrorMessage != '') {
      _num = Number.parseInt(this.backupValue.toString()) + 1;
    }
    else {
      _num = Number.parseInt(this._value.toString()) + 1;
    }

    this.validateNumValue(_num);
  }

  private validateNumValue(_num: number){

    if(_num == undefined ||  _num == null || _num.toString() == '') {
      this.Value = this.MinValue;
    }

    if(_num >= this.MinValue && _num <= this.MaxValue) {
      this.Value = _num;
    }

    if(_num < this.MinValue) {
      this.Value = this.MinValue;
    } else if(_num > this.MaxValue) {
      this.Value = this.MaxValue;
    }

  }

  writeValue(obj: any): void {
    if(obj){
      let _num = parseInt(obj);
        
      this.validateNumValue(_num);

      this.valueChanged.emit(this.Value);
    }
  }

  NotifyToModel(){
    this.onChanged(this._value);
    this.onTouched(this._value);
    this.valueChanged.emit(this._value);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

  onBlur($event: Event){
    let _num = this.ErrorMessage != '' ? parseInt(this.backupValue.toString()) : parseInt(this._value.toString());
    this.validateNumValue(_num);
  }

  keyPress($event: KeyboardEvent){
    let evt = $event || window.event;

    var regex = /[0-9]|\./;
    if(!regex.test($event.key)){
      return false;
    }

    let newValue = this.Value.toString() + evt.key;
    let _num = Number(newValue);

    if(_num > this.MaxValue) {
      return false;
    }

    return true;
  }

  onPaste($event: ClipboardEvent){
    let clip = $event.clipboardData;
    let text = clip?.getData('text');
    
    if(text) {
      var regex = /[0-9]|\./;
      if(!regex.test(text)){
        return false;
      }
    }

    let _num = Number(text);

    if(_num > this.MaxValue) {
      return false;
    }
    
    return true;
  }
}
