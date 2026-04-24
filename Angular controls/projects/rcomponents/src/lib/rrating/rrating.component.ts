import { NgFor } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild, forwardRef, output, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { RWindowHelper } from '../rwindowObject';
import { startWith } from 'rxjs';
import { RBaseComponent, ValidatorValueType } from '../rmodels/RBaseComponent';

@Component({
  selector: 'rstarrating',
  standalone: true,
  imports: [NgFor],
  templateUrl: './rrating.component.html',
  styleUrl: './rrating.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    {
      provide:NG_VALUE_ACCESSOR,
      useExisting:forwardRef(()=> RStarRatingComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RStarRatingComponent),
      multi: true
    },
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => RStarRatingComponent),
      multi: true
    }
  ]
})
export class RStarRatingComponent extends RBaseComponent<number> implements OnInit, AfterViewInit, ControlValueAccessor {
  
  _ratingValue: number = 0;
  _starwidth: number = 20;
  _starColor: string = 'orange';
  _noOfStars: number = 10;

  Items: number[] = [];

  private onChange: any = ()=>{};
  private onTouch: any = ()=> {};

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
    this.valueChanged.emit(value);
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


  constructor(winObj: RWindowHelper, private cdr: ChangeDetectorRef){
    super(winObj);
  }

  ngOnInit(): void {    
    this.Items = [];
    for(let i=1; i<=this._noOfStars; i++){
      this.Items.push(i);
    }
  }

  protected override IsValidatorSupported(): boolean {
    return true;
  }
  
  protected override GetValidatorValueType(): ValidatorValueType {
    return ValidatorValueType.Range;
  }

  protected override getValue() {
    return this._ratingValue;
  }

  ngAfterViewInit(): void {            
    this.renderUI();
  }

  @ViewChild('starcontrol') starControl!: ElementRef;

  @ViewChild('starcontainer') container!: ElementRef;

  @ViewChild('star',{static: true}) star!: ElementRef;

  @ViewChild('staroutline', {static: true }) staroutline!: ElementRef;

  @ViewChild('staroutlinecontainer') starOutlineContainer!: ElementRef;

  private getWidth(starWidth: number): number{
    if(this._ratingValue!=undefined && this._ratingValue!=null) {
    let intellisenseValue = this._ratingValue;
    let decimalArray = this._ratingValue.toString().split('.');
    let intVal: number = 0;

    if(decimalArray.length > 1){
      let val = decimalArray[1][0];
      
      intVal = parseInt(val);
     
      if(intVal>0 && intVal<4){
        intVal = 3
      }

      if(intVal >3 && intVal < 7){
        intVal = 4;
      }

      if(intVal>6 && intVal<=9){
        intVal = 6
      }

      intellisenseValue = parseFloat(decimalArray[0].toString()+'.'+intVal.toString());
    }

    let wd = Math.round( (starWidth*this.noOfStars) * (intellisenseValue/this.noOfStars));
    
    /* Below section is for render decimal value */
    if(intVal > 0){

      let fullValue = parseInt(decimalArray[0].toString());
      fullValue = fullValue + 1;

      let fullLength = Math.round((starWidth * this.noOfStars) * (fullValue/this.noOfStars))

      let remValu = fullLength - wd;

      let starHalfValue = parseFloat("1."+ (intVal + 2).toString());

      if(remValu < starWidth/2){
        let minusValue = remValu - (starWidth/starHalfValue);

        wd = Math.round(wd + minusValue);
      }
    }

    return wd;
    
  }

    return 0;
  }

  getMainContainerWidth(): number {
    
    let starWidth = this.getSingleStarWidth();
    let val = this.noOfStars
    
    if(val!=undefined && val!=null) {
      let wd = Math.round(starWidth * this.noOfStars);
      return wd;
    }

    return 0;
  }

  private getSingleStarWidth(): number {

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
    this.valueChanged.emit(this.ratingValue);      
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this._formDisabled = isDisabled ? true : null;
  }  

  renderUI(){
    const _singleStarwidth = this.getSingleStarWidth();
    const totalStarsWidth = Math.round(_singleStarwidth * this.noOfStars);
    const containerWidth = this.getWidth(_singleStarwidth);

    if (this.starControl && this.starControl.nativeElement) {
      this.starControl.nativeElement.style.width = totalStarsWidth + 'px';
    }

    if (this.starOutlineContainer && this.starOutlineContainer.nativeElement) {
      this.starOutlineContainer.nativeElement.style.width = totalStarsWidth + 'px';
      this.starOutlineContainer.nativeElement.style.display = 'inline-block';
      this.starOutlineContainer.nativeElement.style.zIndex = '1';
    }

    if (this.container && this.container.nativeElement) {
      this.container.nativeElement.style.position = 'absolute';
      this.container.nativeElement.style.left = '0px';
      this.container.nativeElement.style.top = '0px';
      this.container.nativeElement.style.width = containerWidth + 'px';
      this.container.nativeElement.style.display = 'block';
      this.container.nativeElement.style.zIndex = '2';
    }
  }

  private RenderUIAfterRatingValueChanged(){
    if(this.container!=undefined){
      this.renderUI();
      this.cdr.detectChanges();
    }
  }

  selected(value:number){
    
    if(this.IsReadOnly || this.IsDisabled)
      return;

    this.ratingValue = value;    
  }

}
