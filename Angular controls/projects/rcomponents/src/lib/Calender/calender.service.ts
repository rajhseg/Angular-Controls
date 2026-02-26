import { Injectable } from '@angular/core';
import { RCalenderComponent } from './calender.component';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {


  calenderList: RCalenderComponent[] = [];

  constructor() { }

  AddInstance(instance: RCalenderComponent) {
    this.calenderList.push(instance);
  }

  GetAllInstance(): RCalenderComponent[] {
    return this.calenderList;
  }

}
