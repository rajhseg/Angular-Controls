import { AfterContentInit, Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { EditViewTemplateDirective } from '../edit-template.directive';
import { ReadViewTemplateDirective } from '../view-template.directive';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { CssUnit, CssUnitsService } from '../../css-units.service';

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

  constructor(private cssUnit: CssUnitsService){

  }

  ngAfterContentInit(): void {
    
  }

  GetRelativeWidth(totalWidthInPx: string): string {
    let value = this.cssUnit.ToPxValue(totalWidthInPx, null, null);
    let result = this.EditModeWidth.match(/(-?[\d.]+)([a-z%]*)/);
    if(result) {
      let num = parseFloat(result[1].toString());
      let unit = result[2];

      if(unit.toLowerCase()=='%'){
        return parseFloat((value * num/ 100).toString()) +CssUnit.Px.toString();
      } else if(unit.toLowerCase()=='px'){
        return num+CssUnit.Px.toString();
      }

    }

    return this.EditModeWidth;    
  }    

}
