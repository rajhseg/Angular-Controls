import { NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild, forwardRef, output, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'starrating',
  standalone: true,
  imports: [NgFor],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:forwardRef(()=> RatingComponent),
      multi: true
    }
  ]
})
export class RatingComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  
  _ratingValue: number = 3.4;
  _starwidth: number = 20;
  _starColor: string = 'orange';
  _noOfStars: number = 10;

  Items: number[] = [];

  onChange: any = ()=>{};
  onTouch: any = ()=> {};
  onRatingValueChanged = output<number>();

  @Input()
  set noOfStars(value: number){
    this._noOfStars = value;
    this.Items = [];

    for(let i=1; i<=this._noOfStars; i++){
      this.Items.push(i);
    }
    this.RenderUIAfterRatingValueChanged();
  }
  get noOfStars(): number{
    return this._noOfStars;
  }

  set ratingValue(value: number) {
    this._ratingValue = value; 
    this.RenderUIAfterRatingValueChanged();   
  }
  get ratingValue(): number {
    return this._ratingValue;
  }

  @Input()
  set starColor(value: string){
    this._starColor = value;
    this.RenderUIAfterRatingValueChanged();
  }
  get starColor(): string {
    return this._starColor;
  }

  @Input()
  set starWidth(value: number){
    this._starwidth = value;
    this.RenderUIAfterRatingValueChanged();
  }
  get starWidth(): number {
    return this._starwidth;
  }

  ngOnInit(): void {    
    this.Items = [];
    for(let i=1; i<=this._noOfStars; i++){
      this.Items.push(i);
    }
  }

  ngAfterViewInit(): void {            
    this.renderUI();
  }

  @ViewChild('starcontrol') starControl!: ElementRef;

  @ViewChild('starcontainer') container!: ElementRef;

  @ViewChild('star',{static: true}) star!: ElementRef;

  @ViewChild('staroutline', {static: true }) staroutline!: ElementRef;

  @ViewChild('staroutlinecontainer') starOutlineContainer!: ElementRef;

  getWidth(starWidth: number): number{
    let wd = Math.round( (starWidth*this.noOfStars) * Math.round(this._ratingValue/this.noOfStars));
    return wd;
  }
  
  writeValue(obj: any): void {
    this.ratingValue = obj;
    this.onRatingValueChanged.emit(obj);
    this.onChange(this.ratingValue);
    this.onTouch(this.ratingValue);    
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }  

  renderUI(){

    let containerWidth= this.getWidth(this._starwidth);
    this.starControl.nativeElement.style.width = this._starwidth * this.noOfStars + 'px';
    
    console.log(this._starwidth);
    console.log(this._ratingValue);
    console.log(containerWidth);

    this.container.nativeElement.style.width = containerWidth+'px';
    this.container.nativeElement.style.display = 'inline-block';         
    
    this.starOutlineContainer.nativeElement.style.left = -containerWidth + 'px';
    this.starOutlineContainer.nativeElement.style.top = "0px";
    
    this.starOutlineContainer.nativeElement.style.display = 'inline-block';  
  }

  RenderUIAfterRatingValueChanged(){
    if(this.container!=undefined){
      this.renderUI();
    }
  }

}
