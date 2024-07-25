import { AfterViewInit, Component, Directive, EventEmitter, Input, OnInit, Output, output, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'rtab-content',
  standalone: true,
  template:`
  <ng-template #content>
    <ng-content></ng-content>
  </ng-template>
  `
})
export class RTabContentComponent implements OnInit, AfterViewInit {

  @ViewChild('content', { read: TemplateRef }) content: TemplateRef<any> | null = null;

  @Input()
  IsSelected: boolean = false;

  IsComponentLoaded: boolean = false;

  @Output()
  TabContentComponentMounted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(){

  }

  ngAfterViewInit(): void {
    this.IsComponentLoaded = true;
    this.TabContentComponentMounted.emit(this.IsComponentLoaded);
  }

  ngOnInit(): void {

  }

}
