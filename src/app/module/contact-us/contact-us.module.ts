import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ThankYouContactUsComponent } from './thank-you-contact-us/thank-you-contact-us.component';

const routes: Routes = [
  {
    path: '',
    component: ContactUsComponent
  },
  {
    path: 'thank-you',
    component: ThankYouContactUsComponent
  }
];

@NgModule({
  declarations: [
    ContactUsComponent,
    ThankYouContactUsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class ContactUsModule { }
