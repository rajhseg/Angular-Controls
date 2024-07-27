import { AfterContentInit, Component, ContentChild, ContentChildren, ElementRef, EventEmitter, Input, Output, output, QueryList } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'rtab',
  standalone: true,
  imports: [NgForOf, NgTemplateOutlet, AsyncPipe, NgClass],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class RTabComponent implements AfterContentInit {

  @Input({ required: true, alias:'TabId'}) TabId : string= '';

  @Input({required: true, alias:'HeaderText'}) HeaderText : string= '';

  @Input()
  IsSelected: boolean = false;

  constructor(){
  }

  ngAfterContentInit(): void {
    
  }

}


