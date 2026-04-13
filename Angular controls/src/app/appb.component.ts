import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Chart components
import { RAllocatedBarChartComponent, RAreaChartComponent, RAreaChartItem, RDonutChartItem, RGraphSeriesChartItem, RPieChartItem, RSequenceHorizontalItem, RSeriesChartComponent, RStateHorizontalComponent, RStepperHorizontalComponent, RTabsComponent, RYSeriesChartItem, RStackedBarChartHorizontalComponent, RStackedRangeBarChartVerticalComponent, EventsCalenderModel, AddEventModel, EachDayEventsModel, CalenderChangeMonthInfo, REventsCalenderComponent, REventsScheduleComponent, REventsDateSchedule, REvent, REventChannelItem, REventsSchedules, RGridComponent, RTimerResult, RSplitterResult, RCssUnitsService, RRangeSliderComponent, RRangeSliderData, RColumnComponent, ReadViewTemplateDirective, EditViewTemplateDirective } from 'rcomponents';

import { RBarChartVerticalComponent } from 'rcomponents';
import { RBarChartHorizontalComponent } from 'rcomponents';
import { RPieChartComponent } from 'rcomponents';
import { RDonutChartComponent } from 'rcomponents';
import { RLineChartVerticalComponent } from 'rcomponents';
import { RScatterChartComponent } from 'rcomponents';
import { RStackedBarChartVerticalComponent } from 'rcomponents';
import { RProgressbarComponent } from 'rcomponents';

// Form components
import { RButtonComponent } from 'rcomponents';
import { RCheckboxComponent } from 'rcomponents';
import { RTextboxComponent } from 'rcomponents';
import { RNumericComponent } from 'rcomponents';
import { RSliderComponent } from 'rcomponents';
import { RSwitchComponent } from 'rcomponents';
import { RStarRatingComponent } from 'rcomponents';
import { RRadiobuttonComponent } from 'rcomponents';
import { RDropdownComponent } from 'rcomponents';
import { RSelectDropdownComponent } from 'rcomponents';
import { RColorPickerComponent } from 'rcomponents';
import { RfileuploadComponent } from 'rcomponents';
import { RTimeSelectorComponent } from 'rcomponents';

// Layout components
import { RGrouppanelComponent } from 'rcomponents';
import { RSplitterComponent } from 'rcomponents';
import { RSplitPageComponent } from 'rcomponents';
import { RPageContentDirective } from 'rcomponents';

// Navigation components
import { RFlatTabsComponent } from 'rcomponents';
import { RTabComponent, RTabIdFor } from 'rcomponents';
import { RStepperVerticalComponent } from 'rcomponents';
import { RStepComponent } from 'rcomponents';
import { RTreeComponent } from 'rcomponents';

// Data display
import { RTimerComponent } from 'rcomponents';
import { RStateVerticalComponent } from 'rcomponents';
import { RCalendarComponent } from 'rcomponents';

