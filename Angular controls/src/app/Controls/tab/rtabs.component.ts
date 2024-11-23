import { AfterContentChecked, AfterContentInit, AfterViewInit, ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Compiler, Component, ComponentFactoryResolver, ComponentRef, ContentChildren, Directive, ElementRef, Host, inject, Injector, Input, ModuleWithProviders, NgModule, NgModuleRef, QueryList, Renderer2, RendererFactory2, Self, TemplateRef, Type, ViewChild, ViewChildren, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { RTabComponent, RTabIdFor } from "./tab.component";
import { AsyncPipe, CommonModule, JsonPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet } from "@angular/common";
import { WindowHelper } from "../windowObject";
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, transferArrayItem, CdkDragEnd, CdkDropListGroup, CdkDragMove } from '@angular/cdk/drag-drop';
import { RTabService } from "../tab.service";


@Component({
  selector: 'rtabs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  templateUrl: './rtabs.component.html',
  styleUrl: './rtabs.component.css',
  imports: [NgForOf, NgTemplateOutlet, AsyncPipe, NgIf,
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
  public dynamicHtml: string = '';

  public draggedTabs: TabHeaderWithTabId[] = [];

  public ispopuphidden: boolean = true;

  @ViewChild('vcTemp', { read: ViewContainerRef, static: false }) vcElement!: ViewContainerRef;

  @ViewChildren('tmp', {read: ElementRef}) tmp!: QueryList<ElementRef>;

  private hostElement!: ElementRef;

  private components: any[] = [
    RTabComponent
  ];

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

  public get TabHeightForDragged(): string {
    let _width: number = Number.parseInt(this.TabHeight.split('px')[0]) + 40;
    return _width + "px";
  }

  TotalTabCount: number = 0;
  private renderer!: Renderer2;

  @ContentChildren(RTabIdFor) tabTemps!: QueryList<RTabIdFor>;

  constructor(private winobj: WindowHelper,
    private cdr: ChangeDetectorRef,
    private cfr: ComponentFactoryResolver,
    private rendererFactory: RendererFactory2,
    private compiler: Compiler,
    private injector: Injector,
    private moduleRef: NgModuleRef<any>,
    private viewRef: ViewContainerRef,
    @Host() public hostElementRef: ElementRef
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    RTabService.GetInstance().AddTabsInstance(this);
  }

  ngAfterViewInit(): void {

  }

  trackByHeader(index: number, header: TabHeaderWithTabId) {
    return header.TabId;
  }


  dragEnded(event: CdkDragEnd) {
    let item = (event.source.data as TabHeaderWithTabId);
    this.deleteSourceItemOnDrag(item);
  }

  dragEndedForPopup(event: CdkDragEnd) {

  }

  deleteSourceItemOnDrag(item: TabHeaderWithTabId) {
    let _tabs = this.tabTemps?.toArray();
    if (item && _tabs) {
      let _prevIndex = _tabs?.findIndex(x => x.TabId == item.TabId);
      if (_tabs && _prevIndex > -1) {
        _tabs.splice(_prevIndex, 1);

        _tabs.forEach(x => {
          x.IsSelected = false;
        });

        this.tabTemps.reset(_tabs);

        if (this.SelectedTabIndex > -1 && this.SelectedTabIndex < this.tabTemps.length) {

        } else {
          this.SelectedTabIndex = this.tabTemps.length - 1;
        }

        if (this.SelectedTabIndex > -1 && this.SelectedTabIndex < this.tabTemps.length)
          this.SelectedTabId = this.tabTemps?.get(this.SelectedTabIndex)?.TabId;
        else {
          this.RenderHeaders();
          this.SelectedTabTemplateRef = undefined;
        }

      }
    }
  }

  dragStartedForPopup(event: any) {

  }

  draggeddropForPopup(event: CdkDragDrop<TabHeaderWithTabId[]>) {
    let curContainer = event.container.data.every((x: any) => x instanceof TabHeaderWithTabId);
    let PreContainer = event.previousContainer.data.every((x: any) => x instanceof TabHeaderWithTabId);
    if (curContainer && PreContainer) {

      if (!event.isPointerOverContainer) {
        return;
      }

      let _item = (event.item.data as TabHeaderWithTabId);
      let _exists = this.draggedTabs.some((x: TabHeaderWithTabId) => x.TabId == _item.TabId);

      if (!_exists) {

        if (event.previousContainer === event.container) {
          this.dropDataExchange(event, true);
        } else {
          this.dropDataExchange(event, false);
        }

        if (this.draggedTabs.length == 0)
          this.ispopuphidden = true;
      }
    }
  }

  onDragMoved(event: CdkDragMove) {
    const { x, y } = event.pointerPosition;
  }

  dragStarted(event: any) {

  }

  dropDataExchange(event: CdkDragDrop<TabHeaderWithTabId[]>, isSameContainer: boolean) {
    let _itemData = (event.item.data as TabHeaderWithTabId);
    let movedItemIndex = -2;

    if (isSameContainer) {
      movedItemIndex = (event.container.data as TabHeaderWithTabId[]).findIndex(x => x.TabId == _itemData.TabId);
    } else {
      movedItemIndex = (event.previousContainer.data as TabHeaderWithTabId[]).findIndex(x => x.TabId == _itemData.TabId);
    }

    if (movedItemIndex > -1) {
      if (isSameContainer)
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      else
        transferArrayItem(event.previousContainer.data, event.container.data, movedItemIndex, event.currentIndex);
    } else {
      event.container.data.splice(event.currentIndex, 0, _itemData);
    }
  }

  drop(event: CdkDragDrop<TabHeaderWithTabId[]>) {

    let curContainer = event.container.data.every(x => x instanceof TabHeaderWithTabId);
    let PreContainer = event.previousContainer.data.every(x => x instanceof TabHeaderWithTabId);
    if (curContainer && PreContainer) {

      if (!event.isPointerOverContainer) {
        this.ispopuphidden = false;
        let _item = (event.item.data as TabHeaderWithTabId)
        let mEvent = (event.event as MouseEvent);
        _item.X = mEvent.pageX;
        _item.Y = mEvent.pageY;

        this.draggedTabs.push(_item);

        return;
      }

      let _exists = event.container.data.some((x: TabHeaderWithTabId) => x.TabId == event.item.data.TabId);

      if (!_exists) {
        if (event.previousContainer === event.container) {
          this.dropDataExchange(event, true);
        } else {
          this.dropDataExchange(event, false);
        }
      }

      if (this.draggedTabs.length == 0)
        this.ispopuphidden = true;

      let components: RTabIdFor[] | undefined = [];
      components = event.container.data.map(x => x.tabTemplateRef);

      if (components) {
        this.tabTemps?.reset(components);
      }

      this.SelectedTabIndex = event.currentIndex;
      this.SelectedTabId = this.tabTemps?.get(this.SelectedTabIndex)?.TabId;

    }
  }

  bringToTop($event: any, ele:HTMLDivElement){
   
    let highestindex = 0;

    this.tmp.forEach((x:ElementRef<any>)=>{
      let zindex = parseInt((x.nativeElement as HTMLElement).style.zIndex);
      
      if(zindex > highestindex)
          highestindex = zindex;
    });

    this.tmp.forEach((x:ElementRef<any>)=>{
      (x.nativeElement as HTMLElement).style.zIndex = highestindex.toString();        
    });

    ele.style.zIndex = (highestindex + 1).toString();
  }

  HeaderClicked(selectedHeader: TabHeaderWithTabId) {
    selectedHeader.IsSelected = true;
    this.SelectedTabId = selectedHeader.TabId;
  }

  selectTab(selectedHeader: TabHeaderWithTabId | undefined) {

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

  private RenderHeaders() {

    if (this.tabTemps) {
      this.TabHeaders = [];
      this.tabTemps.forEach(x => {

        this.TabHeaders.push(new TabHeaderWithTabId(x, x.TabId, x.HeaderText));

      });
    }
  }

  ngAfterContentChecked(): void {

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

        let selectedHeader = new TabHeaderWithTabId(this.selectedTab,
          this.selectedTab.TabId, this.selectedTab.HeaderText, true);

        this.RenderHeaders();
        this.selectTab(selectedHeader);

      } else {
        this.RenderUIOnEmpty();
      }
    } else {
      this.RenderUIOnEmpty();
    }

    this.cdr.detectChanges();
  }

  RenderUIOnEmpty() {
    this.RenderHeaders();
    this.TabHeaders = [];
    this.selectedTab = undefined;
    this.SelectedTabId = undefined;
    this.SelectedTabIndex = -1;
    this.SelectedTabTemplateRef = undefined;
  }

  MoveEntireTabRow() {

  }

  ReArrangeTabHeaderForWrap() {

  }

  DeleteTab(tabId: string) {

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

  DeleteTabBasedOnIndex(index: number) {
    if (this.tabTemps && index > -1 && index < this.tabTemps.length) {
      let tab = this.tabTemps.get(index);

      if (tab)
        this.DeleteTab(tab.TabId);
    }
  }

  RenderElement(element: HTMLElement) {

  }

}

export class TabHeaderWithTabId {
  constructor(public tabTemplateRef: RTabIdFor, public TabId: string = '',
    public headerText: string = '', public IsSelected: boolean = false,
    public X: number = 0, public Y: number = 0) { }
}

export class TabOffsetTop {
  constructor(public TabId: string,
    public offsetTop: number
  ) {

  }
}
