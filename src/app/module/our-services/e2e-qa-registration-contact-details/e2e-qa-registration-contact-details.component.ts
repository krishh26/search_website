import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-e2e-qa-registration-contact-details',
  templateUrl: './e2e-qa-registration-contact-details.component.html',
  styleUrls: ['./e2e-qa-registration-contact-details.component.scss']
})
export class E2eQaRegistrationContactDetailsComponent {

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

}
