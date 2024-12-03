import { NgStyle } from '@angular/common';
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rbutton',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './rbutton.component.html',
  styleUrl: './rbutton.component.css'
})
export class RbuttonComponent {

  @Output()
  public ButtonClick = new EventEmitter<any>();
  
  @Input()
  public ButtonWidth: string = '100px';

  @Input()
  public ButtonHeight: string = '32px';

  @Input()
  public ButtonType: string = "button";

  @Input()
  ForeColor: string = "whitesmoke";

  @Input()
  BackgroundColor: string = "blue";

  @Input()
  IsDisabled: boolean = false;
  
  onClick($event: any){
    this.ButtonClick.emit($event);
  }

  Id: string = '';

  @HostBinding('id')
  HostElementId: string = this.winObj.GenerateUniqueId();

  constructor(private winObj: WindowHelper){
    this.Id = this.winObj.GenerateUniqueId();
  }

}
