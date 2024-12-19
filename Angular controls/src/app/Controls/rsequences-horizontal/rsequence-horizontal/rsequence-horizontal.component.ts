import { Component, Input } from '@angular/core';
import { RSequenceHorizontalItem } from './sequenceitemhorizontal';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rsequence-horizontal',
  standalone: true,
  imports: [NgStyle, NgIf],
  templateUrl: './rsequence-horizontal.component.html',
  styleUrl: './rsequence-horizontal.component.css'
})
export class RSequenceHorizontalComponent {

  private _item: RSequenceHorizontalItem | undefined = undefined;

  @Input()
  public IsDisplayStepNo: boolean = true;

  @Input()
  public StepNoForeColor: string = 'white';
  
  @Input()
  public StepNo: number = 1;

  public blineWidth: string = "";
  private _contentWidth: string = "100px";

  @Input()
  public EnableEmptyItemOnTopSide: boolean = true;

  @Input()
  public EnableShadow: boolean = false;

  @Input()
  public set ContentWidth(value: string ){
    this._contentWidth = value;
    let width = value.split("px")[0];
    let bwidth = Number.parseInt(width) - (this.IsDisplayStepNo ? 47 : 43);
    this.blineWidth = bwidth.toString()+"px";
  }
  public get ContentWidth(): string {
    return this._contentWidth;
  }

  @Input()
  public CompletedForeColor: string = "orange";

  @Input()
  public StripLineColor: string = "purple";

  @Input()
  public PendingForeColor: string = "purple";

  @Input()
  public ActiveForeColor: string = "green";

  @Input()
  public set Item(value: RSequenceHorizontalItem) {
    this._item = value;
  }
  public get Item(): RSequenceHorizontalItem | undefined {
    return this._item;
  }
}
