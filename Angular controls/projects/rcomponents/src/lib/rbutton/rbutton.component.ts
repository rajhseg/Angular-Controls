import { NgStyle } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RWindowHelper } from '../rwindowObject';
import { ValidateProp } from '../rvalidator';

@Component({
  selector: 'rbutton',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './rbutton.component.html',
  styleUrl: './rbutton.component.css'
})
export class RButtonComponent {

  @Output()
  public ButtonClick = new EventEmitter<any>();

  @Input()
  @ValidateProp("boolean")
  public EnableBackDrop: boolean = false;
  
  @Input()
  @ValidateProp("size")
  public ButtonWidth: string = '100px';

  @Input()
  @ValidateProp("size")
  public ButtonHeight: string = '32px';

  @Input()
  @ValidateProp("label")
  public ButtonType: string = "button";

  @Input()
  @ValidateProp("color")
  ForeColor: string = "whitesmoke";

  @Input()
  @ValidateProp("color")
  BackgroundColor: string = "blue";

  @Input()
  @ValidateProp("boolean")
  IsDisabled: boolean = false;
  
  onClick($event: any){
    this.ButtonClick.emit($event);
  }

  Id: string = '';

  @HostBinding('id')
  HostElementId: string = '';

  constructor(private winObj: RWindowHelper){
    this.Id = this.winObj.GenerateUniqueId();
    this.HostElementId = this.winObj.GenerateUniqueId();
  }

}
