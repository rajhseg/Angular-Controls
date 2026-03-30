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

    
    ValidLabel(value: string) : string {
        return this.propValidator.sanitizeLabel(value);
    }

    ValidNumber(value: number) :  number {
        return this.propValidator.isValidSizeInNumber(value) ? value : 0;
    }

    ValidColor(value: string) : string {
        return this.propValidator.isValidColor(value) ? value : 'black';
    }

    ValidSize(value: string): string {
        return this.propValidator.isValidSize(value) ? value : 'auto';
    }

    constructor(protected winObj: RWindowHelper) {
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();
    }

}

@Directive()
export abstract class RChartBaseComponent {

    protected propValidator: InputPropValidator = inject(InputPropValidator);

    ValidLabel(value: string) : string {
        return this.propValidator.sanitizeLabel(value);
    }

    ValidNumber(value: number) :  number {
        return this.propValidator.isValidSizeInNumber(value) ? value : 0;
    }

    ValidColor(value: any) : string {
        return this.propValidator.isValidColor(value) ? value : 'black';
    }

    ValidSize(value: string): string {
        return this.propValidator.isValidSize(value) ? value : 'auto';
    }
}

export class CalenderChangeMonthInfo{
  constructor(public Year: number, public Month: number){

  }
}