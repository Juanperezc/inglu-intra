import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxEchartsModule } from 'ngx-echarts';
import { AgmCoreModule } from '@agm/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FullCalendarModule } from 'ng-fullcalendar';

import { environment } from '../../environments/environment';
import { UIModule } from '../ui/ui.module';
import { ComponentsModule } from '../components/components.module';
import { LayoutModule } from '../layout/layout.module';
import { BasePageComponent } from './base-page';

import { PageDashboardComponent } from './dashboards/dashboard-1';
import { PageButtonsComponent } from './ui/components/buttons';
import { PageCardsComponent } from './ui/components/cards';
import { PageInputsComponent } from './ui/components/inputs';
import { PageSelectsComponent } from './ui/components/selects';
import { PageTextareasComponent } from './ui/components/textareas';
import { PageAutocompletesComponent } from './ui/components/autocompletes';
import { PageBadgesComponent } from './ui/components/badges';
import { PageRatingsComponent } from './ui/components/ratings';
import { PageSimpleTablesComponent } from './ui/tables/simple-tables';
import { PageSortingTableComponent } from './ui/tables/sorting-table';
import { PageSearchTableComponent } from './ui/tables/search-table';
import { PageFilterTableComponent } from './ui/tables/filter-table';
import { PagePaginationTableComponent } from './ui/tables/pagination-table';
import { PageAlertsComponent } from './ui/components/alerts';
import { PageCheckboxesComponent } from './ui/components/checkboxes';
import { PageRadioButtonsComponent } from './ui/components/radio-buttons';
import { PageSwitchersComponent } from './ui/components/switchers';
import { PageFormElementsComponent } from './ui/forms/form-elements';
import { PageFormLayoutsComponent } from './ui/forms/form-layouts';
import { PageFormValidationComponent } from './ui/forms/form-validation';
import { PageNg2ChartsComponent } from './ui/charts/ng2-charts';
import { PageNgxChartsComponent } from './ui/charts/ngx-charts';
import { PageNgxEchartsComponent } from './ui/charts/ngx-echarts';
import { PageGoogleMapsComponent } from './ui/maps/google-maps';
import { PageWorldMapComponent } from './ui/maps/world-map';
import { PageTypographyComponent } from './ui/typography';
import { PageIconsOptionsComponent } from './ui/icons/icons-options';
import { PageIconsIfComponent } from './ui/icons/icons-if';
import { PageIconsSliComponent } from './ui/icons/icons-sli';
import { PageContactsComponent } from './ui/components/contacts';
import { PageModalWindowsComponent } from './ui/components/modal-windows';
import { PageDoctorsComponent } from './medicine/doctors';
import { PagePatientsComponent } from './medicine/patients';
import { PageDoctorProfileComponent } from './medicine/doctor-profile';
import { PagePaymentsComponent } from './medicine/payments';
import { PageAppointmentsComponent } from './medicine/appointments';
import { PageDepartmentsComponent } from './medicine/departments';
import { Page404Component } from './page-404';
import { PageLeafletMapsComponent } from './ui/maps/leaflet-maps';
import { PageVTimelineComponent } from './ui/components/v-timeline';
import { PagePatientProfileComponent } from './medicine/patient-profile';
import { PageInvoiceComponent } from './apps/service-pages/invoice';
import { PagePricingComponent } from './apps/service-pages/pricing';
import { PageTimelineComponent } from './apps/service-pages/timeline';
import { PageUserProfileComponent } from './apps/service-pages/user-profile';
import { PageAccountComponent } from './apps/service-pages/account';
import { PageCalendarComponent } from './apps/service-pages/calendar';
import { PageSignInComponent } from './apps/sessions/sign-in';
import { PageSignUpComponent } from './apps/sessions/sign-up';
import { PageSettingsComponent } from './settings';
import { PagePostComponent } from './portal/posts';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PageFaqsComponent } from './portal/faqs';
import { PageClaimsComponent } from './portal/claims';
import { PageSuggestionsComponent } from './portal/suggestions';
import { PageClaimTypesComponent } from './portal/claim_types';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    ChartsModule,
    NgxChartsModule,
    NgxEchartsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey
    }),
    LeafletModule,
    FullCalendarModule,
    ComponentsModule,
    UIModule,
    LayoutModule
  ],
  declarations: [
    BasePageComponent,
    PageDashboardComponent,
    SignInComponent,
    SignUpComponent,
    PageAlertsComponent,
    PageButtonsComponent,
    PageCardsComponent,
    PageInputsComponent,
    PageSelectsComponent,
    PageTextareasComponent,
    PageAutocompletesComponent,
    PageBadgesComponent,
    PageRatingsComponent,
    PageCheckboxesComponent,
    PageRadioButtonsComponent,
    PageSwitchersComponent,
    PageTypographyComponent,
    PageSimpleTablesComponent,
    PageSortingTableComponent,
    PageSearchTableComponent,
    PageFilterTableComponent,
    PagePaginationTableComponent,
    PageFormElementsComponent,
    PageFormLayoutsComponent,
    PageFormValidationComponent,
    PageNg2ChartsComponent,
    PageNgxChartsComponent,
    PageNgxEchartsComponent,
    PageGoogleMapsComponent,
    PageWorldMapComponent,
    PageIconsOptionsComponent,
    PageIconsIfComponent,
    PageIconsSliComponent,
    PageContactsComponent,
    PageDoctorsComponent,
    PagePatientsComponent,
    PageModalWindowsComponent,
    PageDoctorProfileComponent,
    PagePaymentsComponent,
    PageAppointmentsComponent,
    PageDepartmentsComponent,
    Page404Component,
    PageLeafletMapsComponent,
    PageVTimelineComponent,
    PagePatientProfileComponent,
    PageInvoiceComponent,
    PagePricingComponent,
    PageTimelineComponent,
    PageUserProfileComponent,
    PageAccountComponent,
    PageCalendarComponent,
    PageSignInComponent,
    PageSignUpComponent,
    PageSettingsComponent,
    PagePostComponent,
    PageFaqsComponent,
    PageClaimsComponent,
    PageClaimTypesComponent,
    PageSuggestionsComponent
  ],
  exports: [ ],
  entryComponents: [ ]
})
export class PagesModule {}
