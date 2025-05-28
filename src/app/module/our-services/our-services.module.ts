import { ItSubcontractingServicesComponent } from './it-subcontracting-services/it-subcontracting-services.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { WorkawayComponent } from './workaway/workaway.component';
import { E2eQaServicesComponent } from './e2e-qa-services/e2e-qa-services.component';

const routes: Routes = [
  {
    path: 'workaway',
    component: WorkawayComponent
  },
  {
    path: 'e2e-qa-services',
    component: E2eQaServicesComponent
  },
  {
    path: 'it-subcontracting-services',
    component: ItSubcontractingServicesComponent
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
