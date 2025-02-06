import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, forwardRef, HostBinding, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonService, RadioEventArgs } from './radiobutton.service';
import { WindowHelper } from '../windowObject';
import { CssUnit, CssUnitsService, RelativeUnitType } from '../css-units.service';

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

  @HostBinding('id')
  HostElementId: string = this.windowHelper.GenerateUniqueId();

  Id: string = '';

  @Input()
  IsChecked: boolean = false;

  @Input()
  DisplayText: string = "";

  @Input()
  DisplayTextRightAlign: boolean = true;

  
  @Input()
  Font: string = '';

  @Input()
  ReadOnly: boolean = false;

  @Input()
  Disabled: boolean = false;

  @Input()
  GroupName: string = "";

  @Output()
  OnCheckChanged = new EventEmitter<RadioEventArgs>();


  @Input()
  DesignWidth: string = '16px';

  get OuterCircle(): string {
    let val = this.cssUnitSer.ToPxValue(this.DesignWidth, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
    return val+CssUnit.Px.toString();
  }

  get InnerCircle(): string {
    let val = this.cssUnitSer.ToPxValue(this.DesignWidth, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
    return (val - 4) +CssUnit.Px.toString();
  }

  @Input()
  Color: string = "#00c7ba";

  @Output()
  OnClick = new EventEmitter<RadioEventArgs>();

  
  
  @Output()
  focus = new EventEmitter<any>();

  @Output()
  blur = new EventEmitter<any>();

  @Output()
  cut = new EventEmitter<any>();

  @Output()
  copy = new EventEmitter<any>();

  @Output()
  paste = new EventEmitter<any>();

  @Output()
  keydown = new EventEmitter<any>();

  @Output()
  keyup = new EventEmitter<any>();

  @Output()
  keypress = new EventEmitter<any>();

  @Output()
  mouseenter = new EventEmitter<any>();

  @Output()
  mousedown = new EventEmitter<any>();

  @Output()
  mouseup = new EventEmitter<any>();

  @Output()
  mouseleave = new EventEmitter<any>();

  @Output()
  mousemove = new EventEmitter<any>();

  @Output()
  mouseout = new EventEmitter<any>();

  @Output()
  mouseover = new EventEmitter<any>();

  @Output()
  dblclick = new EventEmitter<any>();

  @Output()
  drag = new EventEmitter<any>();

  @Output()
  dragend = new EventEmitter<any>();

  @Output()
  dragenter = new EventEmitter<any>();

  @Output()
  dragleave = new EventEmitter<any>();

  @Output()
  dragover = new EventEmitter<any>();

  @Output()
  dragstart = new EventEmitter<any>();

  @Output()
  drop = new EventEmitter<any>();

  onChange: Function = () => { };

  onTouch: Function = () => { };

  @Input()
  LabelColor: string = "black";

  constructor(private service: RadioButtonService, private windowHelper: WindowHelper,
    private cssUnitSer: CssUnitsService, private ele: ElementRef
  ) {
    this.service.AddInstance(this);
    this.Id = this.windowHelper.GenerateUniqueId();
  }

  
  OnBlur($event: any) {
    this.blur.emit($event);
  }

  OnFocus($event: any) {
    this.focus.emit($event);
  }

  OnCut($event: any) {
    this.cut.emit($event);
  }

  OnCopy($event: any) {
    this.copy.emit($event);
  }

  OnPaste($event: any) {
    this.paste.emit($event);
  }

  OnKeyDown($event: any) {
    this.keydown.emit($event);
  }

  OnKeyUp($event: any) {
    this.keyup.emit($event);
  }

  OnKeyPress($event: any) {
    this.keypress.emit($event);
  }

  OnMouseEnter($event: any) {
    this.mouseenter.emit($event);
  }

  OnMouseDown($event: any) {
    this.mousedown.emit($event);
  }

  OnMouseUp($event: any) {
    this.mouseup.emit($event);
  }


  OnMouseLeave($event: any) {
    this.mouseleave.emit($event);
  }

  OnMouseMove($event: any) {
    this.mousemove.emit($event);
  }

  OnMouseOut($event: any) {
    this.mouseout.emit($event);
  }

  OnMouseOver($event: any) {
    this.mouseover.emit($event);
  }

  OnDoubleClick($event: any) {
    this.dblclick.emit($event);
  }

  OnDrag($event: any) {
    this.drag.emit($event);
  }

  OnDragEnd($event: any) {
    this.dragend.emit($event);
  }

  OnDragEnter($event: any) {
    this.dragenter.emit($event);
  }

  OnDragLeave($event: any) {
    this.dragleave.emit($event);
  }

  OnDragOver($event: any) {
    this.dragover.emit($event);
  }

  OnDragStart($event: any) {
    this.dragstart.emit($event);
  }

  OnDrop($event: any) {
    this.drop.emit($event);
  }

  resetValueForGroupedCheckbox($event: Event | undefined, groupname: string) {
    this.service.ResetRadioButtonsForGroup($event, groupname);
  }

  check(event: Event) {
    if(!this.ReadOnly && !this.Disabled) {
      let spanEle = (event.target as HTMLDivElement).parentElement?.querySelector('span');
      if (spanEle) {
        if (spanEle.classList.contains('round')) {
          this.IsChecked = true;
        }
        spanEle.classList.toggle('round');
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
      let args=new RadioEventArgs($event, this.IsChecked);
      this.onChange(this.IsChecked);
      this.onTouch(this.IsChecked);
      this.OnCheckChanged.emit(args);
      this.OnClick.emit(args);
    }
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
    this.Disabled = isDisabled;
  }
  
}
