import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';
import { ReadViewTemplateDirective } from './view-template.directive';

@Directive({
  selector: '[gridColumnFor]',
  standalone: true
})
export class RGridColumnForDirective {

  
  Name: string = "";
  PropToBind: string = "";

  public ViewTemplate: TemplateRef<any> | null = null;
  public EditTemplate: TemplateRef<any> | null = null;

  @ContentChild(ReadViewTemplateDirective) View!: ReadViewTemplateDirective;
  
  constructor(public templateRef: TemplateRef<any>) {

  }

  AddViewTemplate(template: TemplateRef<any>){
    this.ViewTemplate = template;
  }

  AddEditTemplate(template: TemplateRef<any>){
    this.EditTemplate = template;
  }

  @Input('gridColumnFor')
  public set gridColumnFor(val: RGridColumnForContext){
    if(val){
      this.Name = val.Name;
      this.PropToBind = val.PropToBind;
    }
  }
  public get gridColumnFor(): RGridColumnForContext {
    return { Name: this.Name, PropToBind: this.PropToBind};
  }

}


export class RGridColumnForContext {

public Name: string = "";

public PropToBind: string = "";

}