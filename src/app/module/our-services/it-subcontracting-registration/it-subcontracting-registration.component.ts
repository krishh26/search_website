import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-it-subcontracting-registration',
  templateUrl: './it-subcontracting-registration.component.html',
  styleUrls: ['./it-subcontracting-registration.component.scss']
})
export class ItSubcontractingRegistrationComponent {

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

}
