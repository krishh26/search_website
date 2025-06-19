import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItSubcontractService, Tag } from '../../../services/it-subcontract.service';
import { Router } from '@angular/router';

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

  constructor(
    private itSubcontractService: ItSubcontractService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCategories();
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

  onSubmit() {
    if (this.partnerForm.valid) {
      const formValue = this.partnerForm.value;
      const storageKey = 'itSubPartnerSearch';
      let existing = sessionStorage.getItem(storageKey);
      let dataArr = [];
      if (existing) {
        try {
          dataArr = JSON.parse(existing);
          if (!Array.isArray(dataArr)) {
            dataArr = [dataArr];
          }
        } catch {
          dataArr = [];
        }
      }
      dataArr.push(formValue);
      sessionStorage.setItem(storageKey, JSON.stringify(dataArr));
      this.router.navigate(['/our-services/partner-search-result-experience'], {
        queryParams: {
          projectName: this.partnerForm.get('projectName')?.value,
          tags: this.partnerForm.get('projectCategory')?.value,
        }
      });
    } else {
      this.partnerForm.markAllAsTouched();
    }
  }

  // Helper for template
  get f() { return this.partnerForm.controls; }
}
