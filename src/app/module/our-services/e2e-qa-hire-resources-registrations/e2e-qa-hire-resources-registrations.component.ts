import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e2e-qa-hire-resources-registrations',
  templateUrl: './e2e-qa-hire-resources-registrations.component.html',
  styleUrls: ['./e2e-qa-hire-resources-registrations.component.scss']
})
export class E2eQaHireResourcesRegistrationsComponent {

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/our-services/e2e-qa-services']);
  }

}
