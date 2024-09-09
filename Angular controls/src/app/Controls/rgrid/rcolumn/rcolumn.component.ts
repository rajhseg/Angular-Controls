import { AfterContentInit, Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { EditViewTemplateDirective } from '../edit-template.directive';
import { ReadViewTemplateDirective } from '../view-template.directive';
import { NgIf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'rcolumn',
  standalone: true,
  imports: [ReadViewTemplateDirective, EditViewTemplateDirective, NgIf, NgTemplateOutlet],
  templateUrl: './rcolumn.component.html',
  styleUrl: './rcolumn.component.css'
})
export class RColumnComponent implements AfterContentInit {  

  @Input()
  Name: string = "";

  @Input()
  PropToBind: string = "";

  @Input()
  IsComputationalColumn: boolean = false;

  @Input()
  HeaderText: string = "";

  // @Input()
  // Width: string ="auto";

  @Input()
  Height: string ="auto";

  @Input()
  EditModeWidth: string ="auto";

  @Input()
  EditModeHeight: string ="auto";

  @ContentChild(ReadViewTemplateDirective, {read: TemplateRef<any>}) ReadView!: TemplateRef<any>;

  @ContentChild(EditViewTemplateDirective, { read: TemplateRef<any>}) EditView!: TemplateRef<any>;

  ngAfterContentInit(): void {
    
  }

}
