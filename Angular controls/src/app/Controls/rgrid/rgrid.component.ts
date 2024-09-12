import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragPreview, CdkDragStart, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AsyncPipe, JsonPipe, KeyValuePipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, forwardRef, Input, OnChanges, Output, QueryList, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { RColumnComponent } from './rcolumn/rcolumn.component';
import { RCell, RGridEditRowInfo, RGridHeaderSort, RGridHeaderSortType, RGridItems, RGridRow } from './rcell';
import { RbuttonComponent } from "../rbutton/rbutton.component";
import { RDropdownComponent } from "../dropdown/dropdown.component";
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { DropdownModel } from '../dropdown/dropdownmodel';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";

@Component({
  selector: 'rgrid',
  standalone: true,
  imports: [NgForOf, NgTemplateOutlet, AsyncPipe, NgIf, NgStyle, CdkDropListGroup,
    KeyValuePipe,
    NgClass, CdkDrag, CdkDropList, CdkDragPlaceholder, JsonPipe, FormsModule, CdkDragPreview,
    ReactiveFormsModule, NgTemplateOutlet, RbuttonComponent, RDropdownComponent, RTextboxComponent],
  templateUrl: './rgrid.component.html',
  styleUrl: './rgrid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    { 
      provide:NG_VALUE_ACCESSOR,      
      useExisting:forwardRef(()=> RGridComponent),
      multi: true
    }
  ]
})
export class RGridComponent implements AfterContentInit, AfterViewInit, ControlValueAccessor, OnChanges {

  private _items: any[] = [];

  private indxKey: string = "rgrid_index";

  Headers: RGridHeader[] = [];

  SortHeaders: RGridHeaderSort[] = [];

  GroupHeaders: RGridHeader[] = [];

  PageItems: DropdownModel[] = []

  currentPage: number = 1;

  @Output()
  OnCellValueChanged = new EventEmitter<RCell>();
  
  @Output()
  OnItemsChanged = new EventEmitter<{Items: any[], ChangedRow: any, RowIndex: number| undefined}>();
  
  @Input()
  ItemsPerPage!: DropdownModel;

  @Input()
  TableHeight: string = "200px";

  @Input()
  ShowEditUpdate: boolean = true;

  @Input()
  ShowGroupHeader: boolean = true;

  @Input()
  HeaderBackgroundColor: string = "rgb(35, 206, 236)";

  @Input()
  HeaderForeColor: string = "white";

  EditModeEnabled: boolean = false;

  DataItems!: RGridItems;

  EditRows: RGridEditRowInfo[] = [];

  ShowItems!: RGridItems;

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

  onChanged: Function = ()=>{};
  onTouched: Function = ()=>{};

  @Input()
  public set Items(value: any[]) {    
    this.RenderUI(value);
  }
  public get Items(): any[] {
    return this._items;
  }

  constructor(private cdr: ChangeDetectorRef) {
    let ditems: DropdownModel[] = [];
    ditems.push(new DropdownModel(5, "5"));
    ditems.push(new DropdownModel(10, "10"));
    ditems.push(new DropdownModel(15, "15"));
    ditems.push(new DropdownModel(20, "20"));
    ditems.push(new DropdownModel(25, "25"));
    ditems.push(new DropdownModel(50, "50"));
    ditems.push(new DropdownModel(100, "100"));

    this.PageItems = ditems;
    this.ItemsPerPage = new DropdownModel(10, "10");
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }

  writeValue(obj: any): void {
    this.RenderUI(obj);    
  }

  RenderUI(obj: any[]){
    if(obj==null || obj==undefined)
      obj = [];

    this._items = obj.slice(); 
    this.InitGrid();     
  }

