import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formService: ItSubcontractService,
    private router: Router
  ) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', Validators.required],
      companyName: ['', Validators.required],
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
      const payload = {
        formType: 'contactUsForm',
        formData: {
          name: this.contactForm.get('name')?.value || '',
          email: this.contactForm.get('email')?.value || '',
          mobileNumber: this.contactForm.get('mobileNumber')?.value || '',
          companyName: this.contactForm.get('companyName')?.value || '',
          websiteUrl: this.contactForm.get('websiteUrl')?.value || '',
          role: this.contactForm.get('role')?.value || '',
          reasonForContact: this.contactForm.get('reasonForContact')?.value || '',
          message: this.contactForm.get('message')?.value || ''
        }
      };

      this.formService.submitItSubContractData(payload).subscribe({
        next: (response) => {
          if (response.status === true) {
            this.contactForm.reset();
            this.router.navigateByUrl('/contact-us/thank-you')
          }
        },
        error: (error) => {
          console.error('Error submitting form', error);
        }
      });
    }
  }
}
