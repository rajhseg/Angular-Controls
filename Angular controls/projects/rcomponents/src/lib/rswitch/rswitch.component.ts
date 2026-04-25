import { NgStyle } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output, forwardRef, output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RWindowHelper } from '../rwindowObject';
import { RBaseComponent, ValidatorValueType } from '../rmodels/RBaseComponent';

@Component({
  selector: 'rswitch',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './rswitch.component.html',
  styleUrl: './rswitch.component.css',
  providers:[
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RSwitchComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useFactory: (instance: RSwitchComponent) => {
        return {
          validate: (control: AbstractControl) =>{
            return instance.getSyncErrors(control);
          }
        }
      },
      multi: true,
      deps:[forwardRef(()=> RSwitchComponent)]
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => RSwitchComponent),
      multi: true
    }
  ]
})
export class RSwitchComponent extends RBaseComponent<boolean> implements ControlValueAccessor {

  @Input() 
  DisplayLabel: string = '';

  @Input()
  LabelForeColor: string = 'blue';

  private _backColor: string = 'rgba(27, 81, 199, 0.692)';

  @Input()
  set SwitchBackColor(val: string){
    this._backColor = val;
  }
  get SwitchBackColor(): string{
   return this._backColor;
 }

  isChecked: boolean = false;

  private onChange: Function = ()=>{};

  private onTouch: Function = () => {};

  @Output()
  checked = new EventEmitter<boolean>(); // output<boolean>();

  constructor(winObj: RWindowHelper){
    super(winObj);
    this.FontSize = "13px";
  }

  writeValue(obj: any): void {
    
    let val = false;
    
    if(typeof obj === 'boolean'){
      val = obj;
    }
    else if(typeof obj === 'string'){
      if(obj.toLowerCase() == 'true'){
        val = true;
      } else{
        val = false;
      }
    } 

    let sameValue = false;

    if(this.isChecked == val)
      sameValue = true;

    this.isChecked = val;

    if(!sameValue) {
      this.checked.emit(this.isChecked);
      this.valueChanged.emit(this.isChecked);
    }
    
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._formDisabled = isDisabled ? true : null;
  }
  
  toggle() {
    
    if(this.IsReadOnly || this.IsDisabled)
      return;

    this.isChecked = !this.isChecked;        
    this.onChange(this.isChecked);
    this.onTouch(this.isChecked);
    this.checked.emit(this.isChecked);
    this.valueChanged.emit(this.isChecked);
  }

  blockTriggerChange(event: Event) {
    if(this.IsReadOnly || this.IsDisabled) {
      event.preventDefault();
    }
  }

  protected override IsValidatorSupported(): boolean {
    return true;
  }
  
  protected override GetValidatorValueType(): ValidatorValueType {
    return ValidatorValueType.Switch; 
  }

  protected override getValue() {
    return this.isChecked;
  }

}
