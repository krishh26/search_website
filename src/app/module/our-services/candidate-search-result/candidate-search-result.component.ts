import { Component, OnInit } from '@angular/core';
import { ItSubcontractService, Role } from 'src/app/services/it-subcontract.service';

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
  roles: Role[] = [];
  candidates: Candidate[] = [];
  loading: boolean = false;
  error: string | null = null;
  totalCandidates: number = 0;
  activeCandidates: number = 0;
  searchQuery: string = '';

  constructor(private itSubcontractService: ItSubcontractService) {}

  ngOnInit() {
   // this.fetchRoles();
    this.fetchCandidates();
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
