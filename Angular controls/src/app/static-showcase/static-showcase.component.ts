import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  ChangeDetectorRef,
  RendererFactory2,
  Injector,
  NgModuleRef,
  ViewContainerRef,
  ElementRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDropListGroup, DragDropModule } from '@angular/cdk/drag-drop';
import {
  RComponentsModule,
  DropdownModel,
  DropDownItemModel,
  RSelectItemModel,
  RPieChartItem,
  RDonutChartItem,
  RBarChartItem,
  RAreaChartItem,
  RLineChartItem,
  RScatterChartItem,
  RAllocatedBarChartItem,
  RAllocationData,
  RGraphSeriesChartItem,
  RYSeriesChartItem,
  RGraph,
  RTreeItem,
  RSequenceHorizontalItem,
  RSequenceVerticalItem,
  EventsCalenderModel,
  EachDayEventsModel,
  AddEventModel,
  CalenderChangeMonthInfo,
  REventsSchedules,
  REventsDateSchedule,
  REventChannelItem,
  REvent,
  RRangeSliderData,
  RSpaceBetweenBars,
  RProgressBarType,
  RProgressBarDisplayType,
  RTimerResult,
  RTimerComponent,
  RStepComponent,
  RFlatTabsComponent,
  RTabsComponent,
  RSimpleTabsComponent,
  RSplitPageComponent,
  RCarouselComponent,
  RGridComponent,
  RWindowHelper,
  RCssUnitsService,
} from 'rcomponents';