  InitGrid(){
    if(this.currentPage==0)
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

  NotifyToModel(cellInfo: RCell){       
    this.OnCellValueChanged.emit(cellInfo);    
    this.cdr.detectChanges();
  }

  NotifyToModelOnUpdate(row: RGridRow){
    let notifyDataItems = this.Items.slice();

    this.onChanged(notifyDataItems);
    this.onTouched(notifyDataItems);      

    let _rownum = row[this.indxKey as string].Row;  
    let _row = (notifyDataItems as [])[_rownum as any];

    this.OnItemsChanged.emit({Items: notifyDataItems, ChangedRow: _row, RowIndex: _rownum});
    this.cdr.detectChanges();
  }

  sortColumn(hdr: RGridHeader) {
    if (hdr) {

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

      this.sortData();
    }
  }

  sortAsc(hdr: RGridHeader) {
    let indx = this.SortHeaders.findIndex(x => x.Header.PropToBind == hdr.PropToBind);

    if (indx > -1) {
      this.SortHeaders[indx].SortType = RGridHeaderSortType.Ascending;
    } else {
      this.SortHeaders.push(new RGridHeaderSort(RGridHeaderSortType.Ascending, hdr));
    }

    this.sortData();
  }

  AssignSortTypeToHeaders(){
    for (let index = 0; index < this.SortHeaders.length; index++) {
      const element = this.SortHeaders[index];
      let _hdrIndx = this.Headers.findIndex(x=>x.PropToBind == element.Header.PropToBind);
      if(_hdrIndx > -1){
        let _hdr = this.Headers[_hdrIndx];
        _hdr.sortType = element.SortType;
      }
    }
  }

  sortDes(hdr: RGridHeader) {
    let indx = this.SortHeaders.findIndex(x => x.Header.PropToBind == hdr.PropToBind);

    if (indx > -1) {
      this.SortHeaders[indx].SortType = RGridHeaderSortType.Descending;
    } else {
      this.SortHeaders.push(new RGridHeaderSort(RGridHeaderSortType.Descending, hdr));
    }

    this.sortData();
  }

  sortData() {
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
      this.createGroup();

      let _keys = this.GroupItems.length;
      for (let index = 0; index < _keys; index++) {
        const element = this.GroupItems[index];
        element.Values.sort(sorter(this.SortHeaders));
      }

      this.filterPerPageForGroup();

    } else {
      this.DataItems.Rows.sort(sorter(this.SortHeaders));
      this.filterPerPage();
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

  createGroup() {

    let exprs = [];

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
    }

    this.filterPerPageForGroup();
    
  }

  expandGroup($event: Event, grpItem: RGridGroupData) {
    grpItem.IsExpanded = !grpItem.IsExpanded;

    let spanElement = ($event.srcElement as HTMLSpanElement);
    spanElement.classList.toggle("symbol-down");
  }

  groupDrop($event: CdkDragDrop<RGridHeader[]>) {
    let _hdr = $event.item.data as RGridHeader;
    let _srt = undefined;

    if (_hdr) {
      let _col = this.Columns.find(x => x.Name.toLowerCase() == _hdr.ColumnName.toLowerCase());

      if (_col && _col.IsComputationalColumn) {
        return;
      }

      let indx = this.GroupHeaders.findIndex(x => x.PropToBind == _hdr.PropToBind);
      if (indx == -1) {
        this.GroupHeaders.push($event.item.data);
        this.createGroup();

        /* Sort the column when group */
        if(_hdr.sortType==RGridHeaderSortType.Ascending){
          _srt = undefined;
        } else if(_hdr.sortType==RGridHeaderSortType.Descending){
          _srt = RGridHeaderSortType.Ascending;
        }

        _hdr.sortType = _srt;
        this.sortColumn(_hdr);
      }
    }
  }

  removeFromGroup(item: RGridHeader) {
    let ind = this.GroupHeaders.findIndex(x => x.PropToBind == item.PropToBind);
    if (ind > -1) {
      this.GroupHeaders.splice(ind, 1);
      this.createGroup();
    }
  }

  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {
    if (this.Columns && this.Columns.length > 0) {
      this.ColumnsNotDefined = false;
      setTimeout(() => {
        this.ExtractHeadersFromTemplate();
        this.DataItems = this.PopulateData();
        this.filterPerPage();
        //this.createGroup();
        this.sortData();    
        this.cdr.detectChanges();
      }, 500);
    } else {
      this.ColumnsNotDefined = true;
      if (this.ColumnsNotDefined) {
        //setTimeout(()=>{

        this.ExtractHeader();
        this.DataItems = this.PopulateDefaultData();
        this.filterPerPage();
       // this.createGroup();
        this.sortData();    
        this.cdr.detectChanges();

        //}, 500);      
      }
    }

    this.AssignEditRowWhenLoad();
  }

  ItemsShownPerPage(num: any) {
    this.adjustPageValue();
    if (this.IsGroupHaveColumns) {
      this.filterPerPageForGroup();
    } else {
      this.filterPerPage();
    }
  }

  filterPerPage() {
    if (this.DataItems) {
      let skipItems = (this.currentPage - 1) * this.ItemsPerPage.Value;
      this.ShowItems = { Rows: this.DataItems.Rows.slice(skipItems, skipItems + this.ItemsPerPage.Value) };
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

  filterPerPageForGroup() {
    let skipItems = (this.currentPage - 1) * this.ItemsPerPage.Value;
    this.DisplayGroupItems = [];

    this.ShowItems = { Rows: this.DataItems.Rows.slice(skipItems, skipItems + this.ItemsPerPage.Value) };
    let addItem: boolean = false;

    let skipcount = 0;
    let itemAddToListCount: number = 0;

    for (let index = 0; index < this.GroupItems.length; index++) {
      const element = this.GroupItems[index];
      let grpData = new RGridGroupData(element.Key, [], element.IsExpanded);
      for (let i = 0; i < element.Values.length; i++) {

        if (itemAddToListCount == this.ItemsPerPage.Value)
          break;

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

      if (itemAddToListCount == this.ItemsPerPage.Value)
        break;
    }

  }

  NextPage() {
    this.currentPage++;
    this.adjustPageValue();
    if (this.IsGroupHaveColumns) {
      this.filterPerPageForGroup();
    } else {
      this.filterPerPage();
    }
  }

  PreviousPage() {
    this.currentPage--;
    this.adjustPageValue();
    if (this.IsGroupHaveColumns) {
      this.filterPerPageForGroup();
    } else {
      this.filterPerPage();
    }
  }

  LastPage() {

    let noofPage = parseInt((this.DataItems.Rows.length / this.ItemsPerPage.Value).toString());
    let rem = this.DataItems.Rows.length % this.ItemsPerPage.Value;

    if (rem > 0) {
      noofPage = noofPage + 1;
    }

    this.currentPage = noofPage;
    if (this.IsGroupHaveColumns) {
      this.filterPerPageForGroup();
    } else {
      this.filterPerPage();
    }
  }

  FirstPage() {
    this.currentPage = 1;
    if (this.IsGroupHaveColumns) {
      this.filterPerPageForGroup();
    } else {
      this.filterPerPage();
    }
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
      let _arr = this.Columns.toArray();
      for (let index = 0; index < _arr.length; index++) {
        const element = _arr[index];
        this.Headers.push(new RGridHeader(index.toString(), element.PropToBind, element.Name, index,
          element.HeaderText, element.IsComputationalColumn, undefined, element.EditModeWidth, element.Height, element.EditModeWidth, element.EditModeHeight));
      }

    }

    this.Headers.sort(this.headersSort);
  }

  private PopulateData(): RGridItems {
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

        if(props.length > 1){
          let _obj = undefined;
          let _fobj = element;

            for (let index = 0; index < props.length; index++) {
              const _p = props[index];
              _fobj = _fobj[_p];

              if(_fobj==undefined)
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
          _cell.columnDirective = dirs[0];
          _cell.Width = dirs[0].EditModeWidth;
          _cell.Height = dirs[0].Height;
        }

        _row[_hdr.PropToBind] = _cell;
      }

      /* Adding index column for each row */
      let _cell = new RCell();
      c++;
      _cell.Column = c;
      _cell.Row = r;
      _cell.FromModel =true;
      _cell.Value = r as any;
      _cell.FromModel =false;
      _row[this.indxKey] = _cell;

      _dataItems.Rows.push(_row);
    }

    return _dataItems;
  }

  private PopulateDefaultData(): RGridItems {
    let _dataItems = new RGridItems();

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
        _cell.FromModel =true;
        _cell.Value = element[_hdr.PropToBind];
        _cell.FromModel =false;

        let dir = new RColumnComponent();
        dir.EditView = this.defaultEditView;
        dir.ReadView = this.defaultReadView;        
        dir.Height = "fit-content";
        dir.HeaderText = _hdr.HeaderText;
        dir.Name = _hdr.PropToBind;
        dir.PropToBind = _hdr.PropToBind;
        dir.EditModeHeight = "fit-content";
        dir.EditModeWidth = "fit-content";

        if (dir) {
          _cell.columnDirective = dir;
          _cell.Width = dir.EditModeWidth;
          _cell.Height = dir.Height;
        }

        _row[_hdr.PropToBind] = _cell;
      }


      /* Adding index column for each row */
      let _cell = new RCell();
      c++;
      _cell.Column = c;
      _cell.Row = r;
      _cell.FromModel =true;
      _cell.Value = r as any;
      _cell.FromModel = false;
      _row[this.indxKey] = _cell;

      _dataItems.Rows.push(_row);
    }

    return _dataItems;
  }

