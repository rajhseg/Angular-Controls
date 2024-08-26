import { NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, forwardRef, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'rtextbox',
  standalone: true,
  imports: [NgIf, NgStyle, FormsModule, ReactiveFormsModule],
  templateUrl: './rtextbox.component.html',
  styleUrl: './rtextbox.component.css',
  host: {
    "(window:click)": "windowOnClick($event)"
  },
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:forwardRef(()=> RTextboxComponent),
      multi: true
    }
  ]
})
export class RTextboxComponent implements ControlValueAccessor {

  @Input()
  LabelText: string = "";

  @Input()
  PlaceholderText: string = "";

  @Input()
  LabelForeColor: string = "purple";

  @Output()
  valueChanged = new EventEmitter<string>();

  onChanged:  Function = (e:string)=>{ };
  onTouched: Function = (e: string)=> { };

  private _textboxValue: string = "";

  public set TextboxValue(value: string){
    this._textboxValue = value;
    this.notifyToModel();
  }
  
  public get TextboxValue(): string {
    return this._textboxValue;
  }


  public displayPlaceholder: boolean = true;



  txtboxClicked($event: Event){
    
  }

  windowOnClick($event: Event) {   
    
  }

  @HostListener('onblur',['$event'])
  blur($event: Event){
    
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

  notifyToUI(){
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
