import { NgStyle } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RWindowHelper } from '../rwindowObject';
import { RBaseComponent } from '../rmodels/RBaseComponent';
import { RCssUnitsService, RelativeUnitType } from '../rcss-units.service';

@Component({
  selector: 'rbutton',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './rbutton.component.html',
  styleUrl: './rbutton.component.css'
})
export class RButtonComponent extends RBaseComponent<any> {

  @Output()
  public ButtonClick = new EventEmitter<any>();

  @Input()
  public EnableBackDrop: boolean = false;
  
  _buttonWidth: string = '100px';
  _buttonHeight: string = '32px';

  ButtonWidth_C: string = '100px';
  ButtonHeight_C: string = '32px';

  @Input()
  public set ButtonWidth(value: string) {
    if(this.ele){
      this.ButtonWidth_C = this.cssServ.ToPxString(value, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
    }
    this._buttonWidth = value;
  }
  public get ButtonWidth(): string {
    return this._buttonWidth;
  }

  @Input()
  public set ButtonHeight(value: string) {
    if(this.ele){
      this.ButtonHeight_C = this.cssServ.ToPxString(value, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
    }
    this._buttonHeight = value;
  }
  public get ButtonHeight(): string {
    return this._buttonHeight;
  }

  @Input()
  public ButtonType: string = "button";

  @Input()
  ForeColor: string = "whitesmoke";

  @Input()
  BackgroundColor: string = "blue";
  
  onClick($event: any){
    this.ButtonClick.emit($event);
  }

  constructor(winObj: RWindowHelper, private cssServ: RCssUnitsService, private ele: ElementRef){
    super(winObj);
    this.Id = this.winObj.GenerateUniqueId();
    this.HostElementId = this.winObj.GenerateUniqueId();
  }

}
