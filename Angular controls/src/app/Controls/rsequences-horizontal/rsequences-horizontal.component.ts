import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RSequenceHorizontalItem } from './rsequence-horizontal/sequenceitemhorizontal';
import { NgForOf } from '@angular/common';
import { RSequenceHorizontalComponent } from './rsequence-horizontal/rsequence-horizontal.component';

@Component({
  selector: 'rstate-horizontal',
  standalone: true,
  imports: [RSequenceHorizontalComponent, NgForOf],
  templateUrl: './rsequences-horizontal.component.html',
  styleUrl: './rsequences-horizontal.component.css',
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RStateHorizontalComponent),
      multi: true
    }
  ]
})
export class RStateHorizontalComponent  implements ControlValueAccessor {

  private _currentActiveIndex: number = -1;

  private _currentActiveItem: RSequenceHorizontalItem | undefined = undefined;

  private _items: RSequenceHorizontalItem[] = [];

  public _allItemsAreInBottom: boolean = false;
  
  
  @Input()
  public IsDisplayStepNo: boolean = true;

  @Input()
  public StepNoForeColor: string = 'white';
  

  @Input()
  public ContentWidth: string = "100px";

  @Input()
  public CompletedForeColor: string = "orange";

  @Input()
  public StripLineColor: string = "purple";

  @Input()
  public PendingForeColor: string = "purple";

  @Input()
  public ActiveForeColor: string = "green";

  @Input()
  public set Items(value: RSequenceHorizontalItem[]) {
    this._items = value;

    for (let index = 0; index < this._items.length; index++) {
      this._items[index].StepNo = index + 1;      
    }

    let activeIndex = this._items.findIndex(x => x.IsActive);

    let anyInTopAlign = this._items.some(x => x.IsTopAlign);

    if (!anyInTopAlign) {
      this._allItemsAreInBottom = true;
    }

    this._items[this._items.length - 1].IsLastItem = true;

    if (activeIndex == -1 && this._currentActiveIndex == -1)
      this.setPendingFirstItem();
    else
      this.ResetValue(this._currentActiveIndex);

    this.notifyToModel();
  }
  public get Items(): RSequenceHorizontalItem[] {
    return this._items;
  }

  @Input()
  public set SelectedActiveIndex(value: number) {
    if (value < 0) {
      if (this._items.length > 0) {
        this._items[0].IsPending = true;
      }

      this._currentActiveIndex = -1;
      return;
    }

    this._currentActiveIndex = value;
    this.ResetValue(value);

    if (this._currentActiveIndex > -1 && this._currentActiveIndex < this._items.length)
      this.notifyToModel();
  }
  public get SelectedActiveIndex(): number {
    return this._currentActiveIndex;
  }

  @Input()
  public set SelectedActiveItem(value: RSequenceHorizontalItem) {
    if (value) {
      let activeIndex = this._items.findIndex(x => x.Value == value.Value);
      if (activeIndex > -1) {
        this._currentActiveIndex = activeIndex;
        this.ResetValue(activeIndex);
      }

      this.notifyToModel();
    }
  }
  public get SelectedActiveItem(): RSequenceHorizontalItem | undefined {
    return this._currentActiveItem;
  }

  @Output()
  OnActiveValueChanged = new EventEmitter<RSequenceHorizontalItem>();

  OnChanged: Function = (item: RSequenceHorizontalItem) => { };
  OnTouched: Function = (item: RSequenceHorizontalItem) => { };

  constructor(private cdr: ChangeDetectorRef) {

  }

  notifyToModel() {
    this.OnChanged(this._currentActiveItem);
    this.OnTouched(this._currentActiveItem);
    this.OnActiveValueChanged.emit(this._currentActiveItem);
  }

  ResetValue(selindex: number) {

    if (this.Items.length > 0 && selindex >= this.Items.length) {
      this._items[this._items.length - 1].IsCompleted = true;
    }

    if (this._items.length > 0 && selindex > -1 && selindex < this._items.length) {
      for (let index = selindex - 1; index > -1; index--) {
        const element = this._items[index];
        element.IsCompleted = true;
      }

      this._items[selindex].IsActive = true;

      this._currentActiveItem = this._items[selindex];

      for (let index = selindex + 1; index < this._items.length; index++) {
        const element = this._items[index];
        element.IsPending = true;
      }
    }
  }

  writeValue(obj: any): void {

    if (obj) {
      let activeIndex = this._items.findIndex(x => x.Value == obj.Value);
      if (activeIndex > -1) {
        this._currentActiveIndex = activeIndex;
        this.ResetValue(activeIndex);
      }

      this.OnActiveValueChanged.emit(this._currentActiveItem);
    }

  }

  registerOnChange(fn: any): void {
    this.OnChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.OnTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {

  }

  public moveToNext() {
    let currentIndex = this._items.findIndex(x => x.IsActive);
    let lastCompletedIndex = this.Items.findIndex(x => x.IsCompleted);

    if (currentIndex == -1 && lastCompletedIndex > -1) {
      return;
    }

    let nextIndex = currentIndex + 1;

    if (nextIndex >= this._items.length) {
      if(currentIndex > -1 && currentIndex < this._items.length)
        this._items[currentIndex].IsCompleted = true;
      return;
    }

    this._items[nextIndex].IsActive = true;
    this._currentActiveIndex = nextIndex;
    this._currentActiveItem = this._items[nextIndex];

    if(currentIndex > -1 && currentIndex < this._items.length)
      this._items[currentIndex].IsCompleted = true;

    if (this._currentActiveIndex > -1 && this._currentActiveIndex < this._items.length)
      this.notifyToModel();

    this.cdr.detectChanges();

  }


  public moveToPrevious() {
    let currentIndex = this._items.findIndex(x => x.IsActive);
    let previousIndex = currentIndex - 1;
    let lastCompletedIndex = this.Items.findIndex(x => x.IsCompleted);

    if (currentIndex < 0 && lastCompletedIndex > -1) {
      this._items[this.Items.length - 1].IsActive = true;
      this._currentActiveIndex = this.Items.length - 1;
      this._currentActiveItem = this._items[this.Items.length - 1];
      this.notifyToModel()
      return;
    }

    if (previousIndex < 0) {

      if (currentIndex > -1) {
        if (this._items[currentIndex].IsActive) {
          this._items[currentIndex].IsActive = false;
          this._items[currentIndex].IsPending = true;
        } else {
          this._items[currentIndex].IsActive = true;
          this._currentActiveIndex = currentIndex;
          this._currentActiveItem = this._items[currentIndex];
          this.notifyToModel()
        }
      }
      return;
    }

    this._items[previousIndex].IsActive = true;
    this._currentActiveIndex = previousIndex;
    this._currentActiveItem = this._items[previousIndex];
    this._items[currentIndex].IsPending = true;
    this.notifyToModel();
    this.cdr.detectChanges();
  }

  private setPendingFirstItem() {

    for (let index = 0; index < this._items.length; index++) {
      const element = this._items[index];
      element.IsPending = true;
    }

    this._currentActiveIndex = -1;
    this._currentActiveItem = undefined;

    this.notifyToModel();
    this.cdr.detectChanges();
  }
}
