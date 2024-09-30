import { AfterContentInit, ChangeDetectorRef, Component, ContentChildren, EventEmitter, Input, Output, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
import { RStateAlignment, RStateDisplayType, RStepComponent } from '../rstep/rstep.component';
import { WindowHelper } from '../windowObject';
import { RSequenceHorizontalItem } from '../rsequences-horizontal/rsequence-horizontal/sequenceitemhorizontal';
import { RStateHorizontalComponent } from "../rsequences-horizontal/rsequences-horizontal.component";
import { NgClass, NgFor, NgIf, NgStyle, NgTemplateOutlet } from '@angular/common';
import { RbuttonComponent } from '../rbutton/rbutton.component';

@Component({
  selector: 'rstepper-horizontal',
  standalone: true,
  imports: [RStateHorizontalComponent, NgIf, RbuttonComponent, NgStyle, NgFor, NgClass, NgTemplateOutlet],
  templateUrl: './rstepper-horizontal.component.html',
  styleUrl: './rstepper-horizontal.component.css'
})
export class RStepperHorizontalComponent implements AfterContentInit {

  
  seqItems: RSequenceHorizontalItem[] = [];

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
  HorizontalItemStripLineColor: string = 'white';  

  @Input()
  HorizontalItemCompletedBackColor: string = 'white';

  @Input()
  HorizontalItemActiveBackColor: string = 'blue';

  @Input()
  HorizontalItemPendingBackColor: string = 'white';

  @Input()
  HorizontalItemCompletedForeColor: string = 'green';

  @Input()
  HorizontalItemActiveForeColor: string = 'white';

  @Input()
  HorizontalItemPendingForeColor: string = 'orange';

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


  private _stateHorizontalDisplayType: RStateDisplayType = RStateDisplayType.AllItems;
  public get StateHorizontalDisplayType(): RStateDisplayType {
    return this._stateHorizontalDisplayType;
  }

  private _stateHorizontalAlign: RStateAlignment = RStateAlignment.OnTop;
  public get StateHorizontalAlignment(): RStateAlignment {
    return this._stateHorizontalAlign;
  }

  @ViewChild('view', { read: ViewContainerRef }) vcr!: ViewContainerRef;

  @ContentChildren(RStepComponent) Steps!: QueryList<RStepComponent>;

  public CurrentViewStep: RStepComponent | undefined = undefined;

  public TotalSteps: number = 0;

  public StepsNos: number[] = [];

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

  populateNos(){
    this.StepsNos = [];
    for (let index = 1; index <= this.TotalSteps; index++) {      
      this.StepsNos.push(index);
    }
  }
  CompletedClick($event: Event) {
    let allValid = this.stepsList.every(x => x.IsStepValid);
    if (allValid)
      this.OnCompletedClick.emit($event);
  }

  Done($event: Event) {
    this.IsCompleted = true;
    this.IsLastStepFinished = true;
    //this.CurrentViewStep = undefined;
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
      let CompletedItem = new RSequenceHorizontalItem();
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
      this.populateNos();
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
          let CompletedItem = new RSequenceHorizontalItem();
          CompletedItem.Value = element.StepNo;
          CompletedItem.StepNo = element.StepNo;
          CompletedItem.IsCompleted = true;
          CompletedItem.DisplayText = element.Title;
          CompletedItem.IsLastItem = false;
          this.seqItems.push(CompletedItem);
        }
      }
      else {
        if (this.StateHorizontalDisplayType == RStateDisplayType.OnlyCompleted) {
          this.verticalItemActiveItem = index;          
          this.CurrentViewStep = this.stepsList[index];
          break;
        }

        let filItems = this.seqItems.filter(x => x.StepNo == element.StepNo);

        if (filItems == undefined || filItems.length == 0) {
          let CurrentOrPendingItem = new RSequenceHorizontalItem();
          CurrentOrPendingItem.Value = element.StepNo;
          CurrentOrPendingItem.StepNo = element.StepNo;

          if (isActiveItem) {
            CurrentOrPendingItem.IsActive = true;            
            this.CurrentViewStep = this.stepsList.find(x => x.StepNo == element.StepNo);
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

    if (this.StateHorizontalDisplayType == RStateDisplayType.OnlyCompleted) {
      if (this.seqItems.length > 0) {
        this.seqItems.splice(this.seqItems.length - 1, 1);
      }
    }
    else {
      this.RenderHorizontalItemsForAllDisplayType(prevStep - 1);
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

      if (this.StateHorizontalDisplayType == RStateDisplayType.OnlyCompleted) {
        let filItems = this.seqItems.filter(x => x.StepNo == this.CurrentViewStep?.StepNo);

        if (filItems == undefined || filItems.length == 0) {
          let CompletedItem = new RSequenceHorizontalItem();
          CompletedItem.Value = this.CurrentViewStep.StepNo;
          CompletedItem.StepNo = this.CurrentViewStep.StepNo;
          CompletedItem.IsCompleted = true;
          CompletedItem.DisplayText = this.CurrentViewStep.Title;
          this.seqItems.push(CompletedItem);
        }
      } else {
        this.RenderHorizontalItemsForAllDisplayType(nextStep - 1);
      }

      this.SelectStep(nextStep);
    }
  }

  RenderHorizontalItemsForAllDisplayType(lastcompletedStepNo: number) {

    if (this.StateHorizontalDisplayType == RStateDisplayType.AllItems) {
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
