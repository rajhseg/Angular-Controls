import { AfterViewInit, Component, Inject, NgZone, TemplateRef, ViewChild } from '@angular/core';
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
import { RTabComponent } from './Controls/tab/tab.component';
import { RTabHeaderComponent } from "./Controls/tab/tabheader/tabheader.component";
import { RTabContentComponent } from './Controls/tab/tabcontent/tabcontent.component';
import { RTabsComponent } from './Controls/tab/rtabs.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
        RouterOutlet, CalenderComponent,
        SwitchComponent,
        DropdownComponent, FormsModule,
        ReactiveFormsModule, ProgressbarComponent,
        RTabComponent, RTabsComponent,
        NgFor, JsonPipe,
        optionTemplate, RatingComponent,
        RTabHeaderComponent, RTabContentComponent
      ]
})
export class AppComponent implements AfterViewInit {

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
  deltabindex: number = -1;
  window!: Window;
  interval!: number;
  progressDisplayText: string = '';

  @ViewChild('tabCom', {read: RTabsComponent}) tabs!: RTabsComponent;

  constructor(private winObj: WindowHelper, private ngZone: NgZone){
    this.items.push(new DropdownModel("0", "Jan"));
    this.items.push(new DropdownModel("1", "Feb"));
    this.items.push(new DropdownModel("2", "Mar"));
    this.items.push(new DropdownModel("4", "Apr"));
    this.items.push(new DropdownModel("5", "May"));
    this.items.push(new DropdownModel("6", "Jun"));
    this.items.push(new DropdownModel("7", "Jly"));
    this.items.push(new DropdownModel("8", "Aug"));
    this.items.push(new DropdownModel("9", "Sep"));

    if(this.winObj.isExecuteInBrowser())
    this.window = window;

    this.selItem = this.items[5];
    this.curDate = "";
    this.perc = 55;
    this.IncrementValue(this);
  }

  DeleteTab(){
    if(this.tabs.SelectedTabId)
      this.tabs.DeleteTab(this.tabs.SelectedTabId);
  }

  DeleteTabBasedOnIndex(){
    if(this.deltabindex){
      this.tabs.DeleteTabBasedOnIndex(this.deltabindex);
    }
  }

  ngAfterViewInit(): void {
    if(this.tabs){
      console.log('tabs initialized');
      console.log(this.tabs);
    }
  }

  IncrementValue(obj: AppComponent){        
      if(obj.winObj.isExecuteInBrowser()) {        
        obj.interval = obj.window.setInterval((x: AppComponent)=>{

          x.perc = x.perc + 1;

          if(x.perc > 100) {
            x.window.clearInterval(x.interval);
            return;
          }
          
          x.progressDisplayText = x.perc.toString() +" / 100 %";                                                                                                        

        }, 500, obj);
      }              
  }

  ResetProgress(){    
    this.perc = 0;
    this.IncrementValue(this);
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
