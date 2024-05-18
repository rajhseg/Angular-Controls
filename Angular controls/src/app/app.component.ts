import { Component, Inject, NgZone } from '@angular/core';
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
import { setInterval } from 'timers';
import { WINDOWOBJECT, WindowHelper } from './Controls/windowObject';

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
  IsCircleProgressBar: boolean = false;
  IsInfiniteProgressBar: boolean = true;
  progressDisplayType: ProgressBarDisplayType = ProgressBarDisplayType.StraightLine;
  progressType:ProgressBarType = ProgressBarType.Infinite;
  perc:number = 0;
  percInterval : number | undefined = undefined;

  constructor(private winObj: WindowHelper){
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

    if(winObj.isExecuteInBrowser()){
     this.percInterval = window.setInterval((obj: any)=> obj.perc++, 500, this);
    }
  }

  updateProgress(){
    this.percInterval = window.setInterval((obj: any)=> obj.perc++, 500, this);
  }

  ResetProgress(){
    if(this.winObj.isExecuteInBrowser())
    {
        window.clearInterval(this.percInterval);
    }
    this.perc = 0;
    this.updateProgress();
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
