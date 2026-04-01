import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDragStart, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AsyncPipe, DatePipe, JsonPipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, DoCheck, ElementRef, EventEmitter, forwardRef, HostBinding, input, Input,
         NgZone, OnChanges, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { RColumnComponent } from './rcolumn/rcolumn.component';
import { RCell, RCellInfo, RColumnComponentInfo, RGridEditRowInfo, RGridHeaderSort, RGridHeaderSortType, RGridItems, RGridPaginationValue, RGridRow, RGridRowInfo } from './rcell';
import { RButtonComponent } from "../rbutton/rbutton.component";
import { RDropdownComponent } from "../rdropdown/rdropdown.component";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModel } from '../rdropdown/rdropdownmodel';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";
import { RWindowHelper } from '../rwindowObject';
import { RFilterApplyModel, RFilterComponent, RFilterDataType } from '../rfilter/rfilter.component';
import { CssUnit, RCssUnitsService, RelativeUnitType } from '../rcss-units.service';
import { RCheckboxComponent } from '../rcheckbox/rcheckbox.component';
import { CheckboxEventArgs } from '../rcheckbox/rcheckbox.service';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { RProgressBarDisplayType, RProgressBarType } from '../rprogressbar/rprogressbarType';
import { RProgressbarComponent } from "../rprogressbar/rprogressbar.component";
import { RBaseComponent } from '../rmodels/RBaseComponent';
import { ValidateInput, ValidateInputType } from '../Validator';

@Component({
  selector: 'rgrid',
  standalone: true,
  imports: [NgForOf, NgTemplateOutlet, AsyncPipe, NgIf, NgStyle, CdkDropListGroup,
    KeyValuePipe, ScrollingModule,
    NgClass, CdkDrag, CdkDropList, CdkDragPlaceholder, JsonPipe, FormsModule, CdkDragPreview,
    ReactiveFormsModule, NgTemplateOutlet, RButtonComponent, RDropdownComponent, RTextboxComponent,
    RFilterComponent, RCheckboxComponent, RProgressbarComponent],
  templateUrl: './rgrid.component.html',
  styleUrl: './rgrid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RGridComponent),
      multi: true
    },
    DatePipe
  ]
})
export class RGridComponent extends RBaseComponent<any> implements OnInit, DoCheck, AfterContentInit, AfterViewInit, ControlValueAccessor, OnChanges {

  private _items: any[] = [];

  private ColValues: DropdownModel[] = [];

  private indxKey: string = "rgrid_index";

  private selectKey: string = "rgrid_select";

  progressDisplayType: RProgressBarDisplayType = RProgressBarDisplayType.Circle;

  progressType: RProgressBarType = RProgressBarType.Infinite;

  @Input()
  @ValidateInput("color")
  SortIconColor: string = 'white';

  @Input()
  @ValidateInput("color")
  FilterIconColor: string = 'white';

  @Input()
  @ValidateInput("color")
  GroupHeaderBackColor: string = '#edecec';

  @Input()
  @ValidateInput("color")
  GroupHeaderForeColor: string = 'black';

  @Input()
  @ValidateInput("color")
  LoaderForeColor: string = '#8f19ff';

  @Input()
  @ValidateInput("color")
  LoaderTrackColor: string = 'lightgray';

  EnableLoader: boolean = false;

  @Input()
  @ValidateInput("boolean")
  EnableSelectColummn: boolean = true;

  IsSelectedAll: boolean = false;

  @Output()
  SelectAllClicked: EventEmitter<{isSelectedAll: boolean, event: Event|undefined}> = new EventEmitter<{isSelectedAll: boolean, event: Event|undefined}>();

  @Output()
  ItemSelectClick: EventEmitter<{isSelected: boolean, item:any, event: Event|undefined}> = new EventEmitter<{isSelected: boolean, item:any, event: Event|undefined}>();
  
  Headers: RGridHeader[] = [];

  SortHeaders: RGridHeaderSort[] = [];

  GroupHeaders: RGridHeader[] = [];

  @Input()
  PageItems: DropdownModel[] = []

  currentPage: number = 1;  

  @Input()
  @ValidateInput("color")
  GroupByIconColor: string = "#00c7ba";

  @Output()
  OnCellValueChanged = new EventEmitter<RCellInfo>();

  @Output()
  OnItemsChanged = new EventEmitter<{ ChangedRow: any, RowIndex: number | undefined }>();

  @Output()
  OnColumnGrouped = new EventEmitter<RGridHeader>();

  @Output()
  OnColumnRemovedFromGrouped = new EventEmitter<RGridHeader>();

  @Output()
  OnAfterColumnSort = new EventEmitter<RGridHeader>();

  @Output()
  OnBeforeColumnSort = new EventEmitter<RGridHeader>();

  @Output()
  OnFilterApplyClicked = new EventEmitter<RFilterApplyModel>();

  @Output()
  OnFilterClearedClicked = new EventEmitter<RFilterApplyModel>();

  @Output()
  BeforeApplyingFilter = new EventEmitter<RFilterApplyModel>();

  @Output()
  AfterApplyingFilter = new EventEmitter<RFilterApplyModel>();

  @Output()
  OnRowEditClicked = new EventEmitter<RGridRowInfo>();

  @Output()
  OnRowCloseClicked = new EventEmitter<RGridRowInfo>();

  @Output()
  OnCellClicked = new EventEmitter<RCellInfo>();

  @Output()
  OnGroupCliked = new EventEmitter<RGridGroupData>();

  @Input()
  @ValidateInput("size")
  RowHeightInPx: string = '50px';

  @Input()
  @ValidateInput("size")
  GroupHeaderRowHeightInPx: string = '50px';

  @Input()
  @ValidateInput("size")
  SelectCheckBoxSize: string = "13px";
  
  @Input()
  @ValidateInputType(DropdownModel)
  ItemsPerPage!: DropdownModel;

  _tableHeight: string = '200px';

  ActualWidth: string = "100%";

  HeaderWidth: string = "100%";

  _fitColumns: boolean = false;
  
  ContentInit: boolean = false;

  set FitColumnsToContent(val: boolean)
  {
    this._fitColumns = val;
    if(this.ContentInit && this.winObj.isExecuteInBrowser()){
      this.ngAfterContentInit();
    }
  }
  get FitColumnsToContent(): boolean {
    return this._fitColumns;
  }

