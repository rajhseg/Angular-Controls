import { AfterContentInit, Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { RStepViewDirective } from './rsteptemplate.directive';

@Component({
  selector: 'rstep',
  standalone: true,
  imports: [],
  templateUrl: './rstep.component.html',
  styleUrl: './rstep.component.css'
})
export class RStepComponent implements AfterContentInit {

  public StepNo: number = -1;
  
  @Input()
  public Title: string = "";

  @Input()
  public IsStepValid: boolean = false;

  @Input()
  public DisplayTextForNextButton: string = "Next";

  @Input()
  public DisplayTextForBackButton: string = "Back";

  @Input()
  public dir!: RStepViewDirective;

  private _instanceContext: object = {};

  @Input()
  public set InstanceContext(value: object) {
    this._instanceContext = {
      $implicit: value
    };
  }

  public get InstanceContext(): object {
    return this._instanceContext;
  }

  @ContentChild(RStepViewDirective, {read: TemplateRef<any> }) Content!: TemplateRef<any>;

  constructor(){

  }

  ngAfterContentInit(): void {
    
  }

}




export enum RStateAlignment {
  OnTop = 0,
  OnLeft = 1
}

export enum RStateDisplayType {
  OnlyCompleted = 0,
  AllItems = 1
}