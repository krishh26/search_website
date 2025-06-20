import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../common/services/navigation.service';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

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

  jobRoles: any[] = [];
  isLoading: boolean = false;
  jobTitle!: string;

  expertiseList: any[] = [];
  expertiseSelect!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private itSubcontractService: ItSubcontractService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    // Check navigation service first
    const previousService = this.navigationService.getPreviousService();
    if (previousService) {
      this.setServiceBasedOnSource(previousService);
      // Clear the service after using it
      this.navigationService.clearPreviousService();
    }
    this.getJobTitles();
    this.getExpertise();
  }

  getJobTitles() {
    this.jobRoles = [];
    this.isLoading = true;
    this.itSubcontractService.getJobTitles().subscribe({
      next: (response) => {
        if (response?.status) {
          this.jobRoles = (response?.data?.roles || []).map((role: string) => ({ name: role }));
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  searchForWorkAway() {
    if (this.jobTitle) {
      const payload = {
        userId: null, // need to add id based on the login
        filters: [{
          jobTitle: this.jobTitle,
          // minExperience: 0,
          // maxExperience: 100,
          // candidateCount: 100
        }]
      }

      this.itSubcontractService.saveCandidateFilters(payload).subscribe({
        next: (response) => {
          this.router.navigate(['/our-services/candidate-search-result']);
        },
      });
    } else {
      this.notificationService.showError("Please enter one filter !");
    }
  }

  
  getExpertise() {
    this.expertiseList = [];
    this.isLoading = true;
    this.itSubcontractService.getExpertise().subscribe({
      next: (response) => {
        if (response?.status) {
          this.expertiseList = (response?.data?.expertise || []).map((role: any) => ({ name: role.name }));
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  searchForItSubContract() {
    if (this.expertiseSelect) { 
      this.router.navigate(['/our-services/partner-search-result-experience'], {
        queryParams: {
          expertise: this.expertiseSelect || "",
        }
      });
    } else {
         this.notificationService.showError("Please enter one filter !");
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
      this.router.navigateByUrl('/our-services/partner-search-result');
    }
  }
}