// Models
import {
  RAllocatedBarChartItem,
  RAllocationData,
  RSpaceBetweenBars,
  RBarChartItem,
  RLineChartItem,
  RScatterChartItem,
  RGraph,
} from 'rcomponents';
import { RProgressBarType, RProgressBarDisplayType } from 'rcomponents';
import { DropdownModel, DropDownItemModel } from 'rcomponents';
import { RSelectItemModel } from 'rcomponents';
import { RTreeItem } from 'rcomponents';
import { RSequenceVerticalItem } from 'rcomponents';
import { delay, from, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RTabIdFor,
    RTabsComponent,
    // Charts
    RGridComponent,
    RAllocatedBarChartComponent,
    RBarChartVerticalComponent,
    RBarChartHorizontalComponent,
    RPieChartComponent,
    RDonutChartComponent,
    RLineChartVerticalComponent,
    RScatterChartComponent,
    RAreaChartComponent,
    RStackedBarChartVerticalComponent,
    RProgressbarComponent,
    RSeriesChartComponent,
    RStackedBarChartHorizontalComponent,
    RStackedBarChartVerticalComponent,
    RStackedRangeBarChartVerticalComponent,
    // Forms
    RButtonComponent,
    RCheckboxComponent,
    RTextboxComponent,
    RNumericComponent,
    RSliderComponent,
    RRangeSliderComponent,
    RSwitchComponent,
    RStarRatingComponent,
    RRadiobuttonComponent,
    RDropdownComponent,
    RSelectDropdownComponent,
    RColorPickerComponent,
    RfileuploadComponent,
    RTimeSelectorComponent,
    // Layout
    RGrouppanelComponent,
    RSplitterComponent,
    RSplitPageComponent,
    RPageContentDirective,
    // Navigation
    RFlatTabsComponent,
    RTabComponent,
    RStepperVerticalComponent,
    RStepperHorizontalComponent,
    RStepComponent,
    RTreeComponent,
    // Data display
    REventsCalenderComponent,
    RTimerComponent,
    RStateVerticalComponent,
    RStateHorizontalComponent,
    RCalendarComponent,
    RStackedBarChartHorizontalComponent,
    RStackedRangeBarChartVerticalComponent,
    REventsScheduleComponent,
    ReadViewTemplateDirective,
    EditViewTemplateDirective,
    RColumnComponent,
    RGridComponent
],
  templateUrl: './appb.component.html',
  styleUrl: './appb.component.css'
})
export class AppRootComponent {

  optionA: boolean = true;
  optionB: boolean = false;
  optionC: boolean = false;
  
  rrangeSliderData: RRangeSliderData = new RRangeSliderData(40, 70);

  ItemsPerPage = new DropdownModel(10, "10");

  // ─── Section visibility ──────────────────────────────────────────────
  activeSection = 'charts';
  sections = ['charts', 'forms', 'layout', 'navigation', 'data', 'events', 'grid'];

  // ─── Allocated Bar Chart ─────────────────────────────────────────────
  allocatedMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  allocatedGap = RSpaceBetweenBars.OneBar;
  
  allocatedColumns: RAllocatedBarChartItem[] = [
    new RAllocatedBarChartItem(
      'Marketing',
      [
        new RAllocationData(5000, 3200),
        new RAllocationData(5000, 4800),
        new RAllocationData(6000, 5900),
        new RAllocationData(6000, 2100),
        new RAllocationData(7000, 6500),
        new RAllocationData(7000, 4300),
      ],
      '#7F77DD', 'white'
    ),
    new RAllocatedBarChartItem(
      'Engineering',
      [
        new RAllocationData(8000, 7500),
        new RAllocationData(8000, 6200),
        new RAllocationData(9000, 8800),
        new RAllocationData(9000, 4000),
        new RAllocationData(10000, 9800),
        new RAllocationData(10000, 7200),
      ],
      '#1D9E75', 'white'
    ),
  ];

  // ─── Vertical Bar Chart ───────────────────────────────────────────────
  barVerticalMonths = ['Q1', 'Q2', 'Q3', 'Q4'];
  barVerticalColumns: RBarChartItem[] = [
    new RBarChartItem('Revenue', [42000, 58000, 51000, 73000], '#378ADD', 'white'),
    new RBarChartItem('Expenses', [30000, 35000, 38000, 44000], '#D85A30', 'white'),
  ];

  // ─── Horizontal Bar Chart ────────────────────────────────────────────
  barHorizontalItems: string[] = ['Design', 'Development', 'QA', 'DevOps', 'PM'];
  barHorizontalColumns: RBarChartItem[] = [
    new RBarChartItem('Planned hrs', [120, 300, 80, 60, 50], '#534AB7', 'white'),
    new RBarChartItem('Actual hrs', [140, 260, 95, 70, 45], '#0F6E56', 'white'),
  ];

  // ─── Pie Chart ───────────────────────────────────────────────────────
  pieItems: RPieChartItem[] = [
      new RPieChartItem(24,'Cricket', 'grey', 'white'),
       new RPieChartItem(35,'Volleyball', 'purple', 'white'),
       new RPieChartItem(12,'Tennis', 'gray', 'white'),
      new RPieChartItem(44,'BaseBall', 'teal', 'white'),
       new RPieChartItem(14,'Hockey', 'dark#8f19ff', 'white'),
       new RPieChartItem(44,'Football', '#13297A', 'white')
  ];

