import { AfterContentChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, createNgModuleRef, Inject, NgModuleRef, NgZone, TemplateRef, viewChild, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalenderComponent } from './Controls/Calender/calender.component';
import { RDropdownComponent } from './Controls/dropdown/dropdown.component';
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
import { RTimeSelectorComponent } from "./Controls/rtimeselector/rtimeselector.component";
import { RGridComponent } from './Controls/rgrid/rgrid.component';
import { RColumnComponent } from './Controls/rgrid/rcolumn/rcolumn.component';

import { ReadViewTemplateDirective } from './Controls/rgrid/view-template.directive';
import { EditViewTemplateDirective } from './Controls/rgrid/edit-template.directive';
import { RSelectDropdownComponent } from './Controls/rselectdropdown/rselectdropdown.component';
import { ROptionsTemplateDirective } from './Controls/rselectdropdown/rselectModel';
import { REventsScheduleComponent } from './Controls/reventsschedule/reventsschedule.component';
import { REvent, REventChannelItem, REventsDateSchedule, REventsSchedules } from './Controls/reventsschedule/reventsschedule';
import { RStepperVerticalComponent } from "./Controls/rstepper-vertical/rstepper-vertical.component";
import { RStateAlignment, RStateDisplayType, RStepComponent } from "./Controls/rstep/rstep.component";
import { RStepViewDirective } from './Controls/rstep/rsteptemplate.directive';
import { RDonutChartComponent, RDonutChartItem } from "./Controls/rdonutchart/rdonutchart.component";
import { RStepperHorizontalComponent } from './Controls/rstepper-horizontal/rstepper-horizontal.component';
import { RPieChartComponent, RPieChartItem } from './Controls/rpiechart/rpiechart.component';
import { RBarChartVerticalComponent } from "./Controls/rbarchart-vertical/rbarchart-vertical.component";
import { BarChartItem } from './Controls/Models/BarChartItem';
import { RBarChartHorizontalComponent } from './Controls/rbarchart-horizontal/rbarchart-horizontal.component';
import { RStackedBarChartVerticalComponent } from './Controls/rstackedbarchart-vertical/rstackedbarchart-vertical.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet, CalenderComponent,
    SwitchComponent,
    RDropdownComponent, FormsModule,
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
    RTimerComponent,
    RTimeSelectorComponent,
    RGridComponent,
    RColumnComponent,
    ReadViewTemplateDirective,
    EditViewTemplateDirective,
    RSelectDropdownComponent,
    ROptionsTemplateDirective,
    REventsScheduleComponent,
    RStepperVerticalComponent,
    RStepComponent,
    RStepViewDirective,
    RDonutChartComponent,
    RPieChartComponent,
    RStepperHorizontalComponent,
    RBarChartVerticalComponent,
    RBarChartHorizontalComponent,
    RStackedBarChartVerticalComponent
],
changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit, AfterContentChecked {

  time1: string = "1:45 PM";
  time2: string ="13:6";
  time3:string = "";

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
  
  ItemsPerPage = new DropdownModel(10, "10");

  timerDisplayType: TimerType = TimerType.Circle;
  
  pieItems: RDonutChartItem[] = [];

    
  pieItems1: RPieChartItem[] = [];

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
  
  scheduleItems!: REventsSchedules;

  StepperSelectedItem!: RSequenceVerticalItem;
  SeqActiveIndex: number = 1;

  StepperHorizontalSelectedItem!: RSequenceHorizontalItem;
  SeqHorizontalActiveIndex: number = 1;

  treeItems: RTreeItem[] | undefined = undefined;
  selectAll: boolean = false;

  userName: string = "Angular";
  password: string = "";
  confirmpassword: string = "";
  files!: FileList;
  color1: string = "#1598DC";
  gridItems:any[] = [];
  gridItems1:any[] = [];
  selectDropdownItems: DropdownModel[] = [];

  showVerticalItems: boolean = false;

  dates: string [] = [];
  dates1: string [] = [];
  selectedDate: string = "";
  stepOneValid: boolean = false;
  stepTwoValid: boolean = false;
  stepThreeValid: boolean =false;
  
  stepperDisplayType: RStateDisplayType = RStateDisplayType.AllItems;
  stepperAlign: RStateAlignment = RStateAlignment.OnTop;  

  barChartItems: BarChartItem[] = []
  barChartXAxisItemNames: string[] = [];

  barChartItems1: BarChartItem[] = []
  barChartXAxisItemNames1: string[] = [];

  stackedbarChartItems1: BarChartItem[] = []
  stackedbarChartXAxisItemNames1: string[] = [];

  @ViewChild('tabCom1', { read: RTabsComponent }) tabs!: RTabsComponent;
  @ViewChild('sequ', {read: RStateVerticalComponent}) sequ!: RStateVerticalComponent;
  
  @ViewChild('sequhorizontal', {read: RStateHorizontalComponent}) sequhorizontal!: RStateHorizontalComponent;

  constructor(private cdr: ChangeDetectorRef, private winObj: WindowHelper, private ngZone: NgZone, private mod: NgModuleRef<any>) {    
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
      this.populateGridValues();
      this.populateSelectDropdownItems();
      this.createScheduleItems();    
      this.createPieItems();
      this.createDonutItems();
      this.createBarCharts();
      this.createStackedBarCharts();
  }

  ngAfterContentChecked(): void {
    this.cdr.detectChanges();
  }

  createBarCharts(){
    this.barChartXAxisItemNames = ["2000", "2001", "2002","2003"];
    this.barChartItems.push(new BarChartItem("Company A", [75, 87, 60, 94], "blue", "white"));
    this.barChartItems.push(new BarChartItem("Company B", [65, 77, 86, 5], "red", "white"));
    this.barChartItems.push(new BarChartItem("Company C", [90, 75, 96, 58], ["cyan","yellow","green", "gray"], "white"));    

    this.barChartXAxisItemNames1 = ["Tomato", "Potato", "Onion","Oil"];
    this.barChartItems1.push(new BarChartItem("City A", [75, 87, 60, 94], "purple", "white"));
    this.barChartItems1.push(new BarChartItem("City B", [65, 77, 86, 5], "orange", "white"));
    this.barChartItems1.push(new BarChartItem("City C", [90, 75, 96, 58], ["cyan","yellow","green", "gray"], "white"));    
  }

  createStackedBarCharts(){
    this.stackedbarChartXAxisItemNames1 = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jly", "Aug"];
    this.stackedbarChartItems1.push(new BarChartItem("Food Expenses", [2500, 2000, 1500, 1850, 1650, 2700, 2400, 1800], "blue", "white"));
    this.stackedbarChartItems1.push(new BarChartItem("Vehicle Expenses", [465, 377, 486, 378, 500, 450, 350, 350], "red", "white"));
    this.stackedbarChartItems1.push(new BarChartItem("Dress Expenses", [1000, 775, 1096, 758, 700, 1200, 800, 1400], ["cyan","yellow","green", "gray"], "white"));    
  }

  createDonutItems(){
    let pieItem1 = new RDonutChartItem(24,'Cricket', 'blue', 'white');
    let pieItem2 = new RDonutChartItem(35,'Volleyball', 'purple', 'white');
    let pieItem3 = new RDonutChartItem(12,'Tennis', 'yellow', 'white');
    let pieItem4 = new RDonutChartItem(44,'BaseBall', '#6CEBC5', 'white');
    let pieItem5 = new RDonutChartItem(14,'Hockey', 'orangered', 'white');
    let pieItem6 = new RDonutChartItem(44,'Football', 'green', 'white');

    this.pieItems.push(pieItem1);
    this.pieItems.push(pieItem2);
    this.pieItems.push(pieItem3);
    this.pieItems.push(pieItem4);
    this.pieItems.push(pieItem5);
    this.pieItems.push(pieItem6);
  }

  AddFewItems(evt: any) {
    let pieItem5 = new RDonutChartItem(14,'F1', 'gray', 'white');
    let pieItem6 = new RDonutChartItem(24,'WW', 'Red', 'white');
    this.pieItems.push(pieItem5);
    this.pieItems.push(pieItem6);
    this.pieItems = this.pieItems.slice();
  }
  
  createPieItems(){
    let pieItem1 = new RPieChartItem(24,'Cricket', 'blue', 'white');
    let pieItem2 = new RPieChartItem(35,'Volleyball', 'purple', 'white');
    let pieItem3 = new RPieChartItem(12,'Tennis', 'yellow', 'white');
    let pieItem4 = new RPieChartItem(44,'BaseBall', '#6CEBC5', 'white');
    let pieItem5 = new RPieChartItem(14,'Hockey', 'orangered', 'white');
    let pieItem6 = new RPieChartItem(44,'Football', 'green', 'white');

    this.pieItems1.push(pieItem1);
    this.pieItems1.push(pieItem2);
    this.pieItems1.push(pieItem3);
    this.pieItems1.push(pieItem4);
    this.pieItems1.push(pieItem5);
    this.pieItems1.push(pieItem6);
  }


  changeStepperDisplayType($event: any){
    if(this.stepperDisplayType == RStateDisplayType.AllItems){
      this.stepperDisplayType = RStateDisplayType.OnlyCompleted;
    } else {
      this.stepperDisplayType = RStateDisplayType.AllItems;
    }
  }
  
  changeShow($event: any){
    this.showVerticalItems = !this.showVerticalItems;
  }

  changeStepperAlign($event: any){
    if(this.stepperAlign== RStateAlignment.OnLeft){
      this.stepperAlign = RStateAlignment.OnTop;
    } else{
      this.stepperAlign = RStateAlignment.OnLeft;
      this.stepperDisplayType = RStateDisplayType.AllItems;
    }
  }

  stepOneSave($event: Event){
    this.stepOneValid = true;
  }

  stepTwoSave($event: Event){
    this.stepTwoValid = true;
  }

  stepThreeSave($event: Event){
    this.stepThreeValid = true;
  }

  createScheduleItems(){
    let items = new REventsSchedules();

    let ritem = new REventChannelItem();
    ritem.ChannelTitle = "Channel Title1";
    ritem.CalculateStartAndEndTimeBasedOnDuration = true;
    ritem.RenderEventsInContinousSequence = true;
    ritem.ValueKey = {};

    ritem.Events.push(new REvent("", 15, "Event title 1", {}));
    ritem.Events.push(new REvent("", 15, "Event title 2", {}));
    ritem.Events.push(new REvent("", 30, "Event title 3", {}));
    ritem.Events.push(new REvent("", 30, "Event title 4", {}));
    ritem.Events.push(new REvent("", 30, "Event title 5", {}));
    ritem.Events.push(new REvent("", 120, "Event title 6", {}));
    ritem.Events.push(new REvent("", 60, "Event title 7", {}));
    ritem.Events.push(new REvent("", 30, "Event title 8", {}));
    ritem.Events.push(new REvent("", 30, "Event title 9", {}));

    ritem.Events.push(new REvent("", 15, "Event title 1", {}));
    ritem.Events.push(new REvent("", 30, "Event title 2", {}));
    ritem.Events.push(new REvent("", 30, "Event title 3", {}));
    ritem.Events.push(new REvent("", 30, "Event title 4", {}));
    ritem.Events.push(new REvent("", 30, "Event title 5", {}));
    ritem.Events.push(new REvent("", 120, "Event title 6", {}));
    ritem.Events.push(new REvent("", 45, "Event title 7", {}));
    ritem.Events.push(new REvent("", 30, "Event title 8", {}));
    ritem.Events.push(new REvent("", 30, "Event title 9", {}));

    ritem.Events.push(new REvent("", 15, "Event title 1", {}));
    ritem.Events.push(new REvent("", 30, "Event title 2", {}));
    ritem.Events.push(new REvent("", 30, "Event title 3", {}));
    ritem.Events.push(new REvent("", 30, "Event title 4", {}));
    ritem.Events.push(new REvent("", 30, "Event title 5", {}));
    ritem.Events.push(new REvent("", 120, "Event title 6", {}));
    ritem.Events.push(new REvent("", 45, "Event title 7", {}));
    ritem.Events.push(new REvent("", 30, "Event title 8", {}));
    ritem.Events.push(new REvent("", 30, "Event title 9", {}));

    ritem.Events.push(new REvent("", 15, "Event title 1", {}));
    ritem.Events.push(new REvent("", 30, "Event title 2", {}));
    ritem.Events.push(new REvent("", 30, "Event title 3", {}));
    ritem.Events.push(new REvent("", 30, "Event title 4", {}));
    ritem.Events.push(new REvent("", 30, "Event title 5", {}));
    ritem.Events.push(new REvent("", 120, "Event title 6", {}));
    ritem.Events.push(new REvent("", 45, "Event title 7", {}));
    ritem.Events.push(new REvent("", 30, "Event title 8", {}));
    ritem.Events.push(new REvent("", 30, "Event title 9", {}));

    let ritem2 = new REventChannelItem();
    ritem2.ChannelTitle = "Channel Title2";
    ritem2.RenderEventsInContinousSequence = false;
    ritem2.CalculateStartAndEndTimeBasedOnDuration = false;
    ritem2.ValueKey = {};  

    ritem2.Events.push(new REvent("5:30", 30, "Event title 4", {}));
    ritem2.Events.push(new REvent("15:40", 20, "Event title 4", {}));
    ritem2.Events.push(new REvent("3:15", 30, "Event title 1", {}));
    ritem2.Events.push(new REvent("13:10", 30, "Event title 3", {}));
    ritem2.Events.push(new REvent("13:30", 30, "Event title 3.2", {}));
    ritem2.Events.push(new REvent("4:0", 30, "Event title 2", {}));
    ritem2.Events.push(new REvent("16:30", 120, "Event title 5", {}));
    ritem2.Events.push(new REvent("0:30", 30, "Event title 6", {}));
    ritem2.Events.push(new REvent("16:00", 30, "Event title 7", {}));
    ritem2.Events.push(new REvent("17:20", 40, "Event title 8", {}));
    ritem2.Events.push(new REvent("18:20", 40, "Event title 10", {}));
    ritem2.Events.push(new REvent("23:30", 30, "Event title 11", {}));
    

    let evItem = new REventsDateSchedule();    
    evItem.ChannelItems.push(ritem);
    evItem.ChannelItems.push(ritem2);
    evItem.ChannelItems.push(ritem);
    evItem.ChannelItems.push(ritem2);
    evItem.ChannelItems.push(ritem);
    evItem.ChannelItems.push(ritem);
    evItem.ChannelItems.push(ritem);
    evItem.ChannelItems.push(ritem);

    items["14-09-2024"] = evItem;
    items["19-09-2024"] = evItem;
    items["20-09-2024"] = evItem;

    this.dates = ["14-09-2024","15-09-2024", "16-09-2024", "17-09-2024","18-09-2024"];

    this.dates1 = ["15-09-2024", "16-09-2024", "17-09-2024","18-09-2024"];
    this.selectedDate = "19-09-2024";

    this.scheduleItems = items;
  }

  populateSelectDropdownItems(){
    this.selectDropdownItems.push(new DropdownModel({'Id':1, 'Name': 'AAA', 'Age': 24, 'Education': 'BCom'}, "A-1"));
    this.selectDropdownItems.push(new DropdownModel({'Id':2, 'Name': 'BBB', 'Age': 24, 'Education': 'BCom'}, "B-1"));
    this.selectDropdownItems.push(new DropdownModel({'Id':3, 'Name': 'CCC', 'Age': 24, 'Education': 'BCom'}, "C-1"));
    this.selectDropdownItems.push(new DropdownModel({'Id':4, 'Name': 'DDD', 'Age': 24, 'Education': 'BCom'}, "D-1"));
    this.selectDropdownItems.push(new DropdownModel({'Id':5, 'Name': 'EEE', 'Age': 24, 'Education': 'BCom'}, "E-1"));
    this.selectDropdownItems.push(new DropdownModel({'Id':6, 'Name': 'FFF', 'Age': 24, 'Education': 'BCom'}, "F-1"));
    this.selectDropdownItems.push(new DropdownModel({'Id':7, 'Name': 'GGG', 'Age': 24, 'Education': 'BCom'}, "G-1"));
    this.selectDropdownItems.push(new DropdownModel({'Id':8, 'Name': 'HHH', 'Age': 24, 'Education': 'BCom'}, "H-1"));
  }

  populateGridValues(){
    this.gridItems1.push({'Id':1, 'Name': 'AAA', 'Age': 24, 'Education': 'BCom'});
    this.gridItems1.push({'Id':2, 'Name': 'BBB', 'Age': 25, 'Education': 'BSC'});
    this.gridItems1.push({'Id':3, 'Name': 'CCC', 'Age': 25, 'Education': 'BE'});
    this.gridItems1.push({'Id':4, 'Name': 'DDD', 'Age': 27, 'Education': 'BCom'});
    this.gridItems1.push({'Id':5, 'Name': 'AAA', 'Age': 26, 'Education': 'BE'});
    this.gridItems1.push({'Id':6, 'Name': 'AAA', 'Age': 22, 'Education': 'BSC'});
    this.gridItems1.push({'Id':7, 'Name': 'CCC', 'Age': 21, 'Education': 'BA'});
    this.gridItems1.push({'Id':8, 'Name': 'AAA', 'Age': 28, 'Education': 'BBA'});
    this.gridItems1.push({'Id':9, 'Name': 'AAA', 'Age': 32, 'Education': 'BPharm'});
    this.gridItems1.push({'Id':10, 'Name': 'BBB', 'Age': 54, 'Education': 'BE'});
    this.gridItems1.push({'Id':11, 'Name': 'DDD', 'Age': 34, 'Education': 'BSC'});
    this.gridItems1.push({'Id':12, 'Name': 'RRT', 'Age': 64, 'Education': 'BA'});
    this.gridItems1.push({'Id':13, 'Name': 'BBB', 'Age': 24, 'Education': 'BA'});
    this.gridItems1.push({'Id':14, 'Name': 'AAA', 'Age': 14, 'Education': 'BE'});
    this.gridItems1.push({'Id':15, 'Name': 'CCC', 'Age': 84, 'Education': 'BBA'});
    this.gridItems1.push({'Id':16, 'Name': 'DDD', 'Age': 34, 'Education': 'BA'});
    this.gridItems1.push({'Id':17, 'Name': 'AAA', 'Age': 22, 'Education': 'BE'});
    this.gridItems1.push({'Id':18, 'Name': 'AAA', 'Age': 26, 'Education': 'BE'});

    this.gridItems.push({'Id':1, 'Name': 'AAA', 'Age': 24, 'Education': { 'Higher': {'Id': 1, 'Course': 'BCom'}} });
    this.gridItems.push({'Id':2, 'Name': 'BBB', 'Age': 25, 'Education': { 'Higher': {'Id': 2, 'Course': 'BSC'}} });
    this.gridItems.push({'Id':3, 'Name': 'CCC', 'Age': 25, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'Id':4, 'Name': 'DDD', 'Age': 27, 'Education': { 'Higher': {'Id': 1, 'Course': 'BCom'}} });
    this.gridItems.push({'Id':5, 'Name': 'AAA', 'Age': 26, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'Id':6, 'Name': 'AAA', 'Age': 22, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'Id':7, 'Name': 'CCC', 'Age': 21, 'Education': { 'Higher': {'Id': 4, 'Course': 'BA'}} });
    this.gridItems.push({'Id':8, 'Name': 'AAA', 'Age': 28, 'Education': { 'Higher': {'Id': 5, 'Course': 'BBA'}} });
    this.gridItems.push({'Id':9, 'Name': 'AAA', 'Age': 32, 'Education': { 'Higher': {'Id': 6, 'Course': 'BPharm'}} });
    this.gridItems.push({'Id':10, 'Name': 'BBB', 'Age': 54, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'Id':11, 'Name': 'DDD', 'Age': 34, 'Education': { 'Higher': {'Id': 2, 'Course': 'BSC'}} });
    this.gridItems.push({'Id':12, 'Name': 'RRT', 'Age': 64, 'Education': { 'Higher': {'Id': 4, 'Course': 'BA'}} });
    this.gridItems.push({'Id':13, 'Name': 'BBB', 'Age': 24, 'Education': { 'Higher': {'Id': 4, 'Course': 'BA'}} });
    this.gridItems.push({'Id':14, 'Name': 'AAA', 'Age': 14, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'Id':15, 'Name': 'CCC', 'Age': 84, 'Education': { 'Higher': {'Id': 5, 'Course': 'BBA'}} });
    this.gridItems.push({'Id':16, 'Name': 'DDD', 'Age': 34, 'Education': { 'Higher': {'Id': 4, 'Course': 'BA'}} });
    this.gridItems.push({'Id':17, 'Name': 'AAA', 'Age': 22, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'Id':18, 'Name': 'AAA', 'Age': 26, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });

    this.gridItems = this.gridItems.slice();
    this.gridItems1 = this.gridItems1.slice();
  }

  itemsChanged($event: any){        
    this.gridItems = $event.Items;        
  }

  itemsChangedGridItems1($event: any){    
    this.gridItems1 = $event.Items;           
  }

  rtimer_ValueChanged($event: string){
    
  }

  callbackAfterInterval($event: string){
    
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

  StepsCompleted($event: Event){
    console.log("Steps completed");
    console.log($event);
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
        x.cdr.detectChanges();
      }, 500, obj);
    }
  }

  ResetProgress() {
    this.perc = 0;
    this.window.clearInterval(this.interval);
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
