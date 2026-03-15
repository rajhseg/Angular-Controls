import { Injectable } from '@angular/core';
import { RCalenderComponent } from './rcalender.component';

@Injectable({
  providedIn: 'root'
})
export class RCalenderService {


  calenderList: RCalenderComponent[] = [];

  constructor() { }

  AddInstance(instance: RCalenderComponent) {
    this.calenderList.push(instance);
  }

  GetAllInstance(): RCalenderComponent[] {
    return this.calenderList;
  }

}
