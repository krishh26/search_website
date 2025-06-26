import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  searchQuery: any;
  filterList: any[] = [];
  selectedFilter: any;
  selectedFilterData: any = {};
  supplierList: any[] = [];
  totalSuppliers: number = 0;

  selectedService: string = 'WorkAway'; // Default selection

  expertiseSelect!: string;
  expertiseList: any[] = [];
  itSubFilterList: any = [];
  itSelectedFilter: any;

  // How many tags to show by default
  defaultTagLimit = 7;
  showAllTags = false;

  constructor(
    private itSubcontractService: ItSubcontractService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
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
    // Subscribe to route params and load data accordingly
    this.route.queryParams.subscribe(params => {
      // Reset data
      this.candidates = [];
      this.totalCandidates = 0;
      this.activeCandidates = 0;

      if (params['workAwayId']) {
        this.selectedService = "WorkAway";
        this.selectedFilter = params['workAwayId'];
        // Load candidates for this filter
        this.loadCandidatesForFilter(this.selectedFilter);
      } else if (params['id']) {
        this.selectedService = "IT Subcontracting";
        this.itSelectedFilter = params['id'];
        // Load suppliers for this filter
        this.loadSuppliersForFilter(this.itSelectedFilter);
      }
    });

    // Load all supporting data
    this.getFilterList();
    this.getJobTitles();
    this.getExpertise();
    this.loadFilterList();
  }

  loadCandidatesForFilter(filterId: string) {
    if (!filterId) return;

    this.loading = true;
    this.error = null;

    this.itSubcontractService.getCandidateFilterByList(filterId).subscribe({
      next: (response) => {
        if (response?.status) {
          this.candidates = response.data || [];
          this.totalCandidates = response.meta_data.items;
          this.activeCandidates = response.activeCandidatesCount;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading candidates:', error);
        this.error = 'Failed to load candidates. Please try again.';
        this.loading = false;
      }
    });
  }

  loadSuppliersForFilter(filterId: string) {
    if (!filterId) return;

    this.loading = true;
    this.error = null;

    this.itSubcontractService.getSuppliersByFilterId(filterId).subscribe({
      next: (response) => {
        if (response?.status) {
          this.supplierList = response.data || [];
          this.totalSuppliers = response.data?.length || 0;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.error = 'Failed to load suppliers. Please try again.';
        this.loading = false;
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
          // Only select IT Subcontracting filter if we're in IT Subcontracting mode
          if (this.selectedService === "WorkAway") {
            this.selectFilter(this.selectedFilter ? this.selectedFilter : this.filterList?.[0]?._id);
          }
        }
      },
      error: (error) => {
        console.error('Error loading filters:', error);
      }
    });
  }

  // Function to be used for the change filter
  selectFilter(filterId: string) {
    this.selectedService = "WorkAway";
    this.selectedFilter = filterId;
    this.itSelectedFilter = null;
    this.selectedFilterData = this.filterList.find((element) => element._id == filterId);
    this.searchQuery = null;
    this.loadCandidatesForFilter(filterId);
  }

  selectFilterItSubContractFilter(filterId: string): void {
    this.selectedService = "IT Subcontracting";
    this.itSelectedFilter = filterId;
    this.selectedFilter = null;
    this.loadSuppliersForFilter(filterId);
  }

  onServiceChange(event: any) {
    this.selectedService = event.target.value;
  }

  searchData() {
    if (this.selectedService == "WorkAway") {
      this.router.navigateByUrl('/resource-search');
    } else if (this.selectedService === 'IT Subcontracting') {
      this.router.navigateByUrl('/our-services/partner-search-result');
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

  calculateExperience(yearOfEstablishment: string | null): string {
    if (!yearOfEstablishment) return "0";

    const establishmentDate = new Date(yearOfEstablishment);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - establishmentDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    return this.getCompanyExperienceRange(diffYears);
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

  loadFilterList(): void {
    this.itSubFilterList = [];
    this.itSubcontractService.getSupplierFilterList().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.itSubFilterList = response.data as any;
          this.itSubFilterList?.forEach((element: any) => {
            if (element) {
              element['type'] = 'itsubcontract'
            }
          });

          // Only select IT Subcontracting filter if we're in IT Subcontracting mode
          if (this.selectedService === "IT Subcontracting") {
            this.selectFilterItSubContractFilter(this.itSelectedFilter ? this.itSelectedFilter : this.itSubFilterList?.[0]?._id);
          }
        }
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

  // Function to be used for the remove filter
  removeFilter(filterId: string) {
    this.itSubcontractService.removeCandidateFilters(filterId).subscribe({
      next: (response) => {
        if (response?.status) {
          this.selectedFilter = "";
          this.getFilterList();
        }
      },
      error: (error) => {
        console.error('Error removing filter:', error);
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
    if (this.searchQuery) {
      this.selectedFilter = null;
      this.itSelectedFilter = null;
      const payload = {
        userId: null, // need to add id based on the login
        anonymousUserId: localStorage.getItem('anonymousUserId') || null,
        filters: [{
          jobTitle: this.searchQuery,
          // minExperience: 0,
          // maxExperience: 100,
          // candidateCount: 100
        }]
      }

      this.itSubcontractService.saveCandidateFilters(payload).subscribe({
        next: (response) => {
          this.getFilterList();
        },
      });
    } else {
    }
  }

  searchForItSubContract() {
    if (this.expertiseSelect) {
      this.selectedFilter = null;
      this.itSelectedFilter = null;
      const payload = {
        userId: '', // This should come from your auth service
        anonymousUserId: localStorage.getItem('anonymousUserId') || null,
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
            this.loadFilterList();
          }
        },
        error: (error) => {
        }
      });
    } else {
    }
  }

  maskName(name: string): string {
    const words = name.split(' ');

    return words.map((word, index) => {
      if (index === 0) {
        // First word: show 1st, 3rd, 5th
        return word
          .split('')
          .map((char, i) => (i === 0 || i === 2 || i === 4 ? char : '*'))
          .join('');
      } else if (index === 1) {
        // Second word: show 1st and 3rd
        return word
          .split('')
          .map((char, i) => (i === 0 || i === 2 ? char : '*'))
          .join('');
      } else {
        // All other words: full mask
        return '*'.repeat(word.length);
      }
    }).join(' ');
  }

  resourceCapacity(value: number): string {
    if (value === 0) {
      return "0";
    } else if (value > 0 && value <= 20) {
      return "1-20";
    } else if (value > 20 && value <= 50) {
      return "21-50";
    } else if (value > 50 && value <= 100) {
      return "50-100";
    } else if (value > 100 && value <= 200) {
      return "100-200";
    } else {
      return "200+";
    }
  }

  getExperienceRange(years: number): string {
    if (years <= 0) {
      return "0";
    } else if (years > 0 && years <= 3) {
      return "1-3";
    } else if (years > 3 && years <= 5) {
      return "3-5";
    } else if (years > 5 && years <= 10) {
      return "5-10";
    } else {
      return "10+";
    }
  }

  getCompanyExperienceRange(years: number): string {
    if (years <= 0) {
      return "0";
    } else if (years > 0 && years <= 3) {
      return "1-3";
    } else if (years > 3 && years <= 5) {
      return "3-5";
    } else if (years > 5 && years <= 10) {
      return "5-10";
    } else {
      return "10+";
    }
  }
}
