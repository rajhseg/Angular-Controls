import { AfterContentChecked, AfterContentInit, AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, ComponentFactoryResolver, ContentChildren, ElementRef, inject, Input, QueryList, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { RTabComponent } from "./tab.component";
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from "@angular/common";
import { WindowHelper } from "../windowObject";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem, CdkDragEnd } from '@angular/cdk/drag-drop'

@Component({
  selector:'rtabs',
  standalone: true,
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl:'./rtabs.component.html',
  styleUrl:'./rtabs.component.css',
  imports:[NgForOf, NgTemplateOutlet, AsyncPipe, NgIf,
    NgClass, CdkDrag, CdkDropList, JsonPipe]
})
export class RTabsComponent implements AfterContentInit, AfterContentChecked, AfterViewInit {

  
  private _selectedTabId: string | undefined = undefined;
  private _tabWidth: string = '100%';
  private _tabHeight: string = '200px';
  public selectedTab: RTabComponent | undefined = undefined;
  
  public SelectedTabIndex: number = 0;
  public TabHeaders: TabHeaderWithTabId[] = [];

  @ViewChild('tabc',{ read: ViewContainerRef}) viewRef!: ViewContainerRef;

  @Input({required: true, alias:'TabHeight'})
  set TabHeight(value: string){
   if(value && value!='') {
    this._tabHeight = value; 
   } else {
    this._tabHeight = '200px';
   }    
  }
  get TabHeight(): string {
    return this._tabHeight;
  }

  @Input()
  set TabWidth(value: string){
    if(value && value!=''){
      this._tabWidth = value;
    } else{
      this._tabWidth = '100%';
    }
  }
  get TabWidth(): string{
    return this._tabWidth;
  }

  @Input()
  set SelectedTabId(value: string|undefined){
    
    if(value) {      
      this._selectedTabId = value;      
        this.RenderUI();      
    }
  }
  get SelectedTabId(): string | undefined {
    return this._selectedTabId;
  }


  TotalTabCount: number = 0;

  @ContentChildren(RTabComponent) tabs!:QueryList<RTabComponent> | undefined;

  @ContentChildren(RTabComponent) tabsElementRef!:QueryList<RTabComponent>;

  constructor(private winobj:WindowHelper, private cdr: ChangeDetectorRef, private cfr: ComponentFactoryResolver){

  }

  ngAfterViewInit(): void {
    if(this.viewRef){
      this.viewRef.clear();


      if(this.tabsElementRef && this.tabsElementRef.first && this.tabsElementRef.length > 0) {
        let g = this.tabsElementRef.first;
        let fv = this.cfr.resolveComponentFactory<RTabComponent>(RTabComponent);
        
        this.viewRef.createComponent(fv);
      }
    
      this.cdr.detectChanges();
    }
  }

  trackByHeader(index: number, header: TabHeaderWithTabId) {
    return header.TabId;
  }

  dragEnded(event: CdkDragEnd){
    // let _tabs = this.tabs?.toArray();
    // let item = (event.source.data as TabHeaderWithTabId);

    // if(item && this.tabs){
    //   let _tabs = this.tabs?.toArray();
    //   let _prevIndex = _tabs?.findIndex(x=>x.TabId==item.tabComponent.TabId);
    //   if(_tabs && _prevIndex > -1){
    //     _tabs.splice(_prevIndex, 1);
        
    //     _tabs.forEach(x=>{
    //       x.IsSelected = false;          
    //     });


    //     if(this.SelectedTabIndex >-1 && this.SelectedTabIndex < this.tabs.length){

    //     } else{
    //       this.SelectedTabIndex = this.tabs.length -1;
    //     }
        
        
    //     this.tabs?.reset(_tabs);

    //     if(this.SelectedTabIndex > -1)
    //       this.SelectedTabId = this.tabs?.get(this.SelectedTabIndex)?.TabId;
    //     else{
    //       this.RenderHeaders();          
    //     }  

    //   }
    // }
    
  }

  dragStarted(event: any){
    console.log('drag started');
    console.log(event);
    console.log(this.tabsElementRef);
  }

