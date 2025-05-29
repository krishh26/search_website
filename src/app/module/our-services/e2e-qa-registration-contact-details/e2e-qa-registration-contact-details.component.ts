import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e2e-qa-registration-contact-details',
  templateUrl: './e2e-qa-registration-contact-details.component.html',
  styleUrls: ['./e2e-qa-registration-contact-details.component.scss']
})
export class E2eQaRegistrationContactDetailsComponent {

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/our-services/e2e-qa-registration']);
  }

}
