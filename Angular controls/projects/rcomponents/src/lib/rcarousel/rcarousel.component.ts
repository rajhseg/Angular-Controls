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
    
    private  index = 1; 
    private slides: HTMLElement | null = null;
    private total!: number | undefined;
    private _interval: any;

    FirstElement!: HTMLImageElement;

    LastElement!: HTMLImageElement;

    constructor(private eleRef: ElementRef, private cssUnitSer: RCssUnitsService,
            windowHelper: RWindowHelper, private destroy: DestroyRef,
            public cdr: ChangeDetectorRef
    ) {    
        super(windowHelper);
    }

   move(step: number) {
    this.index++;

      if (step < 0)
          this.index -= 2;

      if(this.slides) {
        this.slides.style.transition = "transform .5s ease";
        this.slides.style.transform = `translateX(-${this.index * this.WidthInNumber}px)`;
      }

      this.cdr.detectChanges();
    }

    CalculateSlides() {
      if(this.slides && this.total) {
        
        if (this.index >= this.total - 1) {
            this.slides.style.transition = "none";
            this.index = 1;
            this.slides.style.transform = `translateX(-${this.index * this.WidthInNumber}px)`;
        }

        if (this.index <= 0) {
            this.slides.style.transition = "none";
            this.index = this.total - 2;
            this.slides.style.transform = `translateX(-${this.index * this.WidthInNumber}px)`;
        }

        this.cdr.detectChanges();
      }
    }

    trackById(index: number, item: any): number {
      return index;
    }

    ngAfterContentInit(): void {
      this.slides = document.getElementById("slides");
      this.total = this.Images.length + 2;

      if(this.slides) {

        this.FirstElement = this.Images.first.element.nativeElement;
        this.LastElement = this.Images.last.element.nativeElement;

        this.slides.style.transform = `translateX(-${this.index * this.WidthInNumber}px)`;

        this.slides.addEventListener("transitionend", () => {
          this.CalculateSlides();
        });

        if(this.EnableAutoPlay){
          this._interval = setInterval(() => this.move(1), this.AutoPlayDurationBetweenSlides);
          
          this.destroy.onDestroy(()=>{
            clearInterval(this._interval);
          });
        }

        this.cdr.detectChanges();
    }

  }
}