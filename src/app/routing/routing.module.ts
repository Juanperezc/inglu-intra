import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerticalLayoutComponent } from '../layout/vertical';
import { HorizontalLayoutComponent } from '../layout/horizontal';
import { PublicLayoutComponent } from '../layout/public';

import { PageDashboardComponent } from '../pages/dashboards/dashboard-1';
import { PageButtonsComponent } from '../pages/ui/components/buttons';
import { PageCardsComponent } from '../pages/ui/components/cards';
import { PageInputsComponent } from '../pages/ui/components/inputs';
import { PageSelectsComponent } from '../pages/ui/components/selects';
import { PageTextareasComponent } from '../pages/ui/components/textareas';
import { PageAutocompletesComponent } from '../pages/ui/components/autocompletes';
import { PageBadgesComponent } from '../pages/ui/components/badges';
import { PageRatingsComponent } from '../pages/ui/components/ratings';
import { PageSimpleTablesComponent } from '../pages/ui/tables/simple-tables';
import { PageSortingTableComponent } from '../pages/ui/tables/sorting-table';
import { PageSearchTableComponent } from '../pages/ui/tables/search-table';
import { PageFilterTableComponent } from '../pages/ui/tables/filter-table';
import { PagePaginationTableComponent } from '../pages/ui/tables/pagination-table';
import { PageAlertsComponent } from '../pages/ui/components/alerts';
import { PageCheckboxesComponent } from '../pages/ui/components/checkboxes';
import { PageRadioButtonsComponent } from '../pages/ui/components/radio-buttons';
import { PageSwitchersComponent } from '../pages/ui/components/switchers';
import { PageFormElementsComponent } from '../pages/ui/forms/form-elements';
import { PageFormLayoutsComponent } from '../pages/ui/forms/form-layouts';
import { PageFormValidationComponent } from '../pages/ui/forms/form-validation';
import { PageNg2ChartsComponent } from '../pages/ui/charts/ng2-charts';
import { PageNgxChartsComponent } from '../pages/ui/charts/ngx-charts';
import { PageNgxEchartsComponent } from '../pages/ui/charts/ngx-echarts';
import { PageGoogleMapsComponent } from '../pages/ui/maps/google-maps';
import { PageWorldMapComponent } from '../pages/ui/maps/world-map';
import { PageTypographyComponent } from '../pages/ui/typography';
import { PageIconsOptionsComponent } from '../pages/ui/icons/icons-options';
import { PageIconsIfComponent } from '../pages/ui/icons/icons-if';
import { PageIconsSliComponent } from '../pages/ui/icons/icons-sli';


import { PageModalWindowsComponent } from '../pages/ui/components/modal-windows';
import { PageDoctorProfileComponent } from '../pages/medicine/doctor-profile';
import { PagePaymentsComponent } from '../pages/medicine/payments';
import { PageAppointmentsComponent } from '../pages/services/appointments';
import { PageSpecialtyComponent } from '../pages/services/specialties';
import { Page404Component } from '../pages/page-404';
import { PageLeafletMapsComponent } from '../pages/ui/maps/leaflet-maps';
import { PageVTimelineComponent } from '../pages/ui/components/v-timeline';
import { PagePatientProfileComponent } from '../pages/medicine/patient-profile';
import { PageInvoiceComponent } from '../pages/apps/service-pages/invoice';
import { PagePricingComponent } from '../pages/apps/service-pages/pricing';
import { PageTimelineComponent } from '../pages/apps/service-pages/timeline';
import { PageUserProfileComponent } from '../pages/apps/service-pages/user-profile';
import { PageAccountComponent } from '../pages/apps/service-pages/account';
import { PageCalendarComponent } from '../pages/apps/service-pages/calendar';
import { PageSignInComponent } from '../pages/apps/sessions/sign-in';
import { PageSignUpComponent } from '../pages/apps/sessions/sign-up';
import { PageSettingsComponent } from '../pages/settings';
import { SignInComponent } from '../pages/sign-in/sign-in.component';
import { SignUpComponent } from '../pages/sign-up/sign-up.component';
import { PagePostComponent } from '../pages/portal/posts';
import { AuthGuardService } from '../services/util/auth-guard.service';
import { PageFaqsComponent } from '../pages/portal/faqs';
import { PageClaimsComponent } from '../pages/portal/claims';
import { PageSuggestionsComponent } from '../pages/portal/suggestions';
import { PageClaimTypesComponent } from '../pages/portal/claim_types';
import { PageSuggestionTypesComponent } from '../pages/portal/suggestion_types';
import { PagePostCategoryComponent } from '../pages/portal/post_category';
import { PageContactComponent } from '../pages/services/contacts';
import { PagePatientsComponent } from '../pages/services/patients';
import { PageDoctorsComponent } from '../pages/services/doctors';
import { PageEventsComponent } from '../pages/services/events';
import { PageEventsAssistanceComponent } from '../pages/services/events-assistance';
import { PageClubTeamComponent } from '../pages/portal/club-team';
import { PageClubImageComponent } from '../pages/portal/club-images';
import { PageClubTaskComponent } from '../pages/portal/club-tasks';
import { PageClubInformationComponent } from '../pages/portal/club-information';
import { PageClubInformationMainComponent } from '../pages/portal/club-main-information';
import { PageClubSettingsComponent } from '../pages/portal/club-settings';
import { ForgetPasswordComponent } from '../pages/forget-password/forget-password.component';

