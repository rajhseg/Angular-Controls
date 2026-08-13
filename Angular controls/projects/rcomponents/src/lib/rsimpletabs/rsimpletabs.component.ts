import { CdkDrag, CdkDropList, CdkDropListGroup } from "@angular/cdk/drag-drop";
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from "@angular/common";
import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ContentChildren, ElementRef, EventEmitter, Host, HostBinding, Input, Output, QueryList, RendererFactory2, TemplateRef, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { RTabComponent, RTabHeaderWithTabId, RTabIdFor } from "../rtab/rtab.component";
import { RWindowHelper } from "../rwindowObject";
import { RBaseComponent } from "../rmodels/RBaseComponent";
import { TitleCasePipe } from '@angular/common';
import { CssUnit, RCssUnitsService, RelativeUnitType } from "../rcss-units.service";


@Component({
    selector:'rsimpletabs',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgForOf, NgTemplateOutlet, RTabComponent, RTabIdFor, AsyncPipe, NgIf, NgStyle, TitleCasePipe, NgClass, JsonPipe, NgStyle],
    templateUrl: './rsimpletabs.component.html',
    styleUrl: './rsimpletabs.component.css'
})
export class RSimpleTabsComponent extends RBaseComponent<any> implements AfterContentInit, AfterContentChecked, AfterViewInit {


    private _selectedTabId: string | undefined = undefined;
    private _tabWidth: string = '100%';
    private _tabHeight: string = '200px';
    public selectedTab: RTabIdFor | undefined = undefined;
    public contentVisible: boolean = false;
    public tabInstance: RSimpleTabsComponent = this;
    public SelectedTabIndex: number = 0;
    public TabHeaders: RTabHeaderWithTabId[] = [];
    public activeSection: string = '';

    @Input()
    EnableBoxShadow : boolean = true;
    
    public SelectedTabTemplateRef!: RTabIdFor | undefined;
    
    
    TabWidth_C: string = '100%';
    TabHeight_C: string = '200px';
    
    @Input({ required: true, alias: 'TabHeight' })
    set TabHeight(value: string) {
      this._tabHeight = value;
      if (value && value != '') {
        let _val = this.cssServ.ToPxValue(value, this.hostElementRef.nativeElement.parentElement, RelativeUnitType.Height);
        this.TabHeight_C = _val + CssUnit.Px.toString();
      } else {
        this.TabHeight_C = '200px';
      }
    }
    get TabHeight(): string {
      return this._tabHeight;
    }
  
    @Input()
    set TabWidth(value: string) {
      this._tabWidth = value;
      if (value && value != '') {
        let _val = this.cssServ.ToPxValue(value, this.hostElementRef.nativeElement.parentElement, RelativeUnitType.Width);
        this.TabWidth_C = _val + CssUnit.Px.toString();
      } else {
        this.TabWidth_C = '100%';
      }
    }
    get TabWidth(): string {
      return this._tabWidth;
    }
    
    @Output()
    headerClicked = new EventEmitter<RTabHeaderWithTabId>();

    @Input()
    DisplayTabContainerWhenZeroTabs: boolean = false;
    
    @Input()
    set SelectedTabId(value: string | undefined) {
        if (value) {
        this._selectedTabId = value;
        this.RenderUI();
        }
    }
    get SelectedTabId(): string | undefined {
        return this._selectedTabId;
    }
    
    TotalTabCount: number = 0;

    @ContentChildren(RTabIdFor) tabTemps!: QueryList<RTabIdFor>;
    
    constructor(private winobj: RWindowHelper,
        private cdr: ChangeDetectorRef,
        private viewRef: ViewContainerRef,
        private cssServ: RCssUnitsService,
        @Host() public hostElementRef: ElementRef
    ) {
        super(winobj);
        this.Id = this.winobj.GenerateUniqueId();
        this.HostElementId = this.winobj.GenerateUniqueId();
    }

    setSection(selectedHeader: RTabHeaderWithTabId) {
        this.TabHeaders.forEach(x => x.IsSelected = false);
        this.activeSection = selectedHeader.TabId;
        selectedHeader.IsSelected = true;
        this.SelectedTabId = selectedHeader.TabId;
        this.headerClicked.emit(selectedHeader);
    }