  // ─── Donut Chart ─────────────────────────────────────────────────────
  donutItems: RDonutChartItem[] = [   
    new RDonutChartItem(24,'Cricket', 'grey', 'white'),
    new RDonutChartItem(35,'Volleyball', 'purple', 'white'),
    new RDonutChartItem(12,'Tennis', 'gray', 'white'),
    new RDonutChartItem(44,'BaseBall', 'teal', 'white'),
    new RDonutChartItem(14,'Hockey', 'dark#8f19ff', 'white'),
    new RDonutChartItem(44,'Football', '#13297A', 'white'),

  ];

  // ─── Line Chart ──────────────────────────────────────────────────────
  lineMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  lineItems: RLineChartItem[] = [
    new RLineChartItem('Users', '#378ADD', [1200, 1900, 1700, 2400, 2100, 3000]),
    new RLineChartItem('Sessions', '#D85A30', [2000, 2800, 2400, 3200, 2900, 4100]),
  ];

  // -- Area chart ---
  arealineMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  arealineItems: RAreaChartItem[] = [
    new RAreaChartItem('Users', '#378ADD', [1200, 1900, 1700, 2400, 2100, 3000]),
    new RAreaChartItem('Sessions', '#D85A30', [2000, 2800, 2400, 3200, 2900, 4100]),
  ];

  seriesModel2: RYSeriesChartItem[] = [
    new RYSeriesChartItem('Users', '#378ADD', [10, 30, 40, 50]),
    new RYSeriesChartItem('Sessions', '#D85A30', [10, 50, 60 ,60]),
  ];

  // ─── Scatter Chart ───────────────────────────────────────────────────
  scatterItems: RScatterChartItem[] = [
    new RScatterChartItem('Product A', '#7F77DD', [
      new RGraph(10, 20), new RGraph(25, 45), new RGraph(40, 30),
      new RGraph(55, 60), new RGraph(70, 50), new RGraph(85, 80),
    ]),
    new RScatterChartItem('Product B', '#1D9E75', [
      new RGraph(15, 55), new RGraph(30, 35), new RGraph(50, 70),
      new RGraph(65, 40), new RGraph(80, 65), new RGraph(90, 90),
    ]),
  ];


  calenderEvents!: EventsCalenderModel;

  // ─── Progress Bar ────────────────────────────────────────────────────
  progressBarType = RProgressBarType.Progress;
  progressDisplayType = RProgressBarDisplayType.Circle;
  progressValue = 68;

  // ─── Form: Button ────────────────────────────────────────────────────
  buttonClickCount = 0;
  onButtonClick() { this.buttonClickCount++; }

  // ─── Form: Checkbox ──────────────────────────────────────────────────
  checkboxValue = true;

  // ─── Form: Textbox ───────────────────────────────────────────────────
  textboxValue = '';

  // ─── Form: Numeric ───────────────────────────────────────────────────
  numericValue = 42;

  // ─── Form: Slider ────────────────────────────────────────────────────
  sliderValue = 70;

  // ─── Form: Switch ────────────────────────────────────────────────────
  switchValue = false;

  // ─── Form: Star Rating ───────────────────────────────────────────────
  ratingValue = 7;

  // ─── Form: Radio Button ──────────────────────────────────────────────
  radioSelected = '';

  // ─── Form: Dropdown ──────────────────────────────────────────────────
  dropdownItems: DropDownItemModel[] = [
    new DropDownItemModel({ id: 1 }, 'Angular'),
    new DropDownItemModel({ id: 2 }, 'React'),
    new DropDownItemModel({ id: 3 }, 'Vue'),
    new DropDownItemModel({ id: 4 }, 'Svelte'),
  ];
  dropdownSelected: DropdownModel | undefined;

