import { Directive, ElementRef, EventEmitter, HostBinding, inject, Input, Output } from "@angular/core";
import { RWindowHelper } from "../rwindowObject";
import { RSplitterType } from "../rsplitter/rpagecontent.directive";

@Directive()
export abstract class RBaseComponent<T> {

    Id: string = '';

    @HostBinding('id')
    HostElementId: string = '';
    
    @Output()
    valueChanged = new EventEmitter<T>();

    @Input()
    FontFamily: string = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";

    @Input()
    ErrorIndicatorColor: string = "red";

    @Input()
    IsReadOnly: boolean = false;

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

export class RRangeSliderData {
    
    public FromValue: number | undefined = undefined;

    public ToValue: number | undefined = undefined;
    
    constructor(_fromValue: number | undefined, _toValue: number | undefined) {
        this.FromValue = _fromValue;
        this.ToValue = _toValue;
    }

}

export class RSplitterResult {

    SplitterType: RSplitterType = RSplitterType.Vertical;

    SplitterId: string = '';

    PreviousPanelSize: string = '';

    NextPanelSize: string = '';

    SplitterPosition: number = 0;

    PreviousPanelId: string = '';

    NextPanelId: string = '';

    constructor(_splitterId: string, _splitterType: RSplitterType, _previousPanelSize: string, _nextPanelSize: string,
         _splitterPosition: number, _previousPanelId: string, _nextPanelId: string
    ) {
        this.SplitterId = _splitterId;
        this.SplitterType = _splitterType;
        this.PreviousPanelSize = _previousPanelSize;
        this.NextPanelSize = _nextPanelSize;
        this.SplitterPosition = _splitterPosition;
        this.PreviousPanelId = _previousPanelId;
        this.NextPanelId = _nextPanelId;
    }
}