import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxEventArgs, CheckboxService } from './checkbox.service';
import { WindowHelper } from '../windowObject';
import { RBaseComponent } from '../Models/RBaseComponent';

@Component({
  selector: 'rcheckbox',
  standalone: true,
  imports: [NgClass, NgIf, NgStyle],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RCheckboxComponent),
    multi: true
  }]
})
export class RCheckboxComponent extends RBaseComponent<CheckboxEventArgs> implements ControlValueAccessor {

  private _isChecked: boolean =false;
  
  sizes: CheckBoxSizeModel[] = [
    new CheckBoxSizeModel(CheckBoxSize.x_small, "10px", "10px", "1px", "-5px"),
    new CheckBoxSizeModel(CheckBoxSize.smaller, "12px", "12px", "1px", "-3px"),
    new CheckBoxSizeModel(CheckBoxSize.small, "13px", "13px", "2px", "-2px"),
    new CheckBoxSizeModel(CheckBoxSize.medium, "15px", "15px", "2px", "-3px"),
    new CheckBoxSizeModel(CheckBoxSize.larger, "17px", "17px", "2px", "-5px"),
    new CheckBoxSizeModel(CheckBoxSize.large, "19px", "19px", "3px", "-3px"),
  ]

  private currentSize: CheckBoxSize = CheckBoxSize.x_small;

  @Input()
  set Size(val: CheckBoxSize){
    this.currentSize = val;
  }
  get Size(): CheckBoxSize {
    return this.currentSize;
  }

  get RenderSize(): CheckBoxSizeModel {
    return this.sizes.filter(x=>x.Size==this.currentSize)[0];
  }

  @Input()
  public set IsChecked(val: boolean){
    this._isChecked = val;
  }
  public get IsChecked(): boolean {
    return this._isChecked;
  }

  @Input()
  Font: string = '';

  @Input()
  ReadOnly: boolean = false;

  @Input()
  Disabled: boolean = false;

  @Input()
  DisplayText: string = "";

  @Input()
  DisplayTextRightAlign: boolean = true;

  @Input()
  GroupName: string = "";

  @Output()
  OnCheckChanged = new EventEmitter<CheckboxEventArgs>();

  @Output()
  OnCheckBoxClick = new EventEmitter<CheckboxEventArgs>();
  
  onChange: Function = () => { };

  onTouch: Function = () => { };

  @Input()
  CheckedColor: string = "#00c7ba";

  @Input()
  LabelColor: string = "black";
  
  constructor(private windowHelper: WindowHelper, private service: CheckboxService) {
    super(windowHelper);
    this.HostElementId = this.windowHelper.GenerateUniqueId();
    this.Id = this.windowHelper.GenerateUniqueId();
    this.service.AddInstance(this);
  }

  resetValueForGroupedCheckbox($event: Event | undefined, groupname: string) {
    this.service.ResetCheckboxesForGroup($event, groupname);
  }

  check(event: Event) {
    if(!this.ReadOnly && !this.Disabled) {
      let spanEle = (event.target as HTMLDivElement).parentElement?.querySelector('span');
      if (spanEle) {
        if (spanEle.classList.contains('check')) {
          this.IsChecked = true;
        }
        spanEle.classList.toggle('check');
      }
      
      this.toggleCheck(event);
    }
  }

  toggleCheck($event: Event) {
    if(!this.ReadOnly) {
      let checkValue = !this.IsChecked;

      if (checkValue && this.GroupName != "" && this.GroupName != null && this.GroupName != undefined) {
        this.resetValueForGroupedCheckbox($event, this.GroupName);
      }

      this.IsChecked = checkValue;
      let args=new CheckboxEventArgs($event, this.IsChecked);
      this.onChange(this.IsChecked);
      this.onTouch(this.IsChecked);
      this.OnCheckChanged.emit(args);  
      this.OnCheckBoxClick.emit(args); 
    }
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
    this.Disabled = isDisabled;
  }

}

export enum CheckBoxSize {
  x_small = "x-small",
  smaller = "smaller",
  small = "small",
  medium = "medium",
  larger = "larger",
  large = "large"
}

export class CheckBoxSizeModel {
  constructor(public Size:CheckBoxSize, 
    public Width: string, 
    public Height:string, 
    public Left: string, 
    public Top: string) {

  }
}
