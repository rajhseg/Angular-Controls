import { Component, Directive, HostListener, Input, OnInit, Output, 
          TemplateRef, ViewChild, EventEmitter, 
          AfterContentInit,
          AfterViewInit,
          ContentChild,
          ElementRef} from '@angular/core';

@Component({
  selector: 'rtab-header',
  standalone: true,
  template:`
  <ng-template #content>
     <ng-content></ng-content>
  </ng-template>
  `
})
export class RTabHeaderComponent implements OnInit, AfterContentInit, AfterViewInit {

  @Input()
  IsSelected: boolean = false;

  @Input()
  IsSelectedOnLoad: boolean = false;

  initProcessDone: boolean = false;

  @ViewChild('content') content: TemplateRef<any> | null = null;

  public htmlElement!: ElementRef<HTMLElement>;

  IsComponentLoaded: boolean = false;

  @Output()
  TabHeaderComponentMounted: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private ele:ElementRef){
    this.htmlElement = ele;
  }

  ngAfterViewInit(): void {
    if(this.content){
      this.IsComponentLoaded = true;
      this.TabHeaderComponentMounted.emit(this.IsComponentLoaded);
    }
  }

  ngAfterContentInit(): void {
    
  }

  ngOnInit(): void {

    if(!this.initProcessDone && this.IsSelectedOnLoad){
      this.IsSelected = true;
      this.initProcessDone = true;
    }

  }

}
