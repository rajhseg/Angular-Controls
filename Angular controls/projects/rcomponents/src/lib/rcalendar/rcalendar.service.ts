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

  RemoveInstance(instance: RCalendarComponent) {
    let _index = this.calenderList.findIndex(x=>x==instance);
    if(_index > -1){
      this.calenderList.splice(_index, 1);
    }
  }

}
