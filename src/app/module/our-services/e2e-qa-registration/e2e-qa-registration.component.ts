import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormDataService } from 'src/app/common/services/form-data.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceTypeService } from '../../../services/service-type.service';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';

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
  selectedServiceType: string = 'option3'; // Default to E2E QA Services
  cartItems: any = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private toastr: ToastrService,
    private itSubcontractService: ItSubcontractService,
    public serviceTypeService: ServiceTypeService
  ) { }

  ngOnInit() {
    this.initializeForms();
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

  private initializeForms() {
    // First form
    this.registrationForm = this.formBuilder.group({
      serviceType: ['option3', [Validators.required]], // Default to E2E QA Services
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

  onServiceTypeChange(serviceType: string): void {
    this.selectedServiceType = serviceType;
    this.registrationForm.patchValue({ serviceType });

    // Navigate based on selection
    switch (serviceType) {
      case 'option1':
        this.serviceTypeService.navigateToRegistration('workaway');
        break;
      case 'option2':
        this.serviceTypeService.navigateToRegistration('itSubcontracting');
        break;
      // No need for option3 case as we're already on E2E QA page
    }
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

  maskName(name: string): string {
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
}
