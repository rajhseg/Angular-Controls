import { Directive, ElementRef, Host, Input, Self, TemplateRef } from '@angular/core';
import { RCell } from './rcell';
import { RGridHeaderTemplateContext, RGridTemplateContext } from './rgridtemplatecontext';

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

@Directive({
  selector: 'ng-template[headertemplate]',
  standalone: true
})
export class HeaderTemplateDirective {
  
  constructor(public template: TemplateRef<any>){

  }

  static ngTemplateContextGuard(dir: HeaderTemplateDirective, ctx: unknown): ctx is RGridHeaderTemplateContext {
    return true;
  }
}