import { NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { WindowHelper } from '../windowObject';
import { CssUnitsService } from '../css-units.service';

@Component({
  selector: 'rtextbox',
  standalone: true,
  imports: [NgIf, NgStyle, FormsModule, ReactiveFormsModule],
  templateUrl: './rtextbox.component.html',
  styleUrl: './rtextbox.component.css',
  host: {
    
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RTextboxComponent),
      multi: true
    }
  ]
})
export class RTextboxComponent implements ControlValueAccessor, AfterViewInit {

  @Input()
  LabelText: string = "";

  @Input()
  PlaceholderText: string = "";

  @Input()
  LabelForeColor: string = "blue";

  @Input()
  BottomLineColor: string = "blue";

  @Input()
  ReadOnly: boolean = false;

  @Input()
  Disabled: boolean = false;

  @Input()
  TextBoxWidth: string = '200px';

  @Input()
  TextBoxHeight: string = '30px';

  @Input()
  Font: string = '';

  @Output()
  valueChanged = new EventEmitter<string>();

  @Output()
  Click = new EventEmitter<any>();

  private isPassword: boolean = false;

  @Input()
  EnableMarginTextBottom: boolean = true;

  @Input()
  MarginTextBottom: string = '10px';
  
  @Input()
  public set IsPasswordBox(value: boolean) {
    this.isPassword = value;
  }
  public get IsPasswordBox(): boolean {
    return this.isPassword;
  }

  onChanged: Function = (e: string) => { };
  onTouched: Function = (e: string) => { };

  private _textboxValue: string = "";

  public set TextboxValue(value: string) {
    if(this._textboxValue != value && !this.ReadOnly) {
      this._textboxValue = value;
      this.notifyToModel();
    }
  }

  public get TextboxValue(): string {
    return this._textboxValue;
  }

  Id: string = '';

  
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
  click = new EventEmitter<any>();

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

  
  @HostBinding('id')
  HostElementId: string = this.winObj.GenerateUniqueId();

  constructor(private winObj: WindowHelper, 
      private ele: ElementRef, 
      private cssUnitServ: CssUnitsService) {
    this.Id = this.winObj.GenerateUniqueId();
  }

  ngAfterViewInit(): void {
   
  }

  public displayPlaceholder: boolean = true;

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

  OnBlur($event: any){
    this.blur.emit($event);
  }

  txtboxClicked($event: Event) {
    this.Click.emit($event);
  }

  writeValue(obj: any): void {
    this._textboxValue = obj;
    this.notifyToUI();
  }

  notifyToModel() {
    this.onChanged(this.TextboxValue);
    this.onTouched(this.TextboxValue);
    this.valueChanged.emit(this.TextboxValue);
  }

  notifyToUI() {
    this.valueChanged.emit(this.TextboxValue);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.Disabled = isDisabled;
  }

}
