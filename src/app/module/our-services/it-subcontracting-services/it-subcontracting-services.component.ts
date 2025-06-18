import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../common/services/navigation.service';

@Component({
  selector: 'app-it-subcontracting-services',
  templateUrl: './it-subcontracting-services.component.html',
  styleUrls: ['./it-subcontracting-services.component.scss']
})
export class ItSubcontractingServicesComponent {
  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  navigateToHome() {
    this.navigationService.setPreviousService('it-subcontracting');
    this.router.navigate(['/']);
  }
}
