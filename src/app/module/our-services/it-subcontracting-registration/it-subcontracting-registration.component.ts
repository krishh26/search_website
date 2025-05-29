import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-it-subcontracting-registration',
  templateUrl: './it-subcontracting-registration.component.html',
  styleUrls: ['./it-subcontracting-registration.component.scss']
})
export class ItSubcontractingRegistrationComponent {

  hasDemandReady: boolean = false;
  isRepresentativeForClient: boolean = true;

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

  onDemandReadyChange(value: string): void {
    this.hasDemandReady = value === 'yes';
  }

  onRegistrationTypeChange(value: string): void {
    this.isRepresentativeForClient = value === 'representative';
  }

}
