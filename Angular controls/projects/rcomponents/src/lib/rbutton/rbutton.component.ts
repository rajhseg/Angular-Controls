import { NgStyle } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { RWindowHelper } from '../rwindowObject';
import { ValidateInput } from '../Validator';

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
  @ValidateInput("boolean")
  public EnableBackDrop: boolean = false;
  
  @Input()
  @ValidateInput("size")
  public ButtonWidth: string = '100px';

  @Input()
  @ValidateInput("size")
  public ButtonHeight: string = '32px';

  @Input()
  @ValidateInput("label")
  public ButtonType: string = "button";

  @Input()
  @ValidateInput("color")
  ForeColor: string = "whitesmoke";

  @Input()
  @ValidateInput("color")
  BackgroundColor: string = "blue";

  @Input()
  @ValidateInput("boolean")
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
