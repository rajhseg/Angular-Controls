import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { RStepComponent } from '../rstep/rstep.component';
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

  seqItems: RSequenceVerticalItem[]=[];
  
  @Input()
  public ContentWidth: number = 800;

  @Input()
  public ContentHeight: number = 530;

  @Input()
  EnableShadow: boolean = true;

  public IsCompleted: boolean = false;

  public IsLastStepFinished: boolean = false;

  @ContentChildren(RStepComponent) Steps!: QueryList<RStepComponent>;

  public CurrentViewStep: RStepComponent | undefined = undefined;

  public TotalSteps: number = 0;

  private stepsList: RStepComponent[] = [];
  private _activeStepNo: number = 1;
  public fStep: number | undefined = undefined;
  public sStep: number | undefined = undefined;
  public foStep: number | undefined = undefined;
  public fiStep: number | undefined = undefined;

  @Input()
  public set ActiveStepNo(val: number) {
    this.SelectStepDirectly(val);
  }
  public get ActiveStepNo(): number {
    return this._activeStepNo;
  }

  constructor(private cdr: ChangeDetectorRef, private winObj: WindowHelper) {

  }

  Done($event: Event){
    this.IsCompleted = true;
    this.IsLastStepFinished = true; 
    this.CurrentViewStep = undefined;
    let cStep = this.TotalSteps+1;
    if(cStep) {
      this.fStep = cStep > 2 ? cStep - 2 : undefined;
      this.sStep = cStep > 1 ? cStep - 1 : undefined;            
    }

    this.CreateFinalItemsToDisplay();
  }

  CreateFinalItemsToDisplay(){

    this.seqItems = [];

    for (let index = 0; index < this.stepsList.length; index++) {
      const element = this.stepsList[index];
      let CompletedItem = new RSequenceVerticalItem();    
      CompletedItem.Value = element.StepNo;
      CompletedItem.StepNo = element.StepNo;
      CompletedItem.IsCompleted = true;      
      CompletedItem.DisplayText= element.Title;      
      this.seqItems.push(CompletedItem);
    }
    
  }

  IsLastStep(): boolean{
    return this.CurrentViewStep?.StepNo == this.TotalSteps;
  }

  ngAfterContentInit(): void {
    this.stepsList = this.Steps.toArray();
    let stepNo = 0;

    for (let index = 0; index < this.stepsList.length; index++) {
      const element = this.stepsList[index];
      element.StepNo = index + 1;
    }

    this.TotalSteps = this.stepsList.length;
    this.SelectStepDirectly(this.TotalSteps);
  }

  PrevStep() {
    var prevStep = 1;

    if(!this.IsLastStepFinished) {      
      var stepno = this.ActiveStepNo;
      if (stepno - 1 < 1)
        prevStep = 1;
      else
        prevStep = stepno - 1;
    }
    else{
      this.IsLastStepFinished = false;
      prevStep = this.TotalSteps;
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

      let filItems = this.seqItems.filter(x=>x.StepNo==this.CurrentViewStep?.StepNo);

      if(filItems == undefined || filItems.length == 0){      
        let CompletedItem = new RSequenceVerticalItem();    
        CompletedItem.Value = this.CurrentViewStep.StepNo;
        CompletedItem.StepNo = this.CurrentViewStep.StepNo;
        CompletedItem.IsCompleted = true;      
        CompletedItem.DisplayText= this.CurrentViewStep.Title;      
        this.seqItems.push(CompletedItem);
      }

      this.SelectStep(nextStep);      
    }
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
            this.CurrentViewStep = undefined;
            this.CurrentViewStep = selectedStep[0];
          }

        }
        this.calculateSteps();
        this.cdr.detectChanges();
      });
    }
  }

  calculateSteps(){
    let cStep = this.CurrentViewStep?.StepNo;

    if(cStep) {
      this.fStep = cStep > 2 ? cStep - 2 : undefined;
      this.sStep = cStep > 1 ? cStep - 1 : undefined;
      this.foStep = cStep + 1 <= this.TotalSteps ? cStep + 1: undefined;
      this.fiStep = cStep  + 2 <= this.TotalSteps ? cStep + 2: undefined;
    }
  }


}
