import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceTypeService } from '../../../services/service-type.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-it-subcontracting-registration',
  templateUrl: './it-subcontracting-registration.component.html',
  styleUrls: ['./it-subcontracting-registration.component.scss']
})
export class ItSubcontractingRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  contactForm!: FormGroup;
  hasDemandReady: boolean = false;
  isRepresentativeForClient: boolean = true;
  showContactForm: boolean = false;
  selectedServiceType: string = 'option2'; // Default to IT Subcontracting
  technologiesList: any[] = [];

  // Technology multiselect properties
  techSearch: string = '';
  selectedTechnologies: any[] = [];
  showTechDropdown: boolean = false;
  isLoadingTech: boolean = false;
  hasSearchedTech: boolean = false;
  private techSearchSubject = new Subject<string>();
  cartItems: any = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private itSubcontractService: ItSubcontractService,
    private toastr: ToastrService,
    private serviceTypeService: ServiceTypeService,
  ) { }

  ngOnInit() {
    this.initializeForms();
    this.getFilterList();
    this.loadFilterList();
    this.getCartItems();

    // Setup search debouncing for technologies
    this.techSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.hasSearchedTech = true;
      if (searchTerm && searchTerm.trim().length > 0) {
        this.searchTechnologies(searchTerm);
        this.showTechDropdown = true;
      } else {
        this.technologiesList = [];
        this.showTechDropdown = false;
      }
    });
  }

  // Technology search methods
  onTechSearchChange(event: any) {
    this.techSearch = event?.target?.value;
    this.techSearchSubject.next(this.techSearch);
  }

  searchTechnologies(searchTerm: string) {
    this.isLoadingTech = true;
    this.itSubcontractService.getTechnologies({ search: searchTerm }).subscribe({
      next: (response) => {
        if (response?.status) {
          this.technologiesList = response?.data || [];
        }
        this.isLoadingTech = false;
      },
      error: () => {
        this.isLoadingTech = false;
      }
    });
  }

  selectTechnology(tech: any) {
    // Check if technology is already selected
    const isAlreadySelected = this.selectedTechnologies.some(t => t._id === tech._id);
    if (!isAlreadySelected) {
      this.selectedTechnologies.push(tech);
      this.updateLanguageField();
    }
    this.showTechDropdown = false;
    this.techSearch = '';
  }

  removeTechnology(techId: string) {
    this.selectedTechnologies = this.selectedTechnologies.filter(t => t._id !== techId);
    this.updateLanguageField();
  }

  updateLanguageField() {
    const languageString = this.selectedTechnologies.map(t => t.name).join(', ');
    this.registrationForm.patchValue({ language: languageString });
  }

  onTechInputBlur() {
    setTimeout(() => {
      this.showTechDropdown = false;
    }, 200);
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
      serviceType: ['option2', [Validators.required]], // Default to IT Subcontracting
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

    // Set initial service type
    this.selectedServiceType = 'option2';
    this.registrationForm.patchValue({ serviceType: 'option2' });

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
      this.selectedTechnologies = [];
    }
  }

  onRegistrationTypeChange(value: string): void {
    this.isRepresentativeForClient = value === 'representative';
    this.registrationForm.patchValue({ registrationType: value });
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
        this.serviceTypeService.navigateToRegistration('workaway');
        break;
      case 'option2':
        // Already on IT Subcontracting page
        break;
      case 'option3':
        this.serviceTypeService.navigateToRegistration('e2eQA');
        break;
    }
  }

  goBack(): void {
    if (this.showContactForm) {
      this.showContactForm = false;
    } else {
      this.router.navigate(['/our-services/it-subcontracting-services']);
    }
  }

  nextStep(): void {
    if (this.registrationForm.valid) {
      this.showContactForm = true;
    } else {
      this.markFormGroupTouched(this.registrationForm);
    }
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      const formData = {
        ...this.registrationForm.value,
        ...this.contactForm.value,
        serviceType: this.serviceTypeService.getServiceTypeText(this.registrationForm.value.serviceType)
      };

      this.itSubcontractService.submitItSubContractData({
        formType: 'itSubcontractForm',
        formData
      }).subscribe({
        next: (response) => {
          if (response?.status == true) {
            this.showContactForm = false;
            this.registrationForm.reset();
            this.contactForm.reset();
            this.selectedTechnologies = [];
            this.toastr.success('Form submitted successfully!', 'Success');
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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
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
