import { Injectable } from '@angular/core';
import { RDropdownComponent } from './rdropdown.component';

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

  RemoveInstance(instance: RDropdownComponent) {
    const index = this.ddList.findIndex(x => x === instance || (x.Id && x.Id === instance.Id));
    if (index > -1) {
      this.ddList.splice(index, 1);
    }
  }
}
