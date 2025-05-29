import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-workkaway-registration-contact-details',
  templateUrl: './workkaway-registration-contact-details.component.html',
  styleUrls: ['./workkaway-registration-contact-details.component.scss']
})
export class WorkkawayRegistrationContactDetailsComponent {

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

}
