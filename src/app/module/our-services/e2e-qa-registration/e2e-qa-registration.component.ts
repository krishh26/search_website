import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-e2e-qa-registration',
  templateUrl: './e2e-qa-registration.component.html',
  styleUrls: ['./e2e-qa-registration.component.scss']
})
export class E2eQaRegistrationComponent {

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

}
