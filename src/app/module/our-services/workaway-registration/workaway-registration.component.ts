import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-workaway-registration',
  templateUrl: './workaway-registration.component.html',
  styleUrls: ['./workaway-registration.component.scss']
})
export class WorkawayRegistrationComponent {
  hasDemandReady: boolean = false;
  bankingForClients: boolean = false;

  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }

  onDemandReadyChange(hasDemand: boolean): void {
    this.hasDemandReady = hasDemand;
  }

  onBankingOptionChange(forClients: boolean): void {
    this.bankingForClients = forClients;
  }

}