const VERTICAL_ROUTES: Routes = [
  { path: 'default-dashboard', component: PageDashboardComponent },
  { path: 'doctors', component: PageDoctorsComponent },
  { path: 'doctor-profile', component: PageDoctorProfileComponent },
  { path: 'patients', component: PagePatientsComponent },
  { path: 'patient-profile', component: PagePatientProfileComponent },
  { path: 'payments', component: PagePaymentsComponent },
  { path: 'appointments', component: PageAppointmentsComponent },
  { path: 'specialties', component: PageSpecialtyComponent },
  { path: 'alerts', component: PageAlertsComponent },
  { path: 'buttons', component: PageButtonsComponent },
  { path: 'cards', component: PageCardsComponent },
  { path: 'inputs', component: PageInputsComponent },
  { path: 'selects', component: PageSelectsComponent },
  { path: 'textareas', component: PageTextareasComponent },
  { path: 'autocompletes', component: PageAutocompletesComponent },
  { path: 'badges', component: PageBadgesComponent },
  { path: 'ratings', component: PageRatingsComponent },
  { path: 'checkboxes', component: PageCheckboxesComponent },

  { path: 'radio-buttons', component: PageRadioButtonsComponent },
  { path: 'switchers', component: PageSwitchersComponent },
  { path: 'modal-windows', component: PageModalWindowsComponent },
  { path: 'v-timeline', component: PageVTimelineComponent },
  { path: 'simple-table', component: PageSimpleTablesComponent },
  { path: 'sorting-table', component: PageSortingTableComponent },
  { path: 'search-table', component: PageSearchTableComponent },
  { path: 'filtering-table', component: PageFilterTableComponent },
  { path: 'pagination-table', component: PagePaginationTableComponent },
  { path: 'form-elements', component: PageFormElementsComponent },
  { path: 'form-layout', component: PageFormLayoutsComponent },
  { path: 'form-validation', component: PageFormValidationComponent },
  { path: 'ng2-charts', component: PageNg2ChartsComponent },
  { path: 'ngx-charts', component: PageNgxChartsComponent },
  { path: 'ngx-echarts', component: PageNgxEchartsComponent },
  { path: 'google-map', component: PageGoogleMapsComponent },
  { path: 'leaflet-map', component: PageLeafletMapsComponent },
  { path: 'world-map', component: PageWorldMapComponent },
  { path: 'typography', component: PageTypographyComponent },
  { path: 'icons-options', component: PageIconsOptionsComponent },
  { path: 'icons-if', component: PageIconsIfComponent },
  { path: 'icons-sli', component: PageIconsSliComponent },
  { path: 'invoices', component: PageInvoiceComponent },
  { path: 'pricing', component: PagePricingComponent },
  { path: 'events-timeline', component: PageTimelineComponent },
  { path: 'user-profile', component: PageUserProfileComponent },
  { path: 'edit-account', component: PageAccountComponent },
  { path: 'patient-account/:id', component: PageAccountComponent },
  { path: 'doctor-account/:id', component: PageAccountComponent },
  { path: 'create-doctor', component: PageAccountComponent },
  { path: 'create-patient', component: PageAccountComponent },
  { path: 'events-calendar', component: PageCalendarComponent },
  { path: 'settings', component: PageSettingsComponent },
  { path: 'contacts', component: PageContactComponent },
  { path: 'posts', component: PagePostComponent },
  { path: 'post-categories', component: PagePostCategoryComponent },
  { path: 'claims', component: PageClaimsComponent },
  { path: 'claim-types', component: PageClaimTypesComponent },
  { path: 'suggestions', component: PageSuggestionsComponent },
  { path: 'suggestion-types', component: PageSuggestionTypesComponent },
  { path: 'faqs', component: PageFaqsComponent },
  { path: 'club-team', component: PageClubTeamComponent },
  { path: 'club-images', component: PageClubImageComponent },
  { path: 'club-tasks', component: PageClubTaskComponent },
  { path: 'club-information', component: PageClubInformationComponent },
  { path: 'club-settings', component: PageClubSettingsComponent },
  { path: 'club-main-information', component: PageClubInformationMainComponent },
  
  { path: 'events', component: PageEventsComponent },
  { path: 'events-assistance', component: PageEventsAssistanceComponent },

  
];

const PUBLIC_ROUTES: Routes = [
  { path: 'sign-in', component: SignInComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: '**', component: Page404Component }
  
];

export const ROUTES: Routes = [
  {
    path: '',
   /*  redirectTo: '/vertical/default-dashboard', */
   redirectTo: '/vertical/default-dashboard',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
   /*  redirectTo: '/vertical/default-dashboard', */
   redirectTo: '/vertical/default-dashboard',
    pathMatch: 'full'
  },
  {
    path: 'vertical',
    component: VerticalLayoutComponent,
    canActivate: [AuthGuardService],
    children: VERTICAL_ROUTES
  },
  {
    path: 'horizontal',
    component: HorizontalLayoutComponent,
    children: VERTICAL_ROUTES
  },
  {
    path: 'public',
    component: PublicLayoutComponent,
    children: PUBLIC_ROUTES
  },
  {
    path: '**',
    component: PublicLayoutComponent,
    children: VERTICAL_ROUTES
  }
];

@NgModule({
  imports: [
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }
