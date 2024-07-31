import { AfterContentChecked, AfterContentInit, AfterViewInit, ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ContentChildren, ElementRef, inject, Input, QueryList, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { RTabComponent, RTabIdFor } from "./tab.component";
import { AsyncPipe, CommonModule, JsonPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from "@angular/common";
import { WindowHelper } from "../windowObject";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem, CdkDragEnd } from '@angular/cdk/drag-drop'

@Component({
  selector:'rtabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  public selectedTab: RTabIdFor | undefined = undefined;
  public contentVisible: boolean = false;
  public tabInstance: RTabsComponent = this;
  public SelectedTabIndex: number = 0;
  public TabHeaders: TabHeaderWithTabId[] = [];

  public SelectedTabTemplateRef!: RTabIdFor | undefined;

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
  DisplayTabContainerWhenZeroTabs: boolean = false;
  
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

  @ContentChildren(RTabIdFor) tabTemps!: QueryList<RTabIdFor>;

  constructor(private winobj:WindowHelper, 
    private cdr: ChangeDetectorRef, 
    private cfr: ComponentFactoryResolver){

  }

  ngAfterViewInit(): void {
    if(this.viewRef){
      this.viewRef.clear();    
      this.cdr.detectChanges();
    }
  }

  trackByHeader(index: number, header: TabHeaderWithTabId) {
    return header.TabId;
  }

  dragEnded(event: CdkDragEnd){
    
    let _tabs = this.tabTemps?.toArray();
    let item = (event.source.data as TabHeaderWithTabId);

    if(item && _tabs){      
      let _prevIndex = _tabs?.findIndex(x=>x.TabId==item.TabId);
      if(_tabs && _prevIndex > -1){
        _tabs.splice(_prevIndex, 1);
        
        _tabs.forEach(x=>{
          x.IsSelected = false;          
        });        
        
        this.tabTemps.reset(_tabs);

        if(this.SelectedTabIndex >-1 && this.SelectedTabIndex < this.tabTemps.length){

        } else{
          this.SelectedTabIndex = this.tabTemps.length -1;
        }
                
        if(this.SelectedTabIndex > -1 && this.SelectedTabIndex < this.tabTemps.length)
          this.SelectedTabId = this.tabTemps?.get(this.SelectedTabIndex)?.TabId;
        else{
          this.RenderHeaders();  
          this.SelectedTabTemplateRef = undefined;        
        }  

      }
    }
    
  }

  dragStarted(event: any){
    console.log('drag started');
    console.log(event);    
  }

  drop(event: CdkDragDrop<TabHeaderWithTabId[]>){
    
    let curContainer = event.container.data.every(x=>x instanceof TabHeaderWithTabId);
    let PreContainer = event.previousContainer.data.every(x=>x instanceof TabHeaderWithTabId);

    if(curContainer && PreContainer) {
      
      if(event.previousContainer===event.container){                
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);                            
      } else{        
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);                      
      }

      let components: RTabIdFor[] | undefined = [];      
      components = event.container.data.map(x=>x.tabTemplateRef);

      if(components){        
        this.tabTemps?.reset(components);
      }
          
      this.SelectedTabIndex = event.currentIndex;
      this.SelectedTabId = this.tabTemps?.get(this.SelectedTabIndex)?.TabId;
        
    }
  }

  HeaderClicked(selectedHeader: TabHeaderWithTabId){
    selectedHeader.IsSelected = true;
    this.SelectedTabId = selectedHeader.TabId;  
  }

  selectTab(selectedHeader: TabHeaderWithTabId | undefined){

    this.TabHeaders.forEach(x=>x.IsSelected = false);    

    this.tabTemps?.forEach((x, _index)=>{

      if(selectedHeader && x.TabId==selectedHeader.TabId){
        x.IsSelected =true;
        this.SelectedTabIndex = _index;
        this.SelectedTabTemplateRef = x;
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

    setTimeout(() => {
      this.contentVisible = true;
      console.log('timeout');
      console.log(this.SelectedTabTemplateRef);
      this.cdr.detectChanges();      
    });

    if(this.tabTemps && this.tabTemps.length > 0){                  
      this.TotalTabCount = this.tabTemps.length; 
      console.log('container');
            
      this.RenderUI();                  
    }

  }

  private RenderHeaders() {

    if(this.tabTemps){
      this.TabHeaders = [];
      this.tabTemps.forEach(x => {

        this.TabHeaders.push(new TabHeaderWithTabId( x, x.TabId, x.HeaderText));

      });
    }
  }

  ngAfterContentChecked(): void {        
    
  }  

  RenderUI(){    

    let _wrapLength: number | undefined = undefined;
      
    if(this.tabTemps && this.tabTemps.length > 0) {
      if(this.SelectedTabId!=undefined){
        this.selectedTab = this.tabTemps?.find(x=>x.TabId == this.SelectedTabId);
      } else {
       this.selectedTab = this.tabTemps.first;
       this.SelectedTabId = this.selectedTab.TabId;
      }

      if(this.selectedTab && this.tabTemps) {
        this.selectedTab.IsSelected = true;                

          let selectedHeader = new TabHeaderWithTabId(this.selectedTab,
                    this.selectedTab.TabId, this.selectedTab.HeaderText,true);

          this.RenderHeaders();
          this.selectTab(selectedHeader);      
                    
      } else{
        this.RenderHeaders();
        this.selectTab(undefined);
      }   
    }    
  }

  MoveEntireTabRow(){

  }

  ReArrangeTabHeaderForWrap(){
   
  }

  DeleteTab(tabId: string){    
    
    this.tabTemps?.forEach(x=>{
      if(x.TabId==tabId){
        x.IsSelected =false;
      }
    });

    let newTabs = this.tabTemps?.filter(x=>x.TabId!=tabId);
    if(newTabs){
      
      if(this.SelectedTabIndex < 0 || this.SelectedTabIndex >= newTabs.length){
        this.SelectedTabIndex = newTabs.length - 1;
      }

      this.tabTemps?.reset(newTabs);

      if(this.tabTemps) {
        let _tab = this.tabTemps.get(this.SelectedTabIndex);
        if(_tab){
          this.SelectedTabId = _tab.TabId;
        }
      }

      this.RenderUI();
      
    }
  }

  DeleteTabBasedOnIndex(index: number){
    if(this.tabTemps && index > -1 && index < this.tabTemps.length){
      let tab = this.tabTemps.get(index);
      
      if(tab)
        this.DeleteTab(tab.TabId);
    }
  }
}

export class TabHeaderWithTabId {
  constructor(public tabTemplateRef: RTabIdFor, public TabId: string = '', public headerText: string = '', public IsSelected: boolean = false){ }
}

export class TabOffsetTop {
  constructor(public TabId: string,
    public offsetTop: number
  ) {

  }
}