  @Input()
  set TableHeight(val: string){
    if(this.winObj.isExecuteInBrowser()) {
      let _val = this.ValidSize(val);
      let _height = this.cssUnit.ToPxString(_val, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
      this._tableHeight = _height;
    }
  }
  get TableHeight(): string {
    return this._tableHeight;
  }

  public get FooterWidth() {
    let val = this.cssUnit.ToPxValue(this.TableWidth, null, null);
    return (val - 2) + "px";
  }

  _tableWidth: string = '99%';

  @Input()
  set TableWidth(val: string){
    if(this.winObj.isExecuteInBrowser()) {
      let _val = this.ValidSize(val);
      let _width = this.cssUnit.ToPxString(_val, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
      this._tableWidth = _width;
    }
  }
  get TableWidth(): string {
    let _width = this.cssUnit.ToPxString(this._tableWidth, this.ele.nativeElement.parentElement, RelativeUnitType.Width);
    return _width;
  }

  @Input()
  @ValidateInput("boolean")
  EnableVirtualScroll: boolean = false;

  @Input()
  @ValidateInput("boolean")
  ShowEditUpdate: boolean = true;

  @Input()
  @ValidateInput("boolean")
  ShowGroupHeader: boolean = true;

  @Input()
  @ValidateInput("color")
  HeaderBackgroundColor: string = "rgb(35, 206, 236)";

  @Input()
  @ValidateInput("color")
  HeaderForeColor: string = "white";

  @Input()
  @ValidateInput("label")
  FilterDateFormat: string = 'MM-dd-yyyy';

  @Output()
  NextPageClicked = new EventEmitter<RGridPaginationValue>();

  @Output()
  PreviousPageClicked = new EventEmitter<RGridPaginationValue>();
  
  @Output()
  FirstPageClicked = new EventEmitter<RGridPaginationValue>();
  
  @Output()
  LastPageClicked = new EventEmitter<RGridPaginationValue>();

  @Output()
  ItemsPerPageClicked = new EventEmitter<RGridPaginationValue>();
  
  EditModeEnabled: boolean = false;

  DataItems!: RGridItems;

  EditRows: RGridEditRowInfo[] = [];

  ShowItems!: RGridItems | undefined;

  ColumnsNotDefined: boolean = false;

  IsGroupHaveColumns: boolean = false;

  HeaderGroupPanelShow: boolean = false;

  GroupedData!: Map<string, RGridRow[]> | undefined;

  GroupItems: RGridGroupData[] = [];
  DisplayGroupItems: RGridGroupData[] = [];

  @ContentChildren(RColumnComponent)
  public Columns!: QueryList<RColumnComponent>;

  @ViewChild('viewmode', { read: TemplateRef<any> }) defaultReadView!: TemplateRef<any>;

  @ViewChild('editmode', { read: TemplateRef<any> }) defaultEditView!: TemplateRef<any>;

  @ViewChild('parentElement', {read: ElementRef }) parentEle!: ElementRef;

  onChanged: Function = () => { };
  onTouched: Function = () => { };

  public BackupItems: any[] = [];
  private IsFilteredApplied: boolean = false;
  private IsUpdateFromFilter: boolean = false;
  filterModel: any = {};
  
  @Input()
  public set Items(value: any[]) {
  
    let scannedValue = this.ValidObjectArray(value);

    this.RenderUI(scannedValue);
    
    if(!this.IsUpdateFromFilter)
    {
      if(scannedValue!= undefined && scannedValue!=null)
        this.BackupItems = scannedValue.slice();
      else
        this.BackupItems = [];
    }

    this.IsUpdateFromFilter = false;    
  }
  public get Items(): any[] {
    return this._items;
  }

  private enableShadow: boolean = false;

  @Input()
  public get EnableShadow() {
    return this.enableShadow;
  }
  public set EnableShadow(value: boolean) {

    this.enableShadow = this.ValidBoolean(value);
  }

  public get TotalRows(): number {
    return this.Items.length;
  }

  public get RowsInCurrentPage(): number {
    if(this.IsGroupHaveColumns){
        if(this.DisplayGroupItems){
          let _totalLen = 0;

          for (const group in this.DisplayGroupItems) {
            _totalLen += this.DisplayGroupItems[group].Values.length;
          }
          
          return _totalLen;
        }
    } else{

      if(this.ShowItems && this.ShowItems.Rows)
        return this.ShowItems.Rows.length;
    }
    return 0;
  }

  public get TotalPagesInGrid(): number {
    
    if(this.DataItems) {
      let tot = this.DataItems.Rows.length;
      let div = tot / this.ItemsPerPage.Value;
      div = Math.ceil(div);
      return div;
    }
      
    return 0;
  }

  public get GetContentHeight(): string {
    if(this.TableHeight != undefined && this.TableHeight != null) {
      let _height = this.cssUnit.ToPxValue(this.TableHeight, this.ele.nativeElement.parentElement, RelativeUnitType.Height);
      let contentHeight =  _height - 40;
      let contentHeightPercent = (contentHeight/_height) * 100;
      return contentHeightPercent + CssUnit.Percentage;
    } else {
      return '100%';
    }
  }

  @ViewChild(CdkVirtualScrollViewport)
  viewport!: CdkVirtualScrollViewport;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef, winObj: RWindowHelper,
    private datePipe: DatePipe, private cssUnit: RCssUnitsService, private ele: ElementRef
  ) {
    super(winObj);
    this.Id = this.winObj.GenerateUniqueId();
    this.HostElementId = this.winObj.GenerateUniqueId();

    this.ItemsPerPage = new DropdownModel(10, "10");

    this.ColValues.push(new DropdownModel(1,"1"));
    this.ColValues.push(new DropdownModel(2,"2"));
    this.ColValues.push(new DropdownModel(3,"3"));
    this.ColValues.push(new DropdownModel(4,"4"));
    this.ColValues.push(new DropdownModel(5,"5"));      
  }

  SelectAll(evt: CheckboxEventArgs) {
    this.EnableLoader = true;

    setTimeout(()=>{

      this.IsSelectedAll = evt.isChecked;
      
      for (let index = 0; index < this.DataItems.Rows.length; index++) {
        const element = this.DataItems.Rows[index];
        element[this.selectKey].FromModel = true;
        element[this.selectKey].Value = evt.isChecked as any;
        element[this.selectKey].FromModel = false;
      }

      this.SelectAllClicked.emit({isSelectedAll: evt.isChecked, event:evt.event});
    
      this.EnableLoader = false;
      this.cdr.detectChanges();
    });
  }

  ItemSelect(evt:CheckboxEventArgs, item: any){ 

    if(evt==undefined || evt.event == undefined)
      return;

    let valueUpd = item[this.selectKey].IsValueUpdated;

    let notifyDataItems = this.Items.slice();   
    item[this.selectKey].FromModel = true;
    item[this.selectKey].Value = evt.isChecked as any;
    item[this.selectKey].FromModel = false;

    let _rownum = item[this.indxKey as string].Row;
    let _row = (notifyDataItems as [])[_rownum as any];

    if(valueUpd) {
      this.ItemSelectClick.emit({isSelected: evt.isChecked, event: evt.event, item: _row});
      item[this.selectKey].IsValueUpdated = false;
    }
  }

  ngOnInit(): void {    
    
  }

  ngDoCheck(): void {
  
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  onTDClick(info: RCell) {

    let evtArgs = this.getCellInfo(info);

    this.OnCellClicked.emit(evtArgs);
  }

  getCellInfo(info: RCell): RCellInfo {

    let evtArgs = new RCellInfo();

    //evtArgs.Column = info.Column;
    //evtArgs.Row = info.Row;

    evtArgs.Component = info.component;
    evtArgs.FromModel = info.FromModel;
    evtArgs.HeaderIndex = info.HeaderIndex;
    evtArgs.HeaderKey = info.HeaderKey;
    evtArgs.Height = info.Height;
    evtArgs.IsEditMode = info.IsEditMode;
    evtArgs.Item = info.Item;
    
    evtArgs.Value = info.Value;
    evtArgs.Width = info.Width;
    evtArgs.DisplayRow = info.DisplayRow;
    evtArgs.DisplayColumn = info.DisplayColumn;

    if (info.columnDirective != undefined) {

      let compInfo = new RColumnComponentInfo();

      compInfo.DisableFilter = info.columnDirective.DisableFilter;
      compInfo.DisableGrouping = info.columnDirective.DisableGrouping;
      compInfo.DisableSort = info.columnDirective.DisableSort;
      compInfo.HeaderText = info.columnDirective.HeaderText;
      compInfo.Height = info.columnDirective.Height;
      compInfo.IsComputationalColumn = info.columnDirective.IsComputationalColumn;
      compInfo.IsDummyPropToBind = info.columnDirective.IsDummyPropToBind;
      compInfo.Name = info.columnDirective.Name;
      compInfo.PropToBindToCellInfo = info.columnDirective.PropToBindToCellInfo;
      compInfo.Width = info.columnDirective.Width;

      evtArgs.ColumnComponentInfo = compInfo;
    }

    return evtArgs;
  }

  getPaginationValue(): RGridPaginationValue {
    return new RGridPaginationValue(this.currentPage, this.ItemsPerPage.Value, this.TotalPagesInGrid, this.TotalRows, this.RowsInCurrentPage);
  }

  writeValue(obj: any): void {
    this.RenderUI(obj);
  }

  RenderUI(obj: any[]) {
    if (obj == null || obj == undefined)
      obj = [];

    this._items = obj.slice();
    this.InitGrid();
  }

  InitGrid() {
    if (this.currentPage == 0)
      this.currentPage = 1;

    this.ngAfterContentInit();
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  NotifyToModel(cellInfo: RCell) {

    let evtArgs = this.getCellInfo(cellInfo);

    this.OnCellValueChanged.emit(evtArgs);

    this.cdr.detectChanges();
  }

  NotifyToModelOnUpdate(row: RGridRow) {
    let notifyDataItems = this.Items.slice();

    let fulllist = this.BackupItems.length > 0 ? this.BackupItems.slice() : this.Items.slice();

    this.onChanged(fulllist);
    this.onTouched(fulllist);

    let _rownum = row[this.indxKey as string].Row;
    let _row = (notifyDataItems as [])[_rownum as any];

    this.OnItemsChanged.emit({ ChangedRow: _row, RowIndex: _rownum });
    this.cdr.detectChanges();
  }

  async sortColumn(hdr: RGridHeader) {
    
    this.EnableLoader = true;

    setTimeout(async () => {

      if (hdr) {

        this.OnBeforeColumnSort.emit(hdr);

        let defaultindx = this.SortHeaders.findIndex(x => x.Header.PropToBind == this.indxKey);
        if (defaultindx > -1) {
          this.SortHeaders.splice(defaultindx, 1);
        }
        let srtType: RGridHeaderSortType | undefined = undefined;

        if (hdr.sortType == undefined) {
          srtType = RGridHeaderSortType.Ascending;
        } else if (hdr.sortType == RGridHeaderSortType.Ascending) {
          srtType = RGridHeaderSortType.Descending;
        }
        else {
          srtType = undefined;
        }

        let indx = this.SortHeaders.findIndex(x => x.Header.PropToBind == hdr.PropToBind);
        hdr.sortType = srtType;

        if (srtType == undefined) {
          this.SortHeaders.splice(indx, 1);
        } else {
          if (indx > -1) {
            this.SortHeaders[indx].SortType = srtType;;
          } else {
            this.SortHeaders.push(new RGridHeaderSort(srtType, hdr));
          }
        }

        if (this.SortHeaders.length == 0) {
          let defaultHdr = new RGridHeader(this.indxKey, this.indxKey, this.indxKey, -1, this.indxKey, false);
          this.SortHeaders.push(new RGridHeaderSort(RGridHeaderSortType.Ascending, defaultHdr));
        }

        await this.sortData();
      }

      this.EnableLoader = false;

      this.OnAfterColumnSort.emit(hdr);

      this.cdr.detectChanges();
    });
  }

  async sortAsc(hdr: RGridHeader) {
    let indx = this.SortHeaders.findIndex(x => x.Header.PropToBind == hdr.PropToBind);

    if (indx > -1) {
      this.SortHeaders[indx].SortType = RGridHeaderSortType.Ascending;
    } else {
      this.SortHeaders.push(new RGridHeaderSort(RGridHeaderSortType.Ascending, hdr));
    }

    await this.sortData();
  }

  AssignSortTypeToHeaders() {
    for (let index = 0; index < this.SortHeaders.length; index++) {
      const element = this.SortHeaders[index];
      let _hdrIndx = this.Headers.findIndex(x => x.PropToBind == element.Header.PropToBind);
      if (_hdrIndx > -1) {
        let _hdr = this.Headers[_hdrIndx];
        _hdr.sortType = element.SortType;
      }
    }
  }

  async sortDes(hdr: RGridHeader) {
    let indx = this.SortHeaders.findIndex(x => x.Header.PropToBind == hdr.PropToBind);

    if (indx > -1) {
      this.SortHeaders[indx].SortType = RGridHeaderSortType.Descending;
    } else {
      this.SortHeaders.push(new RGridHeaderSort(RGridHeaderSortType.Descending, hdr));
    }

    await this.sortData();
  }

  async sortData() {

    const sorter = (columns: RGridHeaderSort[]) => (firstObj: any, SecondObj: any) => columns.map(x => {
      let type = 1;

      if (x.SortType == RGridHeaderSortType.Descending) {
        type = -1;
      }

      if (firstObj[x.Header.PropToBind].Value < SecondObj[x.Header.PropToBind].Value)
        return -(type);
      else if (firstObj[x.Header.PropToBind].Value > SecondObj[x.Header.PropToBind].Value)
        return type;
      else
        return 0;

    }).reduce((prev, curr) => prev ? prev : curr, 0);


    if (this.IsGroupHaveColumns) {

      /* insert group column at first position in sort */
      let _cols = this.SortHeaders.map(x => this.GroupHeaders.find(y => y.ColumnName == x.Header.ColumnName));
      let groupCols = _cols.filter(x => x != undefined);

      for (let index = groupCols.length - 1; index > -1; index--) {
        const element = groupCols[index];
        if (element) {
          let indx = this.SortHeaders.findIndex(x => x.Header.ColumnName == element.ColumnName);
          let ele = this.SortHeaders[indx];
          if (indx > 0) {
            this.SortHeaders.splice(indx, 1);
            this.SortHeaders.unshift(ele);
          }
        }
      }
      /* above code insert group column at first position in sort */

      this.DataItems.Rows.sort(sorter(this.SortHeaders));
      await this.createGroup();

      let _keys = this.GroupItems.length;
      for (let index = 0; index < _keys; index++) {
        const element = this.GroupItems[index];
        element.Values.sort(sorter(this.SortHeaders));
      }

      await this.filterPerPageForGroup();

    } else {
      this.DataItems.Rows.sort(sorter(this.SortHeaders));
      await this.filterPerPage();
    }

    this.AssignSortTypeToHeaders();
  }

  getGroupHeaderAsString(grpItem: RGridGroupData) {
    let gpString = "";
    let keys = grpItem.Key.split("_$");

    for (let index = 0; index < this.GroupHeaders.length; index++) {
      const element = this.GroupHeaders[index];
      //gpString += "["+element.HeaderText +" : "+ keys[index+1]+"] ";
      gpString += "[" + keys[index + 1] + "] ";
    }

    gpString += "(" + grpItem.Values.length + ")  items";
    return gpString;
  }

  async createGroup() {

    let exprs = [];

    console.log("Create Group called");

    for (let index = 0; index < this.GroupHeaders.length; index++) {
      const element = this.GroupHeaders[index];
      let exp = (x: any) => x[element.PropToBind];
      exprs.push(exp);
    }

    this.GroupItems = [];

    if (this.GroupHeaders.length > 0) {
      this.GroupedData = this.groupByItems(exprs);
      let keys = (this.GroupedData.keys() as any).toArray();

      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        let _values = this.GroupedData.get(element);
        if (_values) {
          this.GroupItems.push(new RGridGroupData(element, _values, true));
        }
      }

      this.IsGroupHaveColumns = true;

    } else {
      this.GroupedData = undefined;
      this.IsGroupHaveColumns = false;

      this.GroupItems = [];
      this.DisplayGroupItems = [];
    }

    if (this.IsGroupHaveColumns) {
      await this.filterPerPageForGroup();
    } else {
      await this.filterPerPage();
    }

    if (this.viewport) {
      this.viewport.checkViewportSize();
    }
  }

  async expandGroup($event: Event, grpItem: RGridGroupData) {
    this.EnableLoader = true;

    setTimeout(async () => {

      grpItem.IsExpanded = !grpItem.IsExpanded;

      let spanElement = ($event.srcElement as HTMLSpanElement);
      spanElement.classList.toggle("symbol-down");

      this.EnableLoader = false;

      this.OnGroupCliked.emit(grpItem);

      this.cdr.detectChanges();
    });
  }

  public ShowLoader() {
    setTimeout(() => {
      this.EnableLoader = true;
      this.cdr.detectChanges();
    });
  }

 public HideLoader() {
    setTimeout(() => {
      this.EnableLoader = false;
      this.cdr.detectChanges();
    });
  }

  async groupDrop($event: CdkDragDrop<RGridHeader[]>) {

    this.EnableLoader = true;

    setTimeout(async () => {


      let _hdr = $event.item.data as RGridHeader;
      let _srt = undefined;

      if (_hdr) {
        let _col = this.Columns.find(x => x.Name.toLowerCase() == _hdr.ColumnName.toLowerCase());

        if (_col && (_col.IsComputationalColumn || _col.IsDummyPropToBind || _col.DisableGrouping)) {
          this.EnableLoader = false;
          this.cdr.detectChanges();
          return;
        }

        let indx = this.GroupHeaders.findIndex(x => x.PropToBind == _hdr.PropToBind);
        if (indx == -1) {
          this.GroupHeaders.push($event.item.data);
          await this.createGroup();

          /* Sort the column when group */
          if (_hdr.sortType == RGridHeaderSortType.Ascending) {
            _srt = undefined;
          } else if (_hdr.sortType == RGridHeaderSortType.Descending) {
            _srt = RGridHeaderSortType.Ascending;
          }

          _hdr.sortType = _srt;
          this.sortColumn(_hdr);
        }
      }

      this.EnableLoader = false;

      this.OnColumnGrouped.emit(_hdr);

      this.cdr.detectChanges();
    });

  }

  cdkVirtualTrackBy(index: number, item: any): number {
    try {
      if (!item) 
        return index;
      
      const key = this.indxKey;

      if (item[key] && item[key].Value !== undefined && item[key].Value !== null) {
        return item[key].Value as number;
      }
      
      return index;
    } catch (e) {
      return index;
    }
  }

  cdkVirtualGroupTrackBy(index: number, item: any): string {
    try{
      if(!item) 
        return index.toString();

      let _d = item as RGridGroupData;

      if(_d)
        return _d.Key;
      else
        return index.toString();

    } catch(e) {
      return index.toString();
    }
  }

  async removeFromGroup(item: RGridHeader) {
    this.EnableLoader = true;

    setTimeout(async () => {

      let ind = this.GroupHeaders.findIndex(x => x.PropToBind == item.PropToBind);
      if (ind > -1) {
        this.GroupHeaders.splice(ind, 1);
        await this.createGroup();
      }

      this.EnableLoader = false;

      this.OnColumnRemovedFromGrouped.emit(item);

      this.cdr.detectChanges();
    });

  }

  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {
    this.ContentInit = true;
    this.EnableLoader = true;

    if (this.winObj.isExecuteInBrowser()) {
      if (this.Columns && this.Columns.length > 0) {
        this.ColumnsNotDefined = false;

        this.zone.run(() => {

          setTimeout(async () => {

            if (!this.IsFilteredApplied) {
              this.ExtractHeadersFromTemplate();
            }

            this.DataItems = await this.PopulateData();
            this.AssignEditRowWhenLoad();
            await this.filterPerPage();
            // this.createGroup();
            await this.sortData();

            this.EnableLoader = false;

            this.cdr.detectChanges();

          }, 500);

        });        

      } else {
        this.ColumnsNotDefined = true;
        if (this.ColumnsNotDefined) {

          this.zone.run(() => {

            setTimeout(async () => {

              if (!this.IsFilteredApplied) {
                this.ExtractHeader();
              }

              this.DataItems = await this.PopulateDefaultData();
              this.AssignEditRowWhenLoad();
              await this.filterPerPage();
              // this.createGroup();
              await this.sortData();

              this.EnableLoader = false;

              this.cdr.detectChanges();

            }, 500);

          });

        }
      }
    }

  }

  async ItemsShownPerPage(num: any) {
    this.EnableLoader = true;

    setTimeout(async () => {

      this.adjustPageValue();
      if (this.IsGroupHaveColumns) {
        await this.filterPerPageForGroup();
      } else {
        await this.filterPerPage();
      }

      this.EnableLoader = false;
      this.ItemsPerPageClicked.emit(this.getPaginationValue());
      this.cdr.detectChanges();
    });

  }

  async filterPerPage() {

    if (this.DataItems) {

      let skipItems = (this.currentPage - 1) * this.ItemsPerPage.Value;

      this.ShowItems = undefined;

      var _normalData = this.DataItems.Rows.slice(skipItems, skipItems + this.ItemsPerPage.Value);

      var unfiltered = { Rows: [..._normalData] };

      this.ShowItems = unfiltered;
    }

    this.OrderColumnAndRow();

  }

  OrderColumnAndRow(){
    let _row = 0;
    let _col = 0;

    if(this.ShowItems?.Rows && !this.IsGroupHaveColumns) {
      for (let index = 0; index < this.ShowItems.Rows.length; index++) {
        _row++;
        _col = 0;

        let data = this.ShowItems.Rows[index] as RGridRow;
        
        for(const key in data){

          if(!this.EnableSelectColummn && key.toLowerCase() == 'rgrid_select')
            continue;

          _col++;
          data[key].DisplayRow = _row;


          let _hkey = data[key].HeaderKey.toLowerCase();
          let _hdt = this.Headers.filter(x=>x.PropToBind.toLowerCase() == _hkey);

          if(_hdt != undefined && _hdt.length > 0) {
            data[key].HeaderIndex = _hdt[0].Index;
          }

          data[key].DisplayColumn = data[key].HeaderIndex + 1;
        }
      }
    } else {
      for (let index = 0; index < this.DisplayGroupItems.length; index++) {
        const element = this.DisplayGroupItems[index];
        for (let index = 0; index < element.Values.length; index++) {
          _row++;
          _col = 0;
          
          const rowData = element.Values[index];

          for(const key in rowData){

            if(!this.EnableSelectColummn && key.toLowerCase() == 'rgrid_select')
            continue;
          
            _col++;
            rowData[key].DisplayRow = _row;
            
            let _hkey = rowData[key].HeaderKey.toLowerCase();
            let _hdt = this.Headers.filter(x=>x.PropToBind.toLowerCase() == _hkey);

            if(_hdt!=undefined && _hdt.length > 0) {
              rowData[key].HeaderIndex = _hdt[0].Index;
            }
           
            rowData[key].DisplayColumn = rowData[key].HeaderIndex + 1;
          }
        }
      }
    }
  }

  headerDragEnd($event: any) {
    if (this.HeaderGroupPanelShow) {
      this.HeaderGroupPanelShow = false;
    }
  }

  headerDragStart($event: any) {
    if (!this.IsGroupHaveColumns) {
      this.HeaderGroupPanelShow = true;
    }
  }

  async filterPerPageForGroup() {

    let skipItems = (this.currentPage - 1) * this.ItemsPerPage.Value;
    this.DisplayGroupItems = [];

    this.ShowItems = { Rows: this.DataItems.Rows.slice(skipItems, skipItems + this.ItemsPerPage.Value) };

    this.ShowItems = {
      ...this.ShowItems,
      Rows: [...this.ShowItems.Rows]
    }

    let addItem: boolean = false;

    let skipcount = 0;
    let itemAddToListCount: number = 0;

    for (let index = 0; index < this.GroupItems.length; index++) {
      const element = this.GroupItems[index];
      let grpData = new RGridGroupData(element.Key, [], element.IsExpanded);
      for (let i = 0; i < element.Values.length; i++) {

        if (itemAddToListCount == this.ItemsPerPage.Value) {
          break;
        }

        const eachItem = element.Values[i];
        skipcount++;
        if (!addItem && skipcount > skipItems) {
          addItem = true;
        }
        if (addItem) {
          grpData.Values.push(eachItem);
          itemAddToListCount++;
        }
      }

      if (grpData.Values.length > 0)
        this.DisplayGroupItems.push(grpData);

      if (itemAddToListCount == this.ItemsPerPage.Value) {
        break;
      }

    }

    this.OrderColumnAndRow();

    if (this.viewport) {
      this.viewport.checkViewportSize();
    }
  }

  async NextPage() {
    
    this.EnableLoader = true;

    setTimeout(async ()=> {
      this.currentPage++;
      this.adjustPageValue();
      if (this.IsGroupHaveColumns) {
        await this.filterPerPageForGroup();
      } else {
        await this.filterPerPage();
      }

      this.EnableLoader = false;
      this.NextPageClicked.emit(this.getPaginationValue());
      this.cdr.detectChanges();
    });
  }

  async PreviousPage() {
    this.EnableLoader = true;

    setTimeout(async ()=>{
      this.currentPage--;
      this.adjustPageValue();
      if (this.IsGroupHaveColumns) {
        await this.filterPerPageForGroup();
      } else {
        await this.filterPerPage();
      }

      this.EnableLoader = false;
      this.PreviousPageClicked.emit(this.getPaginationValue());
      this.cdr.detectChanges();
    });
  }

  async LastPage() {

    this.EnableLoader = true;

    setTimeout(async ()=> {

      let noofPage = parseInt((this.DataItems.Rows.length / this.ItemsPerPage.Value).toString());
      let rem = this.DataItems.Rows.length % this.ItemsPerPage.Value;

      if (rem > 0) {
        noofPage = noofPage + 1;
      }

      this.currentPage = noofPage;
      if (this.IsGroupHaveColumns) {
        await this.filterPerPageForGroup();
      } else {
        await this.filterPerPage();
      }

      this.EnableLoader = false;
      this.LastPageClicked.emit(this.getPaginationValue());
      this.cdr.detectChanges();
    });
  }

  async FirstPage() {

    this.EnableLoader = true;

    setTimeout(async () => {


      let noofPage = parseInt((this.DataItems.Rows.length / this.ItemsPerPage.Value).toString());
      let rem = this.DataItems.Rows.length % this.ItemsPerPage.Value;

      if (rem > 0) {
        noofPage = noofPage + 1;
      }

      if (noofPage == 0) {
        this.currentPage = 0;
      } else {
        this.currentPage = 1;
      }

      if (this.IsGroupHaveColumns) {
        await this.filterPerPageForGroup();
      } else {
        await this.filterPerPage();
      }

      this.EnableLoader = false;
      this.FirstPageClicked.emit(this.getPaginationValue());
      this.cdr.detectChanges();
    });

  }

  GetDataType(header : RGridHeader, filter: any){

    if(this.Items.length > 0){

      let val = undefined;

      let props = header.PropToBind.split(".");
      
      if (props.length > 1) {
        let _obj = undefined;
        let _fobj = this.Items[0];

        for (let index = 0; index < props.length; index++) {
          const _p = props[index];
          _fobj = _fobj[_p];

          if (_fobj == undefined)
            break;

          _obj = _fobj;
        }

        val = _obj;

      } else {
        val = this.Items[0][header.PropToBind];
      }
      
      let ty = typeof(val);

      if(ty=='number'){
        return RFilterDataType.NumberType;
      }
      else if(ty == 'string'){
        return RFilterDataType.StringType;
      } else if(ty=='object'){
        if(val instanceof Date){
          return RFilterDataType.DateType;
        }
      }
    }

    if(filter){
      let g = filter as RFilterApplyModel;
      if(g  && g.Type){
        return g.Type;
      }
    }

    return RFilterDataType.StringType;
  }

  GetUniqueValues(header: RGridHeader): DropdownModel[] {
    let values: any[] = [];
    let dValues: DropdownModel[] = [];

    if(this.Items.length > 0){
      for (let index = 0; index < this.Items.length; index++) {
        const element = this.Items[index];
        let val = element[header.PropToBind];
        
        if(values.find(x=>x==val) == undefined) {
          if(this.GetDataType(header, this.filterModel[header.ColumnName]) == RFilterDataType.NumberType) {
            values.push(Number.parseInt(val));            
          } else {
            values.push(val);            
          }
        }        
      }
    }

    if(this.GetDataType(header, this.filterModel[header.ColumnName]) == RFilterDataType.NumberType)
      values = values.sort((a,b)=> a - b);
    else
      values = values.sort();

      for (let index = 0; index < values.length; index++) {
        const element = values[index];
        dValues.push(new DropdownModel(element, element));
      }

      return dValues;
  }

  async ApplyFilter(filter: RFilterApplyModel) {

    this.BeforeApplyingFilter.emit(filter);

    this.EnableLoader = true;

    this.IsUpdateFromFilter = true;

    this.filterModel[filter.ColumnName] = filter;

    if (filter.IsCleared) {

      this.OnFilterClearedClicked.emit(filter);

      let isanyFilter = false;
      let keys = Object.keys(this.filterModel);

      for (let index = 0; index < keys.length; index++) {
        const element = this.filterModel[keys[index]] as RFilterApplyModel;
        if (element.IsFiltered) {
          isanyFilter = true;
          break;
        }
      }

      if (!isanyFilter) {
        this.IsFilteredApplied = false;
        this.Items = [];
        this.currentPage = 1;
        this.Items = this.BackupItems.slice();
        this.cdr.detectChanges();
        return;
      } else {
        this.currentPage = 1;
        await this.ApplyFilterOnClick();
        this.AfterApplyingFilter.emit(filter);
        return;
      }

    } else {

      this.OnFilterApplyClicked.emit(filter);

      if (!this.IsFilteredApplied) {
        this.IsFilteredApplied = true;
      }
    }

    if (filter.Contains == undefined && filter.GreaterThan == undefined && filter.LesserThan == undefined) {
      this.currentPage = 1;
      await this.ApplyFilterOnClick();
      this.AfterApplyingFilter.emit(filter);
      return;
    }

    this.currentPage = 1;
    await this.ApplyFilterOnClick();
    this.AfterApplyingFilter.emit(filter);
  }

  async ApplyFilterOnClick(){

    this.EnableLoader = true;

      let newIndexes = [];

      var filteredIndexes: number[] = [];

      for (let index = 0; index < this.BackupItems.length; index++) {
        newIndexes.push(index);
      }

      /* apply filter */
      let keys = Object.keys(this.filterModel);

      for (let index = 0; index < keys.length; index++) {
        const keyname = keys[index];
        let filter = this.filterModel[keyname] as RFilterApplyModel;

        if (!filter.IsCleared) {

          filteredIndexes = newIndexes.slice();
          newIndexes = [];

          let filterLesser: any = undefined;
          let filterGreater: any = undefined;

          if (filter.Type == RFilterDataType.NumberType) {

            if (filter.LesserThan != undefined) {
              if (filter.LesserThan.toString().split(".").length > 1) {
                filterLesser = parseFloat(filter.LesserThan?.toString());
              } else {
                filterLesser = parseInt(filter.LesserThan?.toString());
              }
            }

            if (filter.GreaterThan != undefined) {
              if (filter.GreaterThan.toString().split(".").length > 1) {
                filterGreater = parseFloat(filter.GreaterThan?.toString());
              } else {
                filterGreater = parseInt(filter.GreaterThan?.toString());
              }
            }
          }


          if (filter.Type == RFilterDataType.DateType) {

            if (filter.LesserThan != undefined) {
              let nospaceObj = filter.LesserThan.toString().replace(/\s/g, '');
              let nospaceFormat = this.FilterDateFormat.replace(/\s/g, '');

              let dstr = this.datePipe.transform(nospaceObj, nospaceFormat);

              if (dstr)
                filterLesser = new Date(Date.parse(dstr));
            }

            if (filter.GreaterThan != undefined) {

              let nospaceObj = filter.GreaterThan.toString().replace(/\s/g, '');
              let nospaceFormat = this.FilterDateFormat.replace(/\s/g, '');

              let dstr = this.datePipe.transform(nospaceObj, nospaceFormat);

              if (dstr)
                filterGreater = new Date(Date.parse(dstr));
            }

          }

          if (filter.Contains == undefined && (filter.LesserThan == undefined || filter.LesserThan == '')
            && (filter.GreaterThan == undefined || filter.GreaterThan == '')) {
            newIndexes = filteredIndexes.slice();
            continue;
          }

          for (let index = 0; index < filteredIndexes.length; index++) {
            const ind = filteredIndexes[index];

            let val = this.BackupItems[ind][keyname];

            let props = keyname.split(".");

            if (props.length > 1) {
              let _obj = undefined;
              let _fobj = this.BackupItems[ind];

              for (let index = 0; index < props.length; index++) {
                const _p = props[index];
                _fobj = _fobj[_p];

                if (_fobj == undefined)
                  break;

                _obj = _fobj;
              }

              val = _obj;

            } else {
              val = this.BackupItems[ind][keyname];
            }

            if (filter.Contains?.map(x => x.Value).find(x => x.toString() == val.toString()) != undefined) {
              newIndexes.push(ind);
            }

            if (filter.GreaterThan != undefined && filter.LesserThan != undefined
              && val > filterGreater && val < filterLesser) {
              if (newIndexes.find(x => x == index) == undefined) {
                newIndexes.push(ind);
              }
            }


            if (filter.GreaterThan != undefined && filter.LesserThan == undefined
              && val > filterGreater) {
              if (newIndexes.find(x => x == index) == undefined) {
                newIndexes.push(ind);
              }
            }


            if (filter.GreaterThan == undefined && filter.LesserThan != undefined
              && val < filterLesser) {
              if (newIndexes.find(x => x == index) == undefined) {
                newIndexes.push(ind);
              }
            }

          }
        }
      }

      var filteredValues = [];

      for (let index = 0; index < newIndexes.length; index++) {
        const element = newIndexes[index];
        let eachValue = this.BackupItems[element];
        filteredValues.push(eachValue);
      }

      this.Items = filteredValues.slice();

  }

  adjustPageValue() {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }

    if (this.DataItems && this.DataItems.Rows) {
      let noofPage = parseInt((this.DataItems.Rows.length / this.ItemsPerPage.Value).toString());
      let rem = this.DataItems.Rows.length % this.ItemsPerPage.Value;

      if (rem > 0) {
        noofPage = noofPage + 1;
      }

      if (this.currentPage > noofPage) {
        this.currentPage = noofPage;
      }
    }
  }

  private ExtractHeadersFromTemplate() {
    this.Headers = [];
    if (this.Columns.length > 0) {

      let _wth = this.cssUnit.ToPxValue(this.TableWidth, null, null);
      
      if(this.ShowEditUpdate)
        _wth = _wth - 80;

      if(this.EnableSelectColummn)
        _wth = _wth - 40;

      let twth = _wth+CssUnit.Px.toString();

      let _arr = this.Columns.toArray();
      for (let index = 0; index < _arr.length; index++) {
        const element = _arr[index];

        this.Headers.push(new RGridHeader(index.toString(), element.PropToBindToCellInfo, element.Name, index,
          element.HeaderText, element.IsComputationalColumn, undefined, element.GetRelativeWidth(twth), 
          element.Height, element.GetRelativeWidth(twth), element.Height,
          element.ReadView, element.EditView, element.HeaderTemplate, 
          element.DisableSort, element.DisableFilter));

      }

    }

    this.Headers.sort(this.headersSort);
  }

  GetTxtWidth(header: RGridHeader): string {
    let k = header.ColumnWidth.split("px");
    let val = parseFloat(k[0]) - 15 - 20;
    return val+CssUnit.Px.toString();
  }

  GetColumnsNotDefinedViewModeWidth(header: RGridHeader){
    let k = header.ColumnWidth.split("px");
    let val = parseFloat(k[0]) - 17;
    return val+CssUnit.Px.toString();
  }

  private async PopulateData(): Promise<RGridItems> {
    let _dataItems = new RGridItems();
    let cols = this.Columns.toArray();

    let r = -1;
    for (let index = 0; index < this.Items.length; index++) {
      const element = this.Items[index];

      let _row = new RGridRow();
      r++;
      let c = -1;
      for (let index = 0; index < this.Headers.length; index++) {
        const _hdr = this.Headers[index];
        c++;
        let _cell = new RCell();
        _cell.Column = c;
        _cell.Row = r;
        _cell.HeaderIndex = index;
        _cell.HeaderKey = _hdr.PropToBind;
        _cell.component = this;

        _cell.Item = structuredClone(element);

        let props = _hdr.PropToBind.split(".");
        _cell.FromModel = true;

        if (props.length > 1) {
          let _obj = undefined;
          let _fobj = element;

          for (let index = 0; index < props.length; index++) {
            const _p = props[index];
            _fobj = _fobj[_p];

            if (_fobj == undefined)
              break;

            _obj = _fobj;
          }

          _cell.Value = _obj;

        } else {
          _cell.Value = element[_hdr.PropToBind];
        }

        _cell.FromModel = false;
        let dirs = cols.filter(x => x.Name.toLowerCase() == _hdr.ColumnName.toLowerCase());

        if (dirs && dirs.length > 0) {

          let _wth = this.cssUnit.ToPxValue(this.TableWidth, null, null);              
          
          if(this.ShowEditUpdate)
            _wth = _wth - 80;

          if(this.EnableSelectColummn)
            _wth = _wth - 40;

          let twth = _wth+CssUnit.Px.toString();
    
          _cell.columnDirective = dirs[0];
          _cell.Width = dirs[0].GetRelativeWidth(twth);
          _cell.Height = dirs[0].Height;
        }

        _row[_hdr.PropToBind] = _cell;
      }

      /* Adding index column for each row */
      let _cell = new RCell();
      c++;
      _cell.Column = c;
      _cell.Row = r;
      _cell.FromModel = true;
      _cell.Value = r as any;
      _cell.FromModel = false;
      _row[this.indxKey] = _cell;

      
      /* Adding select column for each row */
      let _cell1 = new RCell();
      c++;
      _cell1.Column = c;
      _cell1.Row = r;
      _cell1.FromModel = true;
      _cell1.Value = false as any;
      _cell1.FromModel = false;
      _row[this.selectKey] = _cell1;

      _dataItems.Rows.push(_row);
    }

    let _wth = this.cssUnit.ToPxValue(this.TableWidth, null, null);          
    
    if(this.ShowEditUpdate)
      _wth = _wth - 80;

    if(this.EnableSelectColummn)
      _wth = _wth - 40;

    let twth = _wth+CssUnit.Px.toString();

    let totalW = 0;

    for (let index = 0; index < cols.length; index++) {
      const element = cols[index];
      let w = element.GetRelativeWidth(twth);
       totalW = totalW + parseFloat(w.split("px")[0]);
    }
    
    if(this.ShowEditUpdate)
      totalW += 80;

    if(this.EnableSelectColummn)
      totalW += 40;

    this.ActualWidth = (totalW - 6) + CssUnit.Px.toString();

    this.HeaderWidth = (totalW + 1) + CssUnit.Px.toString();

    return _dataItems;
  }

  private async PopulateDefaultData(): Promise<RGridItems> {
    let _dataItems = new RGridItems();

    let totCols = this.Headers.length;

    // if(this.ShowEditUpdate){
    //   totCols = totCols + 1;
    // }

    let r = -1;
    for (let index = 0; index < this.Items.length; index++) {
      const element = this.Items[index];

      let _row = new RGridRow();
      r++;
      let c = -1;
      for (let index = 0; index < this.Headers.length; index++) {
        const _hdr = this.Headers[index];
        c++;
        let _cell = new RCell();
        _cell.Column = c;
        _cell.Row = r;
        _cell.HeaderIndex = index;
        _cell.HeaderKey = _hdr.PropToBind;
        _cell.component = this;
        _cell.Item = structuredClone(element);
        _cell.FromModel = true;
        _cell.Value = element[_hdr.PropToBind];
        _cell.FromModel = false;

        let dir = new RColumnComponent(this.cssUnit);
        dir.EditView = this.defaultEditView;
        dir.ReadView = this.defaultReadView;
        dir.Height = "fit-content";
        dir.HeaderText = _hdr.HeaderText;
        dir.Name = _hdr.PropToBind;
        dir.PropToBindToCellInfo = _hdr.PropToBind;
        dir.Height = "fit-content";  
        
        if(this.FitColumnsToContent){
          dir.Width = "fit-content";
        } else {
          dir.Width = (100/totCols)+"%"; 
        }

        let _wth = this.cssUnit.ToPxValue(this.TableWidth, null, null);              
        
        if(this.ShowEditUpdate)
          _wth = _wth - 80;
  
        if(this.EnableSelectColummn)
          _wth = _wth - 40;

        let twth = _wth+CssUnit.Px.toString();
  
        if(!this.FitColumnsToContent)
            _hdr.ColumnWidth = dir.GetRelativeWidth(twth);
        else
          _hdr.ColumnWidth = dir.Width;
        
        if (dir) {
          _cell.columnDirective = dir;
          _cell.Width = _hdr.ColumnWidth;
          _cell.Height = dir.Height;
        }

        _row[_hdr.PropToBind] = _cell;
      }


      /* Adding index column for each row */
      let _cell = new RCell();
      c++;
      _cell.Column = c;
      _cell.Row = r;
      _cell.FromModel = true;
      _cell.Value = r as any;
      _cell.FromModel = false;
      _row[this.indxKey] = _cell;

      /* Adding select column for each row */
      let _cell1 = new RCell();
      c++;
      _cell1.Column = c;
      _cell1.Row = r;
      _cell1.FromModel = true;
      _cell1.Value = false as any;
      _cell1.FromModel = false;
      _row[this.selectKey] = _cell1;

      _dataItems.Rows.push(_row);
    }

    let TotalW = 0;
    for (let index = 0; index < this.Headers.length; index++) {
      const element = this.Headers[index];
      let w = parseFloat(element.ColumnWidth.split("px")[0]);
      TotalW = TotalW + w;
    }    
    
    if(this.ShowEditUpdate)
      TotalW = TotalW + 80;

    if(this.EnableSelectColummn)
      TotalW = TotalW + 40;

    this.ActualWidth = (TotalW - 6) + CssUnit.Px.toString();

    this.HeaderWidth = (TotalW + 1) + CssUnit.Px.toString();

    return _dataItems;
  }

  async ShowEdit($event: Event, item: RGridRow, isUpdate: boolean) {

    let keys = Object.keys(item)
    for (let index = 0; index < keys.length; index++) {
      const element = item[keys[index]];
      if ((element.columnDirective && !element.columnDirective.IsComputationalColumn) || element.columnDirective == undefined)
        element.IsEditMode = !element.IsEditMode;

      if (!element.IsEditMode) {
        if (this.GroupHeaders.length > 0) {
          await this.createGroup();
        }
      }
    }

    this.EditModeEnabled = false;
    this.EditRows = [];

    for (let i = 0; i < this.DataItems.Rows.length; i++) {
      for (let index = 0; index < keys.length; index++) {
        const element = this.DataItems.Rows[i][keys[index]].IsEditMode;
        if (element) {

          if (!this.EditModeEnabled)
            this.EditModeEnabled = true;

          let _rowIndex = this.DataItems.Rows[i][this.indxKey];

          if (_rowIndex && _rowIndex.Value) {
            this.EditRows.push(new RGridEditRowInfo(parseInt(_rowIndex.Value.toString())));
            break;
          }
        }
      }
    }

    let isRowUpdated = this.isRowUpdated(item);

    if (isUpdate) {

      if(isRowUpdated)
      {
        this.NotifyToModelOnUpdate(item);
        this.SetRowUpdateToFalse(item);
      }

      let rowInfo = this.getRGridRowInfo(item);
      this.OnRowCloseClicked.emit(rowInfo);
    }
    else {

      let rowInfo = this.getRGridRowInfo(item);
      this.OnRowEditClicked.emit(rowInfo);
    }

  }

  getRGridRowInfo(row: RGridRow): RGridRowInfo {

    let _row = new RGridRowInfo();

    for (const item in row) {
      _row[item] = this.getCellInfo(row[item]);
    }

    return _row;
  }

  SetRowUpdateToFalse(itemrow: RGridRow){
    for(const key in itemrow){
      itemrow[key].IsValueUpdated = false;
    }
  }

  isRowUpdated(itemrow: RGridRow){
    let isUpdated = false;

    for(const key in itemrow){
      let val = itemrow[key].IsValueUpdated;
      if(val){
        isUpdated = true;
        break;
      }
    }

    return isUpdated;
  }

  private AssignEditRowWhenLoad() {
    this.EditModeEnabled = false;

    if (this.EditRows.length > 0) {
      this.EditModeEnabled = true;

      for (let index = 0; index < this.EditRows.length; index++) {
        const element = this.EditRows[index];

        // let rowItemIndex = (this.DataItems.Rows as RGridRow[]).findIndex(
        //   x=> x[this.indxKey]!=undefined && x[this.indxKey].Value != undefined 
        //   && (x[this.indxKey].Value as any).toString().toLowerCase() == element.RowIndex.toString().toLowerCase());

        let rowItem = this.DataItems.Rows.find((val: RGridRow, indx: number) => {
          return (val[this.indxKey].Value as any).toString().toLowerCase() == element.RowIndex.toString().toLowerCase();
        })

        if (rowItem) {
          let keys = Object.keys(rowItem);

          for (let _keys = 0; _keys < keys.length; _keys++) {
            const _hdrKey = keys[_keys];
            if(!this.Columns.find(c=>c.PropToBindToCellInfo==_hdrKey)?.IsComputationalColumn)
               rowItem[_hdrKey].IsEditMode = true;
          }
        }
      }
    }
  }

  private ExtractHeader() {
    this.Headers = [];
    if (this._items.length > 0) {
      let item = this._items[0];
      let keys = Object.keys(item);

      if (keys) {
        for (let index = 0; index < keys.length; index++) {
          const element = keys[index];
          this.Headers.push(new RGridHeader(index.toString(), element, element, index, element, false));
        }
      }
    }

    this.Headers.sort(this.headersSort);

  }

  headersSort(a: RGridHeader, b: RGridHeader) {
    if (a.Index < b.Index) {
      return -1;
    }
    else if (a.Index > b.Index) {
      return 1;
    } else {
      return 0;
    }
  }

  groupByItems(lambdaKey: any[]): Map<string, RGridRow[]> {
    let data = new Map();
    for (let index = 0; index < this.DataItems.Rows.length; index++) {
      const element = this.DataItems.Rows[index];
      let keyValue: string = "";

      for (let index = 0; index < lambdaKey.length; index++) {
        const expr = lambdaKey[index];
        let _keyV = expr(element);
        keyValue = keyValue + "_$" + _keyV.Value;
      }

      let itemExist = data.get(keyValue);
      if (itemExist) {
        itemExist.push(element);
      } else {
        data.set(keyValue, [element]);
      }
    }

    return data;
  }

  draggeddropForPopup(event: any) {
    let isSameContainer = event.previousContainer === event.container;

    if (isSameContainer)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    else
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

    for (let index = 0; index < this.Headers.length; index++) {
      const element = this.Headers[index];
      element.Index = index;
    }

    this.Headers.sort(this.headersSort);
    
    this.EnableLoader = true;

    setTimeout(()=>{
        this.OrderColumnAndRow();
        this.EnableLoader = false;
        this.cdr.detectChanges();
    });
  }

}

export class RGridHeader {
  constructor(public Id: string, public PropToBind: string, public ColumnName: string,
    public Index: number, public HeaderText: string, public IsComputationColumn: boolean,
    public sortType: RGridHeaderSortType | undefined = undefined,
    public Width: string = 'auto', public Height: string = 'auto',
    public ColumnWidth: string = 'auto', public ColumnHeight: string = 'auto',
    public readView: TemplateRef<any> | null = null, 
    public editView: TemplateRef<any> | null = null,
    public headerTemplate: TemplateRef<any> | null = null,
    public disableSort: boolean = false,
    public disableFilter: boolean = false
  ) {

  }
}

export class RGridGroupData {
  constructor(public Key: string, public Values: RGridRow[], public IsExpanded: boolean = false) {

  }
}
