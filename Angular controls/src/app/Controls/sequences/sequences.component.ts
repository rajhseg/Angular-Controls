import { Component, Input } from '@angular/core';
import { RSequenceVerticalComponent } from "./sequence/sequence.component";
import { RSequenceItem } from './sequence/sequenceitem';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'rstepper-vertical',
  standalone: true,
  imports: [RSequenceVerticalComponent, NgForOf],
  templateUrl: './sequences.component.html',
  styleUrl: './sequences.component.css'
})
export class RSequencesVerticalComponent {

  private _currentActiveIndex: number = -1;

  private _currentActiveItem: RSequenceItem | undefined = undefined;

  private _items: RSequenceItem[] = [];

  @Input()
  public ContentWidth: string = "250px";

  @Input()
  public CompletedForeColor: string = "white";

  @Input()
  public StripLineColor: string = "purple";

  @Input()
  public CompletedBackgroundColor: string = "purple";

  
  @Input()
  public PendingForeColor: string = "Black";

  @Input()
  public PendingBackgroundColor: string = "White";


  @Input()
  public ActiveForeColor: string = "white";

  @Input()
  public ActiveBackgroundColor: string = "green";

  @Input()
  public set Items(value: RSequenceItem[]){
    this._items = value;
    let activeIndex = this._items.findIndex(x=>x.IsActive);
    
    if(activeIndex==-1)
      this.setActiveFirstItem();
  }
  public get Items(): RSequenceItem[] {
    return this._items;
  }
  
  public moveToNext(){
    let currentIndex = this._items.findIndex(x=>x.IsActive);    
    let nextIndex = currentIndex +1;
    
    if(nextIndex> this._items.length){
      this._items[currentIndex].IsCompleted = true;
      return;
    }
      
    this._items[nextIndex].IsActive = true;  
    this._currentActiveIndex = nextIndex;
    this._currentActiveItem = this._items[nextIndex];  
    this._items[currentIndex].IsCompleted = true;
  }

  
  public moveToPrevious(){
    let currentIndex = this._items.findIndex(x=>x.IsActive);    
    let previousIndex = currentIndex - 1;
    
    if(previousIndex< 0){
      this._items[currentIndex].IsPending = true;
      return;
    }
      
    this._items[previousIndex].IsActive = true; 
    this._currentActiveIndex = previousIndex;
    this._currentActiveItem = this._items[previousIndex];   
    this._items[currentIndex].IsPending = true;
  }

  private setActiveFirstItem(){
    if(this._items.length>0) {
      this._items[0].IsActive = true;
      this._currentActiveIndex = 0;
      this._currentActiveItem = this._items[0];
    }    

    for (let index = 1; index < this._items.length; index++) {
      const element = this._items[index];
      element.IsPending = true;
      
    }
  }
}
