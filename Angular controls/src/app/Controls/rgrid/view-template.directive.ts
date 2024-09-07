import { Directive, ElementRef, Host, Input, Self, TemplateRef } from '@angular/core';
import { RCell } from './rcell';
import { RGridTemplateContext } from './rgridtemplatecontext';

@Directive({
  selector: 'ng-template[readviewtemplate]',
  standalone: true
})
export class ReadViewTemplateDirective {

  constructor(public template: TemplateRef<any>) {     
  }

  static ngTemplateContextGuard(dir: ReadViewTemplateDirective, ctx: unknown): ctx is RGridTemplateContext {
    return true;
  }

}