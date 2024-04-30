import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalenderComponent } from './Controls/Calender/calender.component';
import { DropdownComponent } from './Controls/dropdown/dropdown.component';
import { DropdownModel } from './Controls/dropdown/dropdownmodel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgFor } from '@angular/common';
import { optionTemplate } from './Controls/dropdown/optiontemplate.component';
import { RatingComponent } from './Controls/rating/rating.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalenderComponent, DropdownComponent, FormsModule, ReactiveFormsModule,
    NgFor,JsonPipe, 
    optionTemplate, RatingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angularcontrols';
  items: DropdownModel[] = [];
  selItem: any = null;
  starWidth: number = 40;
  starValue: number = 2.4;
  curDate!: string;

  constructor(){  
    this.items.push(new DropdownModel("0", "Jan"));
    this.items.push(new DropdownModel("1", "Feb"));
    this.items.push(new DropdownModel("2", "Mar"));
    this.items.push(new DropdownModel("4", "Apr"));
    this.items.push(new DropdownModel("5", "May"));
    this.items.push(new DropdownModel("6", "Jun"));
    this.items.push(new DropdownModel("7", "Jly"));
    this.items.push(new DropdownModel("8", "Aug"));
    this.items.push(new DropdownModel("9", "Sep"));

    this.selItem = this.items[5];
    this.curDate = "";
  }

  dateSelected($evt: any){
    console.log($evt);
  }
}
