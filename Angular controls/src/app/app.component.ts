import { AfterViewInit, Component, createNgModuleRef, Inject, NgModuleRef, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalenderComponent } from './Controls/Calender/calender.component';
import { DropdownComponent } from './Controls/dropdown/dropdown.component';
import { DropdownModel } from './Controls/dropdown/dropdownmodel';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgFor } from '@angular/common';

import { RStarRatingComponent } from './Controls/rating/rating.component';
import { SwitchComponent } from './Controls/switch/switch.component';
import { RProgressbarComponent } from './Controls/progressbar/progressbar.component';
import { ProgressBarDisplayType, ProgressBarType } from './Controls/progressbar/progressbarType';
import { setInterval } from 'timers';
import { WINDOWOBJECT, WindowHelper } from './Controls/windowObject';
import { RTabComponent, RTabIdFor } from './Controls/tab/tab.component';
import { RTabsComponent } from './Controls/tab/rtabs.component';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { RTreeComponent } from "./Controls/Tree/tree.component";
import { RTreeItem } from './Controls/Tree/TreeModel';
import { RCheckboxComponent } from "./Controls/checkbox/checkbox.component";
import { RRadiobuttonComponent } from "./Controls/radiobutton/radiobutton.component";
import { RSliderComponent } from "./Controls/slider/slider.component";
import { RStateVerticalComponent } from "./Controls/sequences/sequences.component";
import { RSequenceVerticalItem } from './Controls/sequences/sequence/sequenceitem';
import { RbuttonComponent } from "./Controls/rbutton/rbutton.component";
import { RGrouppanelComponent } from './Controls/grouppanel/grouppanel.component';
import { RStateHorizontalComponent } from './Controls/rsequences-horizontal/rsequences-horizontal.component';
import { RSequenceHorizontalItem } from './Controls/rsequences-horizontal/rsequence-horizontal/sequenceitemhorizontal';
import { RTextboxComponent } from "./Controls/rtextbox/rtextbox.component";
import { RfileuploadComponent } from './Controls/rfileupload/rfileupload.component';
import { RColorPickerComponent, RColorPickerEventArgs } from './Controls/rcolorpicker/rcolorpicker.component';
import { RNumericComponent } from "./Controls/rnumeric/rnumeric.component";
import { RTimerComponent, TimerType } from './Controls/rtimer/rtimer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet, CalenderComponent,
    SwitchComponent,
    DropdownComponent, FormsModule,
    ReactiveFormsModule, RProgressbarComponent,
    RTabComponent, RTabsComponent,
    NgFor, JsonPipe, RStarRatingComponent,
    RTabIdFor,
    CdkDropListGroup, CdkDropList, CdkDrag,
    RTreeComponent,
    RCheckboxComponent,
    RRadiobuttonComponent,
    RSliderComponent,
    RStateVerticalComponent,
    RStateHorizontalComponent,
    RbuttonComponent,
    RGrouppanelComponent,
    RTextboxComponent,
    RfileuploadComponent,
    RColorPickerComponent,
    RNumericComponent,
    RTimerComponent
]
})
export class AppComponent implements AfterViewInit {

  title = 'angularcontrols';
  items: DropdownModel[] = [];
  items1: any[] = [];
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
  rangeValue: number = 0.4;
  rangeValue1: number = 35;

  timerDisplayType: TimerType = TimerType.Circle;
  
  multiValue: DropdownModel[] = [];
  singleValue!: DropdownModel;

  IsFootball: boolean = false;
  IsVolleyball: boolean = false;
  IsTennis: boolean = false;
  
  IsFootball1: boolean = false;
  IsVolleyball1: boolean = false;
  IsTennis1: boolean = false;

  seqItems: RSequenceVerticalItem[]=[];
  seqHorizontalItems: RSequenceHorizontalItem[]=[];

  ActiveItem!: RSequenceVerticalItem;
  CompletedItem!: RSequenceVerticalItem;
  PendingItem!: RSequenceVerticalItem;
  LastPendingItem!: RSequenceVerticalItem;

  StepperSelectedItem!: RSequenceVerticalItem;
  SeqActiveIndex: number = 1;

  StepperHorizontalSelectedItem!: RSequenceHorizontalItem;
  SeqHorizontalActiveIndex: number = 1;

  treeItems: RTreeItem[] | undefined = undefined;
  selectAll: boolean = false;

  userName: string = "Angular";
  password: string = "";
  confirmpassword: string = "";
  
  @ViewChild('tabCom1', { read: RTabsComponent }) tabs!: RTabsComponent;
  @ViewChild('sequ', {read: RStateVerticalComponent}) sequ!: RStateVerticalComponent;

  @ViewChild('sequhorizontal', {read: RStateHorizontalComponent}) sequhorizontal!: RStateHorizontalComponent;

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

