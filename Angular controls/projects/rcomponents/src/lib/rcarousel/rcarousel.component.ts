import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, DestroyRef, ElementRef, EventEmitter, Input, Output, QueryList } from '@angular/core'
import { RCssUnitsService, RelativeUnitType } from '../rcss-units.service';
import { RWindowHelper } from '../rwindowObject';
import { RBaseComponent } from '../rmodels/RBaseComponent';
import { RImageDirective } from './rcarousel.directive';
import { NgStyle, NgForOf } from '@angular/common';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs';

@Component({
 selector:'rcarousel',
 standalone: true,
 templateUrl: './rcarousel.component.html',
 styleUrls: ['./rcarousel.component.css'],
 imports: [NgStyle, NgForOf],
 changeDetection: ChangeDetectionStrategy.OnPush
})
export class RCarouselComponent extends RBaseComponent<any> implements AfterContentInit, AfterViewInit {

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

    ImagesList!: RImageDirective[];

    @Input()
    SlideButtonsColor: string = 'white';

    @Input()
    EnableAutoPlay: boolean = true;

    @Input()
    AutoPlayDurationBetweenSlides: number = 4000;

    @Input()
    BorderColor: string = '#ccc';
    
    @Output()
    OnContentClick = new EventEmitter<RCarouselEventArgs>();

    private  currentItem = 1; 
    private items: HTMLElement | null = null;
    private totalItems!: number | undefined;
    private _interval: any;

    private readonly onTransitionEnd = (): void => {
      this.CalculateSlides();
    };

    public _slidesId!: string;

    FirstElement!: HTMLImageElement;

    LastElement!: HTMLImageElement;


    constructor(private eleRef: ElementRef, private cssUnitSer: RCssUnitsService,
            windowHelper: RWindowHelper, private destroy: DestroyRef,
            public cdr: ChangeDetectorRef
    ) {    
        super(windowHelper);
        this._slidesId = this.winObj.GenerateUniqueId();
    }

  imgClick(evt: Event, index: number) {
    this.OnContentClick.emit(new RCarouselEventArgs(evt, index));
  }

   slide(evt: Event | null, step: number) {
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
    this.FirstElement = this.Images.first.element.nativeElement;
    this.LastElement = this.Images.last.element.nativeElement;
  }

  ngAfterViewInit(): void {
    this.Render();
  }

  private Render() {
    
    this.ImagesList = this.Images.toArray();

    this.Images.changes.subscribe((images: QueryList<RImageDirective>) => {
      
      this.FirstElement = images.first.element.nativeElement;
      this.LastElement = images.last.element.nativeElement;
      this.ImagesList = images.toArray();
      this.totalItems = images.length + 2;
      
      this.cdr.detectChanges();

    });

    this.items = document.getElementById(this._slidesId);
    this.totalItems = this.Images.length + 2;

      if(this.items) {

        this.items.style.transform = `translateX(-${this.currentItem * this.WidthInNumber}px)`;
        
        this.items.removeEventListener("transitionend", this.onTransitionEnd);
        this.items.addEventListener("transitionend", this.onTransitionEnd);

        if(this.EnableAutoPlay){
          this._interval = setInterval(() => this.slide(null, 1), this.AutoPlayDurationBetweenSlides);
          
          this.destroy.onDestroy(()=>{
            this.items?.removeEventListener("transitionend", this.onTransitionEnd);
            clearInterval(this._interval);
          });
        }

        this.cdr.detectChanges();
      }
  }


}

export class RCarouselEventArgs {
  constructor(public event: Event | null, public currentItemNo: number) {}
}