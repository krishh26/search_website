import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workkaway-registration-contact-details',
  templateUrl: './workkaway-registration-contact-details.component.html',
  styleUrls: ['./workkaway-registration-contact-details.component.scss']
})
export class WorkkawayRegistrationContactDetailsComponent {

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/our-services/workaway-registration']);
  }

}
