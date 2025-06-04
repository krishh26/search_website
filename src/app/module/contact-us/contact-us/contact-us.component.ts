import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormService } from '../../../services/form.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      companyName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      websiteUrl: ['', Validators.required],
      role: ['', Validators.required],
      reasonForContact: ['', Validators.required],
      message: ['']
    });
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      const formData = {
        name: this.contactForm.get('fullName')?.value || '',
        companyName: this.contactForm.get('companyName')?.value || '',
        email: this.contactForm.get('email')?.value || '',
        mobileNumber: this.contactForm.get('phoneNumber')?.value || '',
        websiteUrl: this.contactForm.get('websiteUrl')?.value || '',
        role: this.contactForm.get('role')?.value || '',
        reasonForContact: this.contactForm.get('reasonForContact')?.value || '',
        message: this.contactForm.get('message')?.value || ''
      };

      this.formService.submitForm(formData).subscribe({
        next: (response) => {
          console.log('Form submitted successfully', response);
          // Add success handling (e.g., show success message, reset form)
          this.contactForm.reset();
        },
        error: (error) => {
          console.error('Error submitting form', error);
          // Add error handling (e.g., show error message)
        }
      });
    }
  }
}
