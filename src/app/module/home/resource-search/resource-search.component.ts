import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItSubcontractService, CandidateFilter } from 'src/app/services/it-subcontract.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { Location } from '@angular/common';
interface JobRole {
  name: string;
}

@Component({
  selector: 'app-resource-search',
  templateUrl: './resource-search.component.html',
  styleUrls: ['./resource-search.component.scss']
})
export class RecourceSearchComponent implements OnInit {
  searchForm: FormGroup;
  filters: CandidateFilter[] = [];
  serviceType: 'workaway' | 'itsubcontract' = 'workaway';
  jobRoles: JobRole[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private itSubcontractService: ItSubcontractService,
    private router: Router,
    private location: Location
  ) {
    this.searchForm = this.fb.group({
      jobTitle: [null, Validators.required],
      numberOfResources: ['', Validators.min(1)],
      experience: [''],
    });
  }

  ngOnInit(): void {
    this.getJobTitles();
  }

  addFilter() {
    this.searchForm.markAllAsTouched();
    if (this.searchForm.valid) {
      this.filters.push(this.searchForm.value);
      this.searchForm.reset();
    }
  }

  getJobTitles() {
    this.jobRoles = [];
    this.isLoading = true;
    this.itSubcontractService.getJobTitles(this.filters).subscribe({
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
          this.router.navigate(['/our-services/candidate-search-result'], {
            queryParams: {
              workAwayId: response?.data?.[0]?._id,
            }
          });
          this.router.navigate(['/our-services/candidate-search-result']);
        },
        error: (error) => {
        }
      });
    } else {
    }
  }

  onServiceTypeChange() {
    if (this.serviceType === 'itsubcontract') {
      this.router.navigate(['/our-services/partner-search-result']);
    }
  }

  goBack() {
    this.location.back();
  }
}
