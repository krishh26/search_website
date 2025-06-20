import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItSubcontractService, Tag } from '../../../services/it-subcontract.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'app-it-sub-partner-search',
  templateUrl: './it-sub-partner-search.component.html',
  styleUrls: ['./it-sub-partner-search.component.scss']
})
export class ItSubPartnerSearchComponent implements OnInit {
  projectCategories: Tag[] = [];
  selectedCategory: Tag | null = null;
  isLoading = false;
  partnerForm!: FormGroup;
  filters: any[] = [];
  expertiseList: any[] = [];
  loadingExpertise = false;

  constructor(
    private itSubcontractService: ItSubcontractService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadCategories();
    this.loadExpertiseList();
    this.initForm();
  }

  initForm() {
    this.partnerForm = this.fb.group({
      projectName: ['', Validators.required],
      projectCategory: [''],
      engagementType: [''],
      projectDescription: [''],
      technologyDemand: [''],
      startDate: [''],
      endDate: [''],
      budget: [''],
      additionalInstructions: [''],
      contactEmail: ['', [Validators.email]],
      contactNumber: ['', [Validators.pattern('^[0-9]*$')]],
    });
  }

  loadExpertiseList() {
    this.loadingExpertise = true;
    this.itSubcontractService.getExpertiseList().subscribe({
      next: (response) => {
        if (response?.status) {
          this.expertiseList = response.data?.expertise || [];
        }
        this.loadingExpertise = false;
      },
      error: (error) => {
        console.error('Error loading expertise list:', error);
        this.loadingExpertise = false;
        this.notificationService.showError('Failed to load expertise list');
      }
    });
  }

  loadCategories() {
    this.isLoading = true;
    this.itSubcontractService.getTags().subscribe({
      next: (data) => {
        this.projectCategories = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading = false;
      }
    });
  }

  addFilter() {
    if (this.partnerForm.valid) {
      const formValue = this.partnerForm.value;
      const selectedExpertise = this.expertiseList.find(exp => exp._id === formValue.projectName);
      this.filters.push({
        projectName: selectedExpertise?.name || '',
        expertise: formValue.technologyDemand,
        tags: formValue.projectCategory,
        projectNameId: selectedExpertise?._id || '' // Store ID for API calls
      });
      this.initForm(); // Reset form for next entry
      this.notificationService.showSuccess('Filter added successfully');
    } else {
      this.partnerForm.markAllAsTouched();
      this.notificationService.showError('Please fill in all required fields');
    }
  }

  removeFilter(index: number) {
    this.filters.splice(index, 1);
  }

  onSubmit() {
    if (this.filters.length === 0 && this.partnerForm.valid) {
      // If no filters added but form is valid, add current form as a filter
      this.addFilter();
    }

    if (this.filters.length > 0) {
      const payload = {
        userId: '683de8cc57a4a857766f083e', // This should come from your auth service
        filters: this.filters.map(filter => ({
          ...filter,
          projectName: filter.projectNameId // Use ID for API call
        }))
      };

      this.itSubcontractService.saveSupplierFilters(payload).subscribe({
        next: (response) => {
          if (response?.status) {
            this.notificationService.showSuccess('Filters saved successfully');
            this.router.navigate(['/our-services/partner-search-result-experience'], {
              queryParams: {
                projectName: this.filters[0].projectNameId,
                tags: this.filters[0].tags,
              }
            });
          }
        },
        error: (error) => {
          this.notificationService.showError(error?.error?.message || 'Failed to save filters');
        }
      });
    } else {
      this.notificationService.showError('Please add at least one filter');
    }
  }

  // Helper for template
  get f() { return this.partnerForm.controls; }

  navigateToWorkaway() {
    this.router.navigate(['/resource-search']);
  }
}
