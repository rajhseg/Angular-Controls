import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, output } from '@angular/core';
import { RProgressbarComponent } from '../progressbar/progressbar.component';
import { ProgressBarDisplayType, ProgressBarType } from '../progressbar/progressbarType';
import { WindowHelper } from '../windowObject';
import { interval, Observable } from 'rxjs';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'rtimer',
  standalone: true,
  imports: [NgIf, RProgressbarComponent, NgStyle],
  templateUrl: './rtimer.component.html',
  styleUrl: './rtimer.component.css'
})
export class RTimerComponent implements OnInit, OnDestroy {

  progressDisplayType: ProgressBarDisplayType = ProgressBarDisplayType.Circle;
  ProgressType: ProgressBarType = ProgressBarType.Progress;

  window!: Window;
  windowInterval!: number;
  private hour: number = 0;
  private minute: number = 0;
  private second: number = 0;

  private _trackWidth: number = 5;
  private _circularWidth: number = 50;

  allDisplayTypes = TimerType;

  @Input()
  EnableShadowEffect: boolean = false;

  @Input()
  EnableDisplayText: boolean = true;

  @Input()
  HoursTrackColor: string = "lightgray";

  @Input()
  HoursForeColor: string = "blue";

  @Input()
  MinuteTrackColor: string = "lightgray";

  @Input()
  MinuteForeColor: string = "blue";

  @Input()
  SecondsTrackColor: string = "lightgray";

  @Input()
  SecondsForeColor: string = "blue";

  @Input()
  FlatStyleForeColor: string = "blue";

  @Input()
  DisplayTextForeColor: string = "blue";

  @Input()
  public set TrackWidth(value: number) {
    this._trackWidth = value;
  }
  public get TrackWidth(): string {
    return this._trackWidth + 'px';
  }

  @Input()
  public set CircularWidth(value: number) {
    this._circularWidth = value;
  }
  public get CircularWidth(): string {
    return this._circularWidth + 'px';
  }

  private count: number = 0;

  @Input()
  CallbackAfterCertainSeconds: number = 0;

  @Output()
  CallbackTriggeredAfterCertainSeconds = new EventEmitter<string>();

  @Input()
  DisplayType: TimerType = TimerType.FlatStyle;

  @Output()
  ValueChanged = new EventEmitter<string>();

  public HourPercentage: number = 0;

  public MinutePercentage: number = 0;

  public SecondPercentage: number = 0;

  public set Hour(value: number) {
    this.hour = value;
  }
  public get Hour(): string {

    if (this.hour.toString().length == 1) {
      return "0" + this.hour.toString();
    }

    return this.hour.toString()
  }

  public set Minute(value: number) {
    this.minute = value;
  }
  public get Minute(): string {
    if (this.minute.toString().length == 1) {
      return "0" + this.minute.toString();
    }
    return this.minute.toString()
  }

  public set Second(value: number) {
    this.second = value;
  }
  public get Second(): string {
    if (this.second.toString().length == 1) {
      return "0" + this.second.toString();
    }
    return this.second.toString()
  }

  constructor(private winObj: WindowHelper) {

    if (this.winObj.isExecuteInBrowser())
      this.window = window;

    this.CalculateTime();
  }

  ngOnDestroy(): void {
    if (this.winObj.isExecuteInBrowser()) {
      this.window.clearInterval(this.windowInterval);
    }
  }

  ngOnInit(): void {
    if (this.winObj.isExecuteInBrowser()) {
      this.windowInterval = this.window.setInterval((x: RTimerComponent) => {
        x.count++;
        x.CalculateTime();

        if (x.CallbackAfterCertainSeconds > 0 && x.count >= this.CallbackAfterCertainSeconds) {
          let timeString: string = x.Hour + ":" + x.Minute + ":" + x.Second;
          x.CallbackTriggeredAfterCertainSeconds.emit(timeString);
          x.count = 0;
        }
      }, 1000, this);
    }
  }

  private CalculateTime() {
    let date = new Date();
    let time = date.getTime();

    this.hour = date.getHours();
    this.minute = date.getMinutes();
    this.second = date.getSeconds();

    this.HourPercentage = this.calcPercentage(this.hour, 24);
    this.MinutePercentage = this.calcPercentage(this.minute, 60);
    this.SecondPercentage = this.calcPercentage(this.second, 60);

    let timeString: string = this.Hour + ":" + this.Minute + ":" + this.Second;

    this.ValueChanged.emit(timeString);
  }

  private calcPercentage(value: number, total: number): number {
    let _percentage = parseFloat((value / total).toFixed(2)) * 100;
    return _percentage;
  }
}

export enum TimerType {
  Circle = 0,
  FlatStyle
}
