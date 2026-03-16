import { Component, ElementRef, EventEmitter, HostBinding, Input, output, Output } from '@angular/core';
import { RTreeItem } from './rtreeModel';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { RWindowHelper } from '../rwindowObject';

@Component({
  selector: 'rtree',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, NgStyle],
  templateUrl: './rtree.component.html',
  styleUrl: './rtree.component.css'
})
export class RTreeComponent {

  private _items: RTreeItem[] = [];

  @Output()
  onExpandClicked = new EventEmitter<RTreeItem>();

  @Output()
  onItemSelected = new EventEmitter<RTreeItem>();

  @Input()
  ExpandIconColor: string = "#00c7ba";

  @Input()
  set Items(value: RTreeItem [] | undefined){        
    if(value!=undefined)
      this._items = value;
  }
  get Items(): RTreeItem[] {
    return this._items;
  }

  Id: string = '';
  
  @HostBinding('id')
  HostElementId: string = '';

  constructor(private winObj: RWindowHelper){
    this.Id = this.winObj.GenerateUniqueId();
    this.HostElementId = this.winObj.GenerateUniqueId();
  }

  onSelected($event: Event, itemSelected: RTreeItem){
    this.onItemSelected.emit(itemSelected);
  }

  expandTree($event: Event, itemClicked: RTreeItem){
    
    itemClicked.IsExpanded = !itemClicked.IsExpanded;

    let spanElement = ($event.srcElement as HTMLSpanElement);
    spanElement.classList.toggle("symbol-down");

    let childElements = ($event.target as HTMLSpanElement).parentElement?.querySelector("rtree");

    if(childElements!=undefined){
      childElements.classList.toggle('show');
    }

    this.onExpandClicked.emit(itemClicked);
  }

  OnChildExpandClicked(item: RTreeItem){
    this.onExpandClicked.emit(item);
  }

  onChildSelected(item: RTreeItem){
    this.onItemSelected.emit(item);
  }

  DeleteTreeItem(removeItem: RTreeItem) {
    if (this._items.length > 0) {
      let firstItem = this._items[0];

      if (firstItem.Id == removeItem.Id) {
        this._items = [];
      } else {
        firstItem.DeleteChildItem(removeItem);
      }
    }
  }

  GetLoadingTreeItem(): RTreeItem {
    let loadingItem = new RTreeItem();
    loadingItem.ConvertToLoaderItem();
    return loadingItem;
  }
  
}
