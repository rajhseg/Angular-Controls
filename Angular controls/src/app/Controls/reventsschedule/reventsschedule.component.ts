import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { REventsHorizontalItem, REventsHorizontalTimeItems, REventsRenderDateSchedule, REventsRenderObj, REventsRenderChannelItem, REventsRenderSchedules, REventsSchedules, REventsVerticalChannels, RDateAndVerticalChannels } from './reventsschedule';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { WindowHelper } from '../windowObject';
import { setInterval } from 'timers';

@Component({
  selector: 'revents-schedule',
  standalone: true,
  imports: [NgIf, NgForOf, NgStyle],
  templateUrl: './reventsschedule.component.html',
  styleUrl: './reventsschedule.component.css'
})
export class REventsScheduleComponent implements AfterViewInit, OnDestroy {

  @ViewChild('hscroll', { read: ElementRef }) hScroll!: ElementRef;

  @ViewChild('vheader', { read: ElementRef }) vheader!: ElementRef;

  @ViewChild('marker', { read: ElementRef }) marker!: ElementRef;

  private startPos!: number;
  private left!: number;
  private mosDown: boolean = false;
  private _ele!: HTMLElement;
  private _vele!: HTMLElement;
  private markerInterval!: number | undefined;
  private pageInterval!: number | undefined;

  @Input()
  MinutesForEachCell: number = 30;

  @Input()
  Height: string = "350px";

  @Input()
  Width: string = "720px";

  @Input()
  ShowScrollBar: boolean = false;

  EachMinuteInPx: number = 6;

  EachCellInPx: number = this.MinutesForEachCell * this.EachMinuteInPx;
  TotalCellsPerDay: number = (60 / this.MinutesForEachCell) * 24;
  TotalCellWidthInPx: number = this.TotalCellsPerDay * this.EachCellInPx + this.GetBordersCountUptoTargetTimeCell("24:00");

  @Input()
  VerticalHeaderWidth: number = 120;

  private isCurrentDate: boolean = false;

  private _showMarker: boolean = true;

  @Input()
  public set ShowMarker(val: boolean) {
    this._showMarker = val;
    this.checkMarker();    
  }
  public get ShowMarker(): boolean {
    return this._showMarker;
  }

  private _datesList: string[] = [];
  private _selectedDate: string = "";

  @Input()
  public set DisplayDatesOnLoad(val: string[]) {
    this._datesList = val;
    this.NoOfDatesToShowOnHeader = this.DisplayDatesOnLoad.length;
  }
  public get DisplayDatesOnLoad(): string[] {
    return this._datesList;
  }

  @Input()
  public set SelectedDate(val: string) {
    this._selectedDate = val;
    this.isCurrentDate = this.isMatchedWithCurrentDate(val);
    this.checkMarker();
  }
  public get SelectedDate(): string {
    return this._selectedDate;
  }

  @Input()
  VerticalHeaderHeight: number = 50;

  @Input()
  EnableMovePageToCurrentTime: boolean = true;

  RenderOverLappingEvents: boolean = true;

  private _scheduleItems!: REventsSchedules;
  private _renderItems!: REventsRenderSchedules;

  public get DisplaySchedules(): REventsRenderSchedules {
    return this._renderItems;
  }

