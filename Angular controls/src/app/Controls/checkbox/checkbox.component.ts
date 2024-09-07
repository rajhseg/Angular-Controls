import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxEventArgs, CheckboxService } from './checkbox.service';

@Component({
  selector: 'rcheckbox',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RCheckboxComponent),
    multi: true
  }]
})
export class RCheckboxComponent implements ControlValueAccessor {

  private _isChecked: boolean =false;

  @Input()
  public set IsChecked(val: boolean){
    this._isChecked = val;
  }
  public get IsChecked(): boolean {
    return this._isChecked;
  }

  @Input()
  DisplayText: string = "";

  @Input()
  DisplayTextRightAlign: boolean = true;

  @Input()
  GroupName: string = "";

  @Output()
  OnCheckChanged = new EventEmitter<CheckboxEventArgs>();

  @Output()
  OnClick = new EventEmitter<CheckboxEventArgs>();
  
  onChange: Function = () => { };

  onTouch: Function = () => { };

  constructor(private service: CheckboxService) {
    this.service.AddInstance(this);
  }

  resetValueForGroupedCheckbox($event: Event | undefined, groupname: string) {
    this.service.ResetCheckboxesForGroup($event, groupname);
  }

  check(event: Event) {
    let spanEle = (event.target as HTMLDivElement).parentElement?.querySelector('span');
    if (spanEle) {
      if (spanEle.classList.contains('check')) {
        this.IsChecked = true;
      }
      spanEle.classList.toggle('check');
    }
    this.toggleCheck(event);
  }

  toggleCheck($event: Event) {
    let checkValue = !this.IsChecked;

    if (checkValue && this.GroupName != "" && this.GroupName != null && this.GroupName != undefined) {
      this.resetValueForGroupedCheckbox($event, this.GroupName);
    }

    this.IsChecked = checkValue;
    let args=new CheckboxEventArgs($event, this.IsChecked);
    this.onChange(this.IsChecked);
    this.onTouch(this.IsChecked);
    this.OnCheckChanged.emit(args);  
    this.OnClick.emit(args); 
  }
  
  emitValueToModel($event: Event | undefined){
    let args=new CheckboxEventArgs($event, this.IsChecked);
    this.onChange(this.IsChecked);
    this.onTouch(this.IsChecked);    
    this.OnCheckChanged.emit(args);
  }

  writeValue(obj: any): void {
    if (obj == null)
      return;

    let checkValue: boolean = false;

    if(obj instanceof CheckboxEventArgs){
      checkValue = obj.isChecked;
    }
    else if (typeof obj === 'boolean') {
      checkValue = obj;
    }
    else if (typeof obj === 'string') {
      if (obj.toLowerCase() == 'true') {
        checkValue = true;
      } else {
        checkValue = false;
      }
    }

    if (checkValue && this.GroupName != "" && this.GroupName != null && this.GroupName != undefined) {
      this.resetValueForGroupedCheckbox(undefined, this.GroupName);
    }

    this.IsChecked = checkValue;
    let args=new CheckboxEventArgs(undefined, this.IsChecked);
    
    this.OnCheckChanged.emit(args);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

}
