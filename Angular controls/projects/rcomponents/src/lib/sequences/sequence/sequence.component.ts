import { Component, Input } from '@angular/core';
import { RSequenceVerticalItem } from './sequenceitem';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rsequence-vertical',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './sequence.component.html',
  styleUrl: './sequence.component.css'
})
export class RSequenceVerticalComponent {

  private _item: RSequenceVerticalItem | undefined = undefined;

  @Input()
  public StepNo: number = -1;

  @Input()
  public IsDisplayStepNo: boolean = true;

  @Input()
  public StepNoForeColor: string = "white";
  
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
  public PendingForeColor: string = "white";

  @Input()
  public PendingBackgroundColor: string = "orangered";


  @Input()
  public ActiveForeColor: string = "white";

  @Input()
  public ActiveBackgroundColor: string = "green";

  @Input()
  public EnableShadow: boolean = true;

  @Input()
  public set Item(value: RSequenceVerticalItem){
    this._item = value;
  }
  public get Item(): RSequenceVerticalItem | undefined {
    return this._item;
  }

}
