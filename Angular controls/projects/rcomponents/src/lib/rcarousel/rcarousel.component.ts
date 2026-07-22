import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, DestroyRef, ElementRef, Input, QueryList } from '@angular/core'
import { RCssUnitsService, RelativeUnitType } from '../rcss-units.service';
import { RWindowHelper } from '../rwindowObject';
import { RBaseComponent } from '../rmodels/RBaseComponent';
import { RImageDirective } from './rcarousel.directive';
import { NgStyle, NgForOf } from '@angular/common';

@Component({
 selector:'rcarousel',
 standalone: true,
 templateUrl: './rcarousel.component.html',
 styleUrls: ['./rcarousel.component.css'],
 imports: [NgStyle, NgForOf],
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class RCarouselComponent extends RBaseComponent<any> implements AfterContentInit {

    private _width: string = '600px';
    private _height: string = '300px';

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
    set Height(val: string) {
      if (this.eleRef.nativeElement) {
        let value = this.cssUnitSer.ToPxString(val, this.eleRef.nativeElement.parentElement, RelativeUnitType.Height);
        this._height = value;
      }
    }
    get Height(): string {
        return this._height;
    }

    @ContentChildren(RImageDirective) Images!: QueryList<RImageDirective>;

    @Input()
    SlideButtonsColor: string = 'white';

    @Input()
    EnableAutoPlay: boolean = true;

    @Input()
    AutoPlayDurationBetweenSlides: number = 4000;

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

        if(this.EnableAutoPlay){
          this._interval = setInterval(() => this.slide(1), this.AutoPlayDurationBetweenSlides);
          
          this.destroy.onDestroy(()=>{
            clearInterval(this._interval);
          });
        }

        this.cdr.detectChanges();
    }

  }
}