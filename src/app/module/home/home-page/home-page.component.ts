import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationService } from '../../../common/services/navigation.service';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';

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

  filterList: any[] = [];
  itSubFilterList: any[] = [];
  // How many tags to show by default
  defaultTagLimit = 2;
  showAllTags = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private itSubcontractService: ItSubcontractService,
    private notificationService: NotificationService
  ) { }

  get visibleFilterList() {
    return this.showAllTags ? this.filterList : this.filterList.slice(0, this.defaultTagLimit);
  }
  get visibleItSubFilterList() {
    return this.showAllTags ? this.itSubFilterList : this.itSubFilterList.slice(0, this.defaultTagLimit);
  }

  toggleShowAllTags() {
    this.showAllTags = !this.showAllTags;
  }

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
    this.getFilterList();
    this.loadFilterList();
  }

  // Function to be used for the getting saved filters
  getFilterList() {
    this.filterList = [];
    this.itSubcontractService.getCandidateFilters().subscribe({
      next: (response) => {
        if (response?.status) {
          this.filterList = response?.data || [];
        }
      },
    });
  }

  // Function to be used for the remove filter
  removeFilter(filterId: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to remove this filter?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.itSubcontractService.removeCandidateFilters(filterId).subscribe((response) => {
          if (response?.status) {
            Swal.fire('Removed!', 'The filter has been removed.', 'success');
            this.getFilterList();
          }
        }, (error) => {
        })
      }
    });
  }

  loadFilterList(): void {
    this.itSubFilterList = [];
    this.itSubcontractService.getSupplierFilterList().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.itSubFilterList = response.data;
        }
      }
    });
  }

  removeFilterItSub(filterId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.itSubcontractService.removeSupplierFilter(filterId).subscribe({
          next: (response: { status: boolean; message: string }) => {
            if (response?.status) {
              Swal.fire(
                'Deleted!',
                'Your filter has been deleted.',
                'success'
              );
              this.loadFilterList();
            }
          },
          error: (error: Error) => {
            console.error('Error removing filter:', error);
            Swal.fire(
              'Error!',
              'Failed to remove filter',
              'error'
            );
          }
        });
      }
    });
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
      const payload = {
        userId: '', // This should come from your auth service
        filters: [
          {
            "projectName": "",
            "expertise": this.expertiseSelect,
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
    this.router.navigate(['/our-services/candidate-search-result'], {
      queryParams: {
        workAwayId: id,
      }
    });
  }

  redirectFilterToItSubSearch(id: string) {
    this.router.navigate(['/our-services/candidate-search-result'], {
      queryParams: {
        id: id,
      }
    });
  }
}
