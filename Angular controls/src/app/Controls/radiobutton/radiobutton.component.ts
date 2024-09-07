import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonService, RadioEventArgs } from './radiobutton.service';

@Component({
  selector: 'rradiobutton',
  standalone: true,
  imports: [NgClass, NgIf, NgStyle],
  templateUrl: './radiobutton.component.html',
  styleUrl: './radiobutton.component.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RRadiobuttonComponent),
    multi: true
  }]
})
export class RRadiobuttonComponent implements ControlValueAccessor{

  
  @Input()
  IsChecked: boolean = false;

  @Input()
  DisplayText: string = "";

  @Input()
  DisplayTextRightAlign: boolean = true;

  @Input()
  GroupName: string = "";

  @Output()
  OnCheckChanged = new EventEmitter<RadioEventArgs>();

  @Input()
  Color: string = "#00c7ba";

  @Output()
  OnClick = new EventEmitter<RadioEventArgs>();

  onChange: Function = () => { };

  onTouch: Function = () => { };

  constructor(private service: RadioButtonService) {
    this.service.AddInstance(this);
  }

  resetValueForGroupedCheckbox($event: Event | undefined, groupname: string) {
    this.service.ResetRadioButtonsForGroup($event, groupname);
  }

  check(event: Event) {
    let spanEle = (event.target as HTMLDivElement).parentElement?.querySelector('span');
    if (spanEle) {
      if (spanEle.classList.contains('round')) {
        this.IsChecked = true;
      }
      spanEle.classList.toggle('round');
    }
    this.toggleCheck(event);
  }

  toggleCheck($event: Event) {
    let checkValue = !this.IsChecked;

    if (checkValue && this.GroupName != "" && this.GroupName != null && this.GroupName != undefined) {
      this.resetValueForGroupedCheckbox($event, this.GroupName);
    }

    this.IsChecked = checkValue;
    let args=new RadioEventArgs($event, this.IsChecked);
    this.onChange(this.IsChecked);
    this.onTouch(this.IsChecked);
    this.OnCheckChanged.emit(args);
    this.OnClick.emit(args);
  }

  emitValueToModel($event: Event | undefined){
    let args=new RadioEventArgs($event, this.IsChecked);
    this.onChange(this.IsChecked);
    this.onTouch(this.IsChecked);
    this.OnCheckChanged.emit(args);
  }

  writeValue(obj: any): void {
    if (obj == null)
      return;

    let checkValue: boolean = false;

    if(obj instanceof RadioEventArgs){
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
    let args=new RadioEventArgs(undefined, this.IsChecked);
    
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
