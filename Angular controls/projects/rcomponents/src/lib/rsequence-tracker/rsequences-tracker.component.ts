import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, Input, QueryList } from "@angular/core";
import { RSequenceTrackerComponent } from "./rtracker/rsequence-tracker.component";
import { RBaseComponent } from "../rmodels/RBaseComponent";
import { NgClass, NgFor, NgStyle, NgTemplateOutlet } from "@angular/common";
import { RTrackerContentDirective } from "../rsequence-tracker/rtracker/rtrackercontent.directive";
import { RWindowHelper } from "../rwindowObject";
import { CssUnit, RCssUnitsService } from "../rcss-units.service";


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
    public ContentWidth: string = "250px";

    @Input()
    public StripLineColor: string = "purple";

    @ContentChildren(RTrackerContentDirective) Items!: QueryList<RTrackerContentDirective>;

    constructor(private cdr: ChangeDetectorRef, winObj: RWindowHelper,private cssServ: RCssUnitsService) {
        super(winObj);
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();
    }
    
    ngAfterContentInit(): void {
        if(this.Items && this.Items.length > 0){
            this.cdr.detectChanges();
        }
    }
  
    trackById(index: number, item: RTrackerContentDirective) : number {
        return index;
    }

    get GetContentWidth(): string {
        let _wth = this.cssServ.ToPxValue(this.ContentWidth, null, null);
        return (_wth - 30) + CssUnit.Px;
    }
}