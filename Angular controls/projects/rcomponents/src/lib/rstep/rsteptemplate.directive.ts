import { Directive, TemplateRef } from "@angular/core";


@Directive({
    selector:'ng-template[rstepview]',
    standalone: true
})
export class RStepViewDirective {

    constructor(){

    }

    static ngTemplateContextGuard(dir: RStepViewDirective, ctx: unknown): ctx is any {
        return true;
    }
}