import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItSubcontractService, CandidateFilter } from 'src/app/services/it-subcontract.service';

@Component({
  selector: 'app-resource-search',
  templateUrl: './resource-search.component.html',
  styleUrls: ['./resource-search.component.scss']
})
export class RecourceSearchComponent {
  searchForm: FormGroup;
  filters: CandidateFilter[] = [];
  serviceType: 'workaway' | 'itsubcontract' = 'workaway';

  constructor(
    private fb: FormBuilder,
    private itSubcontractService: ItSubcontractService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      jobTitle: ['', Validators.required],
      numberOfResources: ['', [Validators.required, Validators.min(1)]],
      experience: ['', Validators.required],
    });
  }

  onRadioChange(event: any) {
    this.serviceType = event.target.value;
  }

  addFilter() {
    if (this.searchForm.valid) {
      this.filters.push(this.searchForm.value);
      this.searchForm.reset();
    }
  }

  search() {
    if (this.filters.length > 0) {
      this.itSubcontractService.saveCandidateFilters(this.filters).subscribe({
        next: (response) => {
          // Navigate to search results page
          this.router.navigate(['/our-services/candidate-search-result']);
        },
        error: (error) => {
          console.error('Error saving filters:', error);
          // Handle error appropriately (show error message to user)
        }
      });
    }
  }
}
