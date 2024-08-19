import { Component, ElementRef, EventEmitter, Input, output, Output } from '@angular/core';
import { RTreeItem } from './TreeModel';
import { NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'rtree',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass],
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
  set Items(value: RTreeItem [] | undefined){        
    if(value!=undefined)
      this._items = value;
  }
  get Items(): RTreeItem[] {
    return this._items;
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
