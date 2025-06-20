import { Component, OnInit } from '@angular/core';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';

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
  selectedFilter: string = '';

  constructor(
    private itsubcontractService: ItSubcontractService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
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
    this.itsubcontractService.getExpertiseList().subscribe({
      next: (response) => {
        if (response?.status && response?.data?.expertise) {
          this.expertiseList = response.data.expertise;
          this.loadFilterList();
        }
      },
      error: (error) => {
        console.error('Error loading expertise list:', error);
        this.notificationService.showError('Failed to load expertise list');
      }
    });
  }

  getExpertiseName(expertiseId: string): string {
    if (!expertiseId) return '';
    const expertise = this.expertiseList.find(e => e._id === expertiseId);
    return expertise?.name || expertiseId;
  }

  loadFilterList(): void {
    this.isLoadingFilters = true;
    this.itsubcontractService.getSupplierFilterList().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.filterList = response.data.map((filter: any) => ({
            _id: filter._id,
            jobTitle: this.getExpertiseName(filter.projectName),
            expertise: filter.expertise,
            tags: filter.tags,
            projectName: filter.projectName,
            supplierCount: filter.supplierCount || 0
          }));

          // Automatically select first filter if available
          if (this.filterList.length > 0) {
            this.selectFilter(this.filterList[0]._id);
          }
        }
        this.isLoadingFilters = false;
      },
      error: (error) => {
        console.error('Error loading filters:', error);
        this.notificationService.showError('Failed to load filters');
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
        this.notificationService.showError('Failed to load suppliers');
        this.isLoadingFilters = false;
      }
    });
  }

  removeFilter(filterId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    this.itsubcontractService.removeSupplierFilter(filterId).subscribe({
      next: (response: { status: boolean; message: string }) => {
        if (response?.status) {
          this.filterList = this.filterList.filter(f => f._id !== filterId);
          this.savedFilters = this.savedFilters.filter(f => f._id !== filterId);
          this.notificationService.showSuccess('Filter removed successfully');
        }
      },
      error: (error: Error) => {
        console.error('Error removing filter:', error);
        this.notificationService.showError('Failed to remove filter');
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
}
