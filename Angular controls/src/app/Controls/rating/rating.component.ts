import { NgFor } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild, forwardRef, output, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { WindowHelper } from '../windowObject';

@Component({
  selector: 'rstarrating',
  standalone: true,
  imports: [NgFor],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.css',
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:forwardRef(()=> RStarRatingComponent),
      multi: true
    }
  ]
})
export class RStarRatingComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  
  _ratingValue: number = 0;
  _starwidth: number = 20;
  _starColor: string = 'orange';
  _noOfStars: number = 10;

  Items: number[] = [];

  onChange: any = ()=>{};
  onTouch: any = ()=> {};

  @Output()
  onRatingValueChanged =new EventEmitter<number>(); // output<number>();

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
    this.onChange(value);
    this.onTouch(value);
    this.onRatingValueChanged.emit(value);
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

  Id: string = '';

  @HostBinding('id')
  HostElementId: string = this.winObj.GenerateUniqueId();

  constructor(private winObj: WindowHelper){
    this.Id = this.winObj.GenerateUniqueId();
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
    if(this._ratingValue!=undefined && this._ratingValue!=null) {
    let intellisenseValue = this._ratingValue;
    let decimalArray = this._ratingValue.toString().split('.');

    if(decimalArray.length > 1){
      let val = decimalArray[1][0];
      let intVal = parseInt(val);
      if(intVal>0 && intVal<4){
        intVal = 3
      }

      if(intVal>6 && intVal<=9){
        intVal = 6
      }

      intellisenseValue = parseFloat(decimalArray[0].toString()+'.'+intVal.toString());
    }

    let wd = Math.round( (starWidth*this.noOfStars) * (intellisenseValue/this.noOfStars));
    return wd;
    
  }

    return 0;
  }

  getSingleStarWidth(): number {

    if(this.winObj.isExecuteInBrowser()) {
      let starOuts : any = document.getElementsByClassName('staroutline');

      if(starOuts && starOuts.length>0){
        return starOuts[0].offsetWidth;
      }
    }

    return this.starWidth*(83.25/100);
  }
  
  writeValue(obj: any): void {
    this.ratingValue = obj;
    
    this.onRatingValueChanged.emit(this.ratingValue);      
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
    let _singleStarwidth = this.getSingleStarWidth();
    let containerWidth= this.getWidth(_singleStarwidth);
    this.starControl.nativeElement.style.width = (_singleStarwidth * this.noOfStars) + 'px';
    
    this.container.nativeElement.style.width = containerWidth+'px';
    this.container.nativeElement.style.display = 'inline-block';         
    
    //this.starOutlineContainer.nativeElement.style.left = -containerWidth + 'px';
    //this.starOutlineContainer.nativeElement.style.top = "-3px";
        
    this.starOutlineContainer.nativeElement.style.display = 'inline-block';  
    this.starOutlineContainer.nativeElement.style.left =  '0px';
  }

  RenderUIAfterRatingValueChanged(){
    if(this.container!=undefined){
      this.renderUI();
    }
  }

  selected(value:number){
    this.ratingValue = value;    
  }

}
