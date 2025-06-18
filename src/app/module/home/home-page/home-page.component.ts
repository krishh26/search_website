import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../common/services/navigation.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  selectedService: string = 'WorkAway'; // Default selection
  showSkills: boolean = true; // Show skills by default for WorkAway
  showServices: boolean = false; // Hide services by default

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    // Check navigation service first
    const previousService = this.navigationService.getPreviousService();
    if (previousService) {
      this.setServiceBasedOnSource(previousService);
      // Clear the service after using it
      this.navigationService.clearPreviousService();
    }
  }

  private setServiceBasedOnSource(source: string) {
    if (source === 'workaway' || source.includes('workaway')) {
      this.selectedService = 'WorkAway';
      this.updateVisibility('WorkAway');
    } else if (source === 'it-subcontracting' || source.includes('it-subcontracting')) {
      this.selectedService = 'IT Subcontracting';
      this.updateVisibility('IT Subcontracting');
    }
  }

  onServiceChange(event: any) {
    const value = event.target.value;
    this.updateVisibility(value);
  }

  private updateVisibility(service: string) {
    if (service === 'WorkAway') {
      this.showSkills = true;
      this.showServices = false;
    } else if (service === 'IT Subcontracting') {
      this.showSkills = false;
      this.showServices = true;
    }
  }
}
