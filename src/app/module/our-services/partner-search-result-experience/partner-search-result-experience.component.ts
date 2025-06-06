import { Component, OnInit } from '@angular/core';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';

interface Supplier {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  location: string;
  employeeCount: number;
  howLongCompanyBussiness: number;
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

  constructor(private itsubcontractService: ItSubcontractService) {}

  ngOnInit(): void {
    this.loadSupplierList();
  }

  loadSupplierList(): void {
    this.itsubcontractService.getSupplierList().subscribe({
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
