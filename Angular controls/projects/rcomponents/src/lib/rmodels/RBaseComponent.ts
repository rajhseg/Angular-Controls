import { Directive, ElementRef, EventEmitter, HostBinding, inject, Input, Output } from "@angular/core";
import { RWindowHelper } from "../rwindowObject";

@Directive()
export abstract class RBaseComponent<T> {

    Id: string = '';

    @HostBinding('id')
    HostElementId: string = '';
    
    @Output()
    valueChanged = new EventEmitter<T>();

    @Input()
    FontFamily: string = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    constructor(protected winObj: RWindowHelper) {
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();
    }

}

@Directive()
export abstract class RChartBaseComponent {

    Id: string = '';

    @HostBinding('id')
    HostElementId: string = '';
    
    @Input()
    FontFamily: string = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    constructor(protected winObj: RWindowHelper){
        this.Id = this.winObj.GenerateUniqueId();
        this.HostElementId = this.winObj.GenerateUniqueId();
    }

}

export class CalenderChangeMonthInfo{
  constructor(public Year: number, public Month: number){

  }
}

export class RTimerResult {
    
    public Hour!: string;

    public Minute!: string;

    public Seconds!: string;

    constructor(_hour: string, _minute: string, _seconds: string) {
        this.Hour = _hour;
        this.Minute = _minute;
        this.Seconds = _seconds;
    }
}