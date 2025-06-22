import { Component, OnInit } from '@angular/core';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';

interface Supplier {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  location: string;
  employeeCount: number;
  howLongCompanyBussiness: number;
  yearOfEstablishment: string;
  expertise: Array<{
    name: string;
    type: string;
    subExpertise: string[];
  }>;
  totalProjectsExecuted: number;
  executiveSummary: string;
}

interface SupplierFilter {
  _id: string;
  projectName: string;
  expertise: string;
  tags: string;
  userId: string;
}

interface Expertise {
  _id: string;
  name: string;
  type: string;
}

@Component({
  selector: 'app-partner-search-result-experience',
  templateUrl: './partner-search-result-experience.component.html',
  styleUrls: ['./partner-search-result-experience.component.scss']
})
export class PartnerSearchResultExperienceComponent implements OnInit {
  supplierList: Supplier[] = [];
  totalSuppliers: number = 0;
  searchText: string = '';
  private searchSubject = new Subject<string>();
  projectName: string = "";
  tags: string = "";
  expertise: string = "";
  savedFilters: SupplierFilter[] = [];
  isLoadingFilters: boolean = false;
  expertiseList: Expertise[] = [];
  filterList: any[] = [];
  selectedFilter!: string;
  expertiseSelect!: string | null;
  isLoading: boolean = false;

  constructor(
    private itsubcontractService: ItSubcontractService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['projectName']) {
        this.projectName = params['projectName'];
      } else {
        this.projectName = ""
      }
      if (params['tags']) {
        this.tags = params['tags'];
      } else {
        this.tags = ""
      }
      if (params['expertise']) {
        this.expertise = params['expertise'];
      } else {
        this.expertise = ""
      }
      if (params['id']) {
        this.selectedFilter = params['id'];
      } else {
        this.selectedFilter = ""
      }
    });

    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.loadSupplierList(searchValue);
    });
  }

  ngOnInit(): void {
    this.loadExpertiseList();
  }

  loadExpertiseList(): void {
    this.isLoading = true;
    this.itsubcontractService.getExpertiseList().subscribe({
      next: (response) => {
        if (response?.status && response?.data?.expertise) {
          this.expertiseList = response.data.expertise;
          this.isLoading = false;
          this.loadFilterList();
        }
      },
      error: (error) => {
        this.isLoading = false;
      }
    });
  }

  loadFilterList(): void {
    this.isLoadingFilters = true;
    this.expertiseSelect = null;
    this.itsubcontractService.getSupplierFilterList().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.filterList = response.data;

          // Automatically select first filter if available
          if (this.filterList.length > 0) {
            this.selectFilter(this.selectedFilter ? this.selectedFilter : this.filterList[0]._id);
          } else {
            this.router.navigateByUrl('/home');
          }
        }
        this.isLoadingFilters = false;
      },
      error: (error) => {
        console.error('Error loading filters:', error);
        this.isLoadingFilters = false;
      }
    });
  }

  selectFilter(filterId: string): void {
    this.selectedFilter = filterId;
    this.isLoadingFilters = true;

    // Call the new API endpoint
    this.itsubcontractService.getSuppliersByFilterId(filterId).subscribe({
      next: (response: any) => {
        if (response?.status) {
          this.supplierList = response.data || [];
          this.totalSuppliers = response.data?.length || 0;
        }
        this.isLoadingFilters = false;
      },
      error: (error: Error) => {
        console.error('Error loading suppliers:', error);
        this.isLoadingFilters = false;
      }
    });
  }

  removeFilter(filterId: string, event?: MouseEvent): void {
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
        this.itsubcontractService.removeSupplierFilter(filterId).subscribe({
          next: (response: { status: boolean; message: string }) => {
            if (response?.status) {
              this.selectedFilter = "";
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

  calculateExperience(yearOfEstablishment: string | null): number {
    if (!yearOfEstablishment) return 0;

    const establishmentDate = new Date(yearOfEstablishment);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - establishmentDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    return diffYears;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText = value;
    this.searchSubject.next(value);
  }

  loadSupplierList(search: string = ''): void {
    const payload = {
      limit: 1000,
      search,
      projectName: this.projectName || "",
      tags: this.tags || "",
      expertise: this.expertise || ""
    }
    this.itsubcontractService.getSupplierList(payload).subscribe({
      next: (response: any) => {
        if (response.status && response.data?.data) {
          this.supplierList = response.data.data;
          this.totalSuppliers = response.data.count?.total || 0;
        }
      },
      error: (error) => {
        console.error('Error fetching supplier list:', error);
      }
    });
  }

  applyFilter(filter: SupplierFilter): void {
    this.projectName = filter.projectName;
    this.tags = filter.tags;
    this.expertise = filter.expertise;
    this.loadSupplierList();
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

      this.itsubcontractService.saveSupplierFilters(payload).subscribe({
        next: (response) => {
          if (response?.status) {
            this.loadFilterList();
          }
        },
        error: (error) => {
        }
      });
    } else {
    }
  }
}