  colors: DropDownItemModel[] = [
    new DropDownItemModel({ header: 'rgb(30 23 107)', rowhover: '#ecebf5', rowhoverfore: 'black' , evenrow: '#534AB7' }, 'Violet'),
    new DropDownItemModel({ header: '#7b1a1a', rowhover: '#c0392b', rowhoverfore: 'white'  , evenrow: '#7b1a1a' }, 'Coral'),
    new DropDownItemModel({ header: '#0d2e55 ', rowhover: '#1a7abf', rowhoverfore: 'white'  , evenrow: '#0d2e55' }, 'Blue'),
    new DropDownItemModel({ header: 'Purple', rowhover: '#7c6edc', rowhoverfore: 'white'  , evenrow: 'Purple' }, 'Purple'),
    new DropDownItemModel({ header: '#083a38 ' , rowhover: '#0b8a80 ', rowhoverfore: 'white'  , evenrow: '#083a38'}, 'Teal')
  ]

  password: string = '';
  
  selectedColor: DropdownModel = this.colors[0];

  // ─── Form: Select Dropdown ───────────────────────────────────────────
  selectItems: RSelectItemModel[] = [
    Object.assign(new RSelectItemModel({ id: 1 }, 'TypeScript'), { IsSelected: true }),
    Object.assign(new RSelectItemModel({ id: 2 }, 'JavaScript'), { IsSelected: false }),
    Object.assign(new RSelectItemModel({ id: 3 }, 'Python'), { IsSelected: false }),
    Object.assign(new RSelectItemModel({ id: 4 }, 'Rust'), { IsSelected: false }),
  ];

  // ─── Form: Color Picker ──────────────────────────────────────────────
  pickedColor = '#1E1198';

  // ─── Form: Time Selector ─────────────────────────────────────────────
  selectedTime = '09:00 AM';

  // ─── Layout: Group Panel ─────────────────────────────────────────────
  // (no extra data needed — uses ng-content)

  // ─── Layout: Splitter ────────────────────────────────────────────────
  // (configured in template)

  // ─── Navigation: Tree ────────────────────────────────────────────────
  treeItems: RTreeItem[] = (() => {
    const root1 = new RTreeItem();
    root1.DisplayText = 'src';
    root1.IsExpanded = true;

    const app = new RTreeItem();
    app.DisplayText = 'app';
    const comp = new RTreeItem(); comp.DisplayText = 'app.component.ts';
    const html = new RTreeItem(); html.DisplayText = 'app.component.html';
    app.AddChildItems([comp, html]);

    const assets = new RTreeItem(); assets.DisplayText = 'assets';
    root1.AddChildItems([app, assets]);

    const root2 = new RTreeItem(); root2.DisplayText = 'node_modules';
    const rc = new RTreeItem(); rc.DisplayText = 'rcomponents';
    root2.AddChildItems(rc);

    return [root1, root2];
  })();

  onTreeExpand(item: RTreeItem) {
    item.IsExpanded = !item.IsExpanded;
  }

  // ─── Navigation: Stepper ─────────────────────────────────────────────
  stepperActiveIndex = 1;

  // ─── Data: Timer ─────────────────────────────────────────────────────
  timerRunning = false;

  @ViewChild('timerRef', { static: false })
  timerComponent!: RTimerComponent;

  // ─── Data: Sequences ─────────────────────────────────────────────────
  sequenceItems: RSequenceVerticalItem[] = (() => {
    const steps = ['Order placed', 'Processing', 'Shipped', 'Delivered'];
    return steps.map((text, i) => {
      const item = new RSequenceVerticalItem();
      item.StepNo = i + 1;
      item.DisplayText = text;
      if (i < 2) item.IsCompleted = true;
      else if (i === 2) item.IsActive = true;
      else item.IsPending = true;
      return item;
    });
  })();

  hsequenceItems: RSequenceHorizontalItem[] = (() => {
    const steps = ['Order placed', 'Shipped', 'Delivered'];
    return steps.map((text, i) => {
      const item = new RSequenceHorizontalItem();
      item.StepNo = i + 1;
      item.DisplayText = text;
      if (i < 2) item.IsCompleted = true;
      else if (i === 2) item.IsActive = true;
      else item.IsPending = true;
      return item;
    });
  })();

