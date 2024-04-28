import { Injectable } from '@angular/core';
import { CalenderComponent } from './calender.component';

@Injectable({
  providedIn: 'root'
})
export class CalenderService {


  calenderList: CalenderComponent[] = [];

  constructor() { }

  AddInstance(instance: CalenderComponent) {
    this.calenderList.push(instance);
  }

  GetAllInstance(): CalenderComponent[] {
    return this.calenderList;
  }

}
