import { ChangeDetectorRef, Directive, ElementRef, Host, Input, TemplateRef, ViewContainerRef } from "@angular/core";
import { RCssUnitsService, RelativeUnitType } from "../../rcss-units.service";
import { RSequencesTrackerComponent } from "../rsequences-tracker.component";

@Directive({
    selector:'[rtrackercontent]',
    standalone: true
})
export class RTrackerContentDirective {
    
    public StepNo: number = -1;
        
    private _height: string = '100px';

    Height_C: string = '100px';

    public set Height(value: string) {
        this._height = value;
        let htmlele = this.vcr.injector.get(RSequencesTrackerComponent);
        if(htmlele){
            let _val = this.cssServ.ToPxString(value, htmlele.getElementRef().nativeElement.parentElement, RelativeUnitType.Height);
            this.Height_C = _val;
        }
    }
    public get Height(): string {
        return this._height;
    }
          
    constructor(@Host() private ele: ElementRef, private cssServ: RCssUnitsService, public templateRef: TemplateRef<any>, public vcr: ViewContainerRef, public cdr: ChangeDetectorRef) {
    
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