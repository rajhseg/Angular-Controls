import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  createNgModuleRef,
  inject,
  Inject,
  NgModuleRef,
  NgZone,
  TemplateRef,
  viewChild,
  ViewChild
} from "@angular/core";
import { RouterOutlet } from '@angular/router';
import { RPageContentDirective, RSplitPageComponent, RSplitterComponent, RSplitterType, RWINDOWHELPEROBJECT } from 'rcomponents';
import { RDropdownComponent } from 'rcomponents';
import { DropdownModel } from 'rcomponents';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgFor } from '@angular/common';

import { RStarRatingComponent } from 'rcomponents';
import { RSwitchComponent } from 'rcomponents';
import { RProgressbarComponent } from 'rcomponents';
import { RProgressBarDisplayType, RProgressBarType } from 'rcomponents';
import { setInterval } from 'timers';
import { WINDOWOBJECT, RWindowHelper } from 'rcomponents';
import { RTabComponent, RTabIdFor } from 'rcomponents';
import { RTabsComponent } from 'rcomponents';
import { CdkDrag, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { RTreeComponent } from "rcomponents";
import { RTreeItem } from 'rcomponents';
import { CheckBoxSize, CheckBoxSizeModel, RCheckboxComponent } from "rcomponents";
import { RRadiobuttonComponent } from "rcomponents";
import { RSliderComponent } from "rcomponents";
import { RStateVerticalComponent } from "rcomponents";
import { RSequenceVerticalItem } from 'rcomponents';
import { RButtonComponent } from "rcomponents";
import { RGrouppanelComponent } from 'rcomponents';
import { RStateHorizontalComponent } from 'rcomponents';
import { RSequenceHorizontalItem } from 'rcomponents';
import { RTextboxComponent } from "rcomponents";
import { RfileuploadComponent } from "rcomponents";
import { RColorPickerComponent, RColorPickerEventArgs } from "rcomponents";
import { RNumericComponent } from "rcomponents";
import { RTimerComponent, TimerType } from "rcomponents";
import { RTimeSelectorComponent } from "rcomponents";
import { RGridComponent } from "rcomponents";
import { RColumnComponent } from "rcomponents";

import { HeaderTemplateDirective, ReadViewTemplateDirective } from "rcomponents";
import { EditViewTemplateDirective } from 'rcomponents';
import { RSelectDropdownComponent } from 'rcomponents';
import { ROptionsTemplateDirective } from 'rcomponents';
import { REventsScheduleComponent } from 'rcomponents';
import { REvent, REventChannelItem, REventsDateSchedule, REventsSchedules } from 'rcomponents';
import { RStepperVerticalComponent } from "rcomponents";
import { RStateAlignment, RStateDisplayType, RStepComponent } from "rcomponents";
import { RStepViewDirective } from 'rcomponents';
import { RDonutChartComponent, RDonutChartItem } from "rcomponents";
import { RStepperHorizontalComponent } from 'rcomponents';
import { RPieChartComponent, RPieChartItem } from 'rcomponents';
import { RBarChartVerticalComponent } from "rcomponents";
import {
  RAllocatedBarChartItem,
  RAllocationData,
  RBarChartItem,
  RGraph,
  RLineChartItem,
  RScatterChartItem,
  RYSeriesChartItem,
  RGraphSeriesChartItem
} from "rcomponents";
import { RBarChartHorizontalComponent } from 'rcomponents';
import { RStackedBarChartVerticalComponent } from 'rcomponents';
import { RStackedRangeBarChartVerticalComponent } from 'rcomponents';
import { RScatterChartComponent } from 'rcomponents';
import { RLineChartVerticalComponent } from 'rcomponents';
import { RStackedBarChartHorizontalComponent } from 'rcomponents';
import { RAreaChartComponent } from 'rcomponents';
import { RAllocatedBarChartComponent } from 'rcomponents';
import { RFilterAlign, RFilterApplyModel, RFilterComponent, RFilterDataType } from 'rcomponents';
import { RSeriesChartComponent } from 'rcomponents';
import { CssUnit, RCssUnitsService, RelativeUnitType } from 'rcomponents';
import { RFlatTabsComponent } from 'rcomponents';
import { AddEventModel, EachDayEventsModel, EventsCalenderModel, REventsCalenderComponent } from 'rcomponents';
import { concatMap, delay, from, Observable, of, switchMap } from 'rxjs';
import { CheckboxEventArgs } from 'rcomponents';
import { RCalendarComponent, CalenderChangeMonthInfo } from 'rcomponents';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    RouterOutlet,
    RCalendarComponent,
    RSwitchComponent,
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
    RButtonComponent,
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
    HeaderTemplateDirective,
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
    RStackedBarChartVerticalComponent,
    RStackedRangeBarChartVerticalComponent,
    RScatterChartComponent, 
    RLineChartVerticalComponent,
    RStackedBarChartHorizontalComponent,
    RAreaChartComponent,
    RAllocatedBarChartComponent,
    RFilterComponent,
    RSeriesChartComponent,
    RFlatTabsComponent,
    REventsCalenderComponent,
    RSplitterComponent,
    RSplitPageComponent,
    RPageContentDirective
  ],
changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements AfterViewInit, AfterContentChecked {

  time1: string = "1:45 PM";
  time2: string ="13:6";
  time3:string = "";
  splitType = RSplitterType;
  calenderEvents!: EventsCalenderModel;
  RcheckSize = CheckBoxSize;
  
  title = 'angularcontrols';
  items: DropdownModel[] = [];
  items1: any[] = [];
  selItem: any = null;
  starWidth: number = 30;
  starValue: number = 6.7;
  curDate!: string;
  dt1!: string;
  dt2!: string;
  isChecked: boolean = true;
  proincenter: boolean = false;
  IsCircleProgressBar: boolean = false;
  IsInfiniteProgressBar: boolean = true;
  progressDisplayType: RProgressBarDisplayType = RProgressBarDisplayType.StraightLine;
  progressType: RProgressBarType = RProgressBarType.Infinite;
  perc: number = 0;
  deltabindex: number = -1;
  window!: Window;
  interval!: number;
  progressDisplayText: string = '';
  rangeValue: number = 0.4;
  rangeValue1: number = 35;
  
  selectedDate1:string = '11-05-2024';
  
  ItemsPerPage = new DropdownModel(5, "5");
  ItemsPerPage4 = new DropdownModel(10000, "10000");

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

  gridSelectAll: boolean = false;

  userName: string = "Angular";
  password: string = "";
  confirmpassword: string = "";
  files!: FileList;
  color1: string = "#1598DC";
  gridItems:any[] = [];
  gridItems1:any[] = [];
  selectDropdownItems: DropdownModel[] = [];

  showVerticalItems: boolean = false;

  numbers: DropdownModel[] = [];
  filterAlign: RFilterAlign = RFilterAlign.Right;
  filterDataType: RFilterDataType = RFilterDataType.NumberType;

  dates: string [] = [];
  dates1: string [] = [];
  selectedDate: string = "";
  stepOneValid: boolean = false;
  stepTwoValid: boolean = false;
  stepThreeValid: boolean =false;
  
  stepperDisplayType: RStateDisplayType = RStateDisplayType.AllItems;
  stepperAlign: RStateAlignment = RStateAlignment.OnTop;  

  barChartItems: RBarChartItem[] = []
  barChartXAxisItemNames: string[] = [];

  barChartItems1: RBarChartItem[] = []
  barChartXAxisItemNames1: string[] = [];

  barChartItems2: RAllocatedBarChartItem[] = []
  barChartXAxisItemNames2: string[] = [];

  stackedbarChartItems1: RBarChartItem[] = []
  stackedbarChartXAxisItemNames1: string[] = [];

  stackedrangebarChartItems1: RBarChartItem[] = []
  stackedrangebarChartXAxisItemNames1: string[] = [];

  stackedrangebarChartItems: RBarChartItem[] = []
  stackedrangebarChartXAxisItemNames: string[] = [];
  
  scatterModel: RScatterChartItem[] = [];

  lineChartItems: RLineChartItem[] = [];
  lineChartXAxisNames: string[] = [];

  bColor: string = 'blue'; //'#13297A';
  tColor: string = 'orangered'; //teal';

  nums2: number[] = [];
  seriesModel2: RYSeriesChartItem[] = [];
  seriesModel: RYSeriesChartItem[] = [];
  seriesModel1: RGraphSeriesChartItem[] = [];
  
  CCol: string = "#6E1F66";

  @ViewChild('tabCom1', { read: RTabsComponent }) tabs!: RTabsComponent;
  @ViewChild('sequ', {read: RStateVerticalComponent}) sequ!: RStateVerticalComponent;
  
  @ViewChild('sequhorizontal', { read: RStateHorizontalComponent }) sequhorizontal!: RStateHorizontalComponent;

  @ViewChild('customTree', { read: RTreeComponent }) customTree!: RTreeComponent;
  
  checkedSize: CheckBoxSize = CheckBoxSize.x_small;
  radioSize: string = "12px";
  checkBoxSizes: DropdownModel[] = [];

  ditems: DropdownModel[] = [];

  winObj!: RWindowHelper;

  constructor(private cdr: ChangeDetectorRef,private ngZone: NgZone,
    private mod: NgModuleRef<any>) {  

    this.winObj = inject(RWINDOWHELPEROBJECT);

    this.items.push(new DropdownModel("0", "Jan"));
    this.items.push(new DropdownModel("1", "Feb"));
    this.items.push(new DropdownModel("2", "Mar"));
    this.items.push(new DropdownModel("4", "Apr"));
    this.items.push(new DropdownModel("5", "May"));
    this.items.push(new DropdownModel("6", "Jun"));
    this.items.push(new DropdownModel("7", "Jly"));
    this.items.push(new DropdownModel("8", "Aug"));
    this.items.push(new DropdownModel("9", "Sep"));

    this.ditems.push(new DropdownModel(5, "5"));
    this.ditems.push(new DropdownModel(10, "10"));
    this.ditems.push(new DropdownModel(15, "15"));
    this.ditems.push(new DropdownModel(20, "20"));
    this.ditems.push(new DropdownModel(25, "25"));
    this.ditems.push(new DropdownModel(50, "50"));
    this.ditems.push(new DropdownModel(100, "100"));

    this.ditems.push(new DropdownModel(200, "200"));
    this.ditems.push(new DropdownModel(500, "500"));
    this.ditems.push(new DropdownModel(1000, "1000"));

    this.ditems.push(new DropdownModel(5000, "5000"));
    this.ditems.push(new DropdownModel(10000, "10000"));

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
      this.createSequenceVerticalItems();
      this.createSequenceHorizontalItems();
      this.populateGridValues();
      this.populateSelectDropdownItems();
      this.createScheduleItems();    
      this.createPieItems();
      this.createDonutItems();
      this.createBarCharts();
      this.createStackedBarCharts();
      this.createScatterChart();
      this.createLineChart();
      this.createSeriesChart();
      this.populateFilters();      
      this.addCalenderEvents();
      this.addCheckBoxSizes();
  }

  chk($evt: DropdownModel){
    this.checkedSize = $evt.Value;
  }
  
  onInputTextBox(e: Event){
    console.log(e);
  }

  addCheckBoxSizes(){
    this.checkBoxSizes = [
      new DropdownModel(CheckBoxSize.x_small,'x-small'),
      new DropdownModel(CheckBoxSize.smaller, 'smaller'),
      new DropdownModel(CheckBoxSize.small, 'small'),
      new DropdownModel(CheckBoxSize.medium, 'medium'),
      new DropdownModel(CheckBoxSize.large, 'large'),
      new DropdownModel(CheckBoxSize.larger, 'larger')
    ];
  }

  changeRadioSize(num: number){
    this.radioSize = num + CssUnit.Px.toString();
  }

  addCalenderEvents(){
    this.calenderEvents = new EventsCalenderModel();
    let eachday = new EachDayEventsModel(new Date(Date.now()));
    eachday.Events.push(new AddEventModel("1","Event1", "07:02 PM", "07:02 PM", "#2D37D0"));
    eachday.Events.push(new AddEventModel("2","Event2", "07:02 PM", "07:02 PM", "#2D37D0"));
    this.calenderEvents.EachDay.push(eachday);
  }

  changeCalenderMonth(month: CalenderChangeMonthInfo){
    this.calenderEvents = new EventsCalenderModel();
    let eachday = new EachDayEventsModel(new Date(month.Year, month.Month, 3));
    eachday.Events.push(new AddEventModel("1","Event1", "07:02 PM", "07:02 PM", "#2D37D0"));
    eachday.Events.push(new AddEventModel("2","Event2", "07:02 PM", "07:02 PM", "#A00FBF"));
    eachday.Events.push(new AddEventModel("3","Event3", "07:02 PM", "07:02 PM", "#BF0F53"));
            
    from([eachday]).pipe(
      switchMap( item => of(item).pipe ( delay( 1000 ) ))
    ).subscribe ( timedItem => {
      this.calenderEvents.EachDay.push(timedItem);
    });
  }

  populateFilters(){
    this.numbers.push(new DropdownModel("1","1"));
    this.numbers.push(new DropdownModel("2","2"));
    this.numbers.push(new DropdownModel("3","3"));
    this.numbers.push(new DropdownModel("4","4"));
    this.numbers.push(new DropdownModel("5","5"));
  }

  SelectAll($evt: CheckboxEventArgs){    
    for (let index = 0; index < this.gridItems.length; index++) {
      const element = this.gridItems[index];
      element.IsSelected = this.gridSelectAll;
    }   
    
    this.gridItems = this.gridItems;
  }

  Select($evt: CheckboxEventArgs, item: any){
   console.log("Item clicked");
   console.log(item);
  }

  createSeriesChart(){
    let nums: number[] = [];
    let graphnums: RGraph[] = [];

    for (let index = 0; index < 50; index++) {
      nums.push(this.GenRandomNum(1, 100));      
    }

    for (let index = 1; index < 80; index++) {
      graphnums.push(new RGraph(index, this.GenRandomNum(1, 100)));      
    }

    graphnums.push(new RGraph(80, 45));

    console.log(nums);

    this.seriesModel.push(new RYSeriesChartItem("Foo", "blue", nums));

    nums = [];

    for (let index = 0; index < 50; index++) {
      nums.push(this.GenRandomNum(1, 100));      
    }

    this.seriesModel.push(new RYSeriesChartItem("Too", "orangered", nums));

    this.seriesModel1.push(new RGraphSeriesChartItem("Foo", "orangered", graphnums));
       
    for (let index = 0; index < 50; index++) {
      this.nums2.push(this.GenRandomNum(1, 100));      
    }

    this.seriesModel2.push(new RYSeriesChartItem("Computer", "blue", this.nums2));

  }

  realTimeCharts(evt: any){    
    let j = this.nums2.slice(1);
    let n1 = this.GenRandomNum(1, 100);
    j.push(n1);
    this.seriesModel2 = [];
    this.seriesModel2.push(new RYSeriesChartItem("Computer", "blue", j));
    this.nums2 = j;
  }

  GenRandomNum(min: number, max: number): number{
    let num = Math.floor(Math.random() * (max-min)+ min);
    return num;
  }

  ngAfterContentChecked(): void {
    
  }

  filterApplied(model: RFilterApplyModel){
    console.log("Filter Applied");
    console.log(model);
  }

  createLineChart() {
    let item1 = new RLineChartItem("Soap", "teal", [25, 45, 12, 35, 18, 17, 40]);
    let item2 = new RLineChartItem("ToothPowder", "darkblue", [35, 75, 18, 45, 16, 27, 60]);
    let item3 = new RLineChartItem("Juice", "orangered", [15, 26, 38, 25, 46, 37, 70]);
    
    this.lineChartXAxisNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    this.lineChartItems = [item1, item2, item3];
  }

  createScatterChart() {

    let item1: RScatterChartItem = new RScatterChartItem("City 1", this.bColor, [
       new RGraph(2,8), new RGraph(15,35), new RGraph(20,65), new RGraph(14, 30)
      ,new RGraph(30,63), new RGraph(35,78), new RGraph(24,53), new RGraph(26, 56)
      ,new RGraph(20,42), new RGraph(14,31), new RGraph(34,75), new RGraph(48, 72)
    ]);
    
    let item2: RScatterChartItem = new RScatterChartItem("City 2", "red", [
      new RGraph(15,40), new RGraph(18,55), new RGraph(20,58)
      ,new RGraph(45,83), new RGraph(28,48), new RGraph(44,83), new RGraph(16, 26)
      ,new RGraph(60,62), new RGraph(64,61), new RGraph(54,75), new RGraph(68, 72)
    ]);

    let item3: RScatterChartItem = new RScatterChartItem("City 3", "green", [
      new RGraph(14,35), new RGraph(25,45), new RGraph(40,85)
      ,new RGraph(40,63), new RGraph(55,78), new RGraph(54,53), new RGraph(66, 56)
      ,new RGraph(20,32), new RGraph(14,41), new RGraph(34,75), new RGraph(68, 72)
    ]);    

    this.scatterModel = [item1, item2, item3];
    
  }

  createBarCharts(){
    this.barChartXAxisItemNames = ["2000", "2001", "2002","2003"];
    this.barChartItems.push(new RBarChartItem("Company A", [75, 87, 60, 94], "#1E96EB", "white"));
    this.barChartItems.push(new RBarChartItem("Company B", [65, 77, 86, 5], "#EF41E5", "white"));
    this.barChartItems.push(new RBarChartItem("Company C", [90, 75, 96, 58], "#C7CBCF", "white"));    

    this.barChartXAxisItemNames1 = ["Tomato", "Potato", "Onion","Oil"];
    this.barChartItems1.push(new RBarChartItem("City A", [75, 87, 60, 94], "#1E96EB", "white"));
    this.barChartItems1.push(new RBarChartItem("City B", [65, 77, 86, 5], "#EF41E5", "white"));
    this.barChartItems1.push(new RBarChartItem("City C", [90, 75, 96, 58], "#C7CBCF", "white"));  
    
    
    this.barChartXAxisItemNames2 = ["Jan", "Feb", "Mar", "Apr", "May"];

    let dat1 = new RAllocationData(8000, 6000);
    let dat2 = new RAllocationData(6800, 4500);
    let dat3 = new RAllocationData(6500, 5000);
    let dat4 = new RAllocationData(7000, 4000);
    let dat5 = new RAllocationData(5500, 5000);

    this.barChartItems2.push(new RAllocatedBarChartItem("Company A",[dat1, dat3, dat4, dat2, dat5], "#1E96EB", "white", "Allocated Money","Spent Money"));
    this.barChartItems2.push(new RAllocatedBarChartItem("Company B",[dat3, dat2, dat1, dat5, dat4],"#EF41E5", "white"));
  }

  createStackedBarCharts(){
    this.stackedbarChartXAxisItemNames1 = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jly", "Aug"];
    this.stackedbarChartItems1.push(new RBarChartItem("Food Expenses", [2500, 2000, 1500, 1090, 1650, 2700, 2400, 1800], "#13297A", "white"));
    this.stackedbarChartItems1.push(new RBarChartItem("Vehicle Expenses", [160, 377, 486, 1090, 200, 450, 5, 350], "teal", "white"));
    this.stackedbarChartItems1.push(new RBarChartItem("Dress Expenses", [1000, 775, 1096, 1090, 700, 1200, 800, 1400], ["gray","grey","darkgreen", "grey"], "white"));    

    this.stackedrangebarChartXAxisItemNames1 = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jly", "Aug"];
    this.stackedrangebarChartItems1.push(new RBarChartItem("Food Expenses", [-1170, 2000, 1170, -610, 1650, 3000, 2400, -1800], "#13297A", "white"));
    this.stackedrangebarChartItems1.push(new RBarChartItem("Vehicle Expenses", [-1170, 377, 1170, -610, -1590, 450, 5, 350], "teal", "white"));
    this.stackedrangebarChartItems1.push(new RBarChartItem("Dress Expenses", [1170, 775, 1170, -758, 1860, 1200, 800, 1400], ["gray","grey","darkgreen", "grey"], "white"));    
        
    this.stackedrangebarChartXAxisItemNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jly", "Aug"];
    this.stackedrangebarChartItems.push(new RBarChartItem("Food Expenses", [25, 20, 15, -61, 60, 30, 24, -18], "#13297A", "white"));
    this.stackedrangebarChartItems.push(new RBarChartItem("Vehicle Expenses", [16, 30, 40, -60, -15, 50, 5, 35], "teal", "white"));
    this.stackedrangebarChartItems.push(new RBarChartItem("Dress Expenses", [10, 17, 10, 58, 70, 20, 60, 14], ["gray","grey","darkgreen", "grey"], "white"));    

  }


  createDonutItems(){
    let pieItem1 = new RDonutChartItem(24,'Cricket', 'grey', 'white');
    let pieItem2 = new RDonutChartItem(35,'Volleyball', 'purple', 'white');
    let pieItem3 = new RDonutChartItem(12,'Tennis', 'gray', 'white');
    let pieItem4 = new RDonutChartItem(44,'BaseBall', 'teal', 'white');
    let pieItem5 = new RDonutChartItem(14,'Hockey', 'darkblue', 'white');
    let pieItem6 = new RDonutChartItem(44,'Football', '#13297A', 'white');

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
    let pieItem1 = new RPieChartItem(24,'Cricket', 'grey', 'white');
    let pieItem2 = new RPieChartItem(35,'Volleyball', 'purple', 'white');
    let pieItem3 = new RPieChartItem(12,'Tennis', 'gray', 'white');
    let pieItem4 = new RPieChartItem(44,'BaseBall', 'teal', 'white');
    let pieItem5 = new RPieChartItem(14,'Hockey', 'darkblue', 'white');
    let pieItem6 = new RPieChartItem(44,'Football', '#13297A', 'white');

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

    items["12-17-2024"] = evItem;
    items["12-18-2024"] = evItem;
    items["12-19-2024"] = evItem;

    this.dates = ["12-17-2024", "12-18-2024", "12-19-2024", "12-20-2024", "12-21-2024"];

    this.dates1 = ["12-17-2024", "12-18-2024", "12-19-2024", "12-20-2024",];
    this.selectedDate = "12-17-2024";

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
    let d = new Date("1982/03/25");

    this.gridItems1.push({'Id':1, 'Name': 'AAA', 'Age': 24, 'Education': 'BCom', 'DOB': new Date(d.setFullYear(1980)), 'IsGrad': true });
    this.gridItems1.push({'Id':2, 'Name': 'BBB', 'Age': 25, 'Education': 'BSC', 'DOB': new Date(d.setFullYear(1981)), 'IsGrad': true });
    this.gridItems1.push({'Id':3, 'Name': 'CCC', 'Age': 25, 'Education': 'BE', 'DOB': new Date(d.setFullYear(1982)), 'IsGrad': false });
    this.gridItems1.push({'Id':4, 'Name': 'DDD', 'Age': 27, 'Education': 'BCom', 'DOB': new Date(d.setFullYear(1983)), 'IsGrad': true });
    this.gridItems1.push({'Id':5, 'Name': 'AAA', 'Age': 26, 'Education': 'BE', 'DOB': new Date(d.setFullYear(1984)), 'IsGrad': false });
    this.gridItems1.push({'Id':6, 'Name': 'AAA', 'Age': 22, 'Education': 'BSC', 'DOB': new Date(d.setFullYear(1985)), 'IsGrad': true });
    this.gridItems1.push({'Id':7, 'Name': 'CCC', 'Age': 21, 'Education': 'BA', 'DOB': new Date(d.setFullYear(1980)), 'IsGrad': true });
    this.gridItems1.push({'Id':8, 'Name': 'AAA', 'Age': 28, 'Education': 'BBA', 'DOB': new Date(d.setFullYear(1986)), 'IsGrad': false });
    this.gridItems1.push({'Id':9, 'Name': 'AAA', 'Age': 32, 'Education': 'BPharm', 'DOB': new Date(d.setFullYear(1987)), 'IsGrad': true });
    this.gridItems1.push({'Id':10, 'Name': 'BBB', 'Age': 54, 'Education': 'BE', 'DOB': new Date(d.setFullYear(1982)), 'IsGrad': true });
    this.gridItems1.push({'Id':11, 'Name': 'DDD', 'Age': 34, 'Education': 'BSC', 'DOB': new Date(d.setFullYear(1983)), 'IsGrad': true });
    this.gridItems1.push({'Id':12, 'Name': 'RRT', 'Age': 64, 'Education': 'BA', 'DOB': new Date(d.setFullYear(1984)), 'IsGrad': false });
    this.gridItems1.push({'Id':13, 'Name': 'BBB', 'Age': 24, 'Education': 'BA', 'DOB': new Date(d.setFullYear(1985)), 'IsGrad': true });
    this.gridItems1.push({'Id':14, 'Name': 'AAA', 'Age': 14, 'Education': 'BE', 'DOB': new Date(d.setFullYear(1982)), 'IsGrad': true });
    this.gridItems1.push({'Id':15, 'Name': 'CCC', 'Age': 84, 'Education': 'BBA', 'DOB': new Date(d.setFullYear(1984)), 'IsGrad': true });
    this.gridItems1.push({'Id':16, 'Name': 'DDD', 'Age': 34, 'Education': 'BA', 'DOB': new Date(d.setFullYear(1986)), 'IsGrad': true });
    this.gridItems1.push({'Id':17, 'Name': 'AAA', 'Age': 22, 'Education': 'BE', 'DOB': new Date(d.setFullYear(1980)), 'IsGrad': true });
    this.gridItems1.push({'Id':18, 'Name': 'AAA', 'Age': 26, 'Education': 'BE', 'DOB': new Date(d.setFullYear(1980)), 'IsGrad': true });

    this.gridItems.push({'IsSelected': false, 'Id':1, 'Name': 'AAA', 'Age': 24, 'Education': { 'Higher': {'Id': 1, 'Course': 'BCom'}} });
    this.gridItems.push({'IsSelected': false, 'Id':2, 'Name': 'BBB', 'Age': 25, 'Education': { 'Higher': {'Id': 2, 'Course': 'BSC'}} });
    this.gridItems.push({'IsSelected': false, 'Id':3, 'Name': 'CCC', 'Age': 25, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'IsSelected': false, 'Id':4, 'Name': 'DDD', 'Age': 27, 'Education': { 'Higher': {'Id': 1, 'Course': 'BCom'}} });
    this.gridItems.push({'IsSelected': false, 'Id':5, 'Name': 'AAA', 'Age': 26, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'IsSelected': false, 'Id':6, 'Name': 'AAA', 'Age': 22, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'IsSelected': false, 'Id':7, 'Name': 'CCC', 'Age': 21, 'Education': { 'Higher': {'Id': 4, 'Course': 'BA'}} });
    this.gridItems.push({'IsSelected': false, 'Id':8, 'Name': 'AAA', 'Age': 28, 'Education': { 'Higher': {'Id': 5, 'Course': 'BBA'}} });
    this.gridItems.push({'IsSelected': false, 'Id':9, 'Name': 'AAA', 'Age': 32, 'Education': { 'Higher': {'Id': 6, 'Course': 'BPharm'}} });
    this.gridItems.push({'IsSelected': false, 'Id':10, 'Name': 'BBB', 'Age': 54, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'IsSelected': false, 'Id':11, 'Name': 'DDD', 'Age': 34, 'Education': { 'Higher': {'Id': 2, 'Course': 'BSC'}} });
    this.gridItems.push({'IsSelected': false, 'Id':12, 'Name': 'RRT', 'Age': 64, 'Education': { 'Higher': {'Id': 4, 'Course': 'BA'}} });
    this.gridItems.push({'IsSelected': false, 'Id':13, 'Name': 'BBB', 'Age': 24, 'Education': { 'Higher': {'Id': 4, 'Course': 'BA'}} });
    this.gridItems.push({'IsSelected': false, 'Id':14, 'Name': 'AAA', 'Age': 14, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'IsSelected': false, 'Id':15, 'Name': 'CCC', 'Age': 84, 'Education': { 'Higher': {'Id': 5, 'Course': 'BBA'}} });
    this.gridItems.push({'IsSelected': false, 'Id':16, 'Name': 'DDD', 'Age': 34, 'Education': { 'Higher': {'Id': 4, 'Course': 'BA'}} });
    this.gridItems.push({'IsSelected': false, 'Id':17, 'Name': 'AAA', 'Age': 22, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });
    this.gridItems.push({'IsSelected': false, 'Id':18, 'Name': 'AAA', 'Age': 26, 'Education': { 'Higher': {'Id': 3, 'Course': 'BE'}} });

    this.gridItems = [...this.gridItems, ...this.gridItems, ...this.gridItems, ...this.gridItems];
    this.gridItems = [...this.gridItems, ...this.gridItems, ...this.gridItems, ...this.gridItems];
    
     this.gridItems = [...this.gridItems, ...this.gridItems, ...this.gridItems, ...this.gridItems];

    this.gridItems = [...this.gridItems, ...this.gridItems, ...this.gridItems, ...this.gridItems];

     //this.gridItems = [...this.gridItems, ...this.gridItems, ...this.gridItems, ...this.gridItems];
     //this.gridItems = [...this.gridItems, ...this.gridItems, ...this.gridItems, ...this.gridItems];
    
   
    this.gridItems1 = this.gridItems1.slice();
  }

  SelectAllGrid(evt: any){
    console.log("Select all");
    console.log(evt);
  }

  ItemSelectClicked(evt: any) {
    console.log("Item selected");
    console.log(evt);
  }

  itemsChanged($event: any){        
    this.gridItems = $event.Items;  
    console.log("item changed");
    console.log($event);      
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

  calFocus($event: any){
    
  }

  createTreeData() {
    if (this.winObj.isExecuteInBrowser()) {
      let _treeItems = new RTreeItem();
      const folderImage: any = document.getElementById("folderImage")?.cloneNode(true);

      _treeItems.DisplayText = "Level 1";
      _treeItems.Value = 1;
      _treeItems.ImageUrl = "images/folder.png";

      this.treeItems = [];
      let childItem = this.customTree.GetLoadingTreeItem();
      _treeItems.AddChildItems(childItem);
      this.treeItems?.push(_treeItems);
    }
  }

  OnTreeItemSelected(item: RTreeItem){
    console.log(item);
  }

  async ExpandClicked(item: RTreeItem) {

    if (item.IsExpanded) {
      item.ImageUrl = "images/open-folder.png";
    }
    else {
      item.ImageUrl = "images/folder.png";
    }


    if (item.CustomPropertyObject.IsDataLoaded ||
      item.CustomPropertyObject.IsCurrentlyLoading) {
      return;
    }

    item.CustomPropertyObject.IsCurrentlyLoading = true;

    setTimeout(async () => {

      await this.LoadTreeItems(item);

      item.CustomPropertyObject.IsDataLoaded = true;

      let loaderItems = item.Childrens.filter(x => x.IsLoaderItem());

      loaderItems.forEach(y => {
        item.DeleteChildItem(y);
      });

      item.CustomPropertyObject.IsCurrentlyLoading = false;

    }, 10000);

  }


  private async LoadTreeItems(item: RTreeItem) {

    let level31 = new RTreeItem();
    level31.DisplayText = "Level " + (item.Level + 1) + ".1";
    level31.Value = "Level " + (item.Level + 1) + ".1";
    level31.ImageUrl = "images/folder.png";

    level31.AddChildItems(this.customTree.GetLoadingTreeItem());

    let level32 = new RTreeItem();
    level32.DisplayText = "Level " + (item.Level + 1) + ".2";
    level32.Value = "Level " + (item.Level + 2) +  ".2";
    level32.ImageUrl = "images/folder.png";

    level32.AddChildItems(this.customTree.GetLoadingTreeItem());

    item.AddChildItems(level31);
    item.AddChildItems(level32);
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
    this.createTreeData();
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
      this.progressDisplayType = RProgressBarDisplayType.Circle;
    }
    else {
      this.progressDisplayType = RProgressBarDisplayType.StraightLine;
    }
  }

  changeToInfinite(val: boolean) {
    if (val) {
      this.progressType = RProgressBarType.Infinite;
    } else {
      this.progressType = RProgressBarType.Progress;
    }
  }
}
