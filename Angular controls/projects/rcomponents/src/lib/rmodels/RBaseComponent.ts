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
        return this.propValidator.getValidLabel(value);
    }

    ValidNumber(value: number) :  number {
        return this.propValidator.getValidNumber(value);
    }

    ValidColor(value: any) : string {
        return this.propValidator.getValidColor(value);
    }

    ValidSize(value: string): string {
        return this.propValidator.getValidSize(value);
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
        return this.propValidator.getValidLabel(value);
    }

    ValidNumber(value: number) :  number {
        return this.propValidator.getValidNumber(value);
    }

    ValidColor(value: any) : string {
        return this.propValidator.getValidColor(value);
    }

    ValidSize(value: string): string {
        return this.propValidator.getValidSize(value);
    }
}

export class CalenderChangeMonthInfo{
  constructor(public Year: number, public Month: number){

  }
}