  @Input()
  public set ScheduleItems(val: REventsSchedules) {
    this._scheduleItems = val;
    this.VerticalChannelsList = {};

    let keys = Object.keys(val);
    let schedules = new REventsRenderSchedules();

    for (let index = 0; index < keys.length; index++) {
      const element = keys[index];
      let dateSchedules = val[element];

      let chList = [];

      let dateSchedule = new REventsRenderDateSchedule();

      let _channelList = [];

      for (let j = 0; j < dateSchedules.ChannelItems.length; j++) {
        const channel = dateSchedules.ChannelItems[j];

        let _vchannel = new REventsVerticalChannels();
        _vchannel.DisplayTitle = channel.ChannelTitle;
        _vchannel.ChannelImageUrl = channel.ChannelImageUrl;
        _vchannel.EventDate = element;
        _vchannel.ValueKey = channel.ValueKey;
        chList.push(_vchannel);

        let _renderChannelItem = new REventsRenderChannelItem();
        _renderChannelItem.ChannelTitle = channel.ChannelTitle;
        _renderChannelItem.ChannelImageUrl = channel.ChannelImageUrl;
        _renderChannelItem.ValueKey = channel.ValueKey;
        _renderChannelItem.CalculateStartAndEndTimeBasedOnDuration = channel.CalculateStartAndEndTimeBasedOnDuration;
        _renderChannelItem.RenderEventsInContinousSequence = channel.RenderEventsInContinousSequence;

        let startTimeinString = "00:00";

        for (let k = 0; k < channel.Events.length; k++) {
          const _event = channel.Events[k];
          let obj = new REventsRenderObj();
          obj.DurationInMinutes = _event.DurationInMinutes;

          if (_renderChannelItem.CalculateStartAndEndTimeBasedOnDuration) {
            obj.StartTime = startTimeinString;
            obj.EndTime = this.AddDurationToTimeString(startTimeinString, _event.DurationInMinutes);
            startTimeinString = obj.EndTime;
          } else {
            obj.StartTime = _event.StartTime;
            obj.EndTime = this.AddDurationToTimeString(_event.StartTime, _event.DurationInMinutes);
          }

          obj.Title = _event.Title;
          obj.WidthInPxForEventCell = this.EachMinuteInPx * _event.DurationInMinutes;
          obj.Value = _event.Value;
          _renderChannelItem.Events.push(obj);
        }

        _renderChannelItem.Events.sort(this.EventsSort);

        if (this.RenderOverLappingEvents) {

          let cellStartingLeftOffset: number = 0;

          let previousObject: REventsRenderObj = new REventsRenderObj();
          previousObject.EndTime = "";
          previousObject.OffsetLeft = 0;

          let minusPx = 0;

          for (let p = 0; p < _renderChannelItem.Events.length; p++) {
            const _evt = _renderChannelItem.Events[p];

            let _min = (cellStartingLeftOffset / 6);
            let _endTime = this.AddDurationToTimeString("00:00", _min);

            let differenceLeft = this.GetOffsetLeftForEvent(_endTime, _evt.StartTime);
            let borders = this.GetBordersCountUptoTargetTimeCell(_evt.StartTime);
            let calcBorder;

            if (differenceLeft < 0) {
              minusPx = minusPx + 2;
            }

            // ContinousSequence Events have 1 side border, others are having 2 side border for each Event
            if (!_renderChannelItem.RenderEventsInContinousSequence) {
              calcBorder = borders - (2 * p) - minusPx - 2; // minusPx is for OverlappingEvents, -1 is for border in vertical header
            } else {
              calcBorder = borders - (2 * p) - 2; // 2 is for borders
            }

            let mergedBorders = 0;
            if (_evt.DurationInMinutes > this.MinutesForEachCell) {
              // if cell takes more than one space, borders are merged that need to be add for each cell
              mergedBorders = this.GetBordersMergedWithInCell(_evt.DurationInMinutes);
            }

            if (!_renderChannelItem.RenderEventsInContinousSequence && p == _renderChannelItem.Events.length - 1) {
              //_evt.OffsetLeft = differenceLeft + calcBorder - _renderChannelItem.Events.length;            
              _evt.OffsetLeft = differenceLeft + calcBorder - 2;
            } else {
              _evt.OffsetLeft = differenceLeft + calcBorder;
            }

            previousObject = _evt;
            cellStartingLeftOffset = cellStartingLeftOffset + _evt.WidthInPxForEventCell;
          }
        }

        _channelList.push(_renderChannelItem);
      }

      dateSchedule.ChannelItems = _channelList;

      this.VerticalChannelsList[element] = chList;

      schedules[element] = dateSchedule;
    }

    this._renderItems = schedules;
  }

  public get ScheduleItems(): REventsSchedules {
    return this._scheduleItems;
  }


  HorizontalHeaders!: REventsHorizontalTimeItems;

  VerticalChannelsList!: RDateAndVerticalChannels;

  DisplayItems!: REventsRenderSchedules;

  DisplayDates: string[] = [];

  @Input()
  NoOfDatesToShowOnHeader: number = 6;

  @Input()
  ContainerBackgroundColor: string = "rgb(35, 206, 236)";

  @Input()
  ContainerBorderColor: string = "#10C4C8";

  @Input()
  ContainerForeColor: string = "white";

  @Input()
  SelectedDateForeColor: string = "white";

  @Input()
  SelectedDateBackgroundColor: string = "#10C4C8";

  @Input()
  MarkerBackgroundColor: string = "blue";

  @Input()
  EventBackgroundColor: string = "rgb(35, 206, 236)";

