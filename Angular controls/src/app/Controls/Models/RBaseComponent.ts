import { Directive, ElementRef, EventEmitter, HostBinding, Output } from "@angular/core";
import { WindowHelper } from "../windowObject";

@Directive()
export abstract class RBaseComponent<T> {

    Id: string = '';

    @HostBinding('id')
    HostElementId: string = this.winObj.GenerateUniqueId();
    
    @Output()
    valueChanged = new EventEmitter<T>();

    constructor(protected winObj: WindowHelper) {
        this.Id = this.winObj.GenerateUniqueId();
    }

}

export class CalenderChangeMonthInfo{
  constructor(public Year: number, public Month: number){

  }
}