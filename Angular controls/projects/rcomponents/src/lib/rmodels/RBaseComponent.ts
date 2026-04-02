import { Directive, ElementRef, EventEmitter, HostBinding, inject, Output } from "@angular/core";
import { RWindowHelper } from "../rwindowObject";

@Directive()
export abstract class RBaseComponent<T> {

    Id: string = '';

    @HostBinding('id')
    HostElementId: string = '';
    
    @Output()
    valueChanged = new EventEmitter<T>();

    constructor(protected winObj: RWindowHelper) {
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();
    }

}

@Directive()
export abstract class RChartBaseComponent {

}

export class CalenderChangeMonthInfo{
  constructor(public Year: number, public Month: number){

  }
}