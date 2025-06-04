import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormDataService } from 'src/app/common/services/form-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-e2e-qa-registration',
  templateUrl: './e2e-qa-registration.component.html',
  styleUrls: ['./e2e-qa-registration.component.scss']
})
export class E2eQaRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  contactForm!: FormGroup;
  hasDemandReady: boolean = false;
  isRepresentativeForClient: boolean = true;
  showContactForm: boolean = false;
  isSubmitting: boolean = false;
  isUploading: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initializeForms();
  }

  private initializeForms() {
    // First form
    this.registrationForm = this.formBuilder.group({
      professionType: ['', [Validators.required]],
      registrationType: ['representative', [Validators.required]],
      whiteLabelOption: [false],
      hasDemandReady: ['', [Validators.required]],
      requirement: [''],
      engagementType: [''],
      description: [''],
      language: [''],
      startDate: [''],
      endDate: [''],
      budget: ['']
    });

    // Subscribe to hasDemandReady changes
    this.registrationForm.get('hasDemandReady')?.valueChanges.subscribe(value => {
      const isYes = value === 'yes';
      const controls = ['requirement', 'engagementType', 'description', 'language', 'startDate', 'endDate', 'budget'];

      controls.forEach(controlName => {
        const control = this.registrationForm.get(controlName);
        if (isYes) {
          control?.setValidators([Validators.required]);
        } else {
          control?.clearValidators();
        }
        control?.updateValueAndValidity();
      });
    });

    // Second form
    this.contactForm = this.formBuilder.group({
      businessName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      hearAboutUs: ['']
    });
  }

  // Validation methods for registration form
  getRegistrationFormError(controlName: string): string {
    const control = this.registrationForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
    }
    return '';
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  // Validation methods for contact form
  getContactFormError(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return 'This field is required';
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid 10-digit phone number';
      }
    }
    return '';
  }

  onDemandReadyChange(value: string): void {
    this.hasDemandReady = value === 'yes';
    this.registrationForm.patchValue({ hasDemandReady: value });

    // Reset the fields when switching to "No"
    if (!this.hasDemandReady) {
      this.registrationForm.patchValue({
        requirement: '',
        engagementType: '',
        description: '',
        language: '',
        startDate: '',
        endDate: '',
        budget: ''
      });
    }
  }

  onRegistrationTypeChange(value: string): void {
    this.isRepresentativeForClient = value === 'representative';
    this.registrationForm.patchValue({ registrationType: value });
  }

  goBack(): void {
    if (this.showContactForm) {
      this.showContactForm = false;
    } else {
      this.router.navigate(['/our-services/e2e-qa-services']);
    }
  }

  nextStep(): void {
    if (this.registrationForm.valid) {
      this.showContactForm = true;
    } else {
      this.markFormGroupTouched(this.registrationForm);
      this.toastr.warning('Please fill in all required fields correctly.', 'Warning');
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formData = {
        ...this.registrationForm.value,
        ...this.contactForm.value
      };

      this.formDataService.submitCompleteFormData({
        formType: 'e2eQaServiceForm',
        formData
      }).subscribe({
        next: (response) => {
          if (response?.status == true) {
            this.showContactForm = false;
            this.registrationForm.reset();
            this.contactForm.reset();
            this.toastr.success('Form submitted successfully!', 'Success');
            this.router.navigate(['/success-message']);
          } else {
            this.toastr.error('Failed to submit form. Please try again.', 'Error');
            console.log("Error : ", response);
          }
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          this.toastr.error('Failed to submit form. Please try again.', 'Error');
        }
      });
    } else {
      this.markFormGroupTouched(this.contactForm);
      this.toastr.warning('Please fill in all required fields correctly.', 'Warning');
    }
  }

  // Handle file upload
  onFileUpload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.isUploading = true;

      this.formDataService.uploadProjectFiles(event.target.files[0]).subscribe({
        next: (response) => {
          this.isUploading = false;
          if (response?.status == true) {
            console.log('File uploaded successfully:', response);
            console.log('File URL:', response?.data?.url);
            console.log('File Key:', response?.data?.key);
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