@Component({
  selector: 'app-static-showcase',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, CdkDropListGroup, RComponentsModule, RStepComponent],
  templateUrl: './static-showcase.component.html',
  styleUrls: ['./static-showcase.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class StaticShowcaseComponent {
  // ----------------------------------------------------
  // 1. THEME, GLASSY EFFECT & CONTROLS
  // ----------------------------------------------------
  public enableGlassyEffect: boolean = false;
  public glassyColor: string = '#A8BFCA';

  public colorItems: DropdownModel[] = [
    new DropdownModel('#1E1198', 'Dark Blue'),
    new DropdownModel('#3569df', 'Blue'),
    new DropdownModel('#00a5fe', 'Light Blue'),
    new DropdownModel('#fda305', 'Yellow'),
    new DropdownModel('#a459b8', 'Purple'),
    new DropdownModel('#f70c6b', 'Pink'),
  ];
  public selectedTheme: DropdownModel = this.colorItems[1];

  public allocatedGap = RSpaceBetweenBars.OneBar;
  public Spaces: DropdownModel[] = Object.keys(RSpaceBetweenBars)
    .filter((key) => isNaN(Number(key)))
    .map(
      (key) =>
        new DropdownModel(
          RSpaceBetweenBars[key as keyof typeof RSpaceBetweenBars],
          key
        )
    );
  public selectedSpace: DropdownModel = new DropdownModel(
    RSpaceBetweenBars.OneBar,
    'OneBar'
  );

  public spaceBarChanged(val: any): void {
    if (this.selectedSpace && this.selectedSpace.Value !== undefined) {
      this.allocatedGap = this.selectedSpace.Value;
    }
  }

  // ----------------------------------------------------
  // COMPONENT INPUT PROPERTIES (CONFIG & ATTRIBUTES)
  // ----------------------------------------------------
  // Top Navigation & Header Controls
  public headerSwitchLabelColor: string = '#1e293b';
  public headerSwitchLabel: string = 'Glassy Effect';
  public headerColorPickerLabelColor: string = '#1e293b';
  public headerColorPickerShowLabel: boolean = true;
  public headerColorPickerShowCode: boolean = false;
  public headerColorPickerLabel: string = 'Theme Color:';
  public spaceDropdownEnableFilter: boolean = false;
  public spaceDropdownReadOnly: boolean = false;
  public spaceDropdownContentHeight: string = '170px';
  public spaceDropdownContentWidth: string = '120px';
  public spaceDropdownWidth: string = '100px';

  // Section 1: Form & CVA Controls Inputs
  public dropdownWidth: string = '260px';
  public dropdownContentWidth: string = '260px';
  public dropdownFilterEnabled: boolean = true;
  public dropdownBottomLineColor: string = '#2563eb';
  public deptDropdownBottomLineColor: string = '#7c3aed';
  public selectDropdownMulti: boolean = true;

  public textboxLabel: string = 'User Full Name';
  public textboxPlaceholder: string = 'Enter name...';
  public textboxWidth: string = '260px';
  public textboxHeight: string = '20px';
  public textboxBottomLineColor: string = '#2563eb';

  public passwordIsPasswordBox: boolean = true;
  public passwordLabel: string = 'API Secret Key';
  public passwordWidth: string = '260px';
  public passwordHeight: string = '20px';
  public passwordBottomLineColor: string = '#7c3aed';

  public numericLabel: string = 'Team Size';
  public numericStepValue: number = 1;
  public numericMinValue: number = 1;
  public numericMaxValue: number = 100;
  public numericWidth: string = '260px';
  public numericHeight: string = '20px';
  public numericBottomLineColor: string = '#2563eb';
  public numericPlusBgColor: string = '#2563eb';
  public numericMinusBgColor: string = '#64748b';
  public numericPlusForeColor: string = '#ffffff';
  public numericMinusForeColor: string = '#ffffff';

  public sliderMinValue: number = 0;
  public sliderMaxValue: number = 100;
  public sliderWidth: string = '260px';
  public sliderColor: string = '#2563eb';
  public sliderTrackColor: string = '#e2e8f0';
  public sliderDisplayValueColor: string = '#2563eb';
  public sliderShowValue: boolean = true;
  public sliderShowLabel: boolean = true;

  public rangeSliderMinValue: number = 0;
  public rangeSliderMaxValue: number = 100;
  public rangeSliderWidth: string = '260px';
  public rangeSlider1Color: string = '#2563eb';
  public rangeSlider2Color: string = '#7c3aed';
  public rangeSliderTrackColor: string = '#e2e8f0';
  public rangeSliderShowValue: boolean = true;
  public rangeSliderShowLabel: boolean = true;

  public colorPickerLabel: string = 'Accent Color:';
  public colorPickerShowLabel: boolean = true;
  public colorPickerDisplayHex: boolean = true;
  public colorPickerShowCode: boolean = true;

  public calendarReadOnly: boolean = false;
  public calendarSelectedBgColor: string = '#2563eb';

  public starRatingCount: number = 5;
  public starRatingWidth: number = 28;
  public starRatingColor: string = '#f59e0b';

  public timeSetCurrentOnLoad: boolean = false;
  public timeButtonBgColor: string = '#2563eb';
  public timeButtonForeColor: string = '#ffffff';
  public timeReadOnly: boolean = false;

  public switch1Label: string = 'AI Auto-Scaling';
  public switch1BgColor: string = '#10b981';
  public switch2Label: string = 'Real-Time Telemetry';
  public switch2BgColor: string = '#2563eb';
  public switchLabelColor: string = '#1e293b';

  public checkbox1Text: string = 'Agree to SLA Terms';
  public checkbox2Text: string = 'Enable 24/7 Monitoring';
  public checkboxCheckedColor: string = '#2563eb';
  public checkboxLabelColor: string = '#1e293b';
  public radio1Text: string = 'Standard';
  public radio2Text: string = 'Enterprise';
  public radio3Text: string = 'Custom';
  public radioColor: string = '#7c3aed';
  public radioLabelColor: string = '#1e293b';
  public radioGroupName: string = 'tier_group';

  public fileUploadEnableShadow: boolean = false;
  public fileUploadShowDropdown: boolean = true;
  public fileUploadMaxHeight: string = '150px';
  public fileUploadMaxSizeMB: number = 10;
  public fileUploadIconColor: string = '#2563eb';
  public fileUploadReadOnly: boolean = false;
  public fileUploadMultiple: boolean = true;
  public filterColumnName: string = 'Cluster Service';
  public filterColor: string = '#2563eb';

  // Section 2: Chart Dimensions & Config Inputs
  public chartWidth: number = 340;
  public chartHeight: number = 240;
  public chartMarginX: number = 55;
  public chartEnableBorder: boolean = false;

  public pieChartWidth: number = 280;
  public pieDataListHeight: number = 100;
  public pieShadowBlur: number = 10;
  public pieFontSize: string = '11px';
  public pieEnableBorder: boolean = false;

  public donutChartWidth: number = 280;
  public donutDataListHeight: number = 100;
  public donutShadowBlur: number = 10;
  public donutEnableBorder: boolean = false;

  public barVerticalXTitle: string = 'Quarter';
  public barVerticalYTitle: string = 'Amount';

  public barHorizontalMarginX: number = 60;
  public barHorizontalMarginBottom: number = 40;
  public barHorizontalXTitle: string = 'Hours';
  public barHorizontalYTitle: string = 'Phase';

  public stackedHorizSplits: number = 5;
  public stackedHorizXTitle: string = 'Hours';
  public stackedHorizYTitle: string = 'Phase';

  public stackedVertSplits: number = 5;
  public stackedVertXTitle: string = 'Month';
  public stackedVertYTitle: string = 'Cost ($k)';

  public stackedRangeSplits: number = 5;
  public stackedRangeXTitle: string = 'Month';
  public stackedRangeYTitle: string = 'Variance';

  public areaXTitle: string = 'Month';
  public areaYTitle: string = 'Count';
  public areaEnablePlotOnPoints: boolean = true;

  public linePlotItemSize: number = 2;
  public lineMarginRight: number = 20;
  public lineXTitle: string = 'Month';
  public lineYTitle: string = 'Count';

  public scatterXTitle: string = 'Price';
  public scatterYTitle: string = 'Sales';

  public allocatedXTitle: string = 'Sprint';
  public allocatedYTitle: string = 'Budget ($k)';
  public allocatedSplits: number = 5;
  public allocatedEnablePopupBorder: boolean = true;
  public allocatedPopupBgOpacity: number = 1;

  public seriesXTitle: string = 'Elements';
  public seriesYTitle: string = 'Values';
  public seriesFillArea: boolean = false;
  public seriesPlotItemSize: number = 25;

  // Section 3: Steppers, Trackers & Schedules Inputs
  public stateDisabled: boolean = false;
  public sequencesTrackerDisabled: boolean = false;
  public sequencesTrackerContentWidth: string = '320px';

  public seqStep1Config = { StepNo: 1, Height: '90px', instanceContext: this };
  public seqStep2Config = { StepNo: 2, Height: '90px', instanceContext: this };
  public seqStep3Config = { StepNo: 3, Height: '90px', instanceContext: this };

  public stepperHorizDisabled: boolean = false;
  public stepperHorizShowState: boolean = false;
  public stepperStep1Title: string = 'Account';
  public stepperStep2Title: string = 'Profile';
  public stepperStep3Title: string = 'Preferences';
  public stepperStep4Title: string = 'Confirm';
  public stepperStepValid: boolean = true;
  public stepperButtonWidth: string = '110px';

  public stepperVertDisabled: boolean = false;
  public stepperVertShowState: boolean = false;
  public stepperVertStep1Title: string = 'Validation';
  public stepperVertStep2Title: string = 'Migration';
  public stepperVertStep3Title: string = 'Verification';
  public stepperVertStep4Title: string = 'Deployment';

  public eventsScheduleDisabled: boolean = false;
  public eventsScheduleFontSize: string = '12px';
  public eventsScheduleShowMarker: boolean = true;
  public eventsScheduleShowScrollBar: boolean = false;
  public eventsScheduleCellMinutes: number = 30;
  public eventsScheduleMoveToCurrentTime: boolean = true;

  public eventsCalendarFontSize: string = '12px';
  public eventsCalendarModalReadOnly: boolean = false;
  public eventsCalendarDayHeight: string = '45px';
  public eventsCalendarDayWidth: string = '110px';

  // Section 4: Data Grids, Trees & Containers Inputs
  public gridTableWidth: string = '95%';
  public gridTableHeight: string = '360px';
  public gridAutoTableHeight: string = '240px';
  public gridEnableShadow: boolean = false;
  public gridShowGroupHeader: boolean = true;
  public gridRowHeight: string = '64px';
  public gridGroupHeaderRowHeight: string = '48px';
  public gridShowEditUpdate: boolean = true;
  public gridEnableSelectColummn: boolean = true;
  public gridEnableSelectColumn: boolean = true;
  public gridEnableAlternateRowColor: boolean = true;
  public gridRowHoverOpacity: number = 1;
  public gridCol1Width: string = '250px';
  public gridCol2Width: string = '300px';
  public gridCol3Width: string = '290px';
  public gridCol4Width: string = '310px';
  public gridCol5Width: string = '260px';
  public gridCol1Header: string = 'Member ID';
  public gridCol2Header: string = 'Engineer Profile';
  public gridCol3Header: string = 'Department';
  public gridCol4Header: string = 'Performance SLA';
  public gridCol5Header: string = 'Credentials';
  public gridInlineTextBoxHeight: string = '12px';
  public gridInlineTextBoxWidth1: string = '70px';
  public gridInlineTextBoxWidth2: string = '140px';
  public gridInlineNumericWidth: string = '100px';
  public gridInlineNumericHeight: string = '15px';
  public gridInlineDropdownWidth: string = '140px';
  public gridInlineDropdownContentWidth: string = '160px';

  public treeDisabled: boolean = false;

  public accordionDisabled: boolean = false;
  public accordionGap: string = '8px';
  public accordionContentWidth: string = '80%';
  public accordionContent1 = { instanceContext: this, ContentId: 1, Title: 'Cluster Infrastructure Diagnostics', Height: '90px', IsOpened: true };
  public accordionContent2 = { instanceContext: this, ContentId: 2, Title: 'Security & Zero-Trust Policies', Height: '90px', IsOpened: false };
  public accordionContent3 = { instanceContext: this, ContentId: 3, Title: 'Telemetry & Performance Logs', Height: '90px', IsOpened: false };

  public simpleTabSelectedId: string = 'st1';
  public simpleTabEnableShadow: boolean = true;
  public tabContainerWidth: string = '90%';
  public tabContainerHeight: string = '140px';
  public simpleTab1Config = { TabId: 'st1', HeaderText: 'System Overview', Context: this };
  public simpleTab2Config = { TabId: 'st2', HeaderText: 'Telemetry Metrics', Context: this };
  public simpleTab3Config = { TabId: 'st3', HeaderText: 'Cluster Health', Context: this };

  public flatTab1Config = { TabId: 'ft1', HeaderText: 'US-West Region', Context: this };
  public flatTab2Config = { TabId: 'ft2', HeaderText: 'EU-Central Region', Context: this };

  public dragTab1Config = { TabId: 'dt1', HeaderText: 'Cluster Alpha', Context: this };
  public dragTab2Config = { TabId: 'dt2', HeaderText: 'Cluster Beta', Context: this };

  public groupPanelName: string = 'Security & Access Policies';
  public groupPanelEnableShadow: boolean = false;

  public carouselAutoPlay: boolean = true;
  public carouselDuration: number = 3500;
  public carouselWidth: string = '280px';
  public carouselHeight: string = '160px';
  public carouselButtonWidth: string = '130px';

  public splitterReadOnly: boolean = false;
  public splitterTotalWidth: string = '90%';
  public splitterTotalHeight: string = '140px';
  public splitterPane1Width: string = '33%';
  public splitterPane2Width: string = '34%';
  public splitterPane3Width: string = '33%';

  // Section 5: Indicators & Actions Inputs
  public progressWidthFull: string = '100%';
  public progressFloatCenter: boolean = false;
  public progressStraightLineHeight: string = '14px';
  public progressType0: number = 0;
  public progressDisplayLinear: number = 0;

  public progressCircleWidth: string = '110px';
  public progressCircleLineWidth: string = '10px';
  public progressDisplayCircle: number = 1;

  public timerDisabled: boolean = false;
  public timerDisplayType: number = 0;
  public timerCircularWidth: number = 80;
  public timerCallbackSeconds: number = 10;
  public timerButtonWidth: string = '100px';

  public actionButtonWidth: string = '130px';

  // ----------------------------------------------------
  // 2. CASCADING DROPDOWN LOOKUPS & MODELS
  // ----------------------------------------------------
  public countries: DropdownModel[] = [
    new DropdownModel('in', 'India 🇮🇳'),
    new DropdownModel('jp', 'Japan 🇯🇵'),
    new DropdownModel('ca', 'Canada 🇨🇦')
  ];

  public statesByCountry: Record<string, DropdownModel[]> = {
    in: [
      new DropdownModel('ka_state', 'Karnataka'),
      new DropdownModel('mh_state', 'Maharashtra'),
      new DropdownModel('dl_state', 'Delhi NCR'),
      new DropdownModel('tn_state', 'Tamil Nadu'),
    ],
    jp: [
      new DropdownModel('tyo_state', 'Tokyo Prefecture'),
      new DropdownModel('osa_state', 'Osaka'),
      new DropdownModel('kyo_state', 'Kyoto'),
      new DropdownModel('kan_state', 'Kanagawa'),
    ],
    ca: [
      new DropdownModel('on_state', 'Ontario'),
      new DropdownModel('bc_state', 'British Columbia'),
      new DropdownModel('qc_state', 'Quebec'),
      new DropdownModel('ab_state', 'Alberta'),
    ]
  };

  public citiesByState: Record<string, DropdownModel[]> = {
    ka_state: [
      new DropdownModel('blr', 'Bengaluru Silicon Valley of India'),
      new DropdownModel('mys', 'Mysuru IT Cyber City'),
    ],
    mh_state: [
      new DropdownModel('pune', 'Pune Hinjawadi Tech Zone'),
      new DropdownModel('mum', 'Mumbai BKC Financial District'),
    ],
    dl_state: [
      new DropdownModel('gur', 'Gurugram Cyber Hub'),
      new DropdownModel('noi', 'Noida Electronic City'),
    ],
    tn_state: [
      new DropdownModel('che', 'Chennai OMR IT Corridor'),
      new DropdownModel('cbe', 'Coimbatore Tech Park'),
    ],
    tyo_state: [
      new DropdownModel('shj', 'Shinjuku Cyber Center'),
      new DropdownModel('min', 'Minato Tech Harbor'),
    ],
    osa_state: [
      new DropdownModel('kita', 'Osaka Kita Tech Cluster'),
      new DropdownModel('chuo', 'Osaka Chuo Business Park'),
    ],
    kyo_state: [
      new DropdownModel('shim', 'Kyoto Research Park'),
      new DropdownModel('nak', 'Kyoto Digital District'),
    ],
    kan_state: [
      new DropdownModel('yok', 'Yokohama Minato Mirai'),
      new DropdownModel('kaw', 'Kawasaki High-Tech City'),
    ],
    on_state: [
      new DropdownModel('tor', 'Toronto Financial & AI District'),
      new DropdownModel('wat', 'Waterloo Quantum Valley'),
    ],
    bc_state: [
      new DropdownModel('van', 'Vancouver Pacific Tech Center'),
      new DropdownModel('vic', 'Victoria Capital Zone'),
    ],
    qc_state: [
      new DropdownModel('mtl', 'Montreal AI Institute Corridor'),
      new DropdownModel('qbc', 'Quebec City Tech Hub'),
    ],
    ab_state: [
      new DropdownModel('cgy', 'Calgary Energy Tech'),
      new DropdownModel('edm', 'Edmonton Innovation District'),
    ],
    eng_state: [
      new DropdownModel('lon_w', 'Westminster, London'),
      new DropdownModel('lon_c', 'City of London Financial Hub'),
    ],
    man_state: [
      new DropdownModel('man_c', 'Manchester City Centre Tech'),
      new DropdownModel('sal', 'Salford MediaCityUK'),
    ],
    sct_state: [
      new DropdownModel('edn', 'Edinburgh Informatics Hub'),
      new DropdownModel('gla', 'Glasgow Innovation District'),
    ],
    wls_state: [
      new DropdownModel('cdf', 'Cardiff Bay Digital Park'),
      new DropdownModel('swa', 'Swansea Waterfront Tech'),
    ],
  };

  public departments: DropdownModel[] = [
    new DropdownModel('eng', 'Engineering & AI'),
    new DropdownModel('prod', 'Product Strategy'),
    new DropdownModel('des', 'Experience Design'),
    new DropdownModel('sales', 'Global Enterprise Sales'),
  ];

  public rolesByDepartment: Record<string, DropdownModel[]> = {
    eng: [
      new DropdownModel('fe_arch', 'Frontend Architect (Angular/Web)'),
      new DropdownModel('ai_lead', 'Principal ML / AI Scientist'),
      new DropdownModel('cloud_ops', 'Staff Cloud Infrastructure Engineer'),
    ],
    prod: [
      new DropdownModel('dir_prod', 'Director of Product Management'),
      new DropdownModel('prod_lead', 'Technical Product Manager'),
      new DropdownModel('growth_pm', 'Growth & Analytics Lead'),
    ],
    des: [
      new DropdownModel('ux_dir', 'Head of Design Systems'),
      new DropdownModel('prod_des', 'Senior Product Designer'),
      new DropdownModel('motion_des', 'Interactive Prototyping Lead'),
    ],
    sales: [
      new DropdownModel('vp_sales', 'VP Enterprise Accounts'),
      new DropdownModel('sa_lead', 'Principal Solutions Architect'),
      new DropdownModel('ae_ent', 'Enterprise Account Executive'),
    ],
  };

  // ----------------------------------------------------
  // 3. FORM CONTROLS TWO-WAY BOUND VALUES & MODELS
  // ----------------------------------------------------
  public selectedCountry: string = 'in';
  public selectedState: string = 'tn_state';
  public selectedCity: string = 'che';

  public currentStates: DropdownModel[] = this.statesByCountry['in'];
  public currentCities: DropdownModel[] = this.citiesByState['tn_state'];

  public selectedDepartment: string = 'eng';
  public selectedRole: string = 'fe_arch';
  public currentRoles: DropdownModel[] = this.rolesByDepartment['eng'];

  public selectDropdownVal: string = 'ca_state';
  public textboxVal: string = 'Alex Chen';
  public passwordVal: string = 'Dyn4micUI#2026';
  public numericVal: number = 16;
  public checkboxVal: boolean = true;
  public checkboxVal2: boolean = true;
  public radioVal: boolean = true;
  public optionA: boolean = false;
  public optionB: boolean = true;
  public optionC: boolean = false;
  public switchVal: boolean = true;
  public sliderVal: number = 75;
  public rrangeSliderData: RRangeSliderData = new RRangeSliderData(25, 75);
  public rangeSliderVal: any = { min: 25, max: 75 };
  public colorPickerVal: string = '#3b82f6';
  public pickedColor: string = '#3b82f6';
  public calendarVal: string = '2026-10-15';
  public calendarSelectedDate: Date | undefined = new Date('2026-10-15');
  public starRatingVal: number = 5;
  public timeVal: string = '09:30 AM';
  public selectedTime: string = '09:30 AM';
  public fileUploadVal: any[] = [];
  public fileupload1: any;
  public filterVal: any = '';

  public selectItems: RSelectItemModel[] = [
    Object.assign(new RSelectItemModel({ id: 1 }, 'TypeScript'), { IsSelected: true }),
    Object.assign(new RSelectItemModel({ id: 2 }, 'JavaScript'), { IsSelected: false }),
    Object.assign(new RSelectItemModel({ id: 3 }, 'Python'), { IsSelected: false }),
    Object.assign(new RSelectItemModel({ id: 4 }, 'Rust'), { IsSelected: false }),
  ];

  public dropdownItems: DropDownItemModel[] = [
    new DropDownItemModel({ id: 1 }, 'Angular 18+'),
    new DropDownItemModel({ id: 2 }, 'React & Next.js'),
    new DropDownItemModel({ id: 3 }, 'Vue & Nuxt'),
    new DropDownItemModel({ id: 4 }, 'SvelteKit'),
  ];
  public dropdownSelected: DropdownModel | undefined = new DropdownModel(
    { id: 1 },
    'Angular 18+'
  );

  public degrees: DropDownItemModel[] = [
    new DropDownItemModel(1, 'B.Tech / Computer Science'),
    new DropDownItemModel(2, 'M.S. in Artificial Intelligence'),
    new DropDownItemModel(3, 'Ph.D. in Computer Engineering'),
    new DropDownItemModel(4, 'B.S. in Software Systems'),
  ];

  public progressBarType = RProgressBarType.Progress;
  public progressDisplayType = RProgressBarDisplayType.Circle;
  public progressBarVal: number = 84;
  public lastButtonClickMsg: string = 'Ready for action';
  public buttonClickCount: number = 0;

  // ----------------------------------------------------
  // 4. 12 CHART DATASETS (TYPED WITH EXACT MODELS)
  // ----------------------------------------------------
  public allocatedMonths: string[] = ['Sprint 1', 'Sprint 2', 'Sprint 3'];
  public allocatedBarItems: RAllocatedBarChartItem[] = [
    new RAllocatedBarChartItem(
      'Infra Sprints',
      [
        new RAllocationData(100, 75),
        new RAllocationData(120, 90),
        new RAllocationData(150, 110),
      ],
      '#3b82f6',
      '#ffffff',
      'Budget Allocated',
      'Actual Spent'
    ),
    new RAllocatedBarChartItem(
      'AI Research',
      [
        new RAllocationData(80, 60),
        new RAllocationData(110, 85),
        new RAllocationData(140, 130),
      ],
      '#8b5cf6',
      '#ffffff',
      'Budget Allocated',
      'Actual Spent'
    ),
  ];

  public barVerticalMonths: string[] = ['Q1', 'Q2', 'Q3', 'Q4'];
  public barVerticalColumns: RBarChartItem[] = [
    new RBarChartItem('Revenue', [42000, 58000, 51000, 73000], '#3b82f6', '#ffffff'),
    new RBarChartItem('Expenses', [30000, 35000, 38000, 44000], '#10b981', '#ffffff'),
  ];

  public barHorizontalItems: string[] = [
    'Design',
    'Development',
    'QA & Testing',
    'DevOps',
    'Product',
  ];
  public barHorizontalColumns: RBarChartItem[] = [
    new RBarChartItem('Planned (hrs)', [120, 300, 80, 60, 50], '#534AB7', '#ffffff'),
    new RBarChartItem('Actual (hrs)', [140, 260, 95, 70, 45], '#0F6E56', '#ffffff'),
  ];

  public pieChartItems: RPieChartItem[] = [
    new RPieChartItem(40, 'Frontend UI', '#3b82f6', '#ffffff'),
    new RPieChartItem(25, 'AI Engine', '#8b5cf6', '#ffffff'),
    new RPieChartItem(20, 'Cloud Services', '#10b981', '#ffffff'),
    new RPieChartItem(15, 'Quality Assurance', '#f59e0b', '#ffffff'),
  ];

  public donutChartItems: RDonutChartItem[] = [
    new RDonutChartItem(35, 'Compute / GPU', '#06b6d4', '#ffffff'),
    new RDonutChartItem(30, 'Storage / CDN', '#3b82f6', '#ffffff'),
    new RDonutChartItem(20, 'Network Bandwidth', '#8b5cf6', '#ffffff'),
    new RDonutChartItem(15, 'Security & IAM', '#ec4899', '#ffffff'),
  ];

  public barChartItems: RBarChartItem[] = [
    new RBarChartItem('Q1 2026', [85], '#3b82f6', '#ffffff'),
    new RBarChartItem('Q2 2026', [120], '#10b981', '#ffffff'),
    new RBarChartItem('Q3 2026', [160], '#8b5cf6', '#ffffff'),
    new RBarChartItem('Q4 2026', [210], '#f59e0b', '#ffffff'),
  ];

  public lineMonths: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  public lineChartItems: RLineChartItem[] = [
    new RLineChartItem('Users', '#3b82f6', [1200, 1900, 1700, 2400, 2100, 3000]),
    new RLineChartItem('Sessions', '#10b981', [2000, 2800, 2400, 3200, 2900, 4120]),
  ];

  public arealineMonths: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  public areaChartItems: RAreaChartItem[] = [
    new RAreaChartItem('Traffic Ingress', '#8b5cf6', [35, 55, 75, 110, 140, 195]),
    new RAreaChartItem('Traffic Egress', '#06b6d4', [20, 35, 50, 70, 95, 130]),
  ];

  public scatterChartItems: RScatterChartItem[] = [
    new RScatterChartItem('Cluster A', '#3b82f6', [
      new RGraph(10, 25),
      new RGraph(20, 45),
      new RGraph(35, 70),
      new RGraph(50, 95),
      new RGraph(70, 130),
    ]),
    new RScatterChartItem('Cluster B', '#f59e0b', [
      new RGraph(15, 30),
      new RGraph(30, 60),
      new RGraph(45, 80),
      new RGraph(60, 110),
      new RGraph(80, 150),
    ]),
  ];

  public stackedbarChartXAxisItemNames1: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  public stackedbarChartItems1: RBarChartItem[] = [
    new RBarChartItem('Compute Expense', [2500, 2000, 1650, 2700, 2300, 1800], '#3b82f6', '#ffffff'),
    new RBarChartItem('Storage Expense', [1600, 377, 2000, 450, 700, 350], '#8b5cf6', '#ffffff'),
  ];

  public stackedrangebarChartXAxisItemNames1: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  public stackedrangebarChartItems1: RBarChartItem[] = [
    new RBarChartItem('Baseline Variance', [-1170, 2000, 1170, -610, 3000, 2400, -1800], '#3b82f6', '#ffffff'),
    new RBarChartItem('Peak Variance', [-1170, 377, 1170, -1590, 450, 5, 350], '#10b981', '#ffffff'),
  ];

  public seriesModel2: RYSeriesChartItem[] = [
    new RYSeriesChartItem('API Ingestion', '#10b981', [10, 30, 40, 50, 70, 90]),
    new RYSeriesChartItem('Worker Nodes', '#ec4899', [10, 50, 60, 60, 80, 110]),
  ];

  public seriesChartItems: RGraphSeriesChartItem[] = [
    new RGraphSeriesChartItem('API Ingestion', '#10b981', [
      new RGraph(1, 20),
      new RGraph(2, 45),
      new RGraph(3, 65),
      new RGraph(4, 90),
    ]),
    new RGraphSeriesChartItem('Worker Nodes', '#ec4899', [
      new RGraph(1, 15),
      new RGraph(2, 35),
      new RGraph(3, 50),
      new RGraph(4, 80),
    ]),
  ];

  // ----------------------------------------------------
  // 5. STEPPERS, TRACKERS, EVENTS & SCHEDULES
  // ----------------------------------------------------
  public horizontalStateItems: RSequenceHorizontalItem[] = [
    this.makeHorizontalStep(1, 'Architecture Spec', false, true, false),
    this.makeHorizontalStep(2, 'Dynamic Engine', false, true, false),
    this.makeHorizontalStep(3, 'CVA Static Binding', true, false, false),
    this.makeHorizontalStep(4, 'E2E Testing', false, false, true),
    this.makeHorizontalStep(5, 'Production Launch', false, false, true),
  ];

  public verticalStateItems: RSequenceVerticalItem[] = [
    this.makeVerticalStep(1, 'Config Initialized', false, true, false),
    this.makeVerticalStep(2, 'Component Bindings Linked', false, true, false),
    this.makeVerticalStep(3, 'Two-Way NgModel Sync', true, false, false),
    this.makeVerticalStep(4, 'Live Model Verified', false, false, true),
  ];

  public sequenceItems: RSequenceVerticalItem[] = (() => {
    const steps = ['Order Placed', 'Processing Pipeline', 'Deployed to Cluster', 'Operational'];
    return steps.map((text, i) => {
      const item = new RSequenceVerticalItem();
      item.StepNo = i + 1;
      item.Value = i + 1;
      item.DisplayText = text;
      if (i < 2) item.IsCompleted = true;
      else if (i === 2) item.IsActive = true;
      else item.IsPending = true;
      item.IsLeftAlign = true;
      return item;
    });
  })();

  public hsequenceItems: RSequenceHorizontalItem[] = (() => {
    const steps = ['Order Placed', 'Shipped', 'Delivered'];
    return steps.map((text, i) => {
      const item = new RSequenceHorizontalItem();
      item.StepNo = i + 1;
      item.Value = i + 1;
      item.DisplayText = text;
      if (i < 2) item.IsCompleted = true;
      else if (i === 2) item.IsActive = true;
      else item.IsPending = true;
      item.IsTopAlign = true;
      return item;
    });
  })();

  public stateVertical: RSequenceVerticalItem = this.sequenceItems[2];
  public stateHorizontal: RSequenceHorizontalItem = this.hsequenceItems[1];

  public stepperActiveIndex: number = 1;

  public scheduleItems!: REventsSchedules;
  public selectedDate: string = '12-17-2024';
  public calenderEvents: EventsCalenderModel = new EventsCalenderModel();

  // ----------------------------------------------------
  // 6. NAVIGATION & DATA CONTAINERS
  // ----------------------------------------------------
  public gridItems = [
    { id: 101, name: 'Dynamic Host Engine', category: 'Core Runtime', version: '2.4.0', status: 'Operational', coverage: '98%' },
    { id: 102, name: 'Bidirectional CVA Bridge', category: 'Forms & Data', version: '3.1.2', status: 'Operational', coverage: '100%' },
    { id: 103, name: 'Cascading Dropdown Resolver', category: 'Reactivity', version: '1.8.0', status: 'Operational', coverage: '96%' },
    { id: 104, name: 'HTML5 Canvas Visualizer', category: 'Graphics', version: '2.0.5', status: 'Operational', coverage: '94%' },
    { id: 105, name: 'Virtual Scrolling Grid', category: 'Containers', version: '4.0.1', status: 'Operational', coverage: '97%' },
  ];

  public gridItemsAuto: any[] = [
    { ID: 101, Service: 'Dynamic Host Engine', Cluster: 'US-West-1', Uptime: '99.99%', Status: 'Operational' },
    { ID: 102, Service: 'CVA Two-Way Bridge', Cluster: 'EU-Central-1', Uptime: '100.0%', Status: 'Operational' },
    { ID: 103, Service: 'Cascading Dropdown Sync', Cluster: 'AP-South-1', Uptime: '99.95%', Status: 'Operational' },
    { ID: 104, Service: 'HTML5 Canvas Visualizer', Cluster: 'US-East-2', Uptime: '99.98%', Status: 'Operational' },
    { ID: 105, Service: 'Virtual Scroll Engine', Cluster: 'EU-West-3', Uptime: '100.0%', Status: 'Operational' },
  ];

  public gridItems1: any[] = [
    {
      Id: 101,
      Avatar: 'AC',
      AvatarBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      Name: 'Alex Chen',
      Email: 'alex.chen@enterprise.io',
      Role: 'Staff Cloud Architect',
      Department: new DropdownModel('eng', 'Engineering & AI'),
      Score: 98,
      ScoreTier: 'Exceptional (98%)',
      Age: 28,
      Education: new DropdownModel(2, 'M.S. in AI & Cloud'),
      DegreeType: 'Master of Science',
      Status: 'Active',
      IsGrad: true
    },
    {
      Id: 102,
      Avatar: 'PS',
      AvatarBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      Name: 'Priya Sharma',
      Email: 'priya.s@enterprise.io',
      Role: 'Lead ML / AI Scientist',
      Department: new DropdownModel('eng', 'Engineering & AI'),
      Score: 95,
      ScoreTier: 'Exceptional (95%)',
      Age: 26,
      Education: new DropdownModel(3, 'Ph.D. in Machine Learning'),
      DegreeType: 'Doctorate',
      Status: 'Active',
      IsGrad: true
    },
    {
      Id: 103,
      Avatar: 'MW',
      AvatarBg: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      Name: 'Marcus Weber',
      Email: 'm.weber@enterprise.io',
      Role: 'Director of Product',
      Department: new DropdownModel('prod', 'Product Strategy'),
      Score: 92,
      ScoreTier: 'Exceeding (92%)',
      Age: 31,
      Education: new DropdownModel(1, 'B.Tech in Computer Science'),
      DegreeType: 'Bachelor of Tech',
      Status: 'Active',
      IsGrad: true
    },
    {
      Id: 104,
      Avatar: 'YT',
      AvatarBg: 'linear-gradient(135deg, #ec4899, #be185d)',
      Name: 'Yuki Tanaka',
      Email: 'yuki.t@enterprise.io',
      Role: 'Design Systems Lead',
      Department: new DropdownModel('des', 'Experience Design'),
      Score: 89,
      ScoreTier: 'Exceeding (89%)',
      Age: 29,
      Education: new DropdownModel(2, 'M.S. in HCI & Design'),
      DegreeType: 'Master of Science',
      Status: 'In Review',
      IsGrad: true
    },
    {
      Id: 105,
      Avatar: 'SJ',
      AvatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      Name: 'Sarah Jenkins',
      Email: 'sarah.j@enterprise.io',
      Role: 'Enterprise Solutions Exec',
      Department: new DropdownModel('sales', 'Global Enterprise Sales'),
      Score: 86,
      ScoreTier: 'Achieving (86%)',
      Age: 27,
      Education: new DropdownModel(4, 'B.S. in Systems Engineering'),
      DegreeType: 'Bachelor of Science',
      Status: 'On Standby',
      IsGrad: false
    },
    {
      Id: 106,
      Avatar: 'DM',
      AvatarBg: 'linear-gradient(135deg, #10b981, #047857)',
      Name: 'David Miller',
      Email: 'david.m@enterprise.io',
      Role: 'Kernel & CVA Architect',
      Department: new DropdownModel('eng', 'Engineering & AI'),
      Score: 94,
      ScoreTier: 'Exceptional (94%)',
      Age: 34,
      Education: new DropdownModel(3, 'Ph.D. in Computer Engineering'),
      DegreeType: 'Doctorate',
      Status: 'Active',
      IsGrad: true
    }
  ];

  public ditems: DropdownModel[] = [
    new DropdownModel(5, '5'),
    new DropdownModel(10, '10'),
    new DropdownModel(20, '20'),
  ];
  public ItemsPerPage: DropdownModel = new DropdownModel(5, '5');
  public gridItemsPerPage: DropdownModel = new DropdownModel(5, '5');

  public carouselImages: { src: string; title: string }[] = [
    {
      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="220" style="background:%232563eb;"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="20" font-family="sans-serif">Slide 1: Enterprise System Architecture</text></svg>',
      title: 'Enterprise System',
    },
    {
      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="220" style="background:%237c3aed;"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="20" font-family="sans-serif">Slide 2: Two-Way CVA Model Synchronization</text></svg>',
      title: 'CVA Model Sync',
    },
    {
      src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="220" style="background:%2310b981;"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="20" font-family="sans-serif">Slide 3: High-Performance Canvas Visualizations</text></svg>',
      title: 'Canvas Visualizations',
    },
  ];

  public addCarouselSlide(): void {
    const nextIndex = this.carouselImages.length + 1;
    const colors = ['#f59e0b', '#ec4899', '#06b6d4', '#84cc16'];
    const color = colors[(nextIndex - 1) % colors.length];
    this.carouselImages.push({
      src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="220" style="background:${encodeURIComponent(color)};"><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23ffffff" font-size="20" font-family="sans-serif">Slide ${nextIndex}: Dynamic Scalable Node</text></svg>`,
      title: `Slide ${nextIndex}`,
    });
  }

  public stepperHorizontalIndex: number = 0;
  public stepperVerticalIndex: number = 0;

  public nextHorizontalStep(): void {
    if (this.stepperHorizontalIndex < 3) this.stepperHorizontalIndex++;
  }
  public prevHorizontalStep(): void {
    if (this.stepperHorizontalIndex > 0) this.stepperHorizontalIndex--;
  }
  public nextVerticalStep(): void {
    if (this.stepperVerticalIndex < 3) this.stepperVerticalIndex++;
  }
  public prevVerticalStep(): void {
    if (this.stepperVerticalIndex > 0) this.stepperVerticalIndex--;
  }

  public treeItems: RTreeItem[] = [
    this.makeTreeItem('1', 'Enterprise Dynamic System', [
      this.makeTreeItem('2', 'rcomponents (50+ Components)', [
        this.makeTreeItem('3', '17 CVA Form Controls'),
        this.makeTreeItem('4', '12 Visualizations & Charts'),
        this.makeTreeItem('5', '8 Steppers & State Trackers'),
        this.makeTreeItem('6', '12 Containers & Layouts'),
        this.makeTreeItem('7', '4 Indicators & Actions'),
      ]),
      this.makeTreeItem('8', 'Static Model Binding & Two-Way NgModel'),
    ]),
  ];

  public activeCategoryTab: string = 'all';

  // ----------------------------------------------------
  // 7. TIMER & CONTROLS
  // ----------------------------------------------------
  @ViewChild('timerRef', { static: false })
  public timerComponent!: RTimerComponent;
  public timerCallbackResult: string = 'Not triggered';

  constructor(private cdr: ChangeDetectorRef) {
    this.initCalendarEvents();
    this.initScheduleItems();
  }

  // ----------------------------------------------------
  // EVENT HANDLERS & CASCADING LOGIC
  // ----------------------------------------------------
  public onCountryChange(countryVal: any): void {
    const val = typeof countryVal === 'object' && countryVal?.Value ? countryVal.Value : countryVal;
    this.selectedCountry = val;
    this.currentStates = this.statesByCountry[val] || [];
    this.selectedState = (this.currentStates[0]?.Value as string) || '';
    this.onStateChange(this.selectedState);
  }

  public onStateChange(stateVal: any): void {
    const val = typeof stateVal === 'object' && stateVal?.Value ? stateVal.Value : stateVal;
    this.selectedState = val;
    this.currentCities = this.citiesByState[val] || [];
    this.selectedCity = (this.currentCities[0]?.Value as string) || '';
  }

  public onDepartmentChange(deptVal: any): void {
    const val = typeof deptVal === 'object' && deptVal?.Value ? deptVal.Value : deptVal;
    this.selectedDepartment = val;
    this.currentRoles = this.rolesByDepartment[val] || [];
    this.selectedRole = (this.currentRoles[0]?.Value as string) || '';
  }

  public onCalendarChange(date: any): void {
    this.calendarSelectedDate = date;
    if (date instanceof Date) {
      this.calendarVal = date.toISOString().split('T')[0];
    } else if (typeof date === 'string') {
      this.calendarVal = date;
    }
  }

  public onButtonClick(): void {
    this.buttonClickCount++;
    this.lastButtonClickMsg = `RButton clicked ${this.buttonClickCount} time(s) at ${new Date().toLocaleTimeString()}!`;
  }

  public setCategory(cat: string): void {
    this.activeCategoryTab = cat;
  }

  public startTimer(): void {
    if (this.timerComponent) {
      this.timerComponent.StartTimer();
    }
  }

  public stopTimer(): void {
    if (this.timerComponent) {
      this.timerComponent.StopTimer();
    }
  }

  public onTimerCallback(result: RTimerResult): void {
    this.timerCallbackResult = `${result.Hour}:${result.Minute}:${result.Seconds}`;
  }

  public onTreeExpand(item: RTreeItem): void {
    item.IsExpanded = !item.IsExpanded;
  }

  public loadPreset(preset: 'usa' | 'germany' | 'india' | 'japan'): void {
    if (preset === 'usa') {
      this.selectedCountry = 'usa';
      this.onCountryChange('usa');
      this.textboxVal = 'Alex Chen';
      this.numericVal = 16;
      this.sliderVal = 75;
      this.colorPickerVal = '#3b82f6';
      this.pickedColor = '#3b82f6';
      this.selectedDepartment = 'eng';
      this.onDepartmentChange('eng');
    } else if (preset === 'germany') {
      this.selectedCountry = 'de';
      this.onCountryChange('de');
      this.textboxVal = 'Klaus Müller';
      this.numericVal = 24;
      this.sliderVal = 90;
      this.colorPickerVal = '#10b981';
      this.pickedColor = '#10b981';
      this.selectedDepartment = 'prod';
      this.onDepartmentChange('prod');
    } else if (preset === 'india') {
      this.selectedCountry = 'in';
      this.onCountryChange('in');
      this.textboxVal = 'Priya Narayanan';
      this.numericVal = 32;
      this.sliderVal = 85;
      this.colorPickerVal = '#8b5cf6';
      this.pickedColor = '#8b5cf6';
      this.selectedDepartment = 'eng';
      this.onDepartmentChange('eng');
    } else if (preset === 'japan') {
      this.selectedCountry = 'jp';
      this.onCountryChange('jp');
      this.textboxVal = 'Kenji Takahashi';
      this.numericVal = 18;
      this.sliderVal = 95;
      this.colorPickerVal = '#ec4899';
      this.pickedColor = '#ec4899';
      this.selectedDepartment = 'des';
      this.onDepartmentChange('des');
    }
  }

  public changeCalenderMonth(month: CalenderChangeMonthInfo): void {
    const cl = new EventsCalenderModel();
    const eachday = new EachDayEventsModel(new Date(month.Year, month.Month, 5));
    eachday.Events.push(new AddEventModel('1', 'Sprint Retrospective', '10:00 AM', '11:00 AM', '#2563eb'));
    eachday.Events.push(new AddEventModel('2', 'Architecture Review', '02:00 PM', '03:30 PM', '#7c3aed'));
    cl.EachDay.push(eachday);
    this.calenderEvents = cl;
    this.cdr.detectChanges();
  }

  private initCalendarEvents(): void {
    this.calenderEvents = new EventsCalenderModel();
    const today = new Date();
    const eachday = new EachDayEventsModel(today);
    eachday.Events.push(new AddEventModel('1', 'Sprint Planning', '09:00 AM', '10:00 AM', '#2563eb'));
    eachday.Events.push(new AddEventModel('2', 'Design System Sync', '02:00 PM', '03:00 PM', '#10b981'));
    eachday.Events.push(new AddEventModel('3', 'E2E Testing Demo', '04:30 PM', '05:30 PM', '#f59e0b'));
    this.calenderEvents.EachDay.push(eachday);
  }

  private initScheduleItems(): void {
    const items = new REventsSchedules();

    const channel1 = new REventChannelItem();
    channel1.ChannelTitle = 'Production Cloud Services';
    channel1.CalculateStartAndEndTimeBasedOnDuration = true;
    channel1.RenderEventsInContinousSequence = true;
    channel1.ValueKey = {};
    channel1.Events.push(new REvent('', 30, 'Cluster Health Check', {}));
    channel1.Events.push(new REvent('', 45, 'Service Deployment', {}));
    channel1.Events.push(new REvent('', 60, 'Security Audit Scan', {}));
    channel1.Events.push(new REvent('', 30, 'Telemetry Sync', {}));

    const channel2 = new REventChannelItem();
    channel2.ChannelTitle = 'AI & Data Pipelines';
    channel2.CalculateStartAndEndTimeBasedOnDuration = false;
    channel2.RenderEventsInContinousSequence = false;
    channel2.ValueKey = {};
    channel2.Events.push(new REvent('09:00', 30, 'Model Training Run', {}));
    channel2.Events.push(new REvent('11:00', 45, 'Inference Benchmarking', {}));
    channel2.Events.push(new REvent('14:30', 60, 'Knowledge Graph Sync', {}));
    channel2.Events.push(new REvent('16:45', 30, 'Checkpoint Backup', {}));

    const dateSchedule = new REventsDateSchedule();
    dateSchedule.ChannelItems.push(channel1);
    dateSchedule.ChannelItems.push(channel2);

    items['12-17-2024'] = dateSchedule;
    items['12-18-2024'] = dateSchedule;
    items['12-19-2024'] = dateSchedule;

    this.scheduleItems = items;
  }

  // ----------------------------------------------------
  // HELPER METHODS
  // ----------------------------------------------------
  private makeHorizontalStep(
    stepNo: number,
    text: string,
    isActive = false,
    isCompleted = false,
    isPending = false
  ): RSequenceHorizontalItem {
    const item = new RSequenceHorizontalItem();
    item.StepNo = stepNo;
    item.DisplayText = text;
    item.IsActive = isActive;
    item.IsCompleted = isCompleted;
    item.IsPending = isPending;
    item.IsTopAlign = true;
    return item;
  }

  private makeVerticalStep(
    stepNo: number,
    text: string,
    isActive = false,
    isCompleted = false,
    isPending = false
  ): RSequenceVerticalItem {
    const item = new RSequenceVerticalItem();
    item.StepNo = stepNo;
    item.DisplayText = text;
    item.IsActive = isActive;
    item.IsCompleted = isCompleted;
    item.IsPending = isPending;
    item.IsLeftAlign = true;
    return item;
  }

  private makeTreeItem(id: string, text: string, children: RTreeItem[] = []): RTreeItem {
    const item = new RTreeItem();
    item.Id = id;
    item.DisplayText = text;
    item.IsExpanded = true;
    if (children.length > 0) {
      item.AddChildItems(children);
    }
    return item;
  }
}
