import { ItSubcontractingServicesComponent } from './it-subcontracting-services/it-subcontracting-services.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { WorkawayComponent } from './workaway/workaway.component';
import { E2eQaServicesComponent } from './e2e-qa-services/e2e-qa-services.component';
import { WorkawayRegistrationComponent } from './workaway-registration/workaway-registration.component';
import { ItSubcontractingRegistrationComponent } from './it-subcontracting-registration/it-subcontracting-registration.component';
import { E2eQaRegistrationComponent } from './e2e-qa-registration/e2e-qa-registration.component';
import { E2eQaRegistrationContactDetailsComponent } from './e2e-qa-registration-contact-details/e2e-qa-registration-contact-details.component';
import { WorkkawayRegistrationContactDetailsComponent } from './workkaway-registration-contact-details/workkaway-registration-contact-details.component';
import { E2eQaHireResourcesContactDetailsComponent } from './e2e-qa-hire-resources-contact-details/e2e-qa-hire-resources-contact-details.component';
import { E2eQaHireResourcesRegistrationsComponent } from './e2e-qa-hire-resources-registrations/e2e-qa-hire-resources-registrations.component';
import { PartnerSearchResultExperienceComponent } from './partner-search-result-experience/partner-search-result-experience.component';
import { CandidateSearchResultComponent } from './candidate-search-result/candidate-search-result.component';
import { ItSubPartnerSearchComponent } from './it-sub-partner-search/it-sub-partner-search.component';

const routes: Routes = [
  {
    path: 'workaway',
    component: WorkawayComponent
  },
  {
    path: 'workaway-registration',
    component: WorkawayRegistrationComponent
  },
  {
    path: 'e2e-qa-services',
    component: E2eQaServicesComponent
  },
  {
    path: 'e2e-qa-registration',
    component: E2eQaRegistrationComponent
  },
  {
    path: 'e2e-qa-registration-contact-details',
    component: E2eQaRegistrationContactDetailsComponent
  },
  {
    path: 'e2e-qa-hire-resources-registration',
    component: E2eQaHireResourcesRegistrationsComponent
  },
  {
    path: 'e2e-qa-hire-resources-contact-details',
    component: E2eQaHireResourcesContactDetailsComponent
  },
  {
    path: 'it-subcontracting-services',
    component: ItSubcontractingServicesComponent
  },
  {
    path: 'it-subcontracting-registration',
    component: ItSubcontractingRegistrationComponent
  },
  {
    path: 'workaway-registration-contact-details',
    component: WorkkawayRegistrationContactDetailsComponent
  },
  {
    path: 'partner-search-result-experience',
    component: PartnerSearchResultExperienceComponent
  },
  {
    path: 'candidate-search-result',
    component: CandidateSearchResultComponent
  },
  {
    path: 'partner-search-result',
    component: ItSubPartnerSearchComponent
  },
  {
    path: '',
    redirectTo: 'workaway',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    WorkawayComponent,
    ItSubcontractingServicesComponent,
    E2eQaServicesComponent,
    ItSubcontractingRegistrationComponent,
    E2eQaRegistrationComponent,
    E2eQaRegistrationContactDetailsComponent,
    WorkawayRegistrationComponent,
    WorkkawayRegistrationContactDetailsComponent,
    E2eQaHireResourcesContactDetailsComponent,
    E2eQaHireResourcesRegistrationsComponent,
    PartnerSearchResultExperienceComponent,
    CandidateSearchResultComponent,
    ItSubPartnerSearchComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    RouterModule.forChild(routes)
  ]
})
export class OurServicesModule { }
