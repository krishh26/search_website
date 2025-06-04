import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { E2eQaHireResourcesRegistrationsComponent } from './e2e-qa-hire-resources-registrations/e2e-qa-hire-resources-registrations.component';
import { E2eQaHireResourcesContactDetailsComponent } from './e2e-qa-hire-resources-contact-details/e2e-qa-hire-resources-contact-details.component';

const routes: Routes = [
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
