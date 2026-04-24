import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, DestroyRef, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxEventArgs, CheckboxService } from './rcheckbox.service';
import { RWindowHelper } from '../rwindowObject';
import { RBaseComponent, ValidatorValueType } from '../rmodels/RBaseComponent';

@Component({
  selector: 'rcheckbox',
  standalone: true,
  imports: [NgClass, NgIf, NgStyle],
  templateUrl: './rcheckbox.component.html',
  styleUrl: './rcheckbox.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RCheckboxComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RCheckboxComponent),
      multi: true
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => RCheckboxComponent),
      multi: true
    }]
})
export class RCheckboxComponent extends RBaseComponent<CheckboxEventArgs> implements ControlValueAccessor {

  private _isChecked: boolean =false;
  

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
  DisplayText: string = "";

  @Input()
  DisplayTextRightAlign: boolean = true;

  @Input()
  GroupName: string = "";

  @Output()
  OnCheckChanged = new EventEmitter<CheckboxEventArgs>();

  @Output()
  OnCheckBoxClick = new EventEmitter<CheckboxEventArgs>();
  
  private onChange: Function = () => { };

  private onTouch: Function = () => { };

  @Input()
  CheckedColor: string = "#00c7ba";

  @Input()
  LabelColor: string = "black";

  @Input()
  CheckSize: string = "12px";
  
  constructor(private windowHelper: RWindowHelper, private service: CheckboxService, private destroyRef: DestroyRef) {
    super(windowHelper);
    this.HostElementId = this.windowHelper.GenerateUniqueId();
    this.Id = this.windowHelper.GenerateUniqueId();
    this.service.AddInstance(this);

    this.destroyRef.onDestroy(this.OnDestroy.bind(this));
  }

  OnDestroy() {
    this.service.RemoveInstance(this);
  }

  private resetValueForGroupedCheckbox($event: Event | undefined, groupname: string) {
    this.service.ResetCheckboxesForGroup($event, groupname, this);
  }

  check(event: Event) {
    if(!this.IsReadOnly && !this.IsDisabled) {  
      this.toggleCheck(event);
    }
  }

  private toggleCheck($event: Event) {
    if(!this.IsReadOnly) {
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
      this.valueChanged.emit(args);
    }
  }
    
  protected override IsValidatorSupported(): boolean {
    return true;
  }
  
  protected override GetValidatorValueType(): ValidatorValueType {
    return ValidatorValueType.Switch;
  }

  protected override getValue() {
    return this.IsChecked;
  }

  emitValueToModel($event: Event | undefined){
    let args=new CheckboxEventArgs($event, this.IsChecked);
    this.onChange(this.IsChecked);
    this.onTouch(this.IsChecked);    
    this.OnCheckChanged.emit(args);
    this.valueChanged.emit(args);
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

    let sameValue = false;

    if(this.IsChecked==checkValue)
      sameValue = true;

    if(!sameValue) {
    
      if (checkValue && this.GroupName != "" && this.GroupName != null && this.GroupName != undefined) {
        this.resetValueForGroupedCheckbox(undefined, this.GroupName);
      }

      this.IsChecked = checkValue;

      let args=new CheckboxEventArgs(undefined, this.IsChecked);
    
      this.OnCheckChanged.emit(args);
      this.valueChanged.emit(args);
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

}

