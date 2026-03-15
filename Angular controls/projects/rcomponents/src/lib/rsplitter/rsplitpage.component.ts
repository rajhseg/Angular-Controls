import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, Input, TemplateRef } from "@angular/core";
import { RPageContentDirective, RSPLIT_ITEM } from "./rpagecontent.directive";
import { RCssUnitsService, RelativeUnitType } from "../rcss-units.service";
import { RWindowHelper } from "../rwindowObject";


@Component({
  selector: 'rsplitpage',
  standalone: true,
  templateUrl: './rsplitpage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
}
)
export class RSplitPageComponent implements AfterContentInit {

  
    _initialWidth: string = '';
  
    _initialHeight: string = '';
  
    @Input()
    set InitialWidth(value: string) {
      this._initialWidth = value;
           
      if(this.winHelper.isExecuteInBrowser()){
          this._initialWidth = this.cssUnit.ToPxString(this._initialWidth, this.elementRef.nativeElement.parentElement.parentElement, RelativeUnitType.Width);
          this.directive.InitialWidth = this._initialWidth;      
      }
    } 
    get InitialWidth(): string {

      return this._initialWidth;
    }
  
    @Input()
    set InitialHeight(value: string) {
      this._initialHeight = value;
            
      if(this.winHelper.isExecuteInBrowser()){
         this._initialHeight = this.cssUnit.ToPxString(this._initialHeight, this.elementRef.nativeElement.parentElement.parentElement, RelativeUnitType.Height);
         this.directive.InitialHeight = this._initialHeight;
      }
    } 
    get InitialHeight(): string {
      return this._initialHeight;
    }

  constructor(private cdr: ChangeDetectorRef, private winHelper: RWindowHelper,
        private cssUnit: RCssUnitsService, private elementRef: ElementRef,private directive: RPageContentDirective) {
        
  }

  ngAfterContentInit(): void {
  }

}
