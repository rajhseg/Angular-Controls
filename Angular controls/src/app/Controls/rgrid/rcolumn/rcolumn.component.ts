import { AfterContentInit, Component, ContentChild, ContentChildren, Input, QueryList, TemplateRef } from '@angular/core';
import { EditViewTemplateDirective } from '../edit-template.directive';
import { HeaderTemplateDirective, ReadViewTemplateDirective } from '../view-template.directive';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { CssUnit, CssUnitsService } from '../../css-units.service';

@Component({
  selector: 'rcolumn',
  standalone: true,
  imports: [ReadViewTemplateDirective, EditViewTemplateDirective, HeaderTemplateDirective, NgIf, NgTemplateOutlet],
  templateUrl: './rcolumn.component.html',
  styleUrl: './rcolumn.component.css'
})
export class RColumnComponent implements AfterContentInit {  

  @Input()
  Name: string = "";

  @Input()
  PropToBind: string = "";

  @Input()
  IsDummyPropToBind: boolean = false;

  @Input()
  DisableGrouping: boolean = false;
  
  @Input()
  IsComputationalColumn: boolean = false;

  @Input()
  HeaderText: string = "";

  @Input()
  Height: string ="auto";

  @Input()
  Width: string ="auto";

  @Input()
  DisableSort: boolean = false;

  @Input()
  DisableFilter: boolean = false;

  @ContentChild(ReadViewTemplateDirective, {read: TemplateRef<any>}) ReadView!: TemplateRef<any>;

  @ContentChild(EditViewTemplateDirective, { read: TemplateRef<any>}) EditView!: TemplateRef<any>;

  @ContentChild(HeaderTemplateDirective, { read: TemplateRef<any>}) HeaderTemplate!: TemplateRef<any>;

  constructor(private cssUnit: CssUnitsService){

  }

  ngAfterContentInit(): void {
    
  }

  GetRelativeWidth(totalWidthInPx: string): string {
    let value = this.cssUnit.ToPxValue(totalWidthInPx, null, null);
    let result = this.Width.match(/(-?[\d.]+)([a-z%]*)/);
    if(result) {
      let num = parseFloat(result[1].toString());
      let unit = result[2];

      if(unit.toLowerCase()=='%'){
        return parseFloat((value * num/ 100).toString()) +CssUnit.Px.toString();
      } else if(unit.toLowerCase()=='px'){
        return num+CssUnit.Px.toString();
      }

    }

    return this.Width;    
  }    

}
