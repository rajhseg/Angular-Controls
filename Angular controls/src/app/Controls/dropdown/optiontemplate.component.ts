import { CommonModule } from "@angular/common";
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, Directive, DoCheck, ElementRef, HostListener, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject, Subject } from "rxjs";
import { EventEmitter } from "stream";
import { WindowHelper } from "../windowObject";

@Component({
    selector:'optionTemplate',
    standalone: true,
    styleUrl: './optiontemplate.component.css',
    template:'<ng-content></ng-content>'    
})
export class optionTemplate implements AfterViewInit, AfterViewChecked, OnChanges, DoCheck, AfterContentInit
{
    backColor: string = '';
    Id: string = '';

    @Input()
    Item: any | null;

    @Input()
    IsInitItem: boolean = false;

    clicked = new Subject<optionTemplate>();

    private isSelected: boolean = false;

    @Input()
    set OptionSelected(value: boolean){
      this.isSelected = value;

      if(this.isSelected && this.eleRef && this.eleRef.nativeElement
        && typeof this.eleRef.nativeElement.scrollIntoView === 'function') {
           // this.scrollIntoViewElement();
        }
    }
    get OptionSelected(): boolean{
      return this.isSelected;
    }

    constructor(public eleRef: ElementRef, private renderer: Renderer2, private htmlHelper: WindowHelper){
      this.Id = this.htmlHelper.GenerateUniqueId();
    }

    ngAfterContentInit(): void {
      (this.eleRef.nativeElement as HTMLDivElement).id = this.Id;
      this.eleRef.nativeElement.firstChild.classList.add('dropdown-content-template');
    }

    ngDoCheck(): void {
      if(this.IsInitItem){
        this.eleRef.nativeElement.firstChild.focus();
        this.IsInitItem = false;
      }
    }

    focusElement(){
      this.eleRef.nativeElement.firstChild.focus();
    }

    scrollIntoViewElement(){
      this.eleRef.nativeElement.firstChild.scrollIntoView();
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    ngAfterViewChecked(): void {

    }

    ngAfterViewInit(): void {
      if(this.isSelected){
        this.eleRef.nativeElement.firstChild.focus();
        this.eleRef.nativeElement.firstChild.classList.add('dropdown-content-selected');
        this.clicked.next(this);
      }
    }

    @HostListener('click', ['$event'])
    onClick(target: any) {
      this.eleRef.nativeElement.focus();
      this.eleRef.nativeElement.firstChild.classList.add('dropdown-content-selected');
      this.isSelected = true;
      this.clicked.next(this);
    }

    @HostListener('mouseenter',['$event'])
    onMouseOver(target: any){
      this.backColor = this.eleRef.nativeElement.style.backgroundColor;
      this.eleRef.nativeElement.firstChild.classList.add('dropdown-content-selected');
    }

    scrollIntoElement(){
      this.eleRef.nativeElement.focus();
    }

    @HostListener('mouseleave',['$event'])
    onMouseLeave(target: any){
      if(!this.isSelected){
        this.eleRef.nativeElement.firstChild.classList.remove('dropdown-content-selected');
      }
    }
}
