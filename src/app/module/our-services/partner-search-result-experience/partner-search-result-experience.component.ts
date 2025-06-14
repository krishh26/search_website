import { Component, OnInit } from '@angular/core';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

interface Supplier {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  location: string;
  employeeCount: number;
  howLongCompanyBussiness: number;
  yearOfEstablishment: string;
  expertise: Array<{
    name: string;
    type: string;
    subExpertise: string[];
  }>;
  totalProjectsExecuted: number;
  executiveSummary: string;
}

@Component({
  selector: 'app-partner-search-result-experience',
  templateUrl: './partner-search-result-experience.component.html',
  styleUrls: ['./partner-search-result-experience.component.scss']
})
export class PartnerSearchResultExperienceComponent implements OnInit {
  supplierList: Supplier[] = [];
  totalSuppliers: number = 0;
  searchText: string = '';
  private searchSubject = new Subject<string>();

  constructor(private itsubcontractService: ItSubcontractService) {
    // Setup search debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.loadSupplierList(searchValue);
    });
  }

  ngOnInit(): void {
    this.loadSupplierList();
  }

  calculateExperience(yearOfEstablishment: string | null): number {
    if (!yearOfEstablishment) return 0;

    const establishmentDate = new Date(yearOfEstablishment);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - establishmentDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    return diffYears;
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText = value;
    this.searchSubject.next(value);
  }

  loadSupplierList(search: string = ''): void {
    this.itsubcontractService.getSupplierList(1000, search).subscribe({
      next: (response: any) => {
        if (response.status && response.data?.data) {
          this.supplierList = response.data.data;
          this.totalSuppliers = response.data.count?.total || 0;
        }
      },
      error: (error) => {
        console.error('Error fetching supplier list:', error);
      }
    });
  }
}
