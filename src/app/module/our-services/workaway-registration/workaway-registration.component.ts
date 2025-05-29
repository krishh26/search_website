import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-workaway-registration',
  templateUrl: './workaway-registration.component.html',
  styleUrls: ['./workaway-registration.component.scss']
})
export class WorkawayRegistrationComponent {
  hasDemandReady: boolean = false;
  bankingForClients: boolean = false;

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/our-services/workaway']);
  }

  onDemandReadyChange(hasDemand: boolean): void {
    this.hasDemandReady = hasDemand;
  }

  onBankingOptionChange(forClients: boolean): void {
    this.bankingForClients = forClients;
  }

}
