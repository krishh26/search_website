import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { E2eQaHireResourcesRegistrationsComponent } from './e2e-qa-hire-resources-registrations/e2e-qa-hire-resources-registrations.component';
import { E2eQaHireResourcesContactDetailsComponent } from './e2e-qa-hire-resources-contact-details/e2e-qa-hire-resources-contact-details.component';
import { WorkawayRegistrationComponent } from './workaway-registration/workaway-registration.component';
import { ItSubcontractingRegistrationComponent } from './it-subcontracting-registration/it-subcontracting-registration.component';

const routes: Routes = [
  {
    path: 'workaway-registration',
    component: WorkawayRegistrationComponent
  },
  {
    path: 'it-subcontracting-registration',
    component: ItSubcontractingRegistrationComponent
  },
  {
    path: 'e2e-qa-hire-resources-registrations',
    component: E2eQaHireResourcesRegistrationsComponent
  },
  {
    path: 'e2e-qa-hire-resources-contact-details',
    component: E2eQaHireResourcesContactDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OurServicesRoutingModule { }
