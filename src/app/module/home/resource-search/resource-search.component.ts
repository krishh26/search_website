import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItSubcontractService, CandidateFilter } from 'src/app/services/it-subcontract.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-resource-search',
  templateUrl: './resource-search.component.html',
  styleUrls: ['./resource-search.component.scss']
})
export class RecourceSearchComponent implements OnInit {
  searchForm: FormGroup;
  filters: CandidateFilter[] = [];
  serviceType: 'workaway' | 'itsubcontract' = 'workaway';
  jobRoles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private itSubcontractService: ItSubcontractService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.searchForm = this.fb.group({
      jobTitle: ['', Validators.required],
      numberOfResources: ['', [Validators.required, Validators.min(1)]],
      experience: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getJobTitles();
  }

  addFilter() {
    if (this.searchForm.valid) {
      this.filters.push(this.searchForm.value);
      this.searchForm.reset();
    }
  }

  getJobTitles() {
    this.jobRoles = [];
    this.itSubcontractService.getJobTitles(this.filters).subscribe({
      next: (response) => {
        if (response?.status) {
          this.jobRoles = response?.data?.roles || [];
        }
      },
    });
  }

  search() {
    if (this.filters.length > 0) {
      const payload = {
        userId: null, // need to add id based on the login
        filters: this.filters.map(item => {
          const exp = item.experience.trim();
          let minExperience, maxExperience;

          if (exp.includes(".")) {
            const [min, max] = exp.split('.').map(Number);
            minExperience = min;
            maxExperience = max;
          } else {
            minExperience = maxExperience = parseInt(exp, 10);
          }

          return {
            jobTitle: item.jobTitle.trim(),
            minExperience,
            maxExperience,
            candidateCount: item.numberOfResources
          };
        })
      }

      this.itSubcontractService.saveCandidateFilters(payload).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Filter added successfully');
          this.router.navigate(['/our-services/candidate-search-result']);
        },
        error: (error) => {
          this.notificationService.showError(error?.error?.message || 'Something went wrong please try again !');
        }
      });
    } else {
      this.notificationService.showError("Please enter one filter !");
    }
  }
}
