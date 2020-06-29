import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { DragulaModule } from 'ng2-dragula';

import { TCBorderColorDirective } from './directives/border-color/border-color.directive';
import { TCFilterTableDirective } from './directives/filter-table/filter-table.directive';
import { TCBorderStyleDirective } from './directives/border-style/border-style.directive';
import { TCSortTableDirective } from './directives/sort-table/sort-table.directive';
import { TCBgColorDirective } from './directives/bg-color/bg-color.directive';
import { TCGradientDirective } from './directives/gradient/gradient.directive';
import { TCColorDirective } from './directives/color/color.directive';
import { TCShapeDirective } from './directives/shape/shape.directive';
import { TCFocusDirective } from './directives/focus/focus.directive';
import { TCFontSizeDirective } from './directives/font-size/font-size.directive';
import { TCAlignDirective } from './directives/align/align.directive';

import { TCButtonComponent } from './components/button';
import { TCTableComponent, TCTableColComponent } from './components/table';
import { TCCardComponent } from './components/card';
import { TCInputComponent } from './components/input';
import { TCFormDescriptionComponent } from './components/form-description';
import { TCFormGroupComponent } from './components/form-group';
import { TCFormLabelComponent } from './components/form-label';
import { TCPaginationComponent } from './components/pagination';
import { TCCheckboxComponent } from './components/checkbox';
import { TCTextareaComponent } from './components/textarea';
import { TCContactComponent } from './components/contact';
import { TCSwitcherComponent } from './components/switcher';
import { TCAutocompleteComponent } from './components/autocomplete';
import { TCRadioComponent, TCRadioOptionComponent } from './components/radio';
import { TCBadgeComponent } from './components/badge';
import { TCDropdownComponent, TCDropdownButtonComponent, TCDropdownContentComponent } from './components/dropdown';
import { TCIconComponent } from './components/icon';
import { TCVTimelineComponent } from './components/v-timeline';
import { TCSelectComponent } from './components/select';
import { TCAlertComponent } from './components/alert';
import { TCRatingComponent } from './components/rating';
import { TCAvatarComponent } from './components/avatar';
import { TCModalComponent } from './components/modal';

import { TCColorPickerComponent } from './components/color-picker/color-picker.component';
import { TCPickerComponent } from './components/color-picker/picker/picker.component';

/* import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime'; */
import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

import { TCDatePickerComponent } from './components/datepicker';

// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_MOMENT_FORMATS = {
  parseInput: 'DD-MM-YYYY',
  fullPickerInput: 'DD-MM-YYYY HH:mm',
  datePickerInput: 'DD-MM-YYYY',
  timePickerInput: 'HH:mm',
  monthYearLabel: 'MMM-YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM-YYYY'
};

@NgModule({
  imports: [
    CommonModule,
		FormsModule,
    RouterModule,
    ReactiveFormsModule,
    OwlDateTimeModule, 
    OwlMomentDateTimeModule,
    DragulaModule.forRoot()
  ],
  declarations: [
    TCBgColorDirective,
    TCBorderColorDirective,
    TCBorderStyleDirective,
    TCColorDirective,
    TCFocusDirective,
    TCGradientDirective,
    TCShapeDirective,
    TCFontSizeDirective,
    TCAlignDirective,
    TCSortTableDirective,
    TCFilterTableDirective,

    TCButtonComponent,
    TCCardComponent,
    TCTableComponent, TCTableColComponent,
    TCInputComponent,
    TCDatePickerComponent,
    TCTextareaComponent,
    TCFormDescriptionComponent,
    TCFormGroupComponent,
    TCFormLabelComponent,
    TCPaginationComponent,
    TCCheckboxComponent,
    TCContactComponent,
    TCSwitcherComponent,
    TCAutocompleteComponent,
    TCRadioComponent, TCRadioOptionComponent,
    TCBadgeComponent,
    TCDropdownComponent, TCDropdownButtonComponent, TCDropdownContentComponent,
    TCIconComponent,
    TCVTimelineComponent,
    TCSelectComponent,
    TCAlertComponent,
    TCRatingComponent,
    TCAvatarComponent,
    TCColorPickerComponent, TCPickerComponent,
    TCModalComponent
  ],
  exports: [
    TCBgColorDirective,
    TCBorderColorDirective,
    TCBorderStyleDirective,
    TCColorDirective,
    TCGradientDirective,
    TCShapeDirective,
    TCFontSizeDirective,
    TCAlignDirective,
    TCSortTableDirective,
    TCFocusDirective,
    TCPaginationComponent,
    TCButtonComponent,
    TCCardComponent,
    TCTableComponent, TCTableColComponent,
    TCInputComponent,
    TCDatePickerComponent,
    TCTextareaComponent,
    TCFormDescriptionComponent,
    TCFormGroupComponent,
    TCFormLabelComponent,
    TCCheckboxComponent,
		TCContactComponent,
		TCSwitcherComponent,
		TCAutocompleteComponent,
    TCRadioComponent,
		TCRadioOptionComponent,
		TCBadgeComponent,
    TCDropdownComponent, TCDropdownButtonComponent, TCDropdownContentComponent,
    TCIconComponent,
		TCVTimelineComponent,
		TCSelectComponent,
		TCAlertComponent,
		TCRatingComponent,
    TCAvatarComponent,
    TCColorPickerComponent, TCPickerComponent,
    TCModalComponent
  ],
  entryComponents: [
    TCModalComponent
  ],
  providers: [
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS},
  ]
})
export class UIModule { }
