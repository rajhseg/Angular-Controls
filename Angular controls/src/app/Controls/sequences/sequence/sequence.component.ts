import { Component, Input } from '@angular/core';
import { RSequenceItem } from './sequenceitem';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rsequence-vertical',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './sequence.component.html',
  styleUrl: './sequence.component.css'
})
export class RSequenceVerticalComponent {

  private _item: RSequenceItem | undefined = undefined;

  @Input()
  public EnableEmptyItemOnLeftSide: boolean = true;
  
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
  public set Item(value: RSequenceItem){
    this._item = value;
  }
  public get Item(): RSequenceItem | undefined {
    return this._item;
  }

}
