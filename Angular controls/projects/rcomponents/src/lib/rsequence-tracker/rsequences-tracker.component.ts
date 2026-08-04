import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, Input, QueryList } from "@angular/core";
import { RSequenceTrackerComponent } from "./rtracker/rsequence-tracker.component";
import { RBaseComponent } from "../rmodels/RBaseComponent";
import { NgClass, NgFor, NgStyle, NgTemplateOutlet } from "@angular/common";
import { RTrackerContentDirective } from "../rsequence-tracker/rtracker/rtrackercontent.directive";
import { RWindowHelper } from "../rwindowObject";
import { CssUnit, RCssUnitsService } from "../rcss-units.service";
import { RelativeUnitType } from "../rcss-units.service";


@Component({  
    selector: 'rsequences-tracker',
    standalone: true,
    imports: [RSequenceTrackerComponent, RTrackerContentDirective, NgStyle, NgFor, NgClass, NgTemplateOutlet],
    templateUrl: './rsequences-tracker.component.html',
    styleUrl: './rsequences-tracker.component.css'
})
export class RSequencesTrackerComponent extends RBaseComponent<any> implements AfterContentInit {

    @Input()
    NumberFontSize: string = "12px";

    @Input()
    override FontSize: string = "12px";
    
    @Input()
    public StepNoForeColor: string = "blue";
    
    @Input()
    public StepNoBackColor: string = "white";
    
    @Input()
    public ContentBackgroundColor: string = 'white';

    @Input()
    public ContentBorderColor: string = 'lightgray';
    
    private _contentWidth: string = "250px";
    
    ContentWidth_C: string = "250px";

    @Input()
    public set ContentWidth(value: string){
        this._contentWidth = value;
        if(this.ele) {
            let _val = this.cssServ.ToPxValue(value, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
            this.ContentWidth_C = _val + CssUnit.Px.toString();
        }
    }
    public get ContentWidth(): string {
        return this._contentWidth;
    }

    @Input()
    public StripLineColor: string = "purple";

    @ContentChildren(RTrackerContentDirective) Items!: QueryList<RTrackerContentDirective>;

    constructor(private cdr: ChangeDetectorRef, private ele: ElementRef, winObj: RWindowHelper,private cssServ: RCssUnitsService) {
        super(winObj);
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();
    }
    
    getElementRef(): ElementRef {
        return this.ele;
    }

    ngAfterContentInit(): void {
        if(this.Items && this.Items.length > 0){
            this.cdr.detectChanges();
        }
    }
  
    trackById(index: number, item: RTrackerContentDirective) : number {
        return index;
    }

    GetContentHeight(height: string): string {
        let _hei = this.cssServ.ToPxValue(height, null, null);
        return (_hei - 20) + CssUnit.Px;
    }

    get GetContentWidth(): string {
        let _wth = this.cssServ.ToPxValue(this.ContentWidth_C, null, null);
        return (_wth - 30) + CssUnit.Px;
    }
}