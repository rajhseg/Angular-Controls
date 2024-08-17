import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, Directive, ElementRef, EventEmitter, forwardRef, Host, inject, Input, Output, output, QueryList, TemplateRef, ViewContainerRef } from '@angular/core';
import { AsyncPipe, NgClass, NgForOf, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'rtab',  
  standalone: true,
  imports: [NgForOf, NgTemplateOutlet, AsyncPipe, NgClass, forwardRef(()=> RTabIdFor)],  
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.css',
  providers:[]  
})
export class RTabComponent implements AfterContentInit {  

  private _tabid: RTabIdFor = inject(RTabIdFor, { host: true });

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

  public ContextInstance: Object = {};
  
  @Input('tabidfor') 
  set tabidfor(val: TabIdForContext){
    if(val){
      this.TabId = val.TabId;
      this.HeaderText = val.HeaderText;
      this.ContextInstance = val.Context;
    }
  }
  get tabidfor(): TabIdForContext{
    return new TabIdForContext(this.TabId, this.HeaderText, this.ContextInstance);
  }

constructor(public templateRef: TemplateRef<any>, public vcr:ViewContainerRef, public cdr:ChangeDetectorRef){

}
 
ngAfterViewInit(): void {      
}

ngAfterContentInit(){
  
}

}


export class TabIdForContext{
  constructor(public TabId: string, public HeaderText:string, public Context: object = {}) {

  }
}