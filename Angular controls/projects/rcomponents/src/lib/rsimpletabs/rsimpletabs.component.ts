import { CdkDrag, CdkDropList, CdkDropListGroup } from "@angular/cdk/drag-drop";
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from "@angular/common";
import { AfterContentChecked, AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ContentChildren, ElementRef, EventEmitter, Host, HostBinding, Input, Output, QueryList, RendererFactory2, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { RTabComponent, RTabHeaderWithTabId, RTabIdFor } from "../rtab/rtab.component";
import { RWindowHelper } from "../rwindowObject";
import { RBaseComponent } from "../rmodels/RBaseComponent";
import { TitleCasePipe } from '@angular/common';


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
    Name: string = "";
    
    @Input()
    EnableBoxShadow : boolean = true;
    
    public SelectedTabTemplateRef!: RTabIdFor | undefined;
    
    @Input({ required: true, alias: 'TabHeight' })
    set TabHeight(value: string) {
        if (value && value != '') {
        this._tabHeight = value;
        } else {
        this._tabHeight = '200px';
        }
    }
    get TabHeight(): string {
        return this._tabHeight;
    }
    
    @Input()
    set TabWidth(value: string) {
        if (value && value != '') {
        this._tabWidth = value;
        } else {
        this._tabWidth = '100%';
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

        
}