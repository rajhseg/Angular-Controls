import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RCalendarComponent } from "./rcalendar/rcalendar.component";
import { RDropdownComponent } from "./rdropdown/rdropdown.component";
import { RSwitchComponent } from "./rswitch/rswitch.component";
import { RStarRatingComponent } from "./rrating/rrating.component";
import { RProgressbarComponent } from "./rprogressbar/rprogressbar.component";
import { RTabComponent, RTabIdFor } from "./rtab/rtab.component";
import { RTabsComponent } from "./rtab/rtabs.component";
import { RTreeComponent } from "./rtree/rtree.component";
import { RCheckboxComponent } from "./rcheckbox/rcheckbox.component";
import { RRadiobuttonComponent } from "./rradiobutton/rradiobutton.component";
import { RSliderComponent } from "./rslider/rslider.component";
import { RStateVerticalComponent } from "./rsequences/rsequences.component";
import { RButtonComponent } from "./rbutton/rbutton.component";
import { RGrouppanelComponent } from "./rgrouppanel/rgrouppanel.component";
import { RStateHorizontalComponent } from "./rsequences-horizontal/rsequences-horizontal.component";
import { RTextboxComponent } from "./rtextbox/rtextbox.component";
import { RfileuploadComponent } from "./rfileupload/rfileupload.component";
import { RColorPickerComponent } from "./rcolorpicker/rcolorpicker.component";
import { RNumericComponent } from "./rnumeric/rnumeric.component";
import { RTimerComponent } from "./rtimer/rtimer.component";
import { RTimeSelectorComponent } from "./rtimeselector/rtimeselector.component";
import { RGridComponent } from "./rgrid/rgrid.component";
import { RColumnComponent } from "./rgrid/rcolumn/rcolumn.component";
import { HeaderTemplateDirective, ReadViewTemplateDirective } from "./rgrid/view-template.directive";
import { EditViewTemplateDirective } from "./rgrid/edit-template.directive";
import { RSelectDropdownComponent } from "./rselectdropdown/rselectdropdown.component";
import { ROptionsTemplateDirective } from "./rselectdropdown/rselectModel";
import { REventsScheduleComponent } from "./reventsschedule/reventsschedule.component";
import { RStepperVerticalComponent } from "./rstepper-vertical/rstepper-vertical.component";
import { RStepViewDirective } from "./rstep/rsteptemplate.directive";
import { RDonutChartComponent } from "./rdonutchart/rdonutchart.component";
import { RStepperHorizontalComponent } from "./rstepper-horizontal/rstepper-horizontal.component";
import { RPieChartComponent } from "./rpiechart/rpiechart.component";
import { RBarChartVerticalComponent } from "./rbarchart-vertical/rbarchart-vertical.component";
import { RBaseComponent } from "../public-api";
import { RBarChartHorizontalComponent } from "./rbarchart-horizontal/rbarchart-horizontal.component";
import { RStackedBarChartVerticalComponent } from "./rstackedbarchart-vertical/rstackedbarchart-vertical.component";
import { RStackedRangeBarChartVerticalComponent } from "./rstackedrangebarchart-vertical/rstackedrangebarchart-vertical.component";
import { RScatterChartComponent } from "./rscatterchart/rscatterchart.component";
import { RLineChartVerticalComponent } from "./rlinechart-vertical/rlinechart-vertical.component";
import { RStackedBarChartHorizontalComponent } from "./rstackedbarchart-horizontal/rstackedbarchart-horizontal.component";
import { RAreaChartComponent } from "./rareachart/rareachart.component";
import { RAllocatedBarChartComponent } from "./rallocated-barchart/rallocated-barchart.component";
import { RFilterComponent } from "./rfilter/rfilter.component";
import { RSeriesChartComponent } from "./rserieschart/rserieschart.component";
import { RFlatTabsComponent } from "./rflattabs/rflattabs.component";
import { REventsCalenderComponent } from "./reventscalender/reventscalender.component";
import { RPageContentDirective } from './rsplitter/rpagecontent.directive';
import { RSplitPageComponent } from './rsplitter/rsplitpage.component';
import { RSplitterComponent } from './rsplitter/rsplitter.component';
import { RCell, RGridHeaderSort, RGridEditRowInfo, RGridHeaderSortType, RGridItems, RGridRow } from './rgrid/rcell';
import { ValidateInput, validateValue } from './Validator';

@NgModule({
    imports: [
        CommonModule, 
        RCalendarComponent,
        RDropdownComponent,
        RStarRatingComponent,
        RSwitchComponent,
        RProgressbarComponent,
        RTabComponent,
        RTabIdFor,
        RTabsComponent,
        RTreeComponent,
        RCheckboxComponent,
        RRadiobuttonComponent,
        RSliderComponent,
        RStateVerticalComponent,
        RButtonComponent,
        RGrouppanelComponent,
        RStateHorizontalComponent,
        RTextboxComponent,
        RfileuploadComponent,
        RColorPickerComponent,
        RNumericComponent,
        RTimerComponent,
        RTimeSelectorComponent,
        RGridComponent,
        RColumnComponent,
        HeaderTemplateDirective,
        ReadViewTemplateDirective,
        EditViewTemplateDirective,
        RSelectDropdownComponent,
        ROptionsTemplateDirective,
        REventsScheduleComponent,
        RStepperVerticalComponent,
        RStepViewDirective,
        RDonutChartComponent,
        RStepperHorizontalComponent,
        RPieChartComponent,
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
        RPageContentDirective,
        RSplitPageComponent,
        RSplitterComponent,
    ],
    exports: [
        RCalendarComponent,
        RDropdownComponent,
        RStarRatingComponent,
        RSwitchComponent,
        RProgressbarComponent,
        RTabComponent,
        RTabIdFor,
        RTabsComponent,
        RTreeComponent,
        RCheckboxComponent,
        RRadiobuttonComponent,
        RSliderComponent,
        RStateVerticalComponent,
        RButtonComponent,
        RGrouppanelComponent,
        RStateHorizontalComponent,
        RTextboxComponent,
        RfileuploadComponent,
        RColorPickerComponent,
        RNumericComponent,
        RTimerComponent,
        RTimeSelectorComponent,
        RGridComponent,
        RColumnComponent,
        HeaderTemplateDirective,
        ReadViewTemplateDirective,
        EditViewTemplateDirective,
        RSelectDropdownComponent,
        ROptionsTemplateDirective,
        REventsScheduleComponent,
        RStepperVerticalComponent,
        RStepViewDirective,
        RDonutChartComponent,
        RStepperHorizontalComponent,
        RPieChartComponent,
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
        RPageContentDirective,
        RSplitPageComponent,
        RSplitterComponent
    ]
})
export class RComponentsModule {
    
}
