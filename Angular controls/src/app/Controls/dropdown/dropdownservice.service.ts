import { Injectable } from '@angular/core';
import { RDropdownComponent } from './dropdown.component';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  ddList: RDropdownComponent[] = [];

  constructor() { }

  AddInstance(instance: RDropdownComponent) {
    this.ddList.push(instance);
  }

  GetAllInstance(): RDropdownComponent[] {
    return this.ddList;
  }
}
