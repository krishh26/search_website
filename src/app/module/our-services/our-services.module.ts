import { ItSubcontractingServicesComponent } from './it-subcontracting-services/it-subcontracting-services.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkawayComponent } from './workaway/workaway.component';
import { E2eQaServicesComponent } from './e2e-qa-services/e2e-qa-services.component';
import { WorkawayRegistrationComponent } from './workaway-registration/workaway-registration.component';
import { ItSubcontractingRegistrationComponent } from './it-subcontracting-registration/it-subcontracting-registration.component';
import { E2eQaRegistrationComponent } from './e2e-qa-registration/e2e-qa-registration.component';

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
    path: 'it-subcontracting-services',
    component: ItSubcontractingServicesComponent
  },
  {
    path: 'it-subcontracting-registration',
    component: ItSubcontractingRegistrationComponent
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
    E2eQaServicesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class OurServicesModule { }
