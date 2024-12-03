import { Component, ElementRef, EventEmitter, HostBinding, Input, output, Output } from '@angular/core';
import { RTreeItem } from './TreeModel';
import { NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rtree',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, NgStyle],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
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
  HostElementId: string = this.winObj.GenerateUniqueId();

  constructor(private winObj: WindowHelper){
    this.Id = this.winObj.GenerateUniqueId();
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
}
