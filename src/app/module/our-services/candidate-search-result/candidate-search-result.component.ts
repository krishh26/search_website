import { Component, OnInit } from '@angular/core';
import { ItSubcontractService, Role } from 'src/app/services/it-subcontract.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import Swal from 'sweetalert2';

interface Candidate {
  _id: string;
  fullName: string;
  gender: string;
  nationality: string;
  highestQualification: string;
  totalExperience: number;
  currentRole?: {
    _id: string;
    name: string;
  };
  technicalSkills: string[];
  languagesKnown: string[];
  ukHourlyRate: number;
  ukDayRate: number;
  indianDayRate: number;
  active: boolean;
}

interface CandidateResponse {
  message: string;
  status: boolean;
  data: Candidate[];
  executiveCount: number;
  activeCandidatesCount: number;
  meta_data: {
    items: number;
    pages: number | null;
  };
}

@Component({
  selector: 'app-candidate-search-result',
  templateUrl: './candidate-search-result.component.html',
  styleUrls: ['./candidate-search-result.component.scss']
})
export class CandidateSearchResultComponent implements OnInit {
  jobRoles: any[] = [];
  roles: Role[] = [];
  candidates: Candidate[] = [];
  loading: boolean = false;
  isLoading: boolean = false;
  error: string | null = null;
  totalCandidates: number = 0;
  activeCandidates: number = 0;
  searchQuery: string = '';
  filterList: any[] = [];
  selectedFilter: string = "";
  selectedFilterData: any = {};

  constructor(
    private itSubcontractService: ItSubcontractService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getFilterList();
    this.getJobTitles();
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
        this.notificationService.showError('Failed to load job titles');
      }
    });
  }

  // Function to be used for the getting saved filters
  getFilterList() {
    this.filterList = [];
    this.selectedFilter = "";
    this.itSubcontractService.getCandidateFilters().subscribe({
      next: (response) => {
        if (response?.status) {
          this.filterList = response?.data || [];
          this.selectFilter(this.filterList?.[0]?._id);
          // this.selectedFilter = this.filterList?.[0]?._id || "";
          // this.selectedFilterData = this.filterList?.[0] || {};
        }
      },
    });
  }

  // Function to be used for the change filter
  selectFilter(filterId: string) {
    this.selectedFilter = filterId;
    this.selectedFilterData = this.filterList.find((element) => element._id == filterId);
    this.itSubcontractService.getCandidateFilterByList(filterId).subscribe({
      next: (response) => {
        if (response?.status) {
           this.candidates = response.data || [];
          this.totalCandidates = response.meta_data.items;
          this.activeCandidates = response.activeCandidatesCount;
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
          this.notificationService.showError(error?.error?.message || 'Filter not removed please try again !');
        })
      }
    });
  }

  fetchRoles() {
    this.loading = true;
    this.error = null;

    this.itSubcontractService.getRolesList()
      .subscribe({
        next: (response: Role[]) => {
          this.roles = response;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Failed to fetch roles. Please try again later.';
          this.loading = false;
          console.error('Error fetching roles:', error);
        }
      });
  }

  fetchCandidates(params: any = {}) {
    this.loading = true;
    this.error = null;

    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    this.itSubcontractService.getCandidateList(params)
      .subscribe({
        next: (response: CandidateResponse) => {
          this.candidates = response.data;
          this.totalCandidates = response.meta_data.items;
          this.activeCandidates = response.activeCandidatesCount;
          this.loading = false;
        },
        error: (error: any) => {
          this.error = 'Failed to fetch candidates. Please try again later.';
          this.loading = false;
          console.error('Error fetching candidates:', error);
        }
      });
  }

  onSearch() {
    this.fetchCandidates();
  }
}
