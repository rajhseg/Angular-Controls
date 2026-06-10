import { ChangeDetectorRef, Directive, Input, TemplateRef, ViewContainerRef } from "@angular/core";

@Directive({
    selector:'[rtrackercontent]',
    standalone: true
})
export class RTrackerContentDirective {
    
    public StepNo: number = -1;
        
    public Height: string = '100px';
          
    constructor(public templateRef: TemplateRef<any>, public vcr: ViewContainerRef, public cdr: ChangeDetectorRef) {
    
    }

    @Input('rtrackercontent')
    set rtrackercontent(val: RTrackerContext) {
        if (val) {
            this.StepNo = val.StepNo;
            this.Height = val.Height;
        }
    }
    get rtrackercontent(): RTrackerContext {
        return new RTrackerContext(this.StepNo, this.Height);
    }
}

export class RTrackerContext {
    constructor(public StepNo: number, public Height: string = '100px') {

    }
}