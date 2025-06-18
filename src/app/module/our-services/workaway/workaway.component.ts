import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from '../../../common/services/navigation.service';

@Component({
  selector: 'app-workaway',
  templateUrl: './workaway.component.html',
  styleUrls: ['./workaway.component.scss']
})
export class WorkawayComponent {
  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  navigateToHome() {
    this.navigationService.setPreviousService('workaway');
    this.router.navigate(['/']);
  }
}
