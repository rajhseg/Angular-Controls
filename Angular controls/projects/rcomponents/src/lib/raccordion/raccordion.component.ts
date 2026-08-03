import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, Input, QueryList } from "@angular/core";
import { RBaseComponent, RContentDirective } from "../rmodels/RBaseComponent";
import { RWindowHelper } from "../rwindowObject";
import { CssUnit, RCssUnitsService, RelativeUnitType } from "../rcss-units.service";
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
    
    private _contentWidth: string = "250px";

    @Input()
    public set ContentWidth(val: string) {
        if(this.ele) {
            let value = this.cssServ.ToPxValue(val, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
            this._contentWidth = (value) + CssUnit.Px.toString();
        }
    }
    public get ContentWidth(): string {
        return this._contentWidth;
    }

    @Input()
    public BorderColor: string = "lightgray";

    private _gapBetweenContent: string = '5px';

    @Input()
    public set GapBetweenContent(val: string) {
        if(this.ele){
            let value = this.cssServ.ToPxValue(val, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
            this._gapBetweenContent = (value) + CssUnit.Px.toString();
        }
    }
    public get GapBetweenContent(): string {
        return this._gapBetweenContent;
    }

    @ContentChildren(RContentDirective) Items!: QueryList<RContentDirective>;

    constructor(private cdr: ChangeDetectorRef, winObj: RWindowHelper,private cssServ: RCssUnitsService, private ele: ElementRef) {
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

    getActualWidth(): string {
        let _wth = this.cssServ.ToPxValue(this.ContentWidth, null, null);
        return (_wth + 20) + CssUnit.Px;
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