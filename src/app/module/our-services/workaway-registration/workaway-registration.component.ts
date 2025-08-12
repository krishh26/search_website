import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormDataService } from '../../../common/services/form-data.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';

@Component({
  selector: 'app-workaway-registration',
  templateUrl: './workaway-registration.component.html',
  styleUrls: ['./workaway-registration.component.scss']
})
export class WorkawayRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  contactForm!: FormGroup;
  hasDemandReady: boolean = false;
  isRepresentativeForClient: boolean = true;
  showContactForm: boolean = false;
  selectedServiceType: string = 'option1'; // Default to WorkAway
  skillsList: any[] = [];

  // Skills multiselect properties
  skillSearch: string = '';
  selectedSkills: any[] = [];
  showSkillDropdown: boolean = false;
  isLoadingSkill: boolean = false;
  hasSearchedSkill: boolean = false;
  private skillSearchSubject = new Subject<string>();

  // File upload properties
  fileUpload: any;
  isUploading: boolean = false;

  // Cart and filters properties
  cartItems: any = [];
  filterList: any[] = [];
  itSubFilterList: any[] = [];
  defaultTagLimit = 7;
  showAllTags = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private formDataService: FormDataService,
    private toastr: ToastrService,
    private itSubcontractService: ItSubcontractService
  ) { }

  ngOnInit(): void {
    this.initializeForms();
    this.setupSkillSearch();
    this.getFilterList();
    this.loadFilterList();
    this.getCartItems();
  }

  private setupSkillSearch(): void {
    // Setup search debouncing for skills
    this.skillSearchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchTerm => {
      this.hasSearchedSkill = true;
      if (searchTerm && searchTerm.trim().length > 0) {
        this.searchSkills(searchTerm);
        this.showSkillDropdown = true;
      } else {
        this.skillsList = [];
        this.showSkillDropdown = false;
      }
    });
  }

  // Skills search methods
  onSkillSearchChange(event: any) {
    this.skillSearch = event?.target?.value;
    this.skillSearchSubject.next(this.skillSearch);
  }

  searchSkills(searchTerm: string) {
    this.isLoadingSkill = true;
    // Mock skills data - replace with actual API call
    setTimeout(() => {
      const mockSkills = [
        { _id: '1', name: 'Angular' },
        { _id: '2', name: 'React' },
        { _id: '3', name: 'Vue.js' },
        { _id: '4', name: 'Node.js' },
        { _id: '5', name: 'Python' },
        { _id: '6', name: 'Java' },
        { _id: '7', name: 'C#' },
        { _id: '8', name: 'PHP' }
      ].filter(skill => 
        skill.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      this.skillsList = mockSkills;
      this.isLoadingSkill = false;
    }, 500);
  }

  selectSkill(skill: any) {
    // Check if skill is already selected
    const isAlreadySelected = this.selectedSkills.some(s => s._id === skill._id);
    if (!isAlreadySelected) {
      this.selectedSkills.push(skill);
      this.updateLanguageField();
    }
    this.showSkillDropdown = false;
    this.skillSearch = '';
  }

  removeSkill(skillId: string) {
    this.selectedSkills = this.selectedSkills.filter(s => s._id !== skillId);
    this.updateLanguageField();
  }

  updateLanguageField() {
    const languageString = this.selectedSkills.map(s => s.name).join(', ');
    this.registrationForm.patchValue({ language: languageString });
  }

  onSkillInputBlur() {
    setTimeout(() => {
      this.showSkillDropdown = false;
    }, 200);
  }

  private initializeForms() {
    // First form - Registration details
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
      budget: [''],
      fileUpload: ['']
    });

    // Subscribe to hasDemandReady changes
    this.registrationForm.get('hasDemandReady')?.valueChanges.subscribe(value => {
      const isYes = value === 'yes';
      const controls = ['requirement', 'engagementType', 'description', 'language', 'startDate', 'endDate', 'budget', 'fileUpload'];

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

    // Second form - Contact details
    this.contactForm = this.formBuilder.group({
      businessName: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      jobTitle: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      hearAboutUs: ['']
    });
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
        budget: '',
        fileUpload: ''
      });
      this.selectedSkills = [];
      this.fileUpload = null;
    }
  }

  onRegistrationTypeChange(value: string): void {
    this.isRepresentativeForClient = value === 'representative';
    this.registrationForm.patchValue({ registrationType: value });
  }

  onServiceTypeChange(serviceType: string): void {
    this.selectedServiceType = serviceType;
    
    // Handle navigation based on service type selection
    if (serviceType === 'option2') {
      // Navigate to IT Subcontracting registration
      this.router.navigate(['/our-services/it-subcontracting-registration']);
    } else if (serviceType === 'option3') {
      // Navigate to E2E QA registration
      this.router.navigate(['/our-services/e2e-qa-registration']);
    }
    // option1 (WorkAway) stays on current page
  }

  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  goBack(): void {
    if (this.showContactForm) {
      this.showContactForm = false;
    } else {
      this.router.navigate(['/our-services/workaway']);
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
        ...this.contactForm.value,
        serviceType: 'WorkAway'
      };

      // Submit WorkAway specific form data
      this.formDataService.submitCompleteFormData({
        formType: 'workAwayForm',
        formData
      }).subscribe({
        next: (response) => {
          // Clear stored data
          this.formDataService.clearStoredData();

          // Show success message
          this.toastr.success('WorkAway registration submitted successfully!', 'Success');

          // Navigate to success page
          this.router.navigate(['/success-message']);
        },
        error: (error) => {
          console.error('Error submitting WorkAway registration:', error);
          this.toastr.error('Failed to submit registration. Please try again.', 'Error');
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.contactForm);
      this.toastr.warning('Please fill in all required fields correctly.', 'Warning');
    }
  }

  // File upload methods
  openUploadModal(): void {
    const modalElement = document.getElementById('uploadbulkModal');
    if (modalElement) {
      // Use Bootstrap 5 Modal API
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  onFileUpload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.isUploading = true;

      this.formDataService.uploadProjectFiles(event.target.files[0]).subscribe({
        next: (response) => {
          this.isUploading = false;
          if (response?.status == true) {
            this.fileUpload = response?.data;
            this.registrationForm.patchValue({ fileUpload: this.fileUpload });
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

  downloadSampleCSV(): void {
    // Implement sample CSV download functionality
    this.toastr.info('Sample file download functionality to be implemented', 'Info');
  }

  // Filter and cart methods
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

  toggleShowAllTags() {
    this.showAllTags = !this.showAllTags;
  }

  get visibleCombinedTags() {
    const combined = [...this.filterList, ...this.itSubFilterList];
    if (this.showAllTags || combined.length <= this.defaultTagLimit) {
      return combined;
    }
    return combined.slice(0, this.defaultTagLimit);
  }

  get showToggleButton() {
    return (this.filterList.length + this.itSubFilterList.length) > this.defaultTagLimit;
  }

  // Utility methods
  maskName(name: string | undefined | null): string {
    if (!name || typeof name !== 'string') {
      return '';
    }
    const words = name.split(' ');

    return words.map((word, index) => {
      if (index === 0) {
        return word
          .split('')
          .map((char, i) => (i === 0 || i === 2 || i === 4 ? char : '*'))
          .join('');
      } else if (index === 1) {
        return word
          .split('')
          .map((char, i) => (i === 0 || i === 2 ? char : '*'))
          .join('');
      } else {
        return '*'.repeat(word.length);
      }
    }).join(' ');
  }

  getBorderColor(index: number): string {
    const colors = ['#22c55e', '#2563eb', '#f9a8d4', '#fbbf24'];
    return colors[index % colors.length];
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
      if (control.errors['minlength']) {
        return `This field must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
      if (control.errors['pattern']) {
        return 'Please enter a valid phone number';
      }
    }
    return '';
  }
}
