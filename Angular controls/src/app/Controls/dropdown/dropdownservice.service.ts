import { Injectable } from '@angular/core';
import { DropdownComponent } from './dropdown.component';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  ddList: DropdownComponent[] = [];

  constructor() { }

  AddInstance(instance: DropdownComponent) {
    this.ddList.push(instance);
  }

  GetAllInstance(): DropdownComponent[] {
    return this.ddList;
  }
}
