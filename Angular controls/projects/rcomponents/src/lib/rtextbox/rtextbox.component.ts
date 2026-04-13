import { NgIf, NgStyle, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RWindowHelper } from '../rwindowObject';
import { RCssUnitsService } from '../rcss-units.service';
import { RBaseComponent } from '../rmodels/RBaseComponent';

@Component({
  selector: 'rtextbox',
  standalone: true,
  imports: [NgIf, NgStyle, FormsModule, ReactiveFormsModule, NgClass],
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
export class RTextboxComponent extends RBaseComponent<string> implements ControlValueAccessor, AfterViewInit {

  @Input()
  EnableBoxShadow: boolean = false;

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
  TextBoxWidth: string = '150px';

  @Input()
  SpaceAtStartChar: string = "7px";

  @Input()
  TextBoxHeight: string = '20px';

  @Input()
  Font: string = '';

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

  InputId: string = this.winObj.GenerateUniqueId();

  public set TextboxValue(value: string) {
    if(this._textboxValue != value && !this.ReadOnly) {
      this._textboxValue = value;
      this.notifyToModel();
    }
  }

  public get TextboxValue(): string {
    return this._textboxValue;
  }

  constructor(winObj: RWindowHelper, 
      private ele: ElementRef, 
      private cssUnitServ: RCssUnitsService) {
    super(winObj);
  }

  ngAfterViewInit(): void {
   
  }

  public displayPlaceholder: boolean = true;

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
