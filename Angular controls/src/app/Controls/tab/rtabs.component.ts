import { AfterContentChecked, AfterContentInit, Component, ContentChildren, Input, QueryList, TemplateRef, ViewEncapsulation } from "@angular/core";
import { RTabComponent } from "./tab.component";
import { RTabHeaderComponent } from "./tabheader/tabheader.component";
import { AsyncPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from "@angular/common";
import { RTabContentComponent } from "./tabcontent/tabcontent.component";

@Component({
  selector:'rtabs',
  standalone: true,
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl:'./rtabs.component.html',
  styleUrl:'./rtabs.component.css',
  imports:[NgForOf, NgTemplateOutlet, AsyncPipe, NgIf,
    NgClass, RTabContentComponent, RTabHeaderComponent]
})
export class RTabsComponent implements AfterContentInit, AfterContentChecked {

  SelectedTabHeader: TabHeaderWithTabId | undefined = undefined;
  SelectedTabContent: TabContentWithTabId | undefined = undefined;
  SelectedContentTemplateRef!: TemplateRef<any>;
  SelectedTabIndex: number = 0;
  IsTabHeaderWrapped: boolean = false;
  tabsOffsets: TabOffsetTop[] = [];
  wrapTabs: TabOffsetTop[] = [];

  private _selectedTabId: string | undefined = undefined;
  private _tabWidth: string = '100%';

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
  set SelectedTabId(value: string){
    
    if(value) {      
      this._selectedTabId = value;
      if(this.TabMountedCount > 0 && this.TabMountedCount==this.TotalTabCount){
        this.RenderUI();
      }
    }
  }
  get SelectedTabId(): string | undefined {
    return this._selectedTabId;
  }

  headers: TabHeaderWithTabId[] | undefined | null = [];
  contents: TabContentWithTabId[]| undefined | null = [];

  TotalTabCount: number = 0;
  TabMountedCount: number = 0;

  @ContentChildren(RTabComponent) tabs!:QueryList<RTabComponent> | undefined;

  HeaderClicked(selectedHeader: TabHeaderWithTabId){
    this.SelectedTabId = selectedHeader.TabId;        
  }

  selectTab(selectedHeader: TabHeaderWithTabId){

    this.headers?.forEach(x=> {
      if(x.headerComponent!=undefined)
          x.headerComponent.IsSelected =false
    } );

    if(selectedHeader.headerComponent!=undefined)
      selectedHeader.headerComponent.IsSelected = true;

    this.SelectedTabHeader = selectedHeader;

    this.contents?.forEach(x=>x.contentComponent.IsSelected=false);

    this.contents?.forEach(x=>{
      if(selectedHeader.TabId==x.TabId){

        x.contentComponent.IsSelected = true;
        this.SelectedTabContent = x;        

        if(x.contentComponent.content)
          this.SelectedContentTemplateRef = x.contentComponent.content;
      }
    });

  }

  ngAfterContentInit(): void {

    if(this.tabs){
      
      this.TotalTabCount = this.tabs.length;

      this.tabs.forEach(x=> {
        x.TabMounted.subscribe(x=>{
          this.TabMountedCount++;
        })
      });

    }        

  }

  ngAfterContentChecked(): void {        
    if(this.TabMountedCount > 0 && this.TabMountedCount==this.TotalTabCount){
      this.RenderUI();
    }
  }  

  RenderUI(){    

    this.headers = this.tabs?.map(x=> new TabHeaderWithTabId(x.TabId, x.tabHeader));
    this.contents = this.tabs?.map(x=> new TabContentWithTabId(x.TabId, x.tabContent));

    if(this.headers!=null && this.contents!=undefined 
      && this.contents.length > 0 
      && this.headers.length > 0) {            

      if(this._selectedTabId==undefined || this._selectedTabId==null){
        this._selectedTabId = this.headers[0].TabId;
      } else{
        let _index = this.headers.findIndex(x=>x.TabId == this._selectedTabId);
        if(_index<0){
          this._selectedTabId = this.headers[0].TabId;
        } else{
          this.SelectedTabIndex = _index;
        }
      }

      this.SelectedTabContent = this.contents[this.SelectedTabIndex];
      this.SelectedTabHeader = this.headers[this.SelectedTabIndex];      

      if(this.SelectedTabContent.contentComponent.content)
          this.SelectedContentTemplateRef = this.SelectedTabContent.contentComponent.content;
      
      this.selectTab(this.headers[this.SelectedTabIndex]);           

      let _wrapLength: number | undefined = undefined;

      this.tabsOffsets = [];
      this.wrapTabs = [];

      this.tabs?.forEach(x => {                
        let _ele = document.getElementById('rtabheader_'+x.TabId);
        
        if(_ele)
          this.tabsOffsets.push(new TabOffsetTop(x.TabId, _ele.offsetTop));

        if(!this.IsTabHeaderWrapped) {
          if(_wrapLength==undefined){
            _wrapLength = _ele?.offsetTop;
          } else{
            if(_ele &&_wrapLength < _ele.offsetTop){
              this.IsTabHeaderWrapped = true;              
            }
          }
        }

      });

      if(this.IsTabHeaderWrapped){
        this.ReArrangeTabHeaderForWrap();
      }

    }    
  }

  MoveEntireTabRow(){
    this.tabsOffsets
    this.tabs?.forEach(x => {                
      let _ele = document.getElementById('rtabheader_'+x.TabId);

      let _wrap = this.wrapTabs.find(y=>y.TabId==x.TabId);
      if(_wrap && _ele){
        console.log('TabID :'+x.TabId + ',offsetTop:'+ _ele.offsetTop +', before Element top: '+_ele.style.marginTop);
        _ele.style.marginTop = _wrap.offsetTop+'px';
        console.log('TabID :'+x.TabId+',offsetTop:'+ _ele.offsetTop +', after Element top: '+_ele.style.marginTop);
      }
    });

  }

  ReArrangeTabHeaderForWrap(){
    console.log(this.tabsOffsets);
    
    let wrapTabOffset = this.tabsOffsets.filter(x=>x.TabId==this.SelectedTabId)[0].offsetTop;
    let wrapTabList = this.tabsOffsets.filter(x=>x.offsetTop == wrapTabOffset).map(x=>x.TabId);

    let newTabs = this.tabs?.filter(x=> wrapTabList.indexOf(x.TabId) == -1);
    let wrapTabs = this.tabs?.filter(x=> wrapTabList.indexOf(x.TabId) > -1);
    let wrappedTabs: RTabComponent[] = [];
    
    if(this.tabsOffsets.length > 0) {
      let lastItemOffset = this.tabsOffsets[this.tabsOffsets.length-1].offsetTop;      
      if(wrapTabList)
        this.wrapTabs = wrapTabList.map(x=> new TabOffsetTop(x, lastItemOffset));
    }

    if(newTabs) {
      for(let i=0; i<newTabs?.length; i++){
        wrappedTabs.push(newTabs[i]);
      }
    }

    if(wrapTabs) {
      for(let i=0; i<wrapTabs?.length; i++){
        wrappedTabs.push(wrapTabs[i]);
      }
    }
    
    console.log(this.tabsOffsets);

    this.tabs?.reset(wrappedTabs);
    this.MoveEntireTabRow();
  }

  DeleteTab(tabId: string){    
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
  constructor(public TabId: string = '',
  public headerComponent: RTabHeaderComponent){ }
}

export class TabContentWithTabId {
  constructor(public TabId: string = '',
  public contentComponent: RTabContentComponent){}
}

export class TabOffsetTop {
  constructor(public TabId: string,
    public offsetTop: number
  ) {

  }
}
