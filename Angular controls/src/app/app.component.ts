import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalenderComponent } from './Controls/Calender/calender.component';
import { DropdownComponent } from './Controls/dropdown/dropdown.component';
import { DropdownModel } from './Controls/dropdown/dropdownmodel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgFor } from '@angular/common';
import { optionTemplate } from './Controls/dropdown/optiontemplate.component';
import { RatingComponent } from './Controls/rating/rating.component';
import { SwitchComponent } from './Controls/switch/switch.component';
import { ProgressbarComponent } from './Controls/progressbar/progressbar.component';
import { ProgressBarDisplayType, ProgressBarType } from './Controls/progressbar/progressbarType';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CalenderComponent, SwitchComponent,
    DropdownComponent, FormsModule, ReactiveFormsModule, ProgressbarComponent,
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
  starValue: number = 2.7;
  curDate!: string;
  isChecked: boolean = true;
  proincenter: boolean = false;
  IsStraightLineProgressBar: boolean = true;
  IsInfiniteProgressBar: boolean = true;
  progressDisplayType: ProgressBarDisplayType = ProgressBarDisplayType.Circle;
  progressType:ProgressBarType = ProgressBarType.Infinite;

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

  switchChange(val:boolean){
    this.proincenter =val;
  }

  movetocenter(){
    this.proincenter = !this.proincenter;
  }

  changeToCircle(val:boolean){
    if(val){
      this.progressDisplayType = ProgressBarDisplayType.Circle;
    }
    else{
      this.progressDisplayType = ProgressBarDisplayType.StraightLine;
    }
  }

  changeToInfinite(val: boolean){    
    if(val){
      this.progressType = ProgressBarType.Infinite;
    } else{
      this.progressType = ProgressBarType.Progress;
    }
  }
}
