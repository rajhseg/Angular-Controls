import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Chart components
import { RAllocatedBarChartComponent, RAreaChartComponent, RAreaChartItem, RDonutChartItem, RGraphSeriesChartItem, RPieChartItem, RSequenceHorizontalItem, RSeriesChartComponent, RStateHorizontalComponent, RStepperHorizontalComponent, RTabsComponent, RYSeriesChartItem, RStackedBarChartHorizontalComponent, RStackedRangeBarChartVerticalComponent } from 'rcomponents';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RTabIdFor,
    RTabsComponent,
    // Charts
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
    RTimerComponent,
    RStateVerticalComponent,
    RStateHorizontalComponent,
    RCalendarComponent,
    RStackedBarChartHorizontalComponent,
    RStackedRangeBarChartVerticalComponent
],
  templateUrl: './appb.component.html',
  styleUrl: './appb.component.css'
})
export class AppRootComponent {

  optionA: boolean = true;
  optionB: boolean = false;
  optionC: boolean = false;
  
  // ─── Section visibility ──────────────────────────────────────────────
  activeSection = 'charts';
  sections = ['charts', 'forms', 'layout', 'navigation', 'data'];

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
    new RYSeriesChartItem('Users', '#378ADD', [10, 1030, 1900, 1700, 2400, 2100, 3000]),
    new RYSeriesChartItem('Sessions', '#D85A30', [10, 2060, 2800, 2400, 3200, 2900, 4100]),
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
  sliderValue = 0;

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

  // ─── Form: Select Dropdown ───────────────────────────────────────────
  selectItems: RSelectItemModel[] = [
    Object.assign(new RSelectItemModel({ id: 1 }, 'TypeScript'), { IsSelected: true }),
    Object.assign(new RSelectItemModel({ id: 2 }, 'JavaScript'), { IsSelected: false }),
    Object.assign(new RSelectItemModel({ id: 3 }, 'Python'), { IsSelected: false }),
    Object.assign(new RSelectItemModel({ id: 4 }, 'Rust'), { IsSelected: false }),
  ];

  // ─── Form: Color Picker ──────────────────────────────────────────────
  pickedColor = '#7F77DD';

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

  
  seriesModel: RYSeriesChartItem[] = [];
  seriesModel1: RGraphSeriesChartItem[] = [];
  stackedbarChartItems1: RBarChartItem[] = []
  stackedbarChartXAxisItemNames1: string[] = [];

  stackedrangebarChartItems1: RBarChartItem[] = []
  stackedrangebarChartXAxisItemNames1: string[] = [];

  stackedrangebarChartItems: RBarChartItem[] = []
  stackedrangebarChartXAxisItemNames: string[] = [];
  
  constructor() {

    this.DrawYSeriesChart();
    this.DrawBarChart();
    
  }

  DrawBarChart() {
    
    this.stackedbarChartXAxisItemNames1 = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jly", "Aug"];
    this.stackedbarChartItems1.push(new RBarChartItem("Food Expenses", [2500, 2000, 1500, 1090, 1650, 2700, 2400, 1800], "#534AB7", "white"));
    this.stackedbarChartItems1.push(new RBarChartItem("Vehicle Expenses", [160, 377, 486, 1090, 200, 450, 5, 350], "lightgreen", "white"));
    this.stackedbarChartItems1.push(new RBarChartItem("Dress Expenses", [1000, 775, 1096, 1090, 700, 1200, 800, 1400], ["#0F6E56","red","orange", "blue"], "white"));    

    
    this.stackedrangebarChartXAxisItemNames1 = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jly", "Aug"];
    this.stackedrangebarChartItems1.push(new RBarChartItem("Food Expenses", [-1170, 2000, 1170, -610, 1650, 3000, 2400, -1800], "#534AB7", "white"));
    this.stackedrangebarChartItems1.push(new RBarChartItem("Vehicle Expenses", [-1170, 377, 1170, -610, -1590, 450, 5, 350], "lightgreen", "white"));
    this.stackedrangebarChartItems1.push(new RBarChartItem("Dress Expenses", [1170, 775, 1170, -758, 1860, 1200, 800, 1400], ["#0F6E56","red","orange", "blue"], "white"));    
        
    this.stackedrangebarChartXAxisItemNames = ["Jan", "Feb", "Mar","Apr", "May", "Jun", "Jly", "Aug"];
    this.stackedrangebarChartItems.push(new RBarChartItem("Food Expenses", [25, 20, 15, -61, 60, 30, 24, -18], "#534AB7", "white"));
    this.stackedrangebarChartItems.push(new RBarChartItem("Vehicle Expenses", [16, 30, 40, -60, -15, 50, 5, 35], "lightgreen", "white"));
    this.stackedrangebarChartItems.push(new RBarChartItem("Dress Expenses", [10, 17, 10, 58, 70, 20, 60, 14], ["#0F6E56","red","orange", "blue"], "white"));    

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
}