  ShowEdit($event: Event, item: RGridRow, isUpdate: boolean) {

    let keys = Object.keys(item)
    for (let index = 0; index < keys.length; index++) {
      const element = item[keys[index]];
      if ((element.columnDirective && !element.columnDirective.IsComputationalColumn) || element.columnDirective==undefined)
        element.IsEditMode = !element.IsEditMode;

      if (!element.IsEditMode) {
        if (this.GroupHeaders.length > 0) {
          this.createGroup();
        }
      }
    }

    this.EditModeEnabled = false;
    this.EditRows = [];

    for (let i = 0; i < this.DataItems.Rows.length; i++) {
      for (let index = 0; index < keys.length; index++) {
        const element = this.DataItems.Rows[i][keys[index]].IsEditMode;
        if (element) {

          if(!this.EditModeEnabled)
            this.EditModeEnabled = true;

          this.EditRows.push(new RGridEditRowInfo(i, index));
        }
      }      
    }

    
    if(isUpdate)            
      this.NotifyToModelOnUpdate(item);

  }

  private AssignEditRowWhenLoad(){
    this.EditModeEnabled = false;

    if(this.EditRows.length > 0){
      this.EditModeEnabled = true;

      for (let index = 0; index < this.EditRows.length; index++) {
        const element = this.EditRows[index];
        let rowItem = this.DataItems.Rows[element.Row] as RGridRow;
        let keys = Object.keys(rowItem);

        for (let _keys = 0; _keys < keys.length; _keys++) {
          const _hdrKey = keys[_keys];
          rowItem[_hdrKey].IsEditMode = true;
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
  }

  dragStartedForPopup($event: any) {

  }


}

export class RGridHeader {
  constructor(public Id: string, public PropToBind: string, public ColumnName: string,
    public Index: number, public HeaderText: string, public IsComputationColumn: boolean,
    public sortType: RGridHeaderSortType | undefined = undefined,
    public Width: string = 'auto', public Height: string = 'auto',
    public EditModeWidth: string = 'auto', public EditModeHeight: string = 'auto',
    public readView: TemplateRef<any> | null = null, public editView: TemplateRef<any> | null = null
  ) {

  }
}

export class RGridGroupData {
  constructor(public Key: string, public Values: RGridRow[], public IsExpanded: boolean = false) {

  }
}
