import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, DestroyRef, ElementRef, Input, QueryList, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";
import { RSplitPageComponent } from "./rsplitpage.component";
import { IRSplitterInterface, RPageContentDirective, RSPLIT_ITEM, RSplitterObj, RSplitterType } from "./rpagecontent.directive";
import { RWindowHelper } from "../rwindowObject";
import { JsonPipe, NgFor, NgIf, NgStyle, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy } from "@angular/core";
import { RCssUnitsService } from "../rcss-units.service";
import { RelativeUnitType } from "../rcss-units.service";


@Component({
  selector: 'rsplitter',
  templateUrl: './rsplitter.component.html',
  styleUrls: ['./rsplitter.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, NgTemplateOutlet, JsonPipe, NgStyle],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RSplitterComponent implements AfterContentInit {

  RenderItems: IRSplitterInterface[] = [];

  RSType = RSplitterType;

  Id: string = '';

  HostElementId: string = '';

  _totalWidthInPx: string = '500px';

  _totalHeightInPx: string = '400px';

  _splitterType: RSplitterType = RSplitterType.Vertical;

  @Input()
  EnableBorder: boolean = true;

  @Input()
  BorderColor: string = 'lightgray';

  @Input()
  SplitterSize: string = '6px';

  @Input()
   SplitterBackgroundColor: string = '#555';

  @Input()
  set TotalWidth(value: string) {
    this._totalWidthInPx = value;
  }
  get TotalWidth(): string {

    if(this.winHelper.isExecuteInBrowser()) {
        this._totalWidthInPx = this.cssUnitService.ToPxString(this._totalWidthInPx, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
    }

    return this._totalWidthInPx;
  }

  @Input()
  set TotalHeight(value: string) {
    this._totalHeightInPx = value;
  }
  get TotalHeight(): string {

    if(this.winHelper.isExecuteInBrowser()){
       this._totalHeightInPx = this.cssUnitService.ToPxString(this._totalHeightInPx, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
    }

    return this._totalHeightInPx;
  }

  @Input()
  set SplitterType(value: RSplitterType) {
    this._splitterType = value;
  }
  get SplitterType(): RSplitterType {
    return this._splitterType;
  }

  @ContentChildren(RPageContentDirective, { descendants: true }) Contents!: QueryList<RPageContentDirective>;

  constructor(private winObj: RWindowHelper, private cdr: ChangeDetectorRef,
              private winHelper: RWindowHelper, private destroy: DestroyRef,
              private cssUnitService: RCssUnitsService, private eleRef: ElementRef) {
    this.Id = this.winObj.GenerateUniqueId();
    this.HostElementId = this.winObj.GenerateUniqueId();
  }

  getPanelStyle(Id: string){

    let page = this.RenderItems.filter(x=>x.Id == Id)[0];

    switch(this.SplitterType){
      case RSplitterType.Vertical:
          return {  'min-width': '50px', 
                    'width': page.InitialWidth, 
                    'flex': page.InitialWidth == '' ? '1' : '', 
                    'height': page.InitialHeight == '' ? '100%' : page.InitialHeight  
                  }
        break;
      case RSplitterType.Horizontal:
          return {  'min-height': '50px', 
                    'height': page.InitialHeight, 
                    'flex': page.InitialHeight == '' ? '1' : '', 
                    'width': page.InitialWidth == '' ? '100%' : page.InitialWidth  
                  
                }
        break;
    }
  }

  getSplitterStyle() {
    switch (this.SplitterType) {
      case RSplitterType.Vertical:
          return { 'width': this.SplitterSize, 'height': '100%', 'background': this.SplitterBackgroundColor }
        break;
      case RSplitterType.Horizontal:
          return { 'height': this.SplitterSize, 'width': '100%', 'background': this.SplitterBackgroundColor }
        break;
    }
  }

  trackById(index: number, obj: IRSplitterInterface) {
    return obj.Id;
  }

  ReFill(){
    this.RenderItems = [];
    this.Contents.forEach((x, index) => {
      this.RenderItems.push(x);
      this.RenderItems.push(new RSplitterObj(this.winObj, this.SplitterType, this.getSplitterStyle()))
    });

    this.cdr.detectChanges();
  }

  ngAfterContentInit(): void {

      this.Contents.forEach((x, index) => {

        this.RenderItems.push(x);
        this.RenderItems.push(new RSplitterObj(this.winObj, this.SplitterType, this.getSplitterStyle()))

        x.ValueChanged.subscribe(()=>{
          this.ReFill();
        });

      });

      console.log(this.RenderItems);

      if (this.RenderItems.length > 0) {
        this.RenderItems.splice(this.RenderItems.length - 1);
      }

      if(this.winHelper.isExecuteInBrowser()) 
      {
        var selectorobj = this.RenderItems.filter(x=>x.IsSplitObj).map(y=>"#"+y.Id).join(", ");

        const dividers = document.querySelectorAll(selectorobj);

        dividers.forEach(divider => {

          let isDragging = false;
          let startX = 0;
          let prevPanel: any, nextPanel: any;
          let prevStartSize: any, nextStartSize: any;

          const _mouseDown = (e: any) => {

            isDragging = true;

            prevPanel = divider.previousElementSibling;
            nextPanel = divider.nextElementSibling;

            if (this._splitterType == RSplitterType.Vertical) {
              startX = e.clientX;
            }
            else {
              startX = e.clientY;
            }

            if(this.SplitterType == RSplitterType.Vertical) {
              prevStartSize = prevPanel.offsetWidth;
              nextStartSize = nextPanel.offsetWidth;
            } else {
              prevStartSize = prevPanel.offsetHeight;
              nextStartSize = nextPanel.offsetHeight;
            }

            // Prevent text selection while dragging
            document.body.style.userSelect = 'none';
          };

          const _moveMove = (e: any) => {
            if (!isDragging) return;

            const dx = this._splitterType == RSplitterType.Vertical ?
                            e.clientX - startX : e.clientY - startX;

            const newPrevSize = prevStartSize + dx;
            const newNextSize = nextStartSize - dx;

            if (newPrevSize > 50 && newNextSize > 50) {
              prevPanel.style.flex = 'none';
              nextPanel.style.flex = 'none';

              if(this.SplitterType==RSplitterType.Vertical) {
                prevPanel.style.width = newPrevSize + 'px';
                nextPanel.style.width = newNextSize + 'px';
              } else {
                prevPanel.style.height = newPrevSize + 'px';
                nextPanel.style.height = newNextSize + 'px';
              }
            }
          };

          const _mouseUp = () => {
            if (isDragging) {
              isDragging = false;
              document.body.style.userSelect = '';
            }
          };

          divider.addEventListener('mousedown', _mouseDown);

          document.addEventListener('mousemove', _moveMove);

          document.addEventListener('mouseup', _mouseUp);

          this.destroy.onDestroy(()=>{

              divider.removeEventListener('mousedown', _mouseDown);

              document.removeEventListener('mousemove', _moveMove);

              document.removeEventListener('mouseup', _mouseUp);
          });

        });
      }

      this.cdr.detectChanges();

  }

}