    ngAfterViewInit(): void {

    }
  
    trackByHeader(index: number, header: RTabHeaderWithTabId) {
      return header.TabId;
    }
  

  private RenderHeaders() {

    if (this.tabTemps) {
      this.TabHeaders = [];
      this.tabTemps.forEach(x => {

        this.TabHeaders.push(new RTabHeaderWithTabId(x, x.TabId, x.HeaderText));

      });
    }
  }

  ngAfterContentChecked(): void {

  }

  private selectTab(selectedHeader: RTabHeaderWithTabId | undefined) {

    this.TabHeaders.forEach(x => x.IsSelected = false);

    this.tabTemps?.forEach((x, _index) => {

      if (selectedHeader && x.TabId == selectedHeader.TabId) {
        x.IsSelected = true;
        this.SelectedTabIndex = _index;
        this.SelectedTabTemplateRef = x;
      } else {
        x.IsSelected = false;
      }
    });

    this.TabHeaders.forEach(x => {
      if (selectedHeader && x.TabId == selectedHeader.TabId) {
        x.IsSelected = true;
      }
    });
  }

  ngAfterContentInit(): void {

    setTimeout(() => {
      this.contentVisible = true;      
      this.cdr.detectChanges();
    });

    if (this.tabTemps && this.tabTemps.length > 0) {
      this.TotalTabCount = this.tabTemps.length;      
      this.RenderUI();
    }

  }

  public AddTab(tabId: string, headerText: string, contextInstance: object, tabContent: TemplateRef<any>, isSelected: boolean) {
    let tab = new RTabIdFor(tabContent, this.viewRef, this.cdr);
    tab.IsSelected = isSelected;
    tab.ContextInstance = contextInstance;
    tab.TabId = tabId;
    tab.HeaderText = headerText;
    let _tabs = this.tabTemps?.toArray();

    if(isSelected) {
      _tabs?.forEach(x => x.IsSelected = false);
      this.SelectedTabId = tabId;
    }

    this.tabTemps?.reset([..._tabs, tab]);
    this.TotalTabCount = this.tabTemps.length;   
    this.RenderUI();
  }

  RenderUI() {

    let _wrapLength: number | undefined = undefined;

    if (this.tabTemps && this.tabTemps.length > 0) {
      if (this.SelectedTabId != undefined) {
        this.selectedTab = this.tabTemps?.find(x => x.TabId == this.SelectedTabId);
      } else {
        this.selectedTab = this.tabTemps.first;
        this.SelectedTabId = this.selectedTab.TabId;
      }

      if (this.selectedTab && this.tabTemps) {
        this.selectedTab.IsSelected = true;

        let selectedHeader = new RTabHeaderWithTabId(this.selectedTab,
          this.selectedTab.TabId, this.selectedTab.HeaderText, true);

        this.RenderHeaders();
        this.selectTab(selectedHeader);

      } else {
        this.RenderUIOnEmpty();
      }
    } else {
      this.RenderUIOnEmpty();
    }

    if(this.SelectedTabId)
      this.activeSection = this.SelectedTabId;

    this.cdr.detectChanges();
  }

  private RenderUIOnEmpty() {
    this.RenderHeaders();
    this.TabHeaders = [];
    this.selectedTab = undefined;
    this.SelectedTabId = undefined;
    this.SelectedTabIndex = -1;
    this.SelectedTabTemplateRef = undefined;
  }


  public DeleteTab(tabId: string) {

    this.tabTemps?.forEach(x => {
      if (x.TabId == tabId) {
        x.IsSelected = false;
      }
    });

    let newTabs = this.tabTemps?.filter(x => x.TabId != tabId);
    if (newTabs) {

      if (this.SelectedTabIndex < 0 || this.SelectedTabIndex >= newTabs.length) {
        this.SelectedTabIndex = newTabs.length - 1;
      }

      this.tabTemps?.reset(newTabs);

      if (this.tabTemps) {
        let _tab = this.tabTemps.get(this.SelectedTabIndex);
        if (_tab) {
          this.SelectedTabId = _tab.TabId;
        }
      }

      this.RenderUI();

    }
  }
        
}