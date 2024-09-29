import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { RStateAlignment, RStateDisplayType, RStepComponent } from '../rstep/rstep.component';
import { RbuttonComponent } from "../rbutton/rbutton.component";
import { NgClass, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { EditViewTemplateDirective } from "../rgrid/edit-template.directive";
import { WindowHelper } from '../windowObject';
import { RStateVerticalComponent } from "../sequences/sequences.component";
import { RSequenceVerticalItem } from '../sequences/sequence/sequenceitem';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
  selector: 'rstepper-vertical',
  standalone: true,
  imports: [RbuttonComponent, NgIf, NgTemplateOutlet,
    EditViewTemplateDirective, NgStyle, NgClass, RStateVerticalComponent],
  templateUrl: './rstepper-vertical.component.html',
  styleUrl: './rstepper-vertical.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RStepperVerticalComponent implements AfterContentInit {

  seqItems: RSequenceVerticalItem[] = [];

  @Input()
  public ContentWidth: number = 800;

  @Input()
  public ContentHeight: number = 530;

  @Input()
  EnableShadow: boolean = true;

  @Input()
  CompletedButtonBackColor: string = 'rgb(35, 206, 236)';

  @Input()
  CompletedButtonForeColor: string = 'white';

  @Input()
  BackButtonBackColor: string = 'blue';

  @Input()
  BackButtonForeColor: string = 'white';

  @Input()
  VerticalItemStepNoForeColor: string = 'Whitesmoke';

  @Input()
  VerticalItemStripLineColor: string = 'blue';

  @Input()
  VerticalItemCompletedBackColor: string = 'white';

  @Input()
  VerticalItemCompletedForeColor: string = 'green';

  @Input()
  VerticalItemActiveBackColor: string = 'green';

  @Input()
  VerticalItemActiveForeColor: string = 'white';

  @Input()
  ApplyItemForeColorToStepNo: boolean = true;

  @Input()
  VerticalItemPendingBackColor: string = 'blue';

  @Input()
  VerticalItemPendingForeColor: string = 'white';


  @Input()
  NextButtonBackColor: string = 'blue';

  @Input()
  NextButtonForeColor: string = 'white';

  @Input()
  DoneButtonBackColor: string = 'blue';

  @Input()
  DoneButtonForeColor: string = 'white';

  @Input()
  CurrentStepValidLabelColor: string = 'green';

  @Input()
  CurrentStepInValidLabelColor: string = 'blue';

  @Output()
  public OnCompletedClick = new EventEmitter<Event>();

  public IsCompleted: boolean = false;

  public IsLastStepFinished: boolean = false;

  private _showInValidStepOnLoad: boolean = true;

  @Output()
  public StateVerticalDisplayTypeChange = new EventEmitter<RStateDisplayType>();

  private _stateVerticalDisplayType: RStateDisplayType = RStateDisplayType.AllItems;

  @Input()
  public set StateVerticalDisplayType(val: RStateDisplayType) {
    this._stateVerticalDisplayType = val;

    if (this.StateVerticalAlignment == RStateAlignment.OnTop) {
      this._stateVerticalDisplayType = RStateDisplayType.OnlyCompleted;      
    }

    this.RenderSequenceItemsForValidSteps();
    this.StateVerticalDisplayTypeChange.emit(this._stateVerticalDisplayType);
  }
  public get StateVerticalDisplayType(): RStateDisplayType {
    return this._stateVerticalDisplayType;
  }

  @Output()
  public StateVerticalAlignmentChange = new EventEmitter<RStateAlignment>();

  private _stateVerticalAlign: RStateAlignment = RStateAlignment.OnLeft;

  @Input()
  public set StateVerticalAlignment(val: RStateAlignment) {
    this._stateVerticalAlign = val;

    if (val == RStateAlignment.OnTop) {
      this._stateVerticalDisplayType = RStateDisplayType.OnlyCompleted;
      this.StateVerticalDisplayTypeChange.emit(this._stateVerticalDisplayType);
    }

    this.RenderSequenceItemsForValidSteps();
    this.StateVerticalAlignmentChange.emit(this._stateVerticalAlign);
  }
  public get StateVerticalAlignment(): RStateAlignment {
    return this._stateVerticalAlign;
  }

  private _showStateVertical: boolean = true;

  @Input()
  public set ShowStateVertical(val: boolean) {
    this._showStateVertical = val;
    this.RenderSequenceItemsForValidSteps();
  }
  public get ShowStateVertical(): boolean {
    return this._showStateVertical;
  }

  @ViewChild('view', { read: ViewContainerRef }) vcr!: ViewContainerRef;

  @ContentChildren(RStepComponent) Steps!: QueryList<RStepComponent>;

  public CurrentViewStep: RStepComponent | undefined = undefined;

  public TotalSteps: number = 0;

  private stepsList: RStepComponent[] = [];
  private _activeStepNo: number = 1;
  public fStep: number | undefined = undefined;
  public sStep: number | undefined = undefined;
  public foStep: number | undefined = undefined;
  public fiStep: number | undefined = undefined;

  public verticalItemActiveItem: number = 0;

  @Input()
  public set ActiveStepNo(val: number) {
    this.SelectStepDirectly(val);
    this.RenderSequenceItemsForValidSteps();
  }
  public get ActiveStepNo(): number {
    return this._activeStepNo;
  }

  constructor(private cdr: ChangeDetectorRef, private winObj: WindowHelper) {
    this.seqItems = [];
  }

  CompletedClick($event: Event) {
    let allValid = this.stepsList.every(x => x.IsStepValid);
    if (allValid)
      this.OnCompletedClick.emit($event);
  }

  Done($event: Event) {
    this.IsCompleted = true;
    this.IsLastStepFinished = true;
    this.CurrentViewStep = undefined;
    let cStep = this.TotalSteps + 1;
    if (cStep) {
      this.fStep = cStep > 2 ? cStep - 2 : undefined;
      this.sStep = cStep > 1 ? cStep - 1 : undefined;
    }

    this.CreateFinalItemsToDisplay();
  }

  CreateFinalItemsToDisplay() {

    this.seqItems = [];

    for (let index = 0; index < this.stepsList.length; index++) {
      const element = this.stepsList[index];
      let CompletedItem = new RSequenceVerticalItem();
      CompletedItem.Value = element.StepNo;
      CompletedItem.StepNo = element.StepNo;
      CompletedItem.IsCompleted = true;
      CompletedItem.DisplayText = element.Title;
      this.seqItems.push(CompletedItem);
    }

    this.verticalItemActiveItem = this.stepsList.length;
  }

  IsLastStep(): boolean {
    return this.CurrentViewStep?.StepNo == this.TotalSteps;
  }

  ngAfterContentInit(): void {
    if (this.winObj.isExecuteInBrowser()) {
      this.stepsList = this.Steps.toArray();
      let stepNo = 0;

      for (let index = 0; index < this.stepsList.length; index++) {
        const element = this.stepsList[index];
        element.StepNo = index + 1;
      }

      this.TotalSteps = this.stepsList.length;
      this.SelectStepDirectly(this.TotalSteps);
      this.RenderSequenceItemsForValidSteps();
    }
  }

  RenderSequenceItemsForValidSteps() {
    this.seqItems = [];    

    let isActiveItem = true;
    for (let index = 0; index < this.stepsList.length; index++) {
      const element = this.stepsList[index];

      if (element.IsStepValid) {
        let filItems = this.seqItems.filter(x => x.StepNo == element.StepNo);

        if (filItems == undefined || filItems.length == 0) {
          let CompletedItem = new RSequenceVerticalItem();
          CompletedItem.Value = element.StepNo;
          CompletedItem.StepNo = element.StepNo;
          CompletedItem.IsCompleted = true;
          CompletedItem.DisplayText = element.Title;
          CompletedItem.IsLastItem = false;
          this.seqItems.push(CompletedItem);
        }
      }
      else {
        if (this.StateVerticalDisplayType == RStateDisplayType.OnlyCompleted) {
          this.verticalItemActiveItem = index;          
          this.CurrentViewStep = this.stepsList[index];
          this._activeStepNo = this.CurrentViewStep.StepNo;
          break;
        }

        let filItems = this.seqItems.filter(x => x.StepNo == element.StepNo);

        if (filItems == undefined || filItems.length == 0) {
          let CurrentOrPendingItem = new RSequenceVerticalItem();
          CurrentOrPendingItem.Value = element.StepNo;
          CurrentOrPendingItem.StepNo = element.StepNo;

          if (isActiveItem) {
            CurrentOrPendingItem.IsActive = true;            
            this.CurrentViewStep = this.stepsList.find(x => x.StepNo == element.StepNo);
            
            if(this.CurrentViewStep)
              this._activeStepNo = this.CurrentViewStep.StepNo;

            this.verticalItemActiveItem = index;
            isActiveItem = false;
          } else {
            CurrentOrPendingItem.IsPending = true;
          }

          CurrentOrPendingItem.DisplayText = element.Title;
          CurrentOrPendingItem.IsLastItem = false;
          this.seqItems.push(CurrentOrPendingItem);
        }

      }
    }

    this.TotalSteps = this.stepsList.length;

    if (this.TotalSteps == this.seqItems.length && this.seqItems.length > 0) {
      this.seqItems[this.seqItems.length - 1].IsLastItem = true;
    }

    if (this.stepsList.length > 0 && this.stepsList.every(x=>x.IsStepValid)) {
      this.IsCompleted = true;
      this.IsLastStepFinished = true;      
      this.verticalItemActiveItem = this.TotalSteps + 1;
      let cStep = this.TotalSteps + 1;
      if (cStep) {
        this.fStep = cStep > 2 ? cStep - 2 : undefined;
        this.sStep = cStep > 1 ? cStep - 1 : undefined;
      }

      return;
    }

    this.calculateSteps();

  }

  PrevStep() {
    var prevStep = 1;
    
    if(this.IsCompleted){
      this.IsCompleted = false;
    }

    if (!this.IsLastStepFinished) {
      var stepno = this.ActiveStepNo;
      if (stepno - 1 < 1)
        prevStep = 1;
      else
        prevStep = stepno - 1;
    }
    else {
      this.IsLastStepFinished = false;
      prevStep = this.TotalSteps;
    }

    if (this.StateVerticalDisplayType == RStateDisplayType.OnlyCompleted) {
      if (this.seqItems.length > 0) {
        this.seqItems.splice(this.seqItems.length - 1, 1);
      }
    }
    else {
      this.RenderVerticalItemsForAllDisplayType(prevStep - 1);
    }

    this.SelectStep(prevStep);
  }

  NextStep() {
    if (this.CurrentViewStep?.IsStepValid) {
      var nextStep = 1;

      var stepno = this.ActiveStepNo;
      if (stepno + 1 > this.TotalSteps)
        nextStep = this.TotalSteps;
      else
        nextStep = stepno + 1;

      if (this.StateVerticalDisplayType == RStateDisplayType.OnlyCompleted) {
        let filItems = this.seqItems.filter(x => x.StepNo == this.CurrentViewStep?.StepNo);

        if (filItems == undefined || filItems.length == 0) {
          let CompletedItem = new RSequenceVerticalItem();
          CompletedItem.Value = this.CurrentViewStep.StepNo;
          CompletedItem.StepNo = this.CurrentViewStep.StepNo;
          CompletedItem.IsCompleted = true;
          CompletedItem.DisplayText = this.CurrentViewStep.Title;
          this.seqItems.push(CompletedItem);
        }
      } else {
        this.RenderVerticalItemsForAllDisplayType(nextStep - 1);
      }

      this.SelectStep(nextStep);
    }
  }

  RenderVerticalItemsForAllDisplayType(lastcompletedStepNo: number) {

    if (this.StateVerticalDisplayType == RStateDisplayType.AllItems) {
      for (let index = 1; index <= lastcompletedStepNo; index++) {
        const element = this.stepsList[index];
        let item = this.seqItems.find(x => x.StepNo == index);
        if (item) {
          item.IsCompleted = true;
        }
      }

      let activeItem = this.seqItems.find(x => x.StepNo == lastcompletedStepNo + 1);
      if (activeItem) {
        activeItem.IsActive = true;        
        this.CurrentViewStep = this.stepsList.find(x => x.StepNo == activeItem.StepNo);
        this.verticalItemActiveItem = lastcompletedStepNo;
      }

      for (let index = lastcompletedStepNo + 2; index <= this.TotalSteps; index++) {
        let pendingItem = this.seqItems.find(x => x.StepNo == index);
        if (pendingItem) {
          pendingItem.IsPending = true;
        }
      }


      if (this.TotalSteps == this.seqItems.length && this.seqItems.length > 0) {
        this.seqItems[this.seqItems.length - 1].IsLastItem = true;
      }

    }

    this.calculateSteps();
  }

  SelectStepDirectly(val: number) {

    if (this.winObj.isExecuteInBrowser()) {
      window.setTimeout(() => {
        if (val > 0 && val <= this.stepsList.length && this.stepsList.length > 0) {

          let stepNo = 1;

          for (let index = 1; index <= val; index++) {
            if (!this.stepsList[index - 1].IsStepValid) {
              stepNo = index;
              break;
            }
          }

          this._activeStepNo = stepNo;

          let selectedStep = this.stepsList.filter(x => x.StepNo == stepNo);

          if (selectedStep && selectedStep.length > 0) {            
            this.CurrentViewStep = selectedStep[0];
          }

        }
        this.calculateSteps();

        this.cdr.detectChanges();
      });
    }
  }

  SelectStep(val: number) {

    if (this.winObj.isExecuteInBrowser()) {
      window.setTimeout(() => {
        if (val > 0 && val <= this.stepsList.length && this.stepsList.length > 0) {

          let stepNo = val;
          this._activeStepNo = stepNo;

          let selectedStep = this.stepsList.filter(x => x.StepNo == stepNo);

          if (selectedStep && selectedStep.length > 0) {            
            this.CurrentViewStep = selectedStep[0];
          }

        }
        this.calculateSteps();

        this.cdr.detectChanges();
      });
    }
  }

  calculateSteps() {
    let cStep = this.CurrentViewStep?.StepNo;

    if (cStep) {
      this.fStep = cStep > 2 ? cStep - 2 : undefined;
      this.sStep = cStep > 1 ? cStep - 1 : undefined;
      this.foStep = cStep + 1 <= this.TotalSteps ? cStep + 1 : undefined;
      this.fiStep = cStep + 2 <= this.TotalSteps ? cStep + 2 : undefined;
    }
  }

}
