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

  // Add new properties for service panels
  activeServicePanel: string = ''; // Tracks which service panel is currently active

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService
  ) { }

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

  // Add new method to handle card clicks
  showServicePanel(panelName: string) {
    this.activeServicePanel = this.activeServicePanel === panelName ? '' : panelName;
  }

  searchData() {
    if (this.selectedService == "WorkAway") {
      this.router.navigateByUrl('/resource-search');
    } else if (this.selectedService === 'IT Subcontracting') {
      this.router.navigateByUrl('/our-services/partner-search-result-experience');
    }
  }
}
