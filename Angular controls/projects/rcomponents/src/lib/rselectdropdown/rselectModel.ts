

import { Directive, TemplateRef } from "@angular/core";
import { DropdownModel } from "../dropdown/dropdownmodel";


export class RSelectItemModel extends DropdownModel {
    public IsSelected: boolean = false;
}

@Directive({
    selector:'ng-template[optionstemplate]',
    standalone: true  
})
export class ROptionsTemplateDirective {

    constructor(public template: TemplateRef<any>){

    }

    static ngTemplateContextGuard(dir: ROptionsTemplateDirective, ctx: unknown): ctx is any {
        return true;
    }
}
