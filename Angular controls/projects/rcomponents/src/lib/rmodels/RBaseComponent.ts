import { Directive, ElementRef, EventEmitter, HostBinding, inject, Output } from "@angular/core";
import { RWindowHelper } from "../rwindowObject";
import { InputPropValidator } from "../rcss-units.service";

@Directive()
export abstract class RBaseComponent<T> {

    Id: string = '';

    @HostBinding('id')
    HostElementId: string = '';
    
    @Output()
    valueChanged = new EventEmitter<T>();

    protected propValidator: InputPropValidator = inject(InputPropValidator);

    ValidDataForAnyType(value: any): any {
        return this.propValidator.getValidAny(value);
    }

    ValidObject(value: any): any {
        return this.propValidator.getValidObject(value);
    }

    ValidObjectArray(value: any[]): any[] {
        return this.propValidator.getValidObjectArray(value);
    }

    ValidBoolean(value: any): boolean {
        return this.propValidator.getValidBoolean(value);
    }

    ValidEnum(value: any, enumType: any) : any {
        return this.propValidator.getValidateEnum(value, enumType);
    }

    ValidLabel(value: string) : string {
        return this.propValidator.getValidLabel(value);
    }

    ValidNumber(value: number) :  number {
        return this.propValidator.getValidNumber(value);
    }

    ValidColor(value: string) : string {
        return this.propValidator.getValidColor(value);
    }

    ValidColors(value: string[]): string[] {
        return this.propValidator.getValidColors(value);
    }

    ValidColorOrColors(value: string | string[]) : string | string[] {
        return this.propValidator.getValidColorOrColors(value);
    }

    ValidNumbersArray(value: number[]) : number[] {
        return this.propValidator.getValidNumberOrNumbers(value);
    }
    
    ValidSize(value: string): string {
        return this.propValidator.getValidSize(value);
    }

    ValidLabelArray(value: string[]): string[] {
        return this.propValidator.getValidStringArray(value);
    }

    ValidLabelOrLabelArray(value: string | string[]): string | string [] {
        return this.propValidator.getValidStringOrStringArray(value);
    }

    constructor(protected winObj: RWindowHelper) {
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();
    }

}

@Directive()
export abstract class RChartBaseComponent {

    protected propValidator: InputPropValidator = inject(InputPropValidator);
    
    ValidDataForAnyType(value: any): any {
        return this.propValidator.getValidAny(value);
    }

    ValidObject(value: any): any {
        return this.propValidator.getValidObject(value);
    }

    ValidObjectArray(value: any[]): any[] {
        return this.propValidator.getValidObjectArray(value);
    }
    
    ValidBoolean(value: any): boolean {
        return this.propValidator.getValidBoolean(value);
    }

    ValidEnum(value: any, enumType: any) : any {
        return this.propValidator.getValidateEnum(value, enumType);
    }

    ValidLabel(value: string) : string {
        return this.propValidator.getValidLabel(value);
    }

    ValidNumber(value: number) :  number {
        return this.propValidator.getValidNumber(value);
    }

    ValidColor(value: string) : string {
        return this.propValidator.getValidColor(value);
    }

    ValidColors(value: string[]): string[] {
        return this.propValidator.getValidColors(value);
    }

    ValidColorOrColors(value: string | string[]) : string | string[] {
        return this.propValidator.getValidColorOrColors(value);
    }

    ValidNumbersArray(value: number[]) : number[] {
        return this.propValidator.getValidNumberOrNumbers(value);
    }
    
    ValidSize(value: string): string {
        return this.propValidator.getValidSize(value);
    }

    ValidLabelArray(value: string[]): string[] {
        return this.propValidator.getValidStringArray(value);
    }

    ValidLabelOrLabelArray(value: string | string[]): string | string [] {
        return this.propValidator.getValidStringOrStringArray(value);
    }
}

export class CalenderChangeMonthInfo{
  constructor(public Year: number, public Month: number){

  }
}