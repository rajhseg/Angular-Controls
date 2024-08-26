import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'rswitch',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.css',
  providers:[
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true
    }
  ]
})
export class SwitchComponent implements ControlValueAccessor {

  @Input() 
  DisplayLabel: string = '';

  private _backColor: string = 'rgba(27, 81, 199, 0.692)';

  @Input()
  set SwitchBackColor(val: string){
    this._backColor = val;
  }
  get SwitchBackColor(): string{
   return this._backColor;
 }

  isChecked: boolean = false;

  onChange: Function = ()=>{};

  onTouch: Function = () => {};

  @Output()
  checked = new EventEmitter<boolean>(); // output<boolean>();

  writeValue(obj: any): void {
    
    if(typeof obj === 'boolean'){
      this.isChecked = obj;
    }
    else if(typeof obj === 'string'){
      if(obj.toLowerCase() == 'true'){
        this.isChecked = true;
      } else{
        this.isChecked = false;
      }
    } 

    this.checked.emit(this.isChecked);
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }
  
  toggle() {
    this.isChecked = !this.isChecked;        
    this.onChange(this.isChecked);
    this.onTouch(this.isChecked);
    this.checked.emit(this.isChecked);
  }
}