  drop(event: CdkDragDrop<TabHeaderWithTabId[]>){
    console.log('drop');
    console.log(event);
    let curContainer = event.container.data.every(x=>x instanceof TabHeaderWithTabId);
    let PreContainer = event.previousContainer.data.every(x=>x instanceof TabHeaderWithTabId);

    if(curContainer && PreContainer) {
      
      if(event.previousContainer===event.container){        
        
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);                    
        let components: RTabComponent[] | undefined = [];      
        components = event.container.data.map(x=>x.tabComponent);

        if(components){        
          this.tabs?.reset(components);
        }
            
        this.SelectedTabIndex = event.currentIndex;
        this.SelectedTabId = this.tabs?.get(this.SelectedTabIndex)?.TabId;
        
      } else{
        
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        
        console.log('dropped moved item after');

        console.log(event.previousContainer.data);
        
        console.log(event.container.data);

        console.log('mapped');

        let components: RTabComponent[] | undefined = [];
      
        // components = event.container.data.map(x=>x.tabComponent); 

        // if(components){        
        //   let currentObject = (event.item.data as TabHeaderWithTabId)?.tabComponent;
        //   if(currentObject)
        //   {
        //     components.splice(event.currentIndex,0, currentObject);
        //     this.tabs?.reset(components);
        //   }
        // }
            
        // this.SelectedTabIndex = event.currentIndex;
        // this.SelectedTabId = this.tabs?.get(this.SelectedTabIndex)?.TabId;
       
      }
      
    }
  }

  HeaderClicked(selectedHeader: TabHeaderWithTabId){
    selectedHeader.IsSelected = true;
    this.SelectedTabId = selectedHeader.TabId;  
  }

  selectTab(selectedHeader: TabHeaderWithTabId | undefined){

    this.TabHeaders.forEach(x=>x.IsSelected = false);    

    this.tabs?.forEach((x, _index)=>{

      if(selectedHeader && x.TabId==selectedHeader.TabId){
        x.IsSelected =true;
        this.SelectedTabIndex = _index;
      } else{
        x.IsSelected =false;
      }
    });

    this.TabHeaders.forEach(x=>{
      if(selectedHeader && x.TabId==selectedHeader.TabId){
        x.IsSelected = true;
      }
    });    
  }

  ngAfterContentInit(): void {

    if(this.tabs){      
      this.TotalTabCount = this.tabs.length;            
      this.RenderUI();      
    }        

  }

  private RenderHeaders() {

    if(this.tabs){
      this.TabHeaders = [];
      this.tabs.forEach(x => {

        this.TabHeaders.push(new TabHeaderWithTabId(x, x.TabId, x.HeaderText));

      });
    }
  }

  ngAfterContentChecked(): void {        
    
  }  

  RenderUI(){    

      let _wrapLength: number | undefined = undefined;
      
      if(this.SelectedTabId!=undefined){
        this.selectedTab = this.tabs?.find(x=>x.TabId == this.SelectedTabId);
      } else {
       this.selectedTab = this.tabs?.first;
       this.SelectedTabId = this.tabs?.first.TabId;
      }

      if(this.selectedTab) {
        this.selectedTab.IsSelected = true;
        let selectedHeader = new TabHeaderWithTabId(this.selectedTab, this.selectedTab.TabId, this.selectedTab.HeaderText, true);
        this.RenderHeaders();
        this.selectTab(selectedHeader);                  
      } else{
        this.RenderHeaders();
        this.selectTab(undefined);
      }       
    }

  MoveEntireTabRow(){

  }

  ReArrangeTabHeaderForWrap(){
   
  }

  DeleteTab(tabId: string){    
    
    this.tabs?.forEach(x=>{
      if(x.TabId==tabId){
        x.IsSelected =false;
      }
    });

    let newTabs = this.tabs?.filter(x=>x.TabId!=tabId);
    if(newTabs){
      
      if(this.SelectedTabIndex < 0 || this.SelectedTabIndex >= newTabs.length){
        this.SelectedTabIndex = newTabs.length - 1;
      }

      this.tabs?.reset(newTabs);

      if(this.tabs) {
        let _tab = this.tabs.get(this.SelectedTabIndex);
        if(_tab){
          this.SelectedTabId = _tab.TabId;
        }
      }

      this.RenderUI();
      
    }
  }

  DeleteTabBasedOnIndex(index: number){
    if(this.tabs && index > -1 && index < this.tabs.length){
      let tab = this.tabs.get(index);
      
      if(tab)
        this.DeleteTab(tab.TabId);
    }
  }
}

export class TabHeaderWithTabId {
  constructor(public tabComponent: RTabComponent, public TabId: string = '', public headerText: string = '', public IsSelected: boolean = false){ }
}

export class TabOffsetTop {
  constructor(public TabId: string,
    public offsetTop: number
  ) {

  }
}
