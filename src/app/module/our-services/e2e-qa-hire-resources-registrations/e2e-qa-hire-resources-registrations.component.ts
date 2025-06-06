import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormDataService } from 'src/app/common/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-e2e-qa-hire-resources-registrations',
  templateUrl: './e2e-qa-hire-resources-registrations.component.html',
  styleUrls: ['./e2e-qa-hire-resources-registrations.component.scss']
})
export class E2eQaHireResourcesRegistrationsComponent {

  hasDemandReady: boolean = false;
  registrationForm!: FormGroup;
  bankingForClients: boolean = false;
  isSubmitting: boolean = false;
  isUploading: boolean = false;
  selectedServiceType: string = 'option3';
  fileUpload: any;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private toastr: ToastrService
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registrationForm = this.formBuilder.group({
      serviceType: ['option3', [Validators.required]], // Default to E2E QA Services
      professionType: ['', [Validators.required]],
      hasDemandReady: [false, [Validators.required]],
      bankingOption: ['', [Validators.required]],
      whiteLabelOption: [false]
    });
  }

  // Getter methods for template
  get professionType() { return this.registrationForm.get('professionType'); }
  get whiteLabelOption() { return this.registrationForm.get('whiteLabelOption'); }
  get hasDemandReadyControl() { return this.registrationForm.get('hasDemandReady'); }

  goBack(): void {
    this.router.navigate(['/our-services/e2e-qa-services']);
  }

  onDemandReadyChange(hasDemand: boolean): void {
    this.hasDemandReady = hasDemand;
    this.registrationForm.patchValue({
      hasDemandReady: hasDemand
    });
  }

  onBankingOptionChange(forClients: boolean): void {
    this.bankingForClients = forClients;
    this.registrationForm.patchValue({
      bankingOption: forClients ? 'client' : 'business'
    });
  }

  onServiceTypeChange(serviceType: string): void {
    this.selectedServiceType = serviceType;
    this.registrationForm.patchValue({
      serviceType: serviceType
    });
  }

  // Handle file upload
  onFileUpload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.isUploading = true;

      this.formDataService.uploadProjectFiles(event.target.files[0]).subscribe({
        next: (response) => {
          this.isUploading = false;
          if (response?.status === true) {
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
      this.router.navigate(['/our-services/e2e-qa-hire-resources-contact-details']);
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.registrationForm);
      this.toastr.warning('Please fill in all required fields correctly.');
    }
  }

  private getServiceTypeText(value: string): string {
    const serviceTypes: { [key: string]: string } = {
      'option1': 'WorkAway',
      'option2': 'IT Subcontracting',
      'option3': 'E2E QA Services'
    };
    return serviceTypes[value] || value;
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
        alert('Bulk enquiry uploaded successfully!');
      },
      error: (error) => {
        console.error('Error uploading bulk enquiry:', error);
        this.isUploading = false;
        alert('Error uploading bulk enquiry. Please try again.');
      }
    });
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

}
