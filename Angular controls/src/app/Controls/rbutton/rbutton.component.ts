import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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

}
