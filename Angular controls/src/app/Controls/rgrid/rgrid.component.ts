import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AsyncPipe, JsonPipe, NgClass, NgForOf, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, QueryList, TemplateRef, ViewChild } from '@angular/core';
import { RColumnComponent } from './rcolumn/rcolumn.component';
import { RGridColumnForDirective } from './grid-column-for.directive';
import { RCell, RGridItems, RGridRow } from './rcell';
import { RbuttonComponent } from "../rbutton/rbutton.component";
import { RDropdownComponent } from "../dropdown/dropdown.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModel } from '../dropdown/dropdownmodel';
import { RTextboxComponent } from "../rtextbox/rtextbox.component";

@Component({
  selector: 'rgrid',
  standalone: true,
  imports: [NgForOf, NgTemplateOutlet, AsyncPipe, NgIf, NgStyle, CdkDropListGroup,
    NgClass, CdkDrag, CdkDropList, JsonPipe, FormsModule, ReactiveFormsModule, NgTemplateOutlet, RbuttonComponent, RDropdownComponent, RTextboxComponent],
  templateUrl: './rgrid.component.html',
  styleUrl: './rgrid.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RGridComponent implements AfterContentInit, AfterViewInit {

  private _items: any[] = [];

  Headers: RGridHeader[] = [];

  GroupHeaders: RGridHeader[] = [];

  PageItems: DropdownModel[] = []

  currentPage: number = 1;

  @Input()
  ItemsPerPage!: DropdownModel;

  @Input()
  TableHeight: string = "200px";

  ShowEditUpdate: boolean = true;

  EditModeEnabled: boolean = false;

  DataItems!: RGridItems;

  ShowItems!: RGridItems;

  ColumnsNotDefined: boolean = false;

  IsGroupHaveColumns: boolean = false;

  GroupedData!: Map<string, any[]> | undefined;

  @ContentChildren(RColumnComponent)
  public Columns!: QueryList<RColumnComponent>;

  @ViewChild('viewmode', { read: TemplateRef<any> }) defaultReadView!: TemplateRef<any>;

  @ViewChild('editmode', { read: TemplateRef<any> }) defaultEditView!: TemplateRef<any>;

  @Input()
  public set Items(value: any[]) {
    this._items = value;
    this.ExtractHeader();
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

  createGroup(){

    let exprs = [];

    for (let index = 0; index < this.GroupHeaders.length; index++) {
      const element = this.GroupHeaders[index];
      let exp = (x: any) => x[element.Key];
      exprs.push(exp);
    }

    this.GroupedData = this.groupByItems(exprs);

    if(this.GroupHeaders.length > 0){
      this.GroupedData = this.groupByItems(exprs);
      this.IsGroupHaveColumns = true;
    } else{
      this.GroupedData = undefined;
      this.IsGroupHaveColumns =false;
    }

    console.log('After group');
    console.log(this.GroupedData);
  }
  
  groupDrop($event: CdkDragDrop<RGridHeader[]>){
    this.GroupHeaders.push($event.item.data);
    this.createGroup();    
  }

  removeFromGroup(item: RGridHeader){
    let ind = this.GroupHeaders.findIndex(x=>x.Key==item.Key);
    if(ind > -1) {
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
        console.clear();
        console.log("DataItems");
        console.log(this.DataItems);
        this.cdr.detectChanges();
      }, 500);
    } else {
      this.ColumnsNotDefined = true;
      if (this.ColumnsNotDefined) {
        //setTimeout(()=>{

        this.ExtractHeader();
        this.DataItems = this.PopulateDefaultData();
        this.filterPerPage();

        this.cdr.detectChanges();

        //}, 500);      
      }
    }
  }

  ItemsShownPerPage(num: any) {
    this.adjustPageValue();
    this.filterPerPage();
  }

  filterPerPage() {
    let skipItems = (this.currentPage - 1) * this.ItemsPerPage.Value;
    this.ShowItems = { Rows: this.DataItems.Rows.slice(skipItems, skipItems + this.ItemsPerPage.Value) };
  }

  NextPage() {
    this.currentPage++;
    this.adjustPageValue();
    this.filterPerPage();
  }

  PreviousPage() {
    this.currentPage--;
    this.adjustPageValue();
    this.filterPerPage();
  }

  LastPage() {

    let noofPage = parseInt((this.DataItems.Rows.length / this.ItemsPerPage.Value).toString());
    let rem = this.DataItems.Rows.length % this.ItemsPerPage.Value;

    if (rem > 0) {
      noofPage = noofPage + 1;
    }

    this.currentPage = noofPage;
    this.filterPerPage();
  }

  FirstPage() {
    this.currentPage = 1;
    this.filterPerPage();
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
          element.HeaderText, element.Width, element.Height, element.EditModeWidth, element.EditModeHeight));
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
        _cell.HeaderKey = _hdr.Key;

        _cell.Item = element;
        _cell.Value = element[_hdr.Key];

        let dirs = cols.filter(x => x.Name.toLowerCase() == _hdr.Value.toLowerCase());

        if (dirs && dirs.length > 0) {
          _cell.columnDirective = dirs[0];
          _cell.Width = dirs[0].Width;
          _cell.Height = dirs[0].Height;
        }

        _row[_hdr.Key] = _cell;
      }

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
        _cell.HeaderKey = _hdr.Key;

        _cell.Item = element;
        _cell.Value = element[_hdr.Key];

        let dir = new RColumnComponent();
        dir.EditView = this.defaultEditView;
        dir.ReadView = this.defaultReadView;
        dir.Width = "fit-content";
        dir.Height = "fit-content";
        dir.HeaderText = _hdr.HeaderText;
        dir.Name = _hdr.Key;
        dir.PropToBind = _hdr.Key;
        dir.EditModeHeight = "fit-content";
        dir.EditModeWidth = "fit-content";

        if (dir) {
          _cell.columnDirective = dir;
          _cell.Width = dir.Width;
          _cell.Height = dir.Height;
        }

        _row[_hdr.Key] = _cell;
      }

      _dataItems.Rows.push(_row);
    }

    return _dataItems;
  }

  ShowEdit($event: Event, item: RGridRow) {
    let keys = Object.keys(item)
    for (let index = 0; index < keys.length; index++) {
      const element = item[keys[index]];
      if (!element.columnDirective.IsComputationalColumn)
        element.IsEditMode = !element.IsEditMode;
    }

    this.EditModeEnabled = false;

    for (let i = 0; i < this.DataItems.Rows.length; i++) {
      for (let index = 0; index < keys.length; index++) {
        const element = this.DataItems.Rows[i][keys[index]].IsEditMode;
        if (element) {
          this.EditModeEnabled = true;
          break;
        }
      }

      if (this.EditModeEnabled)
        break;
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
          this.Headers.push(new RGridHeader(index.toString(), element, element, index, element));
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

  groupByItems(lambdaKey: any[]): any {
    let data = new Map();
    for (let index = 0; index < this.Items.length; index++) {
      const element = this.Items[index];
      let keyValue: string = "";

      for (let index = 0; index < lambdaKey.length; index++) {
        const expr = lambdaKey[index];
        let _keyV = expr(element);
        keyValue = keyValue + "_" + _keyV;
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
  constructor(public Id: string, public Key: string, public Value: string,
    public Index: number, public HeaderText: string, public Width: string = 'auto', public Height: string = 'auto',
    public EditModeWidth: string = 'auto', public EditModeHeight: string = 'auto',
    public readView: TemplateRef<any> | null = null, public editView: TemplateRef<any> | null = null
  ) {

  }
}
