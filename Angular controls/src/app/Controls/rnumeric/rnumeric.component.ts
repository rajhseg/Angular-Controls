import { Component, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { RbuttonComponent } from "../rbutton/rbutton.component";
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rnumeric',
  standalone: true,
  imports: [RTextboxComponent, FormsModule, ReactiveFormsModule, NgStyle, RbuttonComponent],
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
export class RNumericComponent implements ControlValueAccessor {

  @Input()
  public LabelText: string = "";

  @Input()
  public LabelTextForeColor: string = "blue";

  @Input()
  public BottomLineColor: string = "blue";

  @Input()
  public TextBoxWidth: number = 80;
  
  public TextBoxHeight: number = 16;

  @Input()
  public EnableMarginTextBottom: boolean = false;

  private _value: number = 0;

  @Input()
  public EnableShadowEffect: boolean = false;

  @Output()
  public ValueChanged = new EventEmitter<number>();

  @Input()
  public MinusBackgroundColor: string = "blue";

  @Input()
  public PlusBackgroundColor: string = "blue";

  @Input()
  public MinusForeColor: string = "white";

  @Input()
  public PlusForeColor: string = "white";

  @Input()
  public IsReadOnly: boolean = false;

  onChanged: Function = () =>{};
  onTouched: Function = () => {};

  @Input()
  public set Value(val: number){    
      this._value = val;
      this.NotifyToModel();    
  }
  public get Value(): number {
    return this._value;
  }

  Id: string = '';

  @HostBinding('id')
  HostElementId: string = this.winObj.GenerateUniqueId();

  constructor(private winObj: WindowHelper){
    this.Id = this.winObj.GenerateUniqueId();
  }

  public Dec(){
    
    if(this._value==undefined)
      this._value = 0;

    this.Value = Number.parseInt(this._value.toString()) -1;
  }

  public Inc(){

    if(this._value==undefined)
      this._value = 0;

    this.Value = Number.parseInt(this._value.toString()) + 1;
  }

  writeValue(obj: any): void {
    if(obj){
      this._value = parseInt(obj);
      this.ValueChanged.emit(this._value);
    }
  }

  NotifyToModel(){
    this.onChanged(this._value);
    this.onTouched(this._value);
    this.ValueChanged.emit(this._value);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

  keyPress($event: KeyboardEvent){
    let evt = $event || window.event;

    var regex = /[0-9]|\./;
    if(!regex.test($event.key)){
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
    
    return true;
  }
}
