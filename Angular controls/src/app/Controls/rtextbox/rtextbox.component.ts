import { NgIf, NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rtextbox',
  standalone: true,
  imports: [NgIf, NgStyle, FormsModule, ReactiveFormsModule],
  templateUrl: './rtextbox.component.html',
  styleUrl: './rtextbox.component.css',
  host: {
    "(window:click)": "windowOnClick($event)"
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
  IsReadOnly: boolean = false;

  @Input()
  TextBoxWidth: number = 200;

  @Output()
  valueChanged = new EventEmitter<string>();

  @Output()
  Click = new EventEmitter<any>();

  private isPassord: boolean = false;

  @Input()
  EnableMarginTextBottom: boolean = true;

  @Input()
  MarginTextBottom: number = 10;
  
  @Input()
  public set IsPasswordBox(value: boolean) {
    this.isPassord = value;
  }
  public get IsPasswordBox(): boolean {
    return this.isPassord;
  }

  onChanged: Function = (e: string) => { };
  onTouched: Function = (e: string) => { };

  private _textboxValue: string = "";

  public set TextboxValue(value: string) {
    this._textboxValue = value;
    this.notifyToModel();
  }

  public get TextboxValue(): string {
    return this._textboxValue;
  }

  constructor(private winObj: WindowHelper) {

  }

  ngAfterViewInit(): void {
   
  }

  public displayPlaceholder: boolean = true;



  txtboxClicked($event: Event) {
    this.Click.emit($event);
  }

  windowOnClick($event: Event) {

  }

  @HostListener('onblur', ['$event'])
  blur($event: Event) {

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

  }

}
