import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormDataService } from '../../../common/services/form-data.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceTypeService } from '../../../services/service-type.service';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private toastr: ToastrService,
    private serviceTypeService: ServiceTypeService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
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
}
