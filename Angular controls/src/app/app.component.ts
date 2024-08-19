import { AfterViewInit, Component, createNgModuleRef, Inject, NgModuleRef, NgZone, TemplateRef, ViewChild } from '@angular/core';
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
import { RTabComponent, RTabIdFor } from './Controls/tab/tab.component';
import { RTabsComponent } from './Controls/tab/rtabs.component';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { RTreeComponent } from "./Controls/Tree/tree.component";
import { RTreeItem } from './Controls/Tree/TreeModel';

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
    RTabIdFor,
    CdkDropListGroup, CdkDropList, CdkDrag,
    RTreeComponent
]
})
export class AppComponent implements AfterViewInit {

  title = 'angularcontrols';
  items: DropdownModel[] = [];
  selItem: any = null;
  starWidth: number = 30;
  starValue: number = 3.6;
  curDate!: string;
  dt1!: string;
  dt2!: string;
  isChecked: boolean = true;
  proincenter: boolean = false;
  IsCircleProgressBar: boolean = false;
  IsInfiniteProgressBar: boolean = true;
  progressDisplayType: ProgressBarDisplayType = ProgressBarDisplayType.StraightLine;
  progressType: ProgressBarType = ProgressBarType.Infinite;
  perc: number = 0;
  deltabindex: number = -1;
  window!: Window;
  interval!: number;
  progressDisplayText: string = '';

  treeItems: RTreeItem[] | undefined = undefined;

  @ViewChild('tabCom1', { read: RTabsComponent }) tabs!: RTabsComponent;

  constructor(private winObj: WindowHelper, private ngZone: NgZone, private mod: NgModuleRef<any>) {
    this.items.push(new DropdownModel("0", "Jan"));
    this.items.push(new DropdownModel("1", "Feb"));
    this.items.push(new DropdownModel("2", "Mar"));
    this.items.push(new DropdownModel("4", "Apr"));
    this.items.push(new DropdownModel("5", "May"));
    this.items.push(new DropdownModel("6", "Jun"));
    this.items.push(new DropdownModel("7", "Jly"));
    this.items.push(new DropdownModel("8", "Aug"));
    this.items.push(new DropdownModel("9", "Sep"));

    if (this.winObj.isExecuteInBrowser())
      this.window = window;

    this.selItem = this.items[5];
    this.curDate = "";
    this.perc = 55;
    this.IncrementValue(this);
    this.createTreeData();
   
  }

  createTreeData(){
    if(this.winObj.isExecuteInBrowser()){ 
    let _treeItems = new RTreeItem();
    const folderImage: any = document.getElementById("folderImage")?.cloneNode(true);

    _treeItems.DisplayText = "Level 1";
    _treeItems.Value = 1;
    _treeItems.ImageUrl = "images/folder.png";

    let childrens = [];

    let level2= new RTreeItem();
    level2.DisplayText = "Level 2";
    level2.Value = 2;
    level2.ImageUrl = "images/folder.png";

    childrens.push(level2);

    let level21= new RTreeItem();
    level21.DisplayText = "Level 21";
    level21.Value = 21;
    level21.ImageUrl = "images/folder.png";

    childrens.push(level21);

    
    let level22= new RTreeItem();
    level22.DisplayText = "Level 22";
    level22.Value = 22;
    level22.ImageUrl = "images/folder.png";

    let level31= new RTreeItem();
    level31.DisplayText = "Level 31";
    level31.Value = 31;
    level22.Childrens.push(level31);
    level31.ImageUrl = "images/folder.png";

    childrens.push(level22);

    _treeItems.Childrens = childrens;

    this.treeItems = [];
    this.treeItems.push(_treeItems);
    }
  }

  OnTreeItemSelected(item: RTreeItem){
    console.log(item);
  }

  ExpandClicked(item:RTreeItem) {
    if(item.IsExpanded){
      item.ImageUrl = "images/open-folder.png";
    }
    else{
      item.ImageUrl = "images/folder.png";
    }
  }

  AddTab() {
    let rtabInnerHtml = '<starrating [starWidth]="starWidth" [starColor]="\'red\'" [(ngModel)]="starValue"></starrating> {{starValue}}<br/><br/><rcalender [(ngModel)]="curDate" (onDateSelected)="dateSelected($event)"></rcalender> {{curDate}}';

    console.log("mod");
    console.log(this.mod);

  }

  DeleteTab() {
    if (this.tabs.SelectedTabId)
      this.tabs.DeleteTab(this.tabs.SelectedTabId);
  }

  DeleteTabBasedOnIndex() {
    if (this.deltabindex) {
      this.tabs.DeleteTabBasedOnIndex(this.deltabindex);
    }
  }

  ngAfterViewInit(): void {
    if (this.tabs) {

    }
  }

  IncrementValue(obj: AppComponent) {
    if (obj.winObj.isExecuteInBrowser()) {
      obj.interval = obj.window.setInterval((x: AppComponent) => {

        x.perc = x.perc + 1;

        if (x.perc > 100) {
          x.window.clearInterval(x.interval);
          return;
        }

        x.progressDisplayText = x.perc.toString() + " / 100 %";

      }, 500, obj);
    }
  }

  ResetProgress() {
    this.perc = 0;
    this.IncrementValue(this);
  }

  dateSelected($evt: any) {
    console.log($evt);
  }

  switchChange(val: boolean) {
    this.proincenter = val;
  }

  movetocenter() {
    this.proincenter = !this.proincenter;
  }

  changeToCircle(val: boolean) {
    if (val) {
      this.progressDisplayType = ProgressBarDisplayType.Circle;
    }
    else {
      this.progressDisplayType = ProgressBarDisplayType.StraightLine;
    }
  }

  changeToInfinite(val: boolean) {
    if (val) {
      this.progressType = ProgressBarType.Infinite;
    } else {
      this.progressType = ProgressBarType.Progress;
    }
  }
}