  @Input()
  EventForeColor: string = "white";

  @Input()
  EventBorderColor: string = "#10C4C8";

  constructor(private winObj: WindowHelper) {
    this.CalculateHorizontalHeaders();

    if (this.DisplayDatesOnLoad.length == 0) {
      this.CalculateDates();
    }

  }

  checkMarker(){
    if (this.isCurrentDate) {
      if (this._showMarker == true) {
        this.clearPage();
        this.renderMarker();
        if (this.markerInterval == undefined && this.winObj.isExecuteInBrowser()) {
          this.markerInterval = window.setInterval(this.renderMarker.bind(this), 60000);
        }
      } else {
        this.clearMarker();        
        if (this.EnableMovePageToCurrentTime && this.pageInterval == undefined && this.winObj.isExecuteInBrowser()) {
          this.movePageToCurrentTime();
          this.pageInterval = window.setInterval(this.movePageToCurrentTime.bind(this), 60000);
        }
      }
    } else {
      this.ResetPageAndMarker();
    }
  }

  getMarkerHeight(date: string): string {
    if (this.VerticalChannelsList[date] != undefined) {
      let count = this.VerticalChannelsList[date].length;
      let height = (count * this.VerticalHeaderHeight) + count;
      return height + 'px';
    } else {
      return this.Height;
    }
  }

  PreviousPage() {

    let startDate = this.DisplayDatesOnLoad[0];
    let parts = startDate.split("-");
    let dt = new Date();
    dt.setDate(parseInt(parts[0]));
    dt.setMonth(parseInt(parts[1]) - 1);
    dt.setFullYear(parseInt(parts[2]));

    let list = this.GenerateDates(dt, -this.NoOfDatesToShowOnHeader);
    this.DisplayDatesOnLoad = list;
    this.SelectedDate = this.DisplayDatesOnLoad[this.DisplayDatesOnLoad.length - 1];
  }

  NextPage() {
    let startDate = this.DisplayDatesOnLoad[this.DisplayDatesOnLoad.length - 1];
    let parts = startDate.split("-");
    let dt = new Date();
    dt.setDate(parseInt(parts[0]));
    dt.setMonth(parseInt(parts[1]) - 1);
    dt.setFullYear(parseInt(parts[2]));

    let list = this.GenerateDates(dt, this.NoOfDatesToShowOnHeader);
    this.DisplayDatesOnLoad = list;
    this.SelectedDate = this.DisplayDatesOnLoad[0];
  }

  GetDateCellWidth(): string {
    let eachWidth = this.TotalCellWidthInPx / this.DisplayDatesOnLoad.length;
    return eachWidth + 'px';
  }
  CalculateDates() {
    let today = new Date();
    let list1 = this.GenerateDates(today, -2);
    let list2 = this.GenerateDates(today, 3);
    let todayString = this.getDate(today, 0);

    let totalList = [...list1, todayString, ...list2];

    this.DisplayDatesOnLoad = totalList;
    this.SelectedDate = todayString;
  }

  Select(dt: string) {
    this.SelectedDate = dt;
    this.isCurrentDate = this.isMatchedWithCurrentDate(dt);
  }

  isSameDate(a: string) {
    let result = this.SelectedDate.toLowerCase() == a.toLowerCase();
    return result;
  }

  GenerateDates(fromDate: Date, addDays: number): string[] {

    let list = [];

    if (addDays < 0) {
      for (let index = addDays; index < 0; index++) {
        let dte = this.getDate(fromDate, index)
        list.push(dte);
      }
    }
    else {
      for (let index = 1; index <= addDays; index++) {
        let dte = this.getDate(fromDate, index)
        list.push(dte);
      }
    }

    return list;
  }

  isMatchedWithCurrentDate(dte: string): boolean {
    let date = new Date();
    let yr = date.getFullYear();
    let mon = date.getMonth() + 1;
    let day = date.getDate();
    let parts = dte.split("-");

    if (parseInt(parts[0]) == day && parseInt(parts[1]) == mon && parseInt(parts[2]) == yr) {
      return true;
    }

    return false;
  }

  getDate(dt: Date, addDays: number): string {
    let date = new Date(new Date().setDate(dt.getDate() + addDays))
    let yr = date.getFullYear();
    let mon = date.getMonth() + 1;
    let day = date.getDate();

    let dateString = this.GetTimeInString(day) + "-" + this.GetTimeInString(mon) + "-" + this.GetTimeInString(yr);
    return dateString;
  }

  renderMarker() {
    let time = new Date();
    let hr = time.getHours();
    let min = time.getMinutes();

    let totalMinutes = (hr * 60) + min;
    let width = (totalMinutes * this.EachMinuteInPx) + ((totalMinutes / this.MinutesForEachCell) * 2); // 2 is for 2 borders
    let leftWidth = this.VerticalHeaderWidth + width;

    if(this.marker){
    let _marker = (this.marker.nativeElement as HTMLElement)
    _marker.style.left = leftWidth + 'px';
    }

    if (this.winObj.isExecuteInBrowser() && this.hScroll) {
      let _scr = this.hScroll.nativeElement as HTMLElement;

      if (_scr)
        _scr.scrollLeft = leftWidth - this.VerticalHeaderWidth - (this.EachCellInPx);
    }
  }

  movePageToCurrentTime() {
    let time = new Date();
    let hr = time.getHours();
    let min = time.getMinutes();

    let totalMinutes = (hr * 60) + min;
    let width = (totalMinutes * this.EachMinuteInPx) + ((totalMinutes / this.MinutesForEachCell) * 2); // 2 is for borders
    let leftWidth = this.VerticalHeaderWidth + width;

    if (this.winObj.isExecuteInBrowser() && this.hScroll) {
      let _scr = this.hScroll.nativeElement as HTMLElement;

      if (_scr)
        _scr.scrollLeft = leftWidth - this.VerticalHeaderWidth - (this.EachCellInPx);
    }
  }

  ResetPageAndMarker(){
    if(this.marker) {
      let _marker = (this.marker.nativeElement as HTMLElement)
      _marker.style.left = 0+'px';
    }

    if (this.winObj.isExecuteInBrowser() && this.hScroll) {
      let _scr = this.hScroll.nativeElement as HTMLElement;

      if (_scr)
        _scr.scrollLeft = 0;
    }
  }

  EventsSort(a: REventsRenderObj, b: REventsRenderObj): number {
    let aDate = '2024/01/01 ' + a.StartTime;
    let bDate = '2024/01/01 ' + b.StartTime;
    return (Date.parse(aDate)) - (Date.parse(bDate));
  }

  GetDifferenceInMinutes(endTime: string, startTime: string): number {
    let aDate = '2024/01/01 ' + endTime;
    let bDate = '2024/01/01 ' + startTime;
    let diff = Math.abs((Date.parse(aDate)) - (Date.parse(bDate)));
    let minutes = Math.floor((diff / 1000) / 60);

    if ((Date.parse(aDate)) > (Date.parse(bDate)))
      return -minutes;
    else
      return minutes;
  }

  GetBordersCountUptoTargetTimeCell(time: string) {
    let parts = time.split(":");
    // 2 is for borders for each cell
    let firstPart = parseInt((parseInt(parts[0]) * (2 * (60 / this.MinutesForEachCell))).toString());
    let secondPart = parseInt((2 * (parseInt(parts[1]) / this.MinutesForEachCell)).toString());

    let totalBorders = firstPart + secondPart;
    return totalBorders;
  }

  GetBordersMergedWithInCell(duration: number) {
    let noOfBorders = (4 * parseInt((duration / this.MinutesForEachCell).toString())) - 4;
    return noOfBorders;
  }

  GetOffsetLeftForEvent(previousEventEndTime: string, currentEventStartTime: string) {
    let min: number = 0;

    if (previousEventEndTime == undefined || previousEventEndTime == "")
      min = this.GetDifferenceInMinutes("00:00", currentEventStartTime);
    else
      min = this.GetDifferenceInMinutes(previousEventEndTime, currentEventStartTime);

    let left = min * this.EachMinuteInPx;

    return left;
  }

  GetOffsetLeftForStartTime(startTime: string): number {
    let parts = startTime.split(":");
    let totalMinutes = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    let left = totalMinutes * this.EachMinuteInPx;
    return left;
  }

  GetTimeInString(time: number): string {
    return time.toString().length == 1 ? "0" + time.toString() : time.toString();
  }

  IsDatePresentInThisCell(fromTime: string, toTime: string, currTime: string) {
    let from = fromTime.split(":");
    let to = toTime.split(":");

    let cur = currTime.split(":");

    if (cur[0] >= from[0] && cur[0] <= to[0] && cur[1] >= from[1] && cur[1] <= to[1]) {
      return true;
    }

    return false;
  }

  AddDurationToTimeString(time: string, duration: number) {
    let start = time.split(":");
    let initnum = duration / 60;
    let remain = duration % 60;

    let second = parseInt(start[1]) + remain;
    let secremain = 0;

    if (second >= 60) {
      initnum = initnum + 1;
      secremain = second - 60;
    }
    else {
      secremain = second;
    }

    let firstPart = parseInt(start[0]) + initnum;

    firstPart = parseInt(firstPart.toString().split(".")[0]);
    let fpart = firstPart.toString().length == 1 ? "0" + firstPart : firstPart;
    let spart = secremain.toString().length == 1 ? "0" + secremain : secremain;

    return fpart + ":" + spart;
  }

  CalculateHorizontalHeaders() {

    let FromDate = (new Date()).setHours(0, 0, 0, 0);

    let ToDate = (new Date()).setHours(23, 59, 59, 999);

    let startTime = new Date(FromDate);
    let endTime = new Date(ToDate);

    let _hdrs = new REventsHorizontalTimeItems();

    while (startTime <= endTime) {
      let _from = this.GetTimeInString(startTime.getHours()) + ":" + this.GetTimeInString(startTime.getMinutes());
      startTime = new Date(startTime.getTime() + (this.MinutesForEachCell * 60 * 1000));
      let _to = this.GetTimeInString(startTime.getHours()) + ":" + this.GetTimeInString(startTime.getMinutes());

      let item = new REventsHorizontalItem();
      item.DisplayTitle = _from + " - " + _to;
      item.WidthInPx = this.EachCellInPx;
      item.FromTime = _from;
      item.ToTime = _to;

      _hdrs.EachCellHeaderItems.push(item);
    }

    this.HorizontalHeaders = _hdrs;
  }

  ngAfterViewInit(): void {
    this._ele = (this.hScroll.nativeElement as HTMLElement);
    this._vele = (this.vheader.nativeElement as HTMLElement);
    this._ele.addEventListener('mousedown', this.startDrag.bind(this), false);
    this._ele.addEventListener('mouseup', this.stopDrag.bind(this), false);
    this._ele.addEventListener('mouseleave', this.stopDrag.bind(this), false);
    this._ele.addEventListener('mousemove', this.dragging.bind(this), false);

    if (this.isCurrentDate) {
      if (this._showMarker) {
        this.renderMarker();
        if (this.markerInterval == undefined && this.winObj.isExecuteInBrowser()) {
          this.markerInterval = window.setInterval(this.renderMarker.bind(this), 30000);
        }
      } else if (this.EnableMovePageToCurrentTime) {
        this.movePageToCurrentTime();
        if (this.pageInterval == undefined && this.winObj.isExecuteInBrowser()) {
          this.pageInterval = window.setInterval(this.movePageToCurrentTime.bind(this), 30000);
        }
      }
    }
  }

  clearMarker() {
    if (this.winObj.isExecuteInBrowser()) {
      window.clearInterval(this.markerInterval);
      this.markerInterval = undefined;
    }
  }

  clearPage() {
    if (this.winObj.isExecuteInBrowser()) {
      window.clearInterval(this.pageInterval);
      this.pageInterval = undefined
    }
  }
  ngOnDestroy(): void {
    this._ele.removeEventListener('mousedown', this.startDrag.bind(this), false);
    this._ele.removeEventListener('mouseup', this.stopDrag.bind(this), false);
    this._ele.removeEventListener('mouseleave', this.stopDrag.bind(this), false);
    this._ele.removeEventListener('mousemove', this.dragging.bind(this), false);

    if (this.winObj.isExecuteInBrowser()) {
      window.clearInterval(this.markerInterval);
      window.clearInterval(this.pageInterval);
    }
  }

  stopDrag(e: Event) {
    this.mosDown = false;
  }

  startDrag(e: MouseEvent) {
    this.mosDown = true;
    this.startPos = e.pageX - this._ele.offsetLeft;
    this.left = this._ele.scrollLeft;
  }

  dragging(e: MouseEvent) {

    e.preventDefault();

    if (!this.mosDown)
      return;
    let _x = e.pageX - this._ele.offsetLeft;
    let scrollpos = _x - this.startPos;
    this._ele.scrollLeft = this.left - scrollpos;

    this._vele.style.position = "sticky";
    this._vele.style.left = "0px";
  }

}
