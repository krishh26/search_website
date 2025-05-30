import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e2e-qa-hire-resources-contact-details',
  templateUrl: './e2e-qa-hire-resources-contact-details.component.html',
  styleUrls: ['./e2e-qa-hire-resources-contact-details.component.scss']
})
export class E2eQaHireResourcesContactDetailsComponent {

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/our-services/e2e-qa-hire-resources-registrations']);
  }


}
