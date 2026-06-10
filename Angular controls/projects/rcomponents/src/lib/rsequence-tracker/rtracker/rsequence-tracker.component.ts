import { Component, ContentChild, Input, TemplateRef } from "@angular/core";
import { RTrackerContentDirective } from "./rtrackercontent.directive";


@Component({  
    selector: 'rsequencetracker',
    standalone: true,
    imports: [RTrackerContentDirective],
    templateUrl: './rsequence-tracker.component.html',
    styleUrl: './rsequence-tracker.component.css'
})
export class RSequenceTrackerComponent {

    @Input()
    public StepNo: number = -1;

    @Input()
    public Height: string = '100px';
      
    @ContentChild(RTrackerContentDirective, {read: TemplateRef<any> }) Content!: TemplateRef<any>;
    
}