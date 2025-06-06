import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormDataService } from 'src/app/common/services';

@Component({
  selector: 'app-e2e-qa-hire-resources-contact-details',
  templateUrl: './e2e-qa-hire-resources-contact-details.component.html',
  styleUrls: ['./e2e-qa-hire-resources-contact-details.component.scss']
})
export class E2eQaHireResourcesContactDetailsComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  stepOneData: any;

  constructor(
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if step one is completed
    if (!this.formDataService.isStepOneCompleted()) {
      this.router.navigate(['/our-services/e2e-qa-hire-resources-registrations']);
      return;
    }

    this.stepOneData = this.formDataService.getStepOneData();
    this.initializeForm();
  }

  private initializeForm() {
    this.contactForm = this.formBuilder.group({
      businessName: ['', Validators.required],
      address: ['', Validators.required],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      jobTitle: ['', Validators.required],
      emailAddress: ['', [Validators.required, Validators.email]],
      howDidYouHear: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      const completeFormData = {
        formType: 'e2eQaResourceForm',
        formData: {
          ...this.stepOneData,
          ...this.contactForm.value,
          timestamp: new Date().toISOString()
        }
      };

      this.formDataService.submitCompleteFormData(completeFormData).subscribe({
        next: (response) => {
          if (response.status === true) {
            // Clear stored data after successful submission
            this.formDataService.clearStoredData();
            this.isSubmitting = false;
            // Navigate to success page or show success message
            // You can customize this based on your requirements
            alert('Registration completed successfully!');
            this.router.navigate(['/our-services/e2e-qa-services']);
          } else {
            this.isSubmitting = false;
            alert('Submission failed. Please try again.');
          }
        },
        error: (error) => {
          console.error('Error submitting form:', error);
          this.isSubmitting = false;
          alert('Error submitting form. Please try again.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/our-services/e2e-qa-hire-resources-registrations']);
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
