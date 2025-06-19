import { Component, OnInit } from '@angular/core';
import { ItSubcontractService, Tag } from '../../../services/it-subcontract.service';

@Component({
  selector: 'app-it-sub-partner-search',
  templateUrl: './it-sub-partner-search.component.html',
  styleUrls: ['./it-sub-partner-search.component.scss']
})
export class ItSubPartnerSearchComponent implements OnInit {
  projectCategories: Tag[] = [];
  selectedCategory: Tag | null = null;
  isLoading = false;

  constructor(private itSubcontractService: ItSubcontractService) {}

  ngOnInit() {
    this.loadCategories();
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

  onSearch(term: string) {
    // The filtering will be handled by ng-select internally
  }
}
