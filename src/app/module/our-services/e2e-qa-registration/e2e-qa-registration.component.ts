import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e2e-qa-registration',
  templateUrl: './e2e-qa-registration.component.html',
  styleUrls: ['./e2e-qa-registration.component.scss']
})
export class E2eQaRegistrationComponent {

  hasDemandReady: boolean = false;
  isRepresentativeForClient: boolean = true;

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/our-services/e2e-qa-services']);
  }

  onDemandReadyChange(value: string): void {
    this.hasDemandReady = value === 'yes';
  }

  onRegistrationTypeChange(value: string): void {
    this.isRepresentativeForClient = value === 'representative';
  }

}
