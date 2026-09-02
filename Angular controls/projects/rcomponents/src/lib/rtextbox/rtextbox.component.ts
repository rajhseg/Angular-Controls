import { NgIf, NgStyle, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, forwardRef, HostBinding, HostListener, Input, Optional, Output, Self, ViewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormsModule, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { RWindowHelper } from '../rwindowObject';
import { RCssUnitsService } from '../rcss-units.service';
import { RBaseComponent } from '../rmodels/RBaseComponent';
import { RelativeUnitType } from '../rcss-units.service';

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
    },
    {
      provide: NG_VALIDATORS,
      useFactory: (instance: RTextboxComponent) => {
        return {
          validate: (control: AbstractControl) =>{
            return instance.getSyncErrors(control);
          }
        }
      },
      multi: true,
      deps:[forwardRef(()=> RTextboxComponent)]
    },
    {
      provide: NG_ASYNC_VALIDATORS,
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
  LabelForeColor: string = "rgb(30, 17, 152)";

  @Input()
  BottomLineColor: string = "rgb(30, 17, 152)";

  _txtHeight: string = '20px';
  _txtWidth: string = '150px';

  TextBoxWidth_C: string = '150px';
  TextBoxHeight_C: string = '20px';

  @Input()
  set TextBoxWidth(value: string) {
    this._txtWidth = value;
    if(this.ele){
      this.TextBoxWidth_C = this.cssUnitServ.ToPxString(value, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
    }
  }
  get TextBoxWidth(): string {
    return this._txtWidth;
  }

  @Input()
  set TextBoxHeight(value: string) {
    this._txtHeight = value;
    if(this.ele){
      this.TextBoxHeight_C = this.cssUnitServ.ToPxString(value, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
    }
  }
  get TextBoxHeight(): string {
    return this._txtHeight;
  }

  @Input()
  PaddingLeft: string = "7px";

  @Input()
  PaddingRight: string = "7px";

  @Input()
  Font: string = '';

  private isPassword: boolean = false;

  @Input()
  EnableMarginTextBottom: boolean = true;

  @Input()
  MarginTextBottomInPx: string = '10px';
  
  @Input()
  public set IsPasswordBox(value: boolean) {
    this.isPassword = value;
  }
  public get IsPasswordBox(): boolean {
    return this.isPassword;
  }

  private onChanged: Function = (e: string) => { };
  private onTouched: Function = (e: string) => { };

  private _textboxValue: string = "";

  InputId: string = this.winObj.GenerateUniqueId();

  public set TextboxValue(value: string) {
    if(!this.IsReadOnly) {
      this._textboxValue = value;
      this.notifyToModel();
    }
  }

  public get TextboxValue(): string {
    return this._textboxValue;
  }

  constructor(winObj: RWindowHelper, 
      private ele: ElementRef, 
      private cssUnitServ: RCssUnitsService,
      ) {
      super(winObj);
  }

  ngAfterViewInit(): void {
   
  }

  public displayPlaceholder: boolean = true;

  writeValue(obj: any): void {
    obj = obj ?? '';
    this._textboxValue = obj;
  }

  notifyToModel() {
    this.onChanged(this.TextboxValue);
    this.onTouched(this.TextboxValue);
    this.valueChanged.emit(this.TextboxValue);
  }

  protected override IsValidatorSupported(): boolean {
    return true;
  }
  
  protected override getValue() {
    return this.TextboxValue;
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
    this._formDisabled = isDisabled ? true : null;
  }

}