  // ─── Data: Calendar ──────────────────────────────────────────────────
  calendarSelectedDate: Date | undefined;

  onCalendarChange(date: any) {
    this.calendarSelectedDate = date;
  }

  // ─── Helper ──────────────────────────────────────────────────────────
  setSection(s: string) { this.activeSection = s; }

  callbackAfterCertainSeconds = 10;
  callbackResult: string = '';

  seriesModel: RYSeriesChartItem[] = [];
  seriesModel1: RGraphSeriesChartItem[] = [];
  stackedbarChartItems1: RBarChartItem[] = []
  stackedbarChartXAxisItemNames1: string[] = [];

  stackedrangebarChartItems1: RBarChartItem[] = []
  stackedrangebarChartXAxisItemNames1: string[] = [];

  stackedrangebarChartItems: RBarChartItem[] = []
  stackedrangebarChartXAxisItemNames: string[] = [];
    
  scheduleItems!: REventsSchedules;

  selectedDate: string = "";
  
  gridItems1:any[] = [];
  
  ditems: DropdownModel[] = [];

  leftPanelWidth: number = 260;
  middlePanelWidth: number = 260;
  rightPanelWidth: number = 260;

  @ViewChild('leftChart', { read: RAllocatedBarChartComponent }) leftChart!: RAllocatedBarChartComponent;
  @ViewChild('rightChart', { read: RAllocatedBarChartComponent }) rightChart!: RAllocatedBarChartComponent;
  @ViewChild('middleChart', { read: RAllocatedBarChartComponent }) middleChart!: RAllocatedBarChartComponent;

  @ViewChild('splitcomp', { read: RSplitterComponent }) splitter!: RSplitterComponent;

  constructor(private cdr: ChangeDetectorRef, private cssUnitService: RCssUnitsService) {
    this.DrawYSeriesChart();
    this.DrawBarChart();
    this.addCalenderEvents();
    this.createScheduleItems();
    this.DrawGridItems();
  }

  Start($event: any) {
  
  }

  Stop($event: any) {
    
  }
  
  panelSizeChange(data: RSplitterResult) {

    let leftWidth = Number(data.PreviousPanelSize.replace('px',''));
    let rightWidth = Number(data.NextPanelSize.replace('px',''));

    if(data.SplitterPosition == 1) {
      this.leftPanelWidth = leftWidth - 100;
      this.middlePanelWidth = rightWidth - 100;
    }

    if(data.SplitterPosition == 2) {
      this.middlePanelWidth = leftWidth - 100;
      this.rightPanelWidth = rightWidth - 100;
    }

    this.cdr.detectChanges();
    
    setTimeout(() => {  

      if(data.SplitterPosition == 1) {
        this.leftChart.Render();
        this.middleChart.Render();
      } else if(data.SplitterPosition == 2) {
        this.middleChart.Render();
        this.rightChart.Render();
      }
      
    }, 400);
    
  }

  async CallbackMethodAfterCertainSeconds(result: RTimerResult) {

    //const sleep = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

    //await sleep(10000);

    this.callbackResult =  result.Hour + " : " + result.Minute + " : " + result.Seconds;
  }

