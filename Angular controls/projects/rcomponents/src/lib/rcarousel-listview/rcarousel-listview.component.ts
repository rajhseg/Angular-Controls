import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, DestroyRef, ElementRef, Input, QueryList } from '@angular/core'
import { CssUnit, RCssUnitsService, RelativeUnitType } from '../rcss-units.service';
import { RWindowHelper } from '../rwindowObject';
import { RBaseComponent } from '../rmodels/RBaseComponent';
import { RImageDirective } from '../rcarousel/rcarousel.directive';
import { NgStyle, NgForOf } from '@angular/common';

@Component({
 selector:'rcarousel-listview',
 standalone: true,
 templateUrl: './rcarousel-listview.component.html',
 styleUrls: ['./rcarousel-listview.component.css'],
 imports: [NgStyle, NgForOf],
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class RCarouselListViewComponent extends RBaseComponent<any> implements AfterContentInit {

    private _width: string = '600px';
    
    private _itemwidth: string = '150px';
    private _itemheight: string = '150px';

    @Input()
    set Width(val: string) {
      if (this.eleRef.nativeElement) {
        let value = this.cssUnitSer.ToPxString(val, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
        this._width = value;
      }
    }
    get Width(): string {
        return this._width;
    }

    get WidthInNumber(): number {
      let val = this.cssUnitSer.ToPxValue(this.Width, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
      return val;
    }

    @Input()
    set ItemWidth(val: string) {
      if (this.eleRef.nativeElement) {
        let value = this.cssUnitSer.ToPxString(val, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
        this._itemwidth = value;
      }
    }
    get ItemWidth(): string {
        return this._itemwidth;
    }

    get ItemWidthInNumber(): number {
      let val = this.cssUnitSer.ToPxValue(this.ItemWidth, this.eleRef.nativeElement.parentElement, RelativeUnitType.Width);
      return val;
    }

    @Input()
    set ItemHeight(val: string) {
      if (this.eleRef.nativeElement) {
        let value = this.cssUnitSer.ToPxString(val, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
        this._itemheight = value;
      }
    }
    get ItemHeight(): string {
        return this._itemheight;
    }

    @ContentChildren(RImageDirective) Images!: QueryList<RImageDirective>;

    @Input()
    SlideButtonsColor: string = 'white';

    @Input()
    BorderColor: string = '#ccc';
    
    private  currentItem = 1; 
    private items: HTMLElement | null = null;
    private totalItems!: number | undefined;
    private _interval: any;

    FirstElement!: HTMLImageElement;

    LastElement!: HTMLImageElement;

    constructor(private eleRef: ElementRef, private cssUnitSer: RCssUnitsService,
            windowHelper: RWindowHelper, private destroy: DestroyRef,
            public cdr: ChangeDetectorRef
    ) {    
        super(windowHelper);
    }

   slide(step: number) {
    this.currentItem++;

      if (step < 0)
          this.currentItem -= 2;

      if(this.items) {
        this.items.style.transition = "transform .5s ease";
        this.items.style.transform = `translateX(-${this.currentItem * this.WidthInNumber}px)`;
      }

      this.cdr.detectChanges();
    }

    CalculateSlides() {
      if(this.items && this.totalItems) {
        
        if (this.currentItem >= this.totalItems - 1) {
            this.items.style.transition = "none";
            this.currentItem = 1;
            this.items.style.transform = `translateX(-${this.currentItem * this.WidthInNumber}px)`;
        }

        if (this.currentItem <= 0) {
            this.items.style.transition = "none";
            this.currentItem = this.totalItems - 2;
            this.items.style.transform = `translateX(-${this.currentItem * this.WidthInNumber}px)`;
        }

        this.cdr.detectChanges();
      }
    }

    get ContainerHeight(): string {
      let val = this.cssUnitSer.ToPxValue(this.ItemHeight, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
      return (val + 20)+CssUnit.Px;
    }

    trackById(index: number, item: any): number {
      return index;
    }

    ngAfterContentInit(): void {
      this.items = document.getElementById("slides");
      this.totalItems = this.Images.length + 2;

      if(this.items) {

        this.FirstElement = this.Images.first.element.nativeElement;
        this.LastElement = this.Images.last.element.nativeElement;

        this.items.style.transform = `translateX(-${this.currentItem * this.WidthInNumber}px)`;

        this.items.addEventListener("transitionend", () => {
          this.CalculateSlides();
        });

        this.cdr.detectChanges();
    }

  }
}