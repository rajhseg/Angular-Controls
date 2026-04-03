# rcomponents Showcase

This package contains `app.component.ts`, `app.component.html`, and `app.component.css`
which showcase all components from the [rcomponents](https://github.com/rajhseg/Angular-Controls) Angular library.

## Components covered

### Charts (8)
| Selector | Component |
|---|---|
| `<rallocated-barchart>` | Allocated Bar Chart — spent vs allocated budget |
| `<rbarchart-vertical>` | Vertical Bar Chart |
| `<rbarchart-horizontal>` | Horizontal Bar Chart |
| `<rpiechart>` | Pie Chart |
| `<rdonutchart>` | Donut Chart |
| `<rlinechart-vertical>` | Line Chart |
| `<rscatterchart>` | Scatter Chart |
| `<rprogressbar>` | Progress Bar |

### Form Controls (13)
| Selector | Component |
|---|---|
| `<rbutton>` | Button with click event |
| `<rcheckbox>` | Checkbox (ControlValueAccessor) |
| `<rtextbox>` | Text input |
| `<rnumeric>` | Numeric spin input |
| `<rslider>` | CDK drag-based slider |
| `<rswitch>` | Toggle switch |
| `<rstarrating>` | Star rating |
| `<rradiobutton>` | Radio button group |
| `<rdropdown>` | Searchable dropdown |
| `<rselectdropdown>` | Multi-select dropdown |
| `<rcolorpicker>` | Canvas color picker |
| `<rfileupload>` | File upload with preview |
| `<rtimeselector>` | Hour/minute/AM-PM time picker |

### Layout (2)
| Selector | Component |
|---|---|
| `<rgroup-panel>` | Titled group container |
| `<rsplitter>` | Draggable two-pane splitter |

### Navigation (3)
| Selector | Component |
|---|---|
| `<rflattabs>` + `<rtab>` | Draggable flat tabs |
| `<rstepper-vertical>` + `<rstep>` | Vertical step wizard |
| `<rtree>` | Hierarchical tree view |

### Data Display (3)
| Selector | Component |
|---|---|
| `<rcalendar>` | Date picker calendar |
| `<rtimer>` | Stopwatch / countdown timer |
| `<rstate-vertical>` | Vertical sequence / pipeline tracker |

## Setup

1. Install the library:
   ```bash
   npm install rcomponents
   ```

2. Copy `app.component.ts`, `app.component.html`, and `app.component.css` into your Angular project's `src/app/` folder.

3. Make sure your `angular.json` includes rcomponents styles if needed.

4. Run:
   ```bash
   ng serve
   ```

## Notes

- All components are **standalone** — import them individually or via the showcase component.
- Charts render on HTML `<canvas>` — they need a browser environment (no SSR without guards).
- Form components implement Angular's `ControlValueAccessor` and work with `[(ngModel)]` and reactive forms.