  DrawGridItems() {
    
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

    let d = new Date("1982/03/25");

    this.gridItems1.push({'Id':1, 'Name': 'AAA B <script></script> Sample text1, sample text2, sample text3', 'Age': 24, 'Education': 'BCom Sample text1, sample text2, sample text3',  'IsGrad': true });
    this.gridItems1.push({'Id':2, 'Name': 'BBB', 'Age': 25, 'Education': 'BSC', 'IsGrad': true });
    this.gridItems1.push({'Id':3, 'Name': 'CCC', 'Age': 25, 'Education': 'BE', 'IsGrad': false });
    this.gridItems1.push({'Id':4, 'Name': 'DDD', 'Age': 27, 'Education': 'BCom', 'IsGrad': true });
    this.gridItems1.push({'Id':5, 'Name': 'AAA', 'Age': 26, 'Education': 'BE',  'IsGrad': false });
    this.gridItems1.push({'Id':6, 'Name': 'AAA', 'Age': 22, 'Education': 'BSC',  'IsGrad': true });
    this.gridItems1.push({'Id':7, 'Name': 'CCC', 'Age': 21, 'Education': 'BA', 'IsGrad': true });
    this.gridItems1.push({'Id':8, 'Name': 'AAA', 'Age': 28, 'Education': 'BBA',  'IsGrad': false });
    this.gridItems1.push({'Id':9, 'Name': 'AAA', 'Age': 32, 'Education': 'BPharm','IsGrad': true });
    this.gridItems1.push({'Id':10, 'Name': 'BBB', 'Age': 54, 'Education': 'BE',  'IsGrad': true });
    this.gridItems1.push({'Id':11, 'Name': 'DDD', 'Age': 34, 'Education': 'BSC', 'IsGrad': true });
    this.gridItems1.push({'Id':12, 'Name': 'RRT', 'Age': 64, 'Education': 'BA', 'IsGrad': false });
    this.gridItems1.push({'Id':13, 'Name': 'BBB', 'Age': 24, 'Education': 'BA',  'IsGrad': true });
    this.gridItems1.push({'Id':14, 'Name': 'AAA', 'Age': 14, 'Education': 'BE',  'IsGrad': true });
    this.gridItems1.push({'Id':15, 'Name': 'CCC', 'Age': 84, 'Education': 'BBA', 'IsGrad': true });
    this.gridItems1.push({'Id':16, 'Name': 'DDD', 'Age': 34, 'Education': 'BA',  'IsGrad': true });
    this.gridItems1.push({'Id':17, 'Name': 'AAA', 'Age': 22, 'Education': 'BE',  'IsGrad': true });
    this.gridItems1.push({'Id':18, 'Name': 'AAA', 'Age': 26, 'Education': 'BE', 'IsGrad': true });

  }

  DrawBarChart() {
    
    this.stackedbarChartXAxisItemNames1 = ["Jan", "Feb", "Mar","Apr", "May", "Jun"];
    this.stackedbarChartItems1.push(new RBarChartItem("Food Expenses", [2500, 2000, 1650, 2700, 2400, 1800], "#534AB7", "white"));
    this.stackedbarChartItems1.push(new RBarChartItem("Vehicle Expenses", [160, 377, 200, 450, 5, 350], "#a39cf3", "white"));
    //this.stackedbarChartItems1.push(new RBarChartItem("Dress Expenses", [1000, 775, 700, 1200, 800, 1400], "#5a549e", "white"));    

    
    this.stackedrangebarChartXAxisItemNames1 = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jly"];
    this.stackedrangebarChartItems1.push(new RBarChartItem("Food Expenses", [-1170, 2000, 1170, -610,  3000, 2400, -1800], "#534AB7", "white"));
    this.stackedrangebarChartItems1.push(new RBarChartItem("Vehicle Expenses", [-1170, 377, 1170, -1590, 450, 5, 350], "#a39cf3", "white"));
    //this.stackedrangebarChartItems1.push(new RBarChartItem("Dress Expenses", [1170, 775, 1170, -758, 1200, 800, 1400], "#5a549e", "white"));    
        
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
  
  DrawYSeriesChart() {
    
   let graphnums = [];

    for (let index = 1; index < 80; index++) {
      graphnums.push(new RGraph(index, this.GenRandomNum(1, 100)));      
    }

    graphnums.push(new RGraph(80, 45));

    let nums = [];

    for (let index = 0; index < 50; index++) {
      nums.push(this.GenRandomNum(1, 100));      
    }


    this.seriesModel.push(new RYSeriesChartItem("Foo", "#8f19ff", nums));
    
    for (let index = 0; index < 50; index++) {
      nums.push(this.GenRandomNum(1, 100));      
    }

    this.seriesModel1 = [new RGraphSeriesChartItem("Foo", "#8f19ff", graphnums)];

  }

  
  GenRandomNum(min: number, max: number): number{
    let num = Math.floor(Math.random() * (max-min)+ min);
    return num;
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

    this.selectedDate = "12-17-2024";

    this.scheduleItems = items;
  }
}
