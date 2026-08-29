import { Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";
import { AbstractControl, ControlValueAccessor, FormsModule, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { RButtonComponent } from "../rbutton/rbutton.component";
import { RWindowHelper } from '../rwindowObject';
import { CssUnit, RCssUnitsService, RelativeUnitType } from '../rcss-units.service';
import { RBaseComponent, ValidatorValueType } from '../rmodels/RBaseComponent';

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
    },
    {
      provide: NG_VALIDATORS,
      useFactory: (instance: RNumericComponent) => {
        return {
          validate: (control: AbstractControl) =>{
            return instance.getSyncErrors(control);
          }
        }
      },
      multi: true,
      deps:[forwardRef(()=> RNumericComponent)]
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => RNumericComponent),
      multi: true
    }
  ]
})
export class RNumericComponent extends RBaseComponent<number> implements ControlValueAccessor {

  @Input()
  public LabelText: string = "";

  @Input()
  public LabelTextForeColor: string = "rgb(30, 17, 152)";

  private _bottomColor: string = "rgb(30, 17, 152)";

  @Input()
  set BottomLineColor(value: string) {
    this._bottomColor = value;
  }
  get BottomLineColor(): string {
    return this._bottomColor;
  }

  private _textboxWidth: string = '150px';
  private _textboxHeight: string = '20px';
  
  public TextBoxHeight_C: string = '20px';
  
  public TextBoxWidth_C: string = '150px';

  @Input()
  public set TextBoxWidth(value: string) {
    this._textboxWidth = value;
    if(this.ele){
      this.TextBoxWidth_C = this.cssUnitSer.ToPxString(value, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
    }
  }
  public get TextBoxWidth(): string {
    return this._textboxWidth;
  }
  
  @Input()
  public set TextBoxHeight(value: string) {
    this._textboxHeight = value;
    if(this.ele){
      this.TextBoxHeight_C = this.cssUnitSer.ToPxString(value, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
    }
  }
  public get TextBoxHeight(): string {
    return this._textboxHeight;
  }


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
  public MinusBackgroundColor: string = "rgb(30, 17, 152)";

  @Input()
  public PlusBackgroundColor: string = "rgb(30, 17, 152)";

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

  private onChanged: Function = () =>{};
  private onTouched: Function = () => {};

  ErrorMessage: string = "";
  backupColor: string =  this.BottomLineColor;
  backupValue: number = this._value;

  public get ButtonHeight(): string {
    let value = this.cssUnitSer.ToPxValue(this.TextBoxHeight_C, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
    return (value + 4) + CssUnit.Px.toString();
  }

  public get ButtonPaddingLeft(): string {
    let value = this.cssUnitSer.ToPxValue(this.TextBoxWidth_C, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
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
        this.setAboveMaxValue(val);
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

  private setAboveMaxValue(val: number){
    if(this.ErrorMessage == '') {
      this.backupColor = this.BottomLineColor;
      this.backupValue = this._value;
    }

    this._value = val;
    
    this.ErrorMessage = "Invalid max value";
    this.BottomLineColor = this.ErrorIndicatorColor;  
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
    
    if(this.IsReadOnly || this.IsDisabled)
      return;

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

    if(this.IsReadOnly || this.IsDisabled)
      return;
    
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

  private validateNumValue(_num: number) {
    if (_num === undefined || _num === null || Number.isNaN(_num)) {
      this.Value = this.MinValue;
      return;
    }

    if (_num >= this.MinValue && _num <= this.MaxValue) {
      this.Value = _num;
    } else if (_num < this.MinValue) {
      this.Value = this.MinValue;
    } else if (_num > this.MaxValue) {
      this.Value = this.MaxValue;
    }
  }

  writeValue(obj: any): void {
    if (obj !== null && obj !== undefined && obj !== '') {
      const parsed = typeof obj === 'number' ? obj : parseFloat(String(obj));
      if (!Number.isNaN(parsed)) {
        this.validateNumValue(parsed);
      } else {
        this.Value = this.MinValue;
      }
    }
  }

  NotifyToModel(){
    this.onChanged(this._value);
    this.onTouched(this._value);
    this.valueChanged.emit(this._value);
  }

  protected override IsValidatorSupported(): boolean {
    return true;
  }
  
  protected override GetValidatorValueType(): ValidatorValueType {
    return ValidatorValueType.Range;
  }

  protected override getValue() {
    this.min = this.MinValue;
    this.max = this.MaxValue;
    return this.Value;
  }
  
  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._formDisabled = isDisabled ? true : null;
  }

  onBlur($event: Event) {
    const rawVal = this.ErrorMessage !== '' ? this.backupValue : this._value;
    const num = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal));
    this.validateNumValue(Number.isNaN(num) ? this.MinValue : num);
  }

  keyPress($event: KeyboardEvent): boolean {
    const key = $event.key;

    // Allow modifier key combinations (Ctrl+A, Ctrl+C, Ctrl+V, etc.)
    if ($event.ctrlKey || $event.metaKey || $event.altKey) {
      return true;
    }

    // Allow standard control/navigation keys
    if (
      key === 'Backspace' ||
      key === 'Delete' ||
      key === 'Tab' ||
      key === 'Escape' ||
      key === 'Enter' ||
      key === 'ArrowLeft' ||
      key === 'ArrowRight' ||
      key === 'ArrowUp' ||
      key === 'ArrowDown' ||
      key === 'Home' ||
      key === 'End'
    ) {
      return true;
    }

    const isDigit = /^[0-9]$/.test(key);
    const currentStr = String(this._value ?? '');
    const alreadyHasDot = currentStr.includes('.');
    const isDot = key === '.';
    const isMinus = key === '-' && this.MinValue < 0 && !currentStr.includes('-');

    if (!isDigit && !(isDot && !alreadyHasDot) && !isMinus) {
      $event.preventDefault();
      return false;
    }

    return true;
  }

  onPaste($event: ClipboardEvent): boolean {
    const clip = $event.clipboardData;
    const text = clip?.getData('text')?.trim();
    
    if (!text) {
      $event.preventDefault();
      return false;
    }

    // Strictly validate that the full pasted text is an anchored valid number
    const strictNumericRegex = /^-?\d+(\.\d+)?$/;
    if (!strictNumericRegex.test(text)) {
      $event.preventDefault();
      return false;
    }

    const num = parseFloat(text);
    if (Number.isNaN(num)) {
      $event.preventDefault();
      return false;
    }

    if (num > this.MaxValue || num < this.MinValue) {
      $event.preventDefault();
      this.validateNumValue(num);
      return false;
    }

    return true;
  }
}
