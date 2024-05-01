import { CommonModule } from "@angular/common";
import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, Directive, DoCheck, ElementRef, HostListener, Input, OnChanges, Output, Renderer2, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BehaviorSubject, Subject } from "rxjs";
import { EventEmitter } from "stream";

@Component({
    selector:'optionTemplate',
    standalone: true,
    template:'<ng-content></ng-content>',
    styles:[`
      
          `]            
})
export class optionTemplate implements AfterViewInit, AfterViewChecked, OnChanges, DoCheck, AfterContentInit
{
    backColor: string = '';
     
    @Input()
    Item: any | null;
    
    @Input()
    IsInitItem: boolean = false;

    clicked = new Subject<optionTemplate>();

    private isSelected: boolean = false;

    @Input()
    set OptionSelected(value: boolean){
      this.isSelected = value;
      
      if(this.eleRef && this.eleRef.nativeElement 
        && typeof this.eleRef.nativeElement.scrollIntoView === 'function') {
          this.eleRef.nativeElement.scrollIntoView();     
        }
    }
    get OptionSelected(): boolean{
      return this.isSelected;
    }

    constructor(public eleRef: ElementRef, private renderer: Renderer2){

    }

  ngAfterContentInit(): void {
    this.eleRef.nativeElement.firstChild.classList.add('dropdown-content-template');
  }

    ngDoCheck(): void {
      if(this.IsInitItem){
        this.eleRef.nativeElement.firstChild.focus();
        this.IsInitItem = false;
      }
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
    
    @HostListener('click', ['$event.target'])
    onClick(target: any) {       
      this.eleRef.nativeElement.focus();   
      this.eleRef.nativeElement.firstChild.classList.add('dropdown-content-selected');      
      this.isSelected = true;
      this.clicked.next(this);
    }

    @HostListener('mouseenter',['$event.target'])
    onMouseOver(target: any){
      this.backColor = this.eleRef.nativeElement.style.backgroundColor;
      this.eleRef.nativeElement.firstChild.classList.add('dropdown-content-selected');      
    }

    scrollIntoElement(){
      this.eleRef.nativeElement.focus();
    }

    @HostListener('mouseleave',['$event.target'])
    onMouseLeave(target: any){
      if(!this.isSelected){
        this.eleRef.nativeElement.firstChild.classList.remove('dropdown-content-selected');         
      }
    }
}