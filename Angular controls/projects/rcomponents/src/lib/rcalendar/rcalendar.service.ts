import { Injectable } from '@angular/core';
import { RCalendarComponent } from './rcalendar.component';

@Injectable({
  providedIn: 'root'
})
export class RCalenderService {


  calenderList: RCalendarComponent[] = [];

  constructor() { }

  AddInstance(instance: RCalendarComponent) {
    this.calenderList.push(instance);
  }

  GetAllInstance(): RCalendarComponent[] {
    return this.calenderList;
  }

}
