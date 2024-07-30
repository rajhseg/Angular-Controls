import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, Input, Output, output, QueryList, TemplateRef, ViewContainerRef } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'rtab',
  standalone: true,
  imports: [NgForOf, NgTemplateOutlet, AsyncPipe, NgClass],
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css'
})
export class RTabComponent implements AfterContentInit {

  
  constructor(){

  }

  ngAfterContentInit(): void {
    
  }

}


@Directive({
  selector:'[tabidfor]',
  standalone: true
})
export class RTabIdFor implements AfterViewInit {

  public IsSelected: boolean = false;

  public TabId : string= '';

  public HeaderText : string= '';

  @Input('tabidfor') 
  set tabidfor(val: TabIdForContext){
    if(val){
      this.TabId = val.TabId;
      this.HeaderText = val.HeaderText;
    }
  }
  get tabidfor(): TabIdForContext{
    return new TabIdForContext(this.TabId, this.HeaderText);
  }

constructor(public templateRef: TemplateRef<any>, public vcr:ViewContainerRef, public cdr:ChangeDetectorRef){

}
 
ngAfterViewInit(): void {      
}

ngAfterContentInit(){
  
}

}


export class TabIdForContext{
  constructor(public TabId: string, public HeaderText:string) {

  }
}