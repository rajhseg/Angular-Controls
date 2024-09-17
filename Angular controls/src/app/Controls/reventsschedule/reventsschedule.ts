


export class REvent {
    constructor(public StartTime: string, public DurationInMinutes: number, public Title: string, public Value: object) {
        if (StartTime != "") {
            let start = StartTime.split(":");

            let first = start[0].length == 1 ? "0" + start[0] : start[0];
            let second = start[1].length == 1 ? "0" + start[1] : start[1];

            this.StartTime = first + ":" + second;
        }
    }
}

export class REventChannelItem {

    public Events: REvent[] = [];

    public ChannelTitle: string = "";

    public ChannelImageUrl: string = "";

    public ValueKey: object = {};

    public RenderEventsInContinousSequence: boolean = false;

    public CalculateStartAndEndTimeBasedOnDuration: boolean = false;

    // public EventDate: string = "";

    constructor() {
        // this.EventDate = eventDate;
    }
}

export class REventsDateSchedule {

    public ChannelItems: REventChannelItem[] = [];

    // public EventDate: string = "";

}

export class REventsSchedules {
    [Dates: string]: REventsDateSchedule;
}

export class REventsRenderObj {

    private _startTime: string = "";
    private _endTime: string = "";

    public set StartTime(val: string) {
        this._startTime = this.RenderTime(val);
    }
    public get StartTime(): string {
        return this._startTime;
    }

    public set EndTime(val: string) {
        this._endTime = this.RenderTime(val);
    }
    public get EndTime(): string {
        return this._endTime;
    }

    public DurationInMinutes: number = 0;

    public WidthInPxForEventCell: number = 0;

    public Title: string = "";

    public Value: object = {};

    public OffsetLeft!: number;

    private RenderTime(time: string) {

        if (time == "")
            return time;

        let start = time.split(":");

        let first = start[0].length == 1 ? "0" + start[0] : start[0];
        let second = start[1].length == 1 ? "0" + start[1] : start[1];

        let _time = first + ":" + second;

        return _time;
    }
}


export class REventsRenderChannelItem {

    public Events: REventsRenderObj[] = [];

    public ChannelTitle: string = "";

    public ChannelImageUrl: string = "";

    public ValueKey: object = {};

    // public EventDate: string = "";

    public RenderEventsInContinousSequence: boolean = false;

    public CalculateStartAndEndTimeBasedOnDuration: boolean = false;

    constructor() {
        // this.EventDate = eventDate;
    }
}


export class REventsRenderDateSchedule {

    public ChannelItems: REventsRenderChannelItem[] = [];

    // public EventDate: string = "";

}

export class REventsRenderSchedules {
    [Dates: string]: REventsRenderDateSchedule;
}

export class REventsVerticalChannels {

    public DisplayTitle: string = "";

    public ChannelImageUrl: string = "";

    public ValueKey: object = {};

    public EventDate: string = "";

}

export class RDateAndVerticalChannels {
    [Date: string]: REventsVerticalChannels[];
}

export class REventsHorizontalItem {

    public DisplayTitle: string = "";

    public WidthInPx: number = 0;

    public FromTime: string = "";

    public ToTime: string = "";
}

export class REventsHorizontalTimeItems {
    EachCellHeaderItems: REventsHorizontalItem[] = [];
}