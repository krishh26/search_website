import { Component, OnInit } from '@angular/core';
import { ItSubcontractService, Role } from 'src/app/services/it-subcontract.service';

@Component({
  selector: 'app-candidate-search-result',
  templateUrl: './candidate-search-result.component.html',
  styleUrls: ['./candidate-search-result.component.scss']
})
export class CandidateSearchResultComponent implements OnInit {
  roles: Role[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private itSubcontractService: ItSubcontractService) {}

  ngOnInit() {
    this.fetchRoles();
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
}
