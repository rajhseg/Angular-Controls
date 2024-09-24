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

  @ContentChild(RStepViewDirective, {read: TemplateRef<any> }) Content!: TemplateRef<any>;

  constructor(){

  }

  ngAfterContentInit(): void {
    console.log("StepComponent "+this.Title);
    console.log(this.Content);
  }

}