    // this.items1.push(new DropdownModel("0", "Jan"));
    // this.items1.push(new DropdownModel("1", "Feb"));
    // this.items1.push(new DropdownModel("2", "Mar"));
    // this.items1.push(new DropdownModel("4", "Apr"));
    // this.items1.push(new DropdownModel("5", "May"));
    // this.items1.push(new DropdownModel("6", "Jun"));
    // this.items1.push(new DropdownModel("7", "Jly"));
    // this.items1.push(new DropdownModel("8", "Aug"));
    // this.items1.push(new DropdownModel("9", "Sep"));

    this.items1.push("Jan 24");
    this.items1.push("Feb 24");
    this.items1.push("Mar 24");
    this.items1.push("Apr 24");
    this.items1.push("May 24");
    this.items1.push("Jun 24");
    this.items1.push("Jly 24");
    this.items1.push("Aug 24");

    this.singleValue = new DropdownModel("Apr 24","Apr 24");
    this.multiValue.push(new DropdownModel("5", "May"));
    this.multiValue.push(new DropdownModel("7", "Jly"));
        
    if (this.winObj.isExecuteInBrowser())
      this.window = window;

    this.selItem = [];
    this.selItem.push(this.items[5]);

    this.curDate = "";
    this.perc = 55;
    this.IncrementValue(this);
    this.createTreeData();
    this.createSequenceVerticalItems();
    this.createSequenceHorizontalItems();
  }

  rtimer_ValueChanged($event: string){
    
  }

  callbackAfterInterval($event: string){
    console.log("Callback after: "+$event);
  }

  ColorSelected($event: RColorPickerEventArgs){
    console.log($event);
  }

  filesSelected($files: FileList){
    console.log("files selected for upload");
    console.log($files);
  }

  filesCleared($event: Event){
    console.log("files cleared");
    console.log($event);
  }

  selectall($event: any){
    this.selectAll = $event;
  }

  seqValueChanged(event: RSequenceVerticalItem) {
    console.log(this.StepperSelectedItem);
  }

  seqValueChangedForHorizontal(event:RSequenceHorizontalItem){
    console.log(event);
  }

  createSequenceHorizontalItems(){
    let completedItem = new RSequenceHorizontalItem();    
    completedItem.Value = 1;
    completedItem.IsTopAlign = true;
    completedItem.DisplayText= "Completed step 1";

    let activeItem = new RSequenceHorizontalItem();
    activeItem.Value = 2;
    activeItem.DisplayText= "Active step 2";

    let pendingItem = new RSequenceHorizontalItem();
    pendingItem.Value = 3;
    pendingItem.IsTopAlign = true;
    pendingItem.DisplayText="Pending step 3";

    let lastPendingItem = new RSequenceHorizontalItem();    
    lastPendingItem.Value = 4;
    lastPendingItem.DisplayText="Last Pending step 4";

    this.seqHorizontalItems.push(completedItem);
    this.seqHorizontalItems.push(activeItem);
    this.seqHorizontalItems.push(pendingItem);
    this.seqHorizontalItems.push(lastPendingItem);
    
    this.StepperHorizontalSelectedItem = completedItem;
  }

  createSequenceVerticalItems(){
    this.CompletedItem = new RSequenceVerticalItem();    
    this.CompletedItem.Value = 1;
    this.CompletedItem.IsLeftAlign = true;
    this.CompletedItem.DisplayText= "Completed step 1";

    this.ActiveItem = new RSequenceVerticalItem();
    this.ActiveItem.Value = 2;
    this.ActiveItem.DisplayText= "Active step 2";

    this.PendingItem = new RSequenceVerticalItem();
    this.PendingItem.Value = 3;
    this.PendingItem.IsLeftAlign = true;
    this.PendingItem.DisplayText="Pending step 3";

    this.LastPendingItem = new RSequenceVerticalItem();    
    this.LastPendingItem.Value = 4;
    this.LastPendingItem.DisplayText="Last Pending step 4";

    this.seqItems.push(this.CompletedItem);
    this.seqItems.push(this.ActiveItem);
    this.seqItems.push(this.PendingItem);
    this.seqItems.push(this.LastPendingItem);
    
    this.StepperSelectedItem = this.PendingItem;

  }

  nextStepH(){
    //this.SeqHorizontalActiveIndex++;
    this.sequhorizontal.moveToNext();
  }

  prevStepH(){
    this.sequhorizontal.moveToPrevious();
    //this.SeqHorizontalActiveIndex--;
  }

  nextStep(){
    //this.SeqActiveIndex++;
    this.sequ.moveToNext();
  }

  prevStep(){
    this.sequ.moveToPrevious();
    //this.SeqActiveIndex--;
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

    let level32= new RTreeItem();
    level32.DisplayText = "Level 32";
    level32.Value = 31;
    level22.Childrens.push(level32);
    level32.ImageUrl = "images/folder.png";

    let level32ch = new RTreeItem();
    level32ch.DisplayText = "Level 4";
    level32ch.Value =4;
    level32.Childrens.push(level32ch);

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
