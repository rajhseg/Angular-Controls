import { Directive, Optional, Self, TemplateRef } from '@angular/core';
import { RGridTemplateContext } from './rgridtemplatecontext';

@Directive({
  selector: 'ng-template[editviewtemplate]',
  standalone: true
})
export class EditViewTemplateDirective {
  
  constructor(public template: TemplateRef<RGridTemplateContext>) { 
        
  }

  
  static ngTemplateContextGuard(dir: EditViewTemplateDirective, ctx: unknown): ctx is RGridTemplateContext {
    return true;
  }

}
