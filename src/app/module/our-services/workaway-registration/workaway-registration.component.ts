import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormDataService } from '../../../common/services/form-data.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceTypeService } from '../../../services/service-type.service';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';

@Component({
  selector: 'app-workaway-registration',
  templateUrl: './workaway-registration.component.html',
  styleUrls: ['./workaway-registration.component.scss']
})
export class WorkawayRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  hasDemandReady: boolean = false;
  bankingForClients: boolean = false;
  isSubmitting: boolean = false;
  isUploading: boolean = false;
  selectedServiceType: string = 'option1'; // Default to WorkAway
  fileUpload: any;
  cartItems: any = [];


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private toastr: ToastrService,
    private serviceTypeService: ServiceTypeService,
    private itSubcontractService: ItSubcontractService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getFilterList();
    this.loadFilterList();
    this.getCartItems();
  }

  filterList: any[] = [];
  itSubFilterList: any[] = [];
  // How many tags to show by default
  defaultTagLimit = 7;
  showAllTags = false;

  get visibleCombinedTags() {
    // Combine both lists, prioritizing filterList first
    const combined = [...this.filterList, ...this.itSubFilterList];
    if (this.showAllTags || combined.length <= this.defaultTagLimit) {
      return combined;
    }
    return combined.slice(0, this.defaultTagLimit);
  }

  // Function to be used for the getting saved filters
  getFilterList() {
    this.filterList = [];
    this.itSubcontractService.getCandidateFilters().subscribe({
      next: (response) => {
        if (response?.status) {
          this.filterList = response?.data || [];
          this.filterList?.forEach((element) => {
            if (element) {
              element['type'] = 'workaway'
            }
          })
        }
      },
    });
  }

  loadFilterList(): void {
    this.itSubFilterList = [];
    this.itSubcontractService.getSupplierFilterList().subscribe({
      next: (response) => {
        if (response.status && response.data) {
          this.itSubFilterList = response.data;
          this.itSubFilterList?.forEach((element: any) => {
            if (element) {
              element['type'] = 'itsubcontract'
            }
          })
        }
      }
    });
  }

  toggleShowAllTags() {
    this.showAllTags = !this.showAllTags;
  }

  get showToggleButton() {
    return (this.filterList.length + this.itSubFilterList.length) > this.defaultTagLimit;
  }

  // Function to be used for the remove filter
  removeFilter(filterId: string) {
    this.itSubcontractService.removeCandidateFilters(filterId).subscribe({
      next: (response) => {
        if (response?.status) {
          this.getFilterList();
        }
      },
      error: (error) => {
        console.error('Error removing filter:', error);
      }
    });
  }

  removeFilterItSub(filterId: string, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }

    this.itSubcontractService.removeSupplierFilter(filterId).subscribe({
      next: (response: { status: boolean; message: string }) => {
        if (response?.status) {
          this.loadFilterList();
        }
      },
      error: (error: Error) => {
        console.error('Error removing filter:', error);
      }
    });
  }

  private initializeForm(): void {
    this.registrationForm = this.formBuilder.group({
      serviceType: ['option1', [Validators.required]], // Default to WorkAway
      professionType: ['', [Validators.required]],
      hasDemandReady: ['', [Validators.required]],
      bankingOption: ['', [Validators.required]],
      whiteLabelOption: [false]
    });

    // Set initial service type
    this.selectedServiceType = 'option1';
    this.registrationForm.patchValue({ serviceType: 'option1' });

    // Subscribe to bankingOption changes to handle whiteLabelOption visibility
    this.registrationForm.get('bankingOption')?.valueChanges.subscribe(value => {
      this.bankingForClients = value === 'I would like to bank resources for my client(s)';
    });
  }

  goBack(): void {
    this.router.navigate(['/our-services/workaway']);
  }

  onDemandReadyChange(hasDemand: boolean): void {
    this.hasDemandReady = hasDemand;
    this.registrationForm.patchValue({ hasDemandReady: hasDemand });
  }

  onServiceTypeChange(serviceType: string): void {
    if (serviceType === this.selectedServiceType) {
      return; // Don't navigate if already on the selected service type
    }

    this.selectedServiceType = serviceType;
    this.registrationForm.patchValue({ serviceType });

    // Navigate to the appropriate registration page
    switch (serviceType) {
      case 'option1':
        // Already on WorkAway page
        break;
      case 'option2':
        this.serviceTypeService.navigateToRegistration('itSubcontracting');
        break;
      case 'option3':
        this.serviceTypeService.navigateToRegistration('e2eQA');
        break;
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isSubmitting = true;

      const formData = {
        serviceType: this.getServiceTypeText(this.registrationForm.value.serviceType),
        professionType: this.registrationForm.value.professionType,
        hasDemandReady: this.registrationForm.value.hasDemandReady,
        bankingOption: this.registrationForm.value.bankingOption,
        whiteLabelOption: this.registrationForm.value.whiteLabelOption,
        timestamp: new Date().toISOString(),
        fileUpload: this.fileUpload
      };

      // Store step one data temporarily
      this.formDataService.storeStepOneData(formData);

      this.isSubmitting = false;
      // Navigate to contact details step
      this.router.navigate(['/our-services/workaway-registration-contact-details']);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  private getServiceTypeText(value: string): string {
    return this.serviceTypeService.getServiceTypeText(value);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getter methods for template
  get serviceType() { return this.registrationForm.get('serviceType'); }
  get professionType() { return this.registrationForm.get('professionType'); }
  get hasDemandReadyControl() { return this.registrationForm.get('hasDemandReady'); }
  get bankingOption() { return this.registrationForm.get('bankingOption'); }
  get whiteLabelOption() { return this.registrationForm.get('whiteLabelOption'); }

  // Handle file upload
  onFileUpload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.isUploading = true;

      this.formDataService.uploadProjectFiles(event.target.files[0]).subscribe({
        next: (response) => {
          this.isUploading = false;
          if (response?.status == true) {
            this.fileUpload = response?.data;
            this.toastr.success('File uploaded successfully!', 'Success');
          } else {
            this.toastr.error('Upload failed. Please try again.', 'Error');
          }
        },
        error: (error) => {
          console.error('Error uploading file:', error);
          this.isUploading = false;
          this.toastr.error('Error uploading file. Please try again.', 'Error');
        }
      });
    }
  }

  // Handle bulk enquiry upload with sample data
  onBulkEnquiryUpload(): void {
    // Sample array data - replace with actual data structure you need
    const sampleBulkData = [
      {
        serviceType: this.getServiceTypeText(this.registrationForm.value.serviceType || 'option1'),
        professionType: 'Software Developer',
        location: 'India',
        experience: '3-5 years',
        skills: ['Angular', 'React', 'Node.js'],
        budget: '50000-75000'
      },
      {
        serviceType: this.getServiceTypeText(this.registrationForm.value.serviceType || 'option1'),
        professionType: 'QA Engineer',
        location: 'Remote',
        experience: '2-4 years',
        skills: ['Selenium', 'Cypress', 'API Testing'],
        budget: '40000-60000'
      }
    ];

    this.isUploading = true;

    this.formDataService.uploadWithArrayData(sampleBulkData).subscribe({
      next: (response) => {
        this.isUploading = false;
        this.toastr.success('Bulk enquiry uploaded successfully!', 'Success');
      },
      error: (error) => {
        console.error('Error uploading bulk enquiry:', error);
        this.isUploading = false;
        this.toastr.error('Error uploading bulk enquiry. Please try again.', 'Error');
      }
    });
  }

  // Handle modal file upload
  onModalFileUpload(event: any): void {
    this.onFileUpload(event);
  }

  // Download sample CSV
  downloadSampleCSV(): void {
    const csvContent = `Service Type,Profession Type,Location,Experience,Skills,Budget\n` +
      `WorkAway,Software Developer,India,3-5 years,"Angular,React,Node.js",50000-75000\n` +
      `WorkAway,QA Engineer,Remote,2-4 years,"Selenium,Cypress,API Testing",40000-60000\n` +
      `IT Subcontracting,Full Stack Developer,Bangalore,5-7 years,"Java,Spring,React",75000-100000`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample-bulk-enquiry.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getCartItems() {
    this.cartItems = [];
    this.itSubcontractService.getCartItems().subscribe((response: any) => {
      if (response?.status) {
        this.cartItems = response?.data || [];
      }
    })
  }

  removeCartItem(itemId: string) {
    this.itSubcontractService.removeFromCart(itemId).subscribe({
      next: () => this.getCartItems(),
      error: (err) => console.error('Failed to remove item from cart', err)
    });
  }

  maskName(name: string | undefined | null): string {
    if (!name || typeof name !== 'string') {
      return '';
    }
    const words = name.split(' ');
  
    return words.map((word, index) => {
      if (index === 0) {
        // First word: show 1st, 3rd, 5th
        return word
          .split('')
          .map((char, i) => (i === 0 || i === 2 || i === 4 ? char : '*'))
          .join('');
      } else if (index === 1) {
        // Second word: show 1st and 3rd
        return word
          .split('')
          .map((char, i) => (i === 0 || i === 2 ? char : '*'))
          .join('');
      } else {
        // All other words: full mask
        return '*'.repeat(word.length);
      }
    }).join(' ');
  }

  getBorderColor(index: number): string {
    // Colors: green, blue, pink, gold, yellow (from image: #ffd600)
    const colors = ['#22c55e', '#2563eb', '#f9a8d4', '#fbbf24'];
    return colors[index % colors.length];
  }
}
