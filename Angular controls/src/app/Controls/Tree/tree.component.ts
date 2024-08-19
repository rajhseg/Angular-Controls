import { Component, ElementRef, EventEmitter, Input, output, Output } from '@angular/core';
import { TreeItem } from './TreeModel';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'rtree',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.css'
})
export class TreeComponent {

  private _items: TreeItem[] = [];

  @Output()
  onExpandClicked = new EventEmitter<TreeItem>();

  @Output()
  onItemSelected = new EventEmitter<TreeItem>();

  @Input()
  set Items(value: TreeItem [] | undefined){        
    if(value!=undefined)
      this._items = value;
  }
  get Items(): TreeItem[] {
    return this._items;
  }

  onSelected($event: Event, itemSelected: TreeItem){
    this.onItemSelected.emit(itemSelected);
  }

  expandTree($event: Event, itemClicked: TreeItem){
    
    itemClicked.IsExpanded = !itemClicked.IsExpanded;

    let spanElement = ($event.srcElement as HTMLSpanElement);
    spanElement.classList.toggle("symbol-down");

    let childElements = ($event.target as HTMLSpanElement).parentElement?.querySelector("rtree");

    if(childElements!=undefined){
      childElements.classList.toggle('show');
    }

    this.onExpandClicked.emit(itemClicked);
  }

  OnChildExpandClicked(item: TreeItem){
    this.onExpandClicked.emit(item);
  }

  onChildSelected(item: TreeItem){
    this.onItemSelected.emit(item);
  }
}
