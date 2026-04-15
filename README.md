# 🧩 Angular Controls — rcomponents

<p align="center">
  <img src="https://img.shields.io/badge/Angular-18-red?logo=angular&logoColor=white" alt="Angular 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/SSR-Supported-green?logo=node.js&logoColor=white" alt="SSR" />
  <img src="https://img.shields.io/badge/Standalone-Components-purple" alt="Standalone" />
  <img src="https://img.shields.io/badge/license-MIT-brightgreen" alt="MIT License" />
</p>

<p align="center">
  A comprehensive suite of <strong>reusable Angular UI components</strong> (rcomponents) built with Angular 18, featuring full <strong>Server-Side Rendering (SSR)</strong> compatibility, standalone component architecture, and rich customisation via <code>@Input()</code> bindings.
</p>

---

## 📋 Table of Contents

- [Getting Started](#-getting-started)
- [Installation](#-installation)
- [Form Controls](#-form-controls)
  - [RButton](#rbutton)
  - [RTextbox](#rtextbox)
  - [RCheckbox](#rcheckbox)
  - [RRadioButton](#rradiobutton)
  - [RSwitch](#rswitch)
  - [RNumeric](#rnumeric)
  - [RColorPicker](#rcolorpicker)
  - [RFileUpload](#rfileupload)
- [Selection & Dropdowns](#-selection--dropdowns)
  - [RDropdown](#rdropdown)
  - [RSelectDropdown](#rselectdropdown)
- [Layout & Containers](#-layout--containers)
  - [RGroupPanel](#rgrouppanel)
  - [RTabs](#rtabs)
  - [RFlatTabs](#rflattabs)
  - [RSplitter](#rsplitter)
- [Data Display](#-data-display)
  - [RGrid](#rgrid)
  - [RTree](#rtree)
  - [RFilter](#rfilter)
- [Date, Time & Calendar](#-date-time--calendar)
  - [RCalendar](#rcalendar)
  - [REventsCalendar](#reventscalendar)
  - [REventsSchedule](#reventsschedule)
  - [RTimeSelector](#rtimeselector)
  - [RTimer](#rtimer)
- [Progress & Indicators](#-progress--indicators)
  - [RProgressBar](#rprogressbar)
  - [RSlider](#rslider)
  - [RRangeSlider](#rrangeslider)
  - [RStarRating](#rstarrating)
- [Steppers & Sequences](#-steppers--sequences)
  - [RStepperVertical](#rsteppervertical)
  - [RStepperHorizontal](#rstepperhorizontal)
  - [RSequenceVertical](#rsequencevertical)
  - [RSequenceHorizontal](#rsequencehorizontal)
- [Charts](#-charts)
  - [RDonutChart](#rdonutchart)
  - [RPieChart](#rpiechart)
  - [RBarChart Vertical](#rbarchart-vertical)
  - [RBarChart Horizontal](#rbarchart-horizontal)
  - [RStackedBarChart Vertical](#rstackedbarchart-vertical)
  - [RStackedBarChart Horizontal](#rstackedbarchart-horizontal)
  - [RStackedRangeBarChart Vertical](#rstackedrangebarchart-vertical)
  - [RScatterChart](#rscatterchart)
  - [RLineChart](#rlinechart)
  - [RAreaChart](#rareachart)
  - [RAllocationBarChart](#rallocationbarchart)
  - [RSeriesChart](#rserieschart)
- [SSR Compatibility](#-ssr-compatibility)
- [Project Structure](#-project-structure)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 18+

### Build the Library

```bash
# Clone the repository
git clone https://github.com/rajhseg/Angular-Controls.git
cd "Angular Controls"

# Install dependencies
npm install --legacy-peer-deps

# Build the rcomponents library first
ng build rcomponents --configuration=development

# Build the main application
ng build --configuration=development

# Serve the application
ng serve
```

---

## 📦 Installation

Import `RComponentsModule` in your Angular module or use individual standalone components:

```typescript
// Option 1: Import the full module
import { RComponentsModule } from 'rcomponents';

@NgModule({
  imports: [RComponentsModule]
})
export class AppModule {}

// Option 2: Import individual standalone components
import { RButtonComponent, RTextboxComponent } from 'rcomponents';

@Component({
  standalone: true,
  imports: [RButtonComponent, RTextboxComponent]
})
export class MyComponent {}
```

---

## 🎛️ Form Controls

### RButton

A styleable button component with custom dimensions and colours.

<img width="110" height="58" alt="RButton" src="https://github.com/user-attachments/assets/a39ae1ca-a904-49b2-a604-56ac9c62408d" />

**Selector:** `<rbutton>`

**Usage:**
```html
<rbutton
  [BackgroundColor]="'#8f19ff'"
  [ForeColor]="'white'"
  [ButtonWidth]="'120px'"
  [ButtonHeight]="'40px'"
  (ButtonClick)="onButtonClick($event)">
  Submit
</rbutton>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `BackgroundColor` | `string` | `'blue'` | Button background colour |
| `ForeColor` | `string` | `'whitesmoke'` | Button text colour |
| `ButtonWidth` | `string` | `'100px'` | Width of the button |
| `ButtonHeight` | `string` | `'32px'` | Height of the button |
| `ButtonType` | `string` | `'button'` | HTML button type attribute |
| `EnableBackDrop` | `boolean` | `false` | Enables a backdrop effect |

| Output | Description |
|---|---|
| `ButtonClick` | Emits when the button is clicked |

---

### RTextbox

A styled text input with label, password mode, and bottom-line animation.

<img width="561" height="90" alt="RTextbox" src="https://github.com/user-attachments/assets/66fb75ac-6320-4622-9b21-64d9a1e55a96" />

**Password variant:**

<img width="574" height="88" alt="RTextbox Password" src="https://github.com/user-attachments/assets/34420472-4b75-4a87-b2ef-46e011546fff" />

**Selector:** `<rtextbox>`

**Usage:**
```html
<rtextbox
  [LabelText]="'Username'"
  [LabelForeColor]="'#8f19ff'"
  [BottomLineColor]="'#8f19ff'"
  [TextBoxWidth]="'200px'"
  [(ngModel)]="username">
</rtextbox>

<rtextbox
  [LabelText]="'Password'"
  [IsPasswordBox]="true"
  [(ngModel)]="password">
</rtextbox>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `LabelText` | `string` | `''` | Label displayed above the input |
| `LabelForeColor` | `string` | `'blue'` | Colour of the label text |
| `BottomLineColor` | `string` | `'blue'` | Colour of the animated bottom border |
| `IsPasswordBox` | `boolean` | `false` | Enables password masking |
| `TextBoxWidth` | `string` | `'150px'` | Width of the input |
| `TextBoxHeight` | `string` | `'20px'` | Height of the input |
| `PlaceholderText` | `string` | `''` | Placeholder text |
| `EnableBoxShadow` | `boolean` | `false` | Adds a shadow around the input |
| `IsReadOnly` | `boolean` | `false` | Makes the field read-only |

---

### RCheckbox

A customisable checkbox with group support and ngModel binding.

<img width="314" height="110" alt="RCheckbox" src="https://github.com/user-attachments/assets/a7f2af42-e10c-4d55-8ebf-41a44181a9e9" />

**Selector:** `<rcheckbox>`

**Usage:**
```html
<rcheckbox
  [DisplayText]="'Volleyball'"
  [CheckedColor]="'#8f19ff'"
  [(ngModel)]="isVolleyballSelected">
</rcheckbox>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `DisplayText` | `string` | `''` | Label next to the checkbox |
| `CheckedColor` | `string` | `'#00c7ba'` | Colour when checked |
| `LabelColor` | `string` | `'black'` | Colour of the label text |
| `GroupName` | `string` | `''` | Group name for grouped checkboxes |
| `DisplayTextRightAlign` | `boolean` | `true` | Aligns label to the right of checkbox |

| Output | Description |
|---|---|
| `OnCheckChanged` | Fires when check state changes |
| `OnCheckBoxClick` | Fires on click |

---

### RRadioButton

A styleable radio button with group name support.

<img width="331" height="104" alt="RRadioButton" src="https://github.com/user-attachments/assets/712eb7fe-d050-4541-b59f-e8bf40e7d32f" />

**Selector:** `<rradiobutton>`

**Usage:**
```html
<rradiobutton
  [DisplayText]="'Tennis'"
  [Color]="'#8f19ff'"
  [GroupName]="'sports'"
  [(ngModel)]="selectedSport">
</rradiobutton>
```

| Input | Type | Description |
|---|---|---|
| `DisplayText` | `string` | Label text beside the radio button |
| `Color` | `string` | Accent colour |
| `GroupName` | `string` | Groups related radio buttons |
| `DesignWidth` | `string` | Width of the radio control |

---

### RSwitch

A toggle switch control with label and colour customisation.

<img width="194" height="42" alt="RSwitch" src="https://github.com/user-attachments/assets/cb4ab400-9dad-4915-9442-18fbc6af81a8" />

**Selector:** `<rswitch>`

**Usage:**
```html
<rswitch
  [DisplayLabel]="'Enable notifications'"
  [SwitchBackColor]="'#8f19ff'"
  [(ngModel)]="isEnabled"
  (checked)="onToggle($event)">
</rswitch>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `DisplayLabel` | `string` | `''` | Label next to the switch |
| `LabelForeColor` | `string` | `'blue'` | Label text colour |
| `SwitchBackColor` | `string` | `'rgba(27,81,199,0.69)'` | Background colour when active |

| Output | Description |
|---|---|
| `checked` | Emits `boolean` on toggle |

---

### RNumeric

A numeric spinner control with step, min/max and formatted display.

<img width="242" height="94" alt="RNumeric" src="https://github.com/user-attachments/assets/09a6af80-448e-482f-ab20-7d0a19d256e6" />

**Selector:** `<rnumeric>`

**Usage:**
```html
<rnumeric
  [Value]="10"
  [MinValue]="0"
  [MaxValue]="100"
  [StepValue]="1">
</rnumeric>
```

---

### RColorPicker

A full-featured colour picker with hex/RGB support.

<img width="348" height="360" alt="RColorPicker" src="https://github.com/user-attachments/assets/84e0613f-1ab8-4bd7-9673-15fd5c190076" />

**Selector:** `<rcolorpicker>`

**Usage:**
```html
<rcolorpicker
  (ColorChanged)="onColorChange($event)"
  [SelectedColor]="'#8f19ff'">
</rcolorpicker>
```

| Input | Type | Description |
|---|---|---|
| `SelectedColor` | `string` | Initial colour value |

| Output | Description |
|---|---|
| `ColorChanged` | Emits the new colour string |

---

### RFileUpload

A drag-and-drop file upload component with file type filtering.

<img width="320" height="120" alt="RFileUpload" src="https://github.com/user-attachments/assets/8a949651-b5c9-4554-a809-83748dcd1b46" />

**Selector:** `<rfileupload>`

**Usage:**
```html
<rfileupload
  [AllowMultiple]="true"
  [AcceptTypes]="'.pdf,.docx,.png'"
  (FilesSelected)="onFilesSelected($event)">
</rfileupload>
```

| Output | Description |
|---|---|
| `FilesSelected` | Emits selected `File[]` array |
| `FileRemoved` | Emits when a file is removed |

---

## 📂 Selection & Dropdowns

### RDropdown

A multi-select capable dropdown with search and customisable width.

<img width="283" height="283" alt="RDropdown" src="https://github.com/user-attachments/assets/516f7586-ea57-4ce9-a25e-74013c6ef70d" />

**Selector:** `<rdropdown>`

**Usage:**
```html
<rdropdown
  [Items]="dropdownItems"
  [IsMulti]="true"
  [Width]="'150px'"
  [DropDownContentWidth]="'280px'"
  [(ngModel)]="selectedValues">
</rdropdown>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `Items` | `DropdownModel[]` | `[]` | List of dropdown options |
| `IsMulti` | `boolean` | `false` | Enables multi-selection |
| `Width` | `string` | — | Trigger button width |
| `DropDownContentWidth` | `string` | — | Width of the dropdown panel |

| Output | Description |
|---|---|
| `ItemSelected` | Emits the selected item |
| `ItemsSelected` | Emits array of selected items (multi-mode) |

---

### RSelectDropdown

A rich select-style dropdown with images and search capabilities.

<img width="300" height="285" alt="RSelectDropdown" src="https://github.com/user-attachments/assets/d686b727-7fae-4056-9616-e9f26b4acc9a" />

**Selector:** `<rselectdropdown>`

**Usage:**
```html
<rselectdropdown
  [Items]="selectItems"
  [IsMulti]="false"
  [(ngModel)]="selectedValue">
</rselectdropdown>
```

---

## 🗂️ Layout & Containers

### RGroupPanel

A collapsible group panel with a header and content projection.

![RGroupPanel](https://github.com/user-attachments/assets/d18acc04-5212-4118-a7b9-abc98a7fed1c)

**Selector:** `<rgroup-panel>`

**Usage:**
```html
<rgroup-panel [Title]="'User Details'" [IsCollapsible]="true">
  <!-- projected content -->
  <p>Name: John Doe</p>
</rgroup-panel>
```

| Input | Type | Description |
|---|---|---|
| `Title` | `string` | Panel header title |
| `IsCollapsible` | `boolean` | Enables collapse/expand toggle |
| `HeaderColor` | `string` | Header background colour |

---

### RTabs

A standard tab container with customisable tab styles.

![RTabs](https://github.com/user-attachments/assets/73fecaf6-ef16-423b-874f-dbfd80ee7a12)

**Selector:** `<rtab>` inside a tabs host

**Usage:**
```html
<rtabs>
  <rtab [Title]="'Tab 1'">Content for tab 1</rtab>
  <rtab [Title]="'Tab 2'">Content for tab 2</rtab>
</rtabs>
```

---

### RFlatTabs

A flat-style tab bar with underline indicator.

![RFlatTabs](https://github.com/user-attachments/assets/ba64778a-ed66-4f9d-a0e1-e6599a521066)

**Selector:** `<rflattabs>`

**Usage:**
```html
<rflattabs
  [Tabs]="tabItems"
  [ActiveTabColor]="'#8f19ff'"
  (TabChanged)="onTabChange($event)">
</rflattabs>
```

| Input | Type | Description |
|---|---|---|
| `Tabs` | `any[]` | Array of tab label objects |
| `ActiveTabColor` | `string` | Colour of the active tab indicator |

| Output | Description |
|---|---|
| `TabChanged` | Emits when user switches tab |

---

### RSplitter

A resizable split-pane layout component.

<img width="1004" height="333" alt="RSplitter" src="https://github.com/user-attachments/assets/e4ea40cd-28a3-4f97-bbd8-b481c7091432" />

**Selector:** `<rsplitter>` with `<rsplitpage>` children

**Usage:**
```html
<rsplitter [Direction]="'horizontal'">
  <rsplitpage [Width]="'300px'">Left panel</rsplitpage>
  <rsplitpage>Right panel</rsplitpage>
</rsplitter>
```

| Input (`rsplitpage`) | Type | Description |
|---|---|---|
| `Width` | `string` | Initial pane width |
| `MinWidth` | `string` | Minimum draggable width |

---

## 📊 Data Display

### RGrid

A feature-rich data grid with sorting, filtering, pagination, inline editing, drag-and-drop rows, and virtual scrolling.

#### View Mode
<img width="992" height="336" alt="RGrid ViewMode" src="https://github.com/user-attachments/assets/c52a71ec-1cd1-4568-93bb-7e159267554f" />

#### Edit Mode
<img width="992" height="336" alt="RGrid EditMode" src="https://github.com/user-attachments/assets/dee8deb2-d5a0-4781-803a-72622375181a" />

**Selector:** `<rgrid>`

**Usage:**
```html
<rgrid
  [Items]="gridData"
  [IsEditable]="true"
  [EnablePagination]="true"
  [PageSize]="10"
  [EnableVirtualScroll]="false"
  (RowEdit)="onRowEdit($event)"
  (RowDelete)="onRowDelete($event)">

  <rcolumn [ColumnName]="'id'" [HeaderText]="'ID'" [Width]="'60px'"></rcolumn>
  <rcolumn [ColumnName]="'name'" [HeaderText]="'Name'"></rcolumn>
  <rcolumn [ColumnName]="'age'" [HeaderText]="'Age'" [Width]="'80px'"></rcolumn>
</rgrid>
```

| Input | Type | Description |
|---|---|---|
| `Items` | `any[]` | Data source array |
| `IsEditable` | `boolean` | Enables inline editing |
| `EnablePagination` | `boolean` | Shows pagination controls |
| `PageSize` | `number` | Rows per page |
| `EnableVirtualScroll` | `boolean` | Virtual scrolling for large datasets |
| `EnableDragDrop` | `boolean` | Enables row drag-and-drop reordering |

| Output | Description |
|---|---|
| `RowEdit` | Emits edited row data |
| `RowDelete` | Emits deleted row data |
| `RowSelected` | Emits selected row |
| `PageChanged` | Emits page change event |

---

### RTree

A hierarchical tree view component with expand/collapse.

<img width="301" height="223" alt="RTree" src="https://github.com/user-attachments/assets/4e18aae7-4102-4059-bb1e-862e43919d98" />

**Selector:** `<rtree>`

**Usage:**
```html
<rtree
  [Items]="treeData"
  (NodeSelected)="onNodeSelect($event)"
  (NodeExpanded)="onNodeExpand($event)">
</rtree>
```

| Input | Type | Description |
|---|---|---|
| `Items` | `RTreeModel[]` | Hierarchical data array |

| Output | Description |
|---|---|
| `NodeSelected` | Emits the selected tree node |
| `NodeExpanded` | Emits the expanded node |

---

### RFilter

An advanced column filter UI with multiple data type support.

![RFilter](https://github.com/user-attachments/assets/70f4fba1-9e1f-401d-a481-a9bdc0f029be)

**Selector:** `<rfilter>`

**Usage:**
```html
<rfilter
  [Columns]="filterColumns"
  (FilterApplied)="onFilterApply($event)">
</rfilter>
```

| Output | Description |
|---|---|
| `FilterApplied` | Emits `RFilterApplyModel[]` with applied filter rules |

---

## 📅 Date, Time & Calendar

### RCalendar

A date-picker calendar with format customisation.

<img width="345" height="297" alt="RCalendar" src="https://github.com/user-attachments/assets/28e93cae-48b4-47a6-b867-5b1dbbcfb328" />

**Selector:** `<rcalendar>`

**Usage:**
```html
<rcalendar
  [(ngModel)]="selectedDate"
  [DateFormat]="'yyyy - MMM - dd'"
  [SelectedItemBackGroundColor]="'#8f19ff'">
</rcalendar>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `DateFormat` | `string` | `'yyyy-MM-dd'` | Display format for the selected date |
| `SelectedItemBackGroundColor` | `string` | — | Highlight colour for selected date |
| `MinDate` | `Date` | — | Minimum selectable date |
| `MaxDate` | `Date` | — | Maximum selectable date |

---

### REventsCalendar

A full events calendar with month/week view and double-click to add events.

#### Main Screen
![REventsCalendar](https://github.com/user-attachments/assets/f7fab9d8-f9c6-4b39-bc07-9988171cb750)

#### Add Events Screen
<img width="785" height="672" alt="REventsCalendar AddEvent" src="https://github.com/user-attachments/assets/95985ca1-d2cf-4fcc-b6ff-5bd874cefc48" />

**Selector:** `<revents-calender>`

**Usage:**
```html
<revents-calender
  [Events]="calendarEvents"
  (EventAdded)="onEventAdded($event)"
  (EventClicked)="onEventClicked($event)">
</revents-calender>
```

---

### REventsSchedule

A timeline-style events schedule view.

![REventsSchedule](https://github.com/user-attachments/assets/97e54714-093f-46f7-b1ad-3e7dff7580a4)

**Selector:** `<revents-schedule>`

**Usage:**
```html
<revents-schedule
  [Events]="scheduleData"
  [StartHour]="8"
  [EndHour]="20">
</revents-schedule>
```

---

### RTimeSelector

A visual time picker with hour and minute selectors.

![RTimeSelector](https://github.com/user-attachments/assets/3af32442-7d88-4c53-84f9-1d4ace726636)

**Selector:** `<rtimeselector>`

**Usage:**
```html
<rtimeselector [(ngModel)]="selectedTime"></rtimeselector>
```

---

### RTimer

A countdown/count-up timer with circular and linear display modes.

<img width="386" height="166" alt="RTimer" src="https://github.com/user-attachments/assets/cf2502fb-e863-4a60-8c52-ca667d7c18eb" />

**Selector:** `<rtimer>`

**Usage:**
```html
<rtimer
  [DisplayType]="1"
  [CircularWidth]="100"
  [CallbackAfterCertainSeconds]="60"
  (CallbackTriggeredAfterCertainSeconds)="onTimerTick($event)">
</rtimer>
```

| Input | Type | Description |
|---|---|---|
| `DisplayType` | `number` | `1` = circular, `2` = linear |
| `CircularWidth` | `number` | Diameter for circular mode |
| `CallbackAfterCertainSeconds` | `number` | Trigger callback every N seconds |

---

## 📈 Progress & Indicators

### RProgressBar

A multi-mode progress bar with circular and linear variants, both finite and infinite.

#### Circle Infinite
<img width="263" height="237" alt="RProgressBar Circle Infinite" src="https://github.com/user-attachments/assets/20d5481c-1c26-423f-9aa2-4bbb458b7215" />

#### StraightLine Infinite
<img width="484" height="148" alt="RProgressBar Line Infinite" src="https://github.com/user-attachments/assets/87642eb4-36b7-46cf-b2ad-73becc8b424e" />

#### StraightLine Finite
![RProgressBar Line Finite](https://github.com/rajhseg/Angular-Controls/assets/9523832/f429bb04-072f-4b12-af27-bf1fc2636fda)

#### Circular Finite
![RProgressBar Circular Finite](https://github.com/rajhseg/Angular-Controls/assets/9523832/b5e76ad3-cfca-4fd4-999a-f8a68c544537)

**Selector:** `<rprogressbar>`

**Usage:**
```html
<!-- Infinite circular -->
<rprogressbar
  [ProgressBarType]="'Circle'"
  [IsInfinite]="true"
  [ForeColor]="'#8f19ff'">
</rprogressbar>

<!-- Finite linear -->
<rprogressbar
  [ProgressBarType]="'StraightLine'"
  [IsInfinite]="false"
  [Value]="65"
  [MaxValue]="100">
</rprogressbar>
```

| Input | Type | Description |
|---|---|---|
| `ProgressBarType` | `'Circle' \| 'StraightLine'` | Display mode |
| `IsInfinite` | `boolean` | Infinite animation or value-based |
| `Value` | `number` | Current progress value |
| `MaxValue` | `number` | Maximum value |
| `ForeColor` | `string` | Progress indicator colour |

---

### RSlider

A draggable single-value slider.

<img width="351" height="88" alt="RSlider" src="https://github.com/user-attachments/assets/cd2fb13c-e2a1-4e10-9fd5-ca03cc38f246" />

**Selector:** `<rslider>`

**Usage:**
```html
<rslider
  [MinValue]="0"
  [MaxValue]="100"
  [IsDisplayValue]="true"
  [TrackColor]="'#8f19ff'"
  [(ngModel)]="sliderValue">
</rslider>
```

| Input | Type | Default | Description |
|---|---|---|---|
| `MinValue` | `number` | `0` | Minimum value |
| `MaxValue` | `number` | `100` | Maximum value |
| `IsDisplayValue` | `boolean` | `true` | Shows current value label |
| `TrackColor` | `string` | `'darkblue'` | Colour of the filled track |
| `ShowDecimalValues` | `boolean` | `false` | Shows decimal precision |

---

### RRangeSlider

A dual-handle range slider for selecting a value range.

<img width="341" height="81" alt="RRangeSlider" src="https://github.com/user-attachments/assets/561acbaa-0c93-4f80-bbc6-fcc9504879c7" />

**Selector:** `<rrangeslider>`

**Usage:**
```html
<rrangeslider
  [MinValue]="0"
  [MaxValue]="200"
  [(ngModel)]="rangeValues">
</rrangeslider>
```

---

### RStarRating

A clickable star rating component.

<img width="322" height="107" alt="RStarRating" src="https://github.com/user-attachments/assets/66b99462-bf44-454f-a05b-409420981211" />

**Selector:** `<rstarrating>`

**Usage:**
```html
<rstarrating
  [starColor]="'#8f19ff'"
  [starWidth]="30"
  [(ngModel)]="rating">
</rstarrating>
```

| Input | Type | Description |
|---|---|---|
| `starColor` | `string` | Fill colour of stars |
| `starWidth` | `number` | Size of each star in pixels |

---

## 🪜 Steppers & Sequences

### RStepperVertical

A vertical step-by-step wizard component.

![RStepperVertical](https://github.com/user-attachments/assets/f62388f4-6c1a-403a-a3db-a11791a3d2a3)

**Selector:** `<rstepper-vertical>` with `<rstep>` children

**Usage:**
```html
<rstepper-vertical [ActiveStepColor]="'#8f19ff'">
  <rstep [StepTitle]="'Personal Info'">
    <!-- step content -->
  </rstep>
  <rstep [StepTitle]="'Address'">
    <!-- step content -->
  </rstep>
  <rstep [StepTitle]="'Review'">
    <!-- step content -->
  </rstep>
</rstepper-vertical>
```

---

### RStepperHorizontal

A horizontal step wizard with progress indicator.

![RStepperHorizontal](https://github.com/user-attachments/assets/cc2a436f-feaa-4b8f-9edc-539df2327da1)

**Selector:** `<rstepper-horizontal>` with `<rstep>` children

**Usage:**
```html
<rstepper-horizontal [ActiveStepColor]="'#8f19ff'">
  <rstep [StepTitle]="'Step 1'">Content 1</rstep>
  <rstep [StepTitle]="'Step 2'">Content 2</rstep>
</rstepper-horizontal>
```

---

### RSequenceVertical

A vertical connector-sequence timeline.

<img width="396" height="299" alt="RSequenceVertical" src="https://github.com/user-attachments/assets/97f15f2f-b813-464f-9577-cdab75e07c1b" />

**Selector:** `<rsequence-vertical>`

---

### RSequenceHorizontal

A horizontal connector-sequence timeline.

<img width="538" height="227" alt="RSequenceHorizontal" src="https://github.com/user-attachments/assets/57ad1cb3-15a7-4b2f-a021-707558db4445" />

**Selector:** `<rsequence-horizontal>`

---

## 📉 Charts

All chart components share common styling inputs such as `Width`, `Height`, `BackgroundColor`, and accept typed data arrays.

### RDonutChart

![RDonutChart](https://github.com/user-attachments/assets/30ac5cd0-0750-4969-a13d-85825520a637)

**Selector:** `<rdonutchart>`

```html
<rdonutchart [Items]="donutData" [Width]="'300px'" [Height]="'300px'"></rdonutchart>
```

---

### RPieChart

![RPieChart](https://github.com/user-attachments/assets/2c46f4d3-351c-4d05-b0b0-d6a491a923f0)

**Selector:** `<rpiechart>`

```html
<rpiechart [Items]="pieData" [ShowLegend]="true"></rpiechart>
```

---

### RBarChart Vertical

<img width="899" height="371" alt="RBarChart Vertical" src="https://github.com/user-attachments/assets/8d3a256c-4d8b-4017-9abe-2826e6fcfa8e" />

**Selector:** `<rbarchart-vertical>`

```html
<rbarchart-vertical [Items]="barData" [BarColor]="'#8f19ff'" [ShowValues]="true"></rbarchart-vertical>
```

---

### RBarChart Horizontal

<img width="906" height="498" alt="RBarChart Horizontal" src="https://github.com/user-attachments/assets/dd424b5d-3989-40d2-bc7d-4470d1cd4682" />

**Selector:** `<rbarchart-horizontal>`

```html
<rbarchart-horizontal [Items]="barData" [BarColor]="'#8f19ff'"></rbarchart-horizontal>
```

---

### RStackedBarChart Vertical

<img width="561" height="370" alt="RStackedBarChart Vertical" src="https://github.com/user-attachments/assets/1bcc4c09-c94a-450a-a9c8-111629407ed1" />

**Selector:** `<rstackedbarchart-vertical>`

---

### RStackedBarChart Horizontal

<img width="560" height="498" alt="RStackedBarChart Horizontal" src="https://github.com/user-attachments/assets/43a8a50f-527e-4ea7-9683-428eece78dfb" />

**Selector:** `<rstackedbarchart-horizontal>`

---

### RStackedRangeBarChart Vertical

<img width="474" height="498" alt="RStackedRangeBarChart Vertical" src="https://github.com/user-attachments/assets/b5537a0b-2b5a-407d-8468-369f970353b9" />

**Selector:** `<rstackedrangebarchart-vertical>`

---

### RScatterChart

<img width="458" height="471" alt="RScatterChart" src="https://github.com/user-attachments/assets/c2c97d0a-c2a6-44b8-be38-bc0006c697b6" />

**Selector:** `<rscatterchart>`

```html
<rscatterchart [Items]="scatterData" [XAxisLabel]="'Month'" [YAxisLabel]="'Sales'"></rscatterchart>
```

---

### RLineChart

<img width="456" height="478" alt="RLineChart" src="https://github.com/user-attachments/assets/2b56727a-3ef6-4767-94a7-4d8cb250d881" />

**Selector:** `<rlinechart-vertical>`

```html
<rlinechart-vertical [Items]="lineData" [LineColor]="'#8f19ff'" [ShowDataPoints]="true"></rlinechart-vertical>
```

---

### RAreaChart

<img width="460" height="471" alt="RAreaChart" src="https://github.com/user-attachments/assets/4d2b391c-2b04-4725-8c18-16b2819c502f" />

**Selector:** `<rareachart>`

```html
<rareachart [Items]="areaData" [FillColor]="'rgba(143,25,255,0.3)'" [LineColor]="'#8f19ff'"></rareachart>
```

---

### RAllocationBarChart

<img width="659" height="476" alt="RAllocationBarChart" src="https://github.com/user-attachments/assets/9838a950-ff56-44d7-b957-ae42c557573c" />

**Selector:** `<rallocated-barchart>`

---

### RSeriesChart

#### Y-Series Chart
<img width="901" height="476" alt="RSeriesChart Y" src="https://github.com/user-attachments/assets/d8444ffc-7cff-4f9c-bc08-cc38a1e1bb37" />

#### Graph Series Chart
<img width="462" height="476" alt="RSeriesChart Graph" src="https://github.com/user-attachments/assets/02dea651-3c2c-41ab-9ab4-6b4f4dcdee4e" />

**Selector:** `<rserieschart>`

```html
<rserieschart [Items]="seriesData" [SeriesType]="'YSeries'"></rserieschart>
```

---

## 🖥️ SSR Compatibility

All components are built with Angular 18's SSR in mind. The library uses a `RWindowHelper` service that safely wraps `window`, `document`, and `localStorage` access — preventing errors during server-side rendering.

```typescript
// Use the window helper in your own components
import { RWindowHelper } from 'rcomponents';

@Component({ ... })
export class MyComponent {
  constructor(private winObj: RWindowHelper) {
    if (this.winObj.IsBrowser) {
      // safe browser-only code
    }
  }
}
```

To enable SSR in your application:

```bash
ng add @angular/ssr
```

Then run the SSR server:

```bash
node dist/angularcontrols/server/server.mjs
```

---

## 🗂️ Project Structure

```
Angular Controls/
├── src/
│   └── app/
│       ├── app.component.ts        # Main demo app
│       └── appb.component.ts       # Extended demo component
├── projects/
│   └── rcomponents/
│       └── src/
│           └── lib/
│               ├── rbutton/
│               ├── rcalendar/
│               ├── rcheckbox/
│               ├── rcolorpicker/
│               ├── rdropdown/
│               ├── reventscalender/
│               ├── reventsschedule/
│               ├── rfileupload/
│               ├── rfilter/
│               ├── rflattabs/
│               ├── rgrid/
│               ├── rgrouppanel/
│               ├── rlinechart-vertical/
│               ├── rnumeric/
│               ├── rpiechart/
│               ├── rprogressbar/
│               ├── rradiobutton/
│               ├── rrangeslider/
│               ├── rrating/
│               ├── rscatterchart/
│               ├── rselectdropdown/
│               ├── rsequences/
│               ├── rsequences-horizontal/
│               ├── rserieschart/
│               ├── rslider/
│               ├── rsplitter/
│               ├── rstackedbarchart-horizontal/
│               ├── rstackedbarchart-vertical/
│               ├── rstackedrangebarchart-vertical/
│               ├── rstepper-horizontal/
│               ├── rstepper-vertical/
│               ├── rswitch/
│               ├── rtab/
│               ├── rtextbox/
│               ├── rtimer/
│               ├── rtimeselector/
│               └── rtree/
└── angular.json
```

---

<p align="center">
  Built with ❤️ using <strong>Angular 18</strong> · Contributions welcome!
</p>
