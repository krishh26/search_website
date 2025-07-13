import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../common/services/navigation.service';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

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
  jobTitleSearch: string = ''; // New property for job title search input
  showJobTitleDropdown: boolean = false; // Control dropdown visibility

  expertiseList: any[] = [];
  expertiseSelect!: string;
  expertiseSearch: string = ''; // New property for expertise search input
  showExpertiseDropdown: boolean = false; // Control dropdown visibility

  // Search subjects for debouncing
  private jobTitleSearchSubject = new Subject<string>();
  private expertiseSearchSubject = new Subject<string>();

  filterList: any[] = [];
  itSubFilterList: any[] = [];
  // How many tags to show by default
  defaultTagLimit = 5;
  showAllTags = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private itSubcontractService: ItSubcontractService,
    private notificationService: NotificationService
  ) { }

  get visibleCombinedTags() {
    // Combine both lists, prioritizing filterList first
    const combined = [...this.filterList, ...this.itSubFilterList];
    if (this.showAllTags || combined.length <= this.defaultTagLimit) {
      return combined;
    }
    return combined.slice(0, this.defaultTagLimit);
  }

  get showToggleButton() {
    return (this.filterList.length + this.itSubFilterList.length) > this.defaultTagLimit;
  }

  toggleShowAllTags() {
    this.showAllTags = !this.showAllTags;
  }

  ngOnInit() {
    // Reset the showAllTags state
    this.showAllTags = false;

    // Check navigation service first
    const previousService = this.navigationService.getPreviousService();
    if (previousService) {
      this.setServiceBasedOnSource(previousService);
      // Clear the service after using it
      this.navigationService.clearPreviousService();
    }
    this.getFilterList();
    this.loadFilterList();

    // Subscribe to router events to handle navigation
    this.router.events.subscribe(() => {
      this.showAllTags = false;
    });

    // Setup search debouncing for job titles
    this.jobTitleSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm && searchTerm.trim().length > 0) {
        this.searchJobTitles(searchTerm);
        this.showJobTitleDropdown = true;
      } else {
        this.jobRoles = [];
        this.showJobTitleDropdown = false;
      }
    });

    // Setup search debouncing for expertise
    this.expertiseSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      if (searchTerm && searchTerm.trim().length > 0) {
        this.searchExpertise(searchTerm);
        this.showExpertiseDropdown = true;
      } else {
        this.expertiseList = [];
        this.showExpertiseDropdown = false;
      }
    });
  }

  // Function to be used for the getting saved filters
  getFilterList() {
    this.filterList = [];
    this.itSubcontractService.getCandidateFilters().subscribe({
      next: (response) => {
        if (response?.status) {
          this.filterList = response?.data || [];
          this.filterList?.forEach((element) => {
            if (element) {
              element['type'] = 'workaway'
            }
          })
        }
      },
    });
  }

  // Function to be used for the remove filter
  removeFilter(filterId: string) {
    this.itSubcontractService.removeCandidateFilters(filterId).subscribe({
      next: (response) => {
        if (response?.status) {
          this.getFilterList();
        }
      },
      error: (error) => {
        console.error('Error removing filter:', error);
      }
    });
  }

  loadFilterList(): void {
    this.itSubFilterList = [];
    this.itSubcontractService.getSupplierFilterList().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.itSubFilterList = response.data;
          this.itSubFilterList?.forEach((element: any) => {
            if (element) {
              element['type'] = 'itsubcontract'
            }
          })
        }
      }
    });
  }

  removeFilterItSub(filterId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    this.itSubcontractService.removeSupplierFilter(filterId).subscribe({
      next: (response: { status: boolean; message: string }) => {
        if (response?.status) {
          this.loadFilterList();
        }
      },
      error: (error: Error) => {
        console.error('Error removing filter:', error);
      }
    });
  }



  searchForWorkAway() {
    const searchValue = this.jobTitle || this.jobTitleSearch;
    if (searchValue) {
      const payload = {
        userId: null, // need to add id based on the login
        anonymousUserId: localStorage.getItem('anonymousUserId') || null,
        filters: [{
          jobTitle: searchValue,
          // minExperience: 0,
          // maxExperience: 100,
          // candidateCount: 100
        }]
      }

      this.itSubcontractService.saveCandidateFilters(payload).subscribe({
        next: (response) => {
          this.router.navigate(['/our-services/candidate-search-result'], {
            queryParams: {
              workAwayId: response?.data?.[0]?._id,
            }
          });
          // this.router.navigate(['/our-services/candidate-search-result']);
        },
      });
    } else {
    }
  }




  searchForItSubContract() {
    const searchValue = this.expertiseSelect || this.expertiseSearch;
    if (searchValue) {
      const payload = {
        userId: '', // This should come from your auth service
        anonymousUserId: localStorage.getItem('anonymousUserId') || null,
        filters: [
          {
            "projectName": "",
            "expertise": searchValue,
            "tags": "",
            "projectNameId": ""
          }
        ]
      };

      this.itSubcontractService.saveSupplierFilters(payload).subscribe({
        next: (response) => {
          if (response?.status) {
            this.router.navigate(['/our-services/candidate-search-result'], {
              queryParams: {
                id: response?.data?.[0]?._id,
              }
            });
            // this.router.navigate(['/our-services/partner-search-result-experience']);
          }
        },
        error: (error) => {
        }
      });
    } else {
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
    
    // Reset search inputs and dropdowns when service changes
    this.jobTitleSearch = '';
    this.expertiseSearch = '';
    this.jobTitle = '';
    this.expertiseSelect = '';
    this.jobRoles = [];
    this.expertiseList = [];
    this.showJobTitleDropdown = false;
    this.showExpertiseDropdown = false;
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

  redirectFilterToWorkAwaySearch(id: string) {
    // First set the service type in navigation service
    this.navigationService.setPreviousService('workaway');

    // Then navigate with the ID
    this.router.navigate(['/our-services/candidate-search-result'], {
      queryParams: {
        workAwayId: id,
      }
    });
  }

  redirectFilterToItSubSearch(id: string) {
    // First set the service type in navigation service
    this.navigationService.setPreviousService('it-subcontracting');

    // Then navigate with the ID
    this.router.navigate(['/our-services/candidate-search-result'], {
      queryParams: {
        id: id,
      }
    });
  }

  // New method to handle job title search input
  onJobTitleSearchChange(event: any) {
    this.jobTitleSearch = event?.target?.value;
    this.jobTitleSearchSubject.next(event?.target?.value);
  }

  // New method to handle expertise search input
  onExpertiseSearchChange(event: any) {
    this.expertiseSearch = event?.target?.value;;
    this.expertiseSearchSubject.next(event?.target?.value);
  }

  // New method to search job titles with API
  searchJobTitles(searchTerm: string) {
    this.isLoading = true;
    this.itSubcontractService.getJobTitles(searchTerm).subscribe({
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

  // New method to search expertise with API
  searchExpertise(searchTerm: string) {
    this.isLoading = true;
    this.itSubcontractService.getExpertise(searchTerm).subscribe({
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

  // Method to select job title from dropdown
  selectJobTitle(jobTitle: string) {
    this.jobTitle = jobTitle;
    this.jobTitleSearch = jobTitle;
    this.showJobTitleDropdown = false;
  }

  // Method to select expertise from dropdown
  selectExpertise(expertise: string) {
    this.expertiseSelect = expertise;
    this.expertiseSearch = expertise;
    this.showExpertiseDropdown = false;
  }

  // Method to close dropdowns when clicking outside
  onInputBlur() {
    // Small delay to allow for dropdown item clicks
    setTimeout(() => {
      this.showJobTitleDropdown = false;
      this.showExpertiseDropdown = false;
    }, 200);
  }

  // Method to handle Enter key press
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.selectedService === 'WorkAway' && (this.jobTitle || this.jobTitleSearch)) {
        this.searchForWorkAway();
      } else if (this.selectedService === 'IT Subcontracting' && (this.expertiseSelect || this.expertiseSearch)) {
        this.searchForItSubContract();
      }
    }
  }
}
