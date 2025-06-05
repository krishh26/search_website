import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormDataService } from '../../../common/services/form-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workkaway-registration-contact-details',
  templateUrl: './workkaway-registration-contact-details.component.html',
  styleUrls: ['./workkaway-registration-contact-details.component.scss']
})
export class WorkkawayRegistrationContactDetailsComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting: boolean = false;
  stepOneData: any = null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private toastr: ToastrService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    // Check if step one is completed
    if (!this.formDataService.isStepOneCompleted()) {
      // Redirect back to step one if not completed
      this.router.navigate(['/our-services/workaway-registration']);
      return;
    }

    // Get step one data to display or use
    this.stepOneData = this.formDataService.getStepOneData();
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  private initializeForm(): void {
    this.contactForm = this.formBuilder.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      jobTitle: ['', [Validators.required, Validators.minLength(2)]],
      emailAddress: ['', [Validators.required, Validators.email]],
      howDidYouHear: ['']
    });
  }

  goBack(): void {
    this.router.navigate(['/our-services/workaway-registration']);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      const formData = {
        ...this.stepOneData,
        ...this.contactForm.value
      };

      this.formDataService.submitCompleteFormData({
        formType: 'workAwayForm',
        formData
      }).subscribe({
        next: (response) => {
          this.isSubmitting = false;

          // Clear stored data
          this.formDataService.clearStoredData();

          // Show success message
          this.toastr.success('Form submitted successfully!', 'Success');

          // Navigate to success page
          this.router.navigate(['/success-message']);
        },
        error: (error) => {
          console.error('Error submitting complete form:', error);
          this.isSubmitting = false;
          this.toastr.error('Failed to submit form. Please try again.', 'Error');
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.contactForm);
      this.toastr.warning('Please fill in all required fields correctly.', 'Warning');
    }
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
  get businessName() { return this.contactForm.get('businessName'); }
  get address() { return this.contactForm.get('address'); }
  get fullName() { return this.contactForm.get('fullName'); }
  get phoneNumber() { return this.contactForm.get('phoneNumber'); }
  get jobTitle() { return this.contactForm.get('jobTitle'); }
  get emailAddress() { return this.contactForm.get('emailAddress'); }
  get howDidYouHear() { return this.contactForm.get('howDidYouHear'); }
}
