import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, Input, QueryList } from "@angular/core";
import { RBaseComponent, RContentDirective } from "../rmodels/RBaseComponent";
import { RWindowHelper } from "../rwindowObject";
import { CssUnit, RCssUnitsService } from "../rcss-units.service";
import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from "@angular/common";


@Component({
 selector:'raccordion',
 standalone: true,
 templateUrl:'./raccordion.component.html',
 styleUrl:'./raccordion.component.css',
 imports: [NgStyle, NgClass, NgFor, NgIf, RContentDirective, NgTemplateOutlet]
})
export class RAccordionComponent extends RBaseComponent<any> implements AfterContentInit {

    @Input()
    override FontSize: string = "12px";
    
    @Input()
    public TitleForeColor: string = "black";

    @Input()
    public TitleBarBackColor: string = 'white';
    
    @Input()
    public ContentForeColor: string = "black";
    
    @Input()
    public ContentBackgroundColor: string = 'white';
    
    @Input()
    public ContentWidth: string = "250px";

    @Input()
    public BorderColor: string = "lightgray";

    @Input()
    public GapBetweenContent: string = '5px';

    @ContentChildren(RContentDirective) Items!: QueryList<RContentDirective>;

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
  
    trackById(index: number, item: RContentDirective) : number {
        return index;
    }

    toggle($evt: Event, item: RContentDirective) {
        item.IsOpened = !item.IsOpened;
        let div = ($evt.currentTarget as HTMLDivElement);

        if(div) {
            let panel = div.nextElementSibling;
            if(panel) {
                if(item.IsOpened) {
                    (panel as HTMLDivElement).style.height = item.Height;
                }
                else {
                    (panel as HTMLDivElement).style.height = '0px';
                }
            }
        }
    }   
}