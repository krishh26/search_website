import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormDataService } from '../../../common/services/form-data.service';
import { ToastrService } from 'ngx-toastr';
import { ServiceTypeService } from '../../../services/service-type.service';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-workaway-registration',
  templateUrl: './workaway-registration.component.html',
  styleUrls: ['./workaway-registration.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class WorkawayRegistrationComponent implements OnInit {
  // Step management
  currentStep: number = 1;
  totalSteps: number = 3;

  // Forms
  unifiedForm!: FormGroup;
  contactForm!: FormGroup;

  // Service selection
  selectedServices: { workaway: boolean; itSubcontract: boolean; e2eQA: boolean } = {
    workaway: false,
    itSubcontract: false,
    e2eQA: false
  };

  // Demand ready flags for each service
  hasDemandReady: { workaway: boolean; itSubcontract: boolean; e2eQA: boolean } = {
    workaway: false,
    itSubcontract: false,
    e2eQA: false
  };

  // Registration type flags
  isRepresentativeForClient: { workaway: boolean; itSubcontract: boolean; e2eQA: boolean } = {
    workaway: true,
    itSubcontract: true,
    e2eQA: true
  };

  // Technology search properties (for IT Subcontracting)
  techSearch: string = '';
  selectedTechnologies: any[] = [];
  searchResults: any[] = [];
  showTechDropdown: boolean = false;
  isLoadingTech: boolean = false;
  hasSearchedTech: boolean = false;
  private techSearchSubject = new Subject<string>();

  // File upload
  fileUpload: any;
  isUploading: boolean = false;
  isSubmitting: boolean = false;

  // Cart and filters
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
    private serviceTypeService: ServiceTypeService,
    private itSubcontractService: ItSubcontractService,
  ) { }

  ngOnInit(): void {
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
        this.searchResults = [];
        this.showTechDropdown = false;
      }
    });
  }

  // Step navigation
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.currentStep++;
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  private validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        // Step 1 validation - at least one service should be selected
        if (!this.selectedServices.workaway && !this.selectedServices.itSubcontract && !this.selectedServices.e2eQA) {
          this.toastr.warning('Please select at least one service type.', 'Warning');
          return false;
        }
        return true;
      case 2:
        // Step 2 validation - validate forms based on selected services
        return this.validateStep2();
      default:
        return true;
    }
  }

  private validateStep2(): boolean {
    let isValid = true;

    // Validate common fields
    const commonProfessionType = this.unifiedForm.get('commonProfessionType');
    const commonRegistrationType = this.unifiedForm.get('commonRegistrationType');
    
    if (!commonProfessionType?.valid) {
      commonProfessionType?.markAsTouched();
      isValid = false;
    }
    
    if (!commonRegistrationType?.valid) {
      commonRegistrationType?.markAsTouched();
      isValid = false;
    }

    // Validate demand ready controls for selected services
    if (this.selectedServices.workaway) {
      const workawayDemand = this.unifiedForm.get('workawayHasDemandReady');
      if (!workawayDemand?.valid) {
        workawayDemand?.markAsTouched();
        isValid = false;
      }
    }

    if (this.selectedServices.itSubcontract) {
      const itSubDemand = this.unifiedForm.get('itSubcontractHasDemandReady');
      if (!itSubDemand?.valid) {
        itSubDemand?.markAsTouched();
        isValid = false;
      }
    }

    if (this.selectedServices.e2eQA) {
      const e2eDemand = this.unifiedForm.get('e2eQAHasDemandReady');
      if (!e2eDemand?.valid) {
        e2eDemand?.markAsTouched();
        isValid = false;
      }
    }

    // Validate service-specific forms if demand is ready
    if (this.selectedServices.workaway && this.hasDemandReady.workaway) {
      const workawayForm = this.unifiedForm.get('workaway');
      if (workawayForm && !workawayForm.valid) {
        this.markFormGroupTouched(workawayForm as FormGroup);
        isValid = false;
      }
    }

    if (this.selectedServices.itSubcontract && this.hasDemandReady.itSubcontract) {
      const itSubForm = this.unifiedForm.get('itSubcontract');
      if (itSubForm) {
        // Check if language field has selected technologies
        const languageControl = itSubForm.get('language');
        if (languageControl && this.selectedTechnologies.length === 0) {
          languageControl.setErrors({ required: true });
          languageControl.markAsTouched();
          isValid = false;
        }
        
        if (!itSubForm.valid) {
          this.markFormGroupTouched(itSubForm as FormGroup);
          isValid = false;
        }
      }
    }

    if (this.selectedServices.e2eQA && this.hasDemandReady.e2eQA) {
      const e2eForm = this.unifiedForm.get('e2eQA');
      if (e2eForm && !e2eForm.valid) {
        this.markFormGroupTouched(e2eForm as FormGroup);
        isValid = false;
      }
    }

    if (!isValid) {
      this.toastr.warning('Please fill in all required fields correctly.', 'Warning');
    }

    return isValid;
  }

  private initializeForms(): void {
    // Main unified form
    this.unifiedForm = this.formBuilder.group({
      // Common fields
      commonProfessionType: ['', [Validators.required]],
      commonRegistrationType: ['representative', [Validators.required]],
      commonWhiteLabelOption: [false],
      
      // Separate demand ready controls for each service
      workawayHasDemandReady: ['', [Validators.required]],
      itSubcontractHasDemandReady: ['', [Validators.required]],
      e2eQAHasDemandReady: ['', [Validators.required]],

      // WorkAway form
      workaway: this.formBuilder.group({
        fileUpload: ['']
      }),

      // IT Subcontracting form
      itSubcontract: this.formBuilder.group({
        requirement: [''],
        engagementType: [''],
        description: [''],
        language: [''],
        startDate: [''],
        endDate: [''],
        budget: ['']
      }),

      // E2E QA form
      e2eQA: this.formBuilder.group({
        requirement: [''],
        engagementType: [''],
        description: [''],
        startDate: [''],
        endDate: [''],
        budget: ['']
      })
    });

    // Contact form
    this.contactForm = this.formBuilder.group({
      businessName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      hearAboutUs: ['']
    });

    // Subscribe to demand ready changes for each service
    this.setupDemandReadySubscriptions();
  }

  private setupDemandReadySubscriptions(): void {
    // WorkAway demand ready subscription
    this.unifiedForm.get('workawayHasDemandReady')?.valueChanges.subscribe(value => {
      this.hasDemandReady.workaway = value === 'yes';
    });

    // IT Subcontracting demand ready subscription
    this.unifiedForm.get('itSubcontractHasDemandReady')?.valueChanges.subscribe(value => {
      this.hasDemandReady.itSubcontract = value === 'yes';
      const controls = ['requirement', 'engagementType', 'description', 'language', 'startDate', 'endDate', 'budget'];
      this.updateFormValidation('itSubcontract', controls, value === 'yes');
    });

    // E2E QA demand ready subscription
    this.unifiedForm.get('e2eQAHasDemandReady')?.valueChanges.subscribe(value => {
      this.hasDemandReady.e2eQA = value === 'yes';
      const controls = ['requirement', 'engagementType', 'description', 'startDate', 'endDate', 'budget'];
      this.updateFormValidation('e2eQA', controls, value === 'yes');
    });
  }

  private updateFormValidation(formGroup: string, controls: string[], isRequired: boolean): void {
    controls.forEach(controlName => {
      const control = this.unifiedForm.get(`${formGroup}.${controlName}`);
      if (isRequired) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  // Common registration type change handler
  onCommonRegistrationTypeChange(value: string): void {
    this.unifiedForm.patchValue({ commonRegistrationType: value });
  }

  // Getter for common representative flag
  get isCommonRepresentativeForClient(): boolean {
    return this.unifiedForm.get('commonRegistrationType')?.value === 'representative';
  }

  // Service selection methods
  onServiceSelectionChange(service: 'workaway' | 'itSubcontract' | 'e2eQA', event: any): void {
    this.selectedServices[service] = event?.target?.checked;
    
    if (!event?.target?.checked) {
      // Reset form when service is deselected
      this.unifiedForm.get(service)?.reset();
      this.hasDemandReady[service] = false;
      
      // Reset demand ready control
      const demandControl = `${service}HasDemandReady`;
      this.unifiedForm.get(demandControl)?.reset();
      
      if (service === 'itSubcontract') {
        this.selectedTechnologies = [];
      }
    }
  }

  // Demand ready change handlers
  onDemandReadyChange(service: 'workaway' | 'itSubcontract' | 'e2eQA', value: string): void {
    this.hasDemandReady[service] = value === 'yes';
    const demandControl = `${service}HasDemandReady`;
    this.unifiedForm.patchValue({ [demandControl]: value });

    if (value === 'no') {
      // Reset demand-related fields
      this.resetDemandFields(service);
    }
  }

  private resetDemandFields(service: 'workaway' | 'itSubcontract' | 'e2eQA'): void {
    const formGroup = this.unifiedForm.get(service);
    if (service === 'workaway') {
      formGroup?.patchValue({ fileUpload: '' });
    } else if (service === 'itSubcontract') {
      formGroup?.patchValue({
        requirement: '',
        engagementType: '',
        description: '',
        language: '',
        startDate: '',
        endDate: '',
        budget: ''
      });
      this.selectedTechnologies = [];
    } else if (service === 'e2eQA') {
      formGroup?.patchValue({
        requirement: '',
        engagementType: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: ''
      });
    }
  }

  // Registration type change handlers
  onRegistrationTypeChange(service: 'itSubcontract' | 'e2eQA', value: string): void {
    this.isRepresentativeForClient[service] = value === 'representative';
    this.unifiedForm.get(`${service}.registrationType`)?.patchValue(value);
  }

  // Banking option change handler (WorkAway)
  onBankingOptionChange(event: any): void {
    const whiteLabelControl = this.unifiedForm.get('workaway.whiteLabelOption');
    if (event?.target?.value === 'I would like to bank resources for my client(s)') {
      whiteLabelControl?.enable();
    } else {
      whiteLabelControl?.disable();
      whiteLabelControl?.patchValue(false);
    }
  }

  // Technology search methods (for IT Subcontracting)
  onTechSearchChange(event: any) {
    this.techSearch = event?.target?.value;
    this.techSearchSubject.next(this.techSearch);
  }

  searchTechnologies(searchTerm: string) {
    this.isLoadingTech = true;
    this.itSubcontractService.getTechnologies({ search: searchTerm }).subscribe({
      next: (response) => {
        if (response?.status) {
          this.searchResults = response?.data || [];
        }
        this.isLoadingTech = false;
      },
      error: () => {
        this.isLoadingTech = false;
      }
    });
  }

  selectTechnology(tech: any) {
    const isAlreadySelected = this.selectedTechnologies.some(t => t._id === tech._id);
    if (!isAlreadySelected) {
      this.selectedTechnologies.push(tech);
      this.updateLanguageField();
    }
    this.showTechDropdown = false;
    this.techSearch = '';
    this.searchResults = [];
  }

  removeTechnology(techId: string) {
    this.selectedTechnologies = this.selectedTechnologies.filter(t => t._id !== techId);
    this.updateLanguageField();
    
    // Mark language control as touched if no technologies are selected
    if (this.selectedTechnologies.length === 0) {
      const languageControl = this.unifiedForm.get('itSubcontract.language');
      languageControl?.markAsTouched();
    }
  }

  updateLanguageField() {
    const languageString = this.selectedTechnologies.map(t => t.name).join(', ');
    const languageControl = this.unifiedForm.get('itSubcontract.language');
    languageControl?.patchValue(languageString);
    
    // Update validation based on whether technologies are selected
    if (this.selectedTechnologies.length > 0) {
      languageControl?.setErrors(null);
    } else {
      languageControl?.setErrors({ required: true });
    }
  }

  onTechInputBlur() {
    setTimeout(() => {
      this.showTechDropdown = false;
      this.searchResults = [];
    }, 200);
  }

  // File upload methods
  onFileUpload(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.isUploading = true;

      this.formDataService.uploadProjectFiles(event.target.files[0]).subscribe({
        next: (response) => {
          this.isUploading = false;
          if (response?.status == true) {
            this.fileUpload = response?.data;
            this.unifiedForm.patchValue({ 'workaway.fileUpload': response?.data });
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

  // Form submission
  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      const contactData = this.contactForm.value;
      const commonData = {
        professionType: this.unifiedForm.get('commonProfessionType')?.value,
        registrationType: this.unifiedForm.get('commonRegistrationType')?.value,
        whiteLabelOption: this.unifiedForm.get('commonWhiteLabelOption')?.value
      };
      
      let submissionPromises: Promise<any>[] = [];

      // Submit forms for each selected service
      if (this.selectedServices.workaway) {
        const workawayData = {
          ...commonData,
          ...this.unifiedForm.get('workaway')?.value,
          ...contactData,
          serviceType: 'WorkAway',
          hasDemandReady: this.unifiedForm.get('workawayHasDemandReady')?.value
        };
        submissionPromises.push(
          this.formDataService.submitCompleteFormData({
            formType: 'workAwayForm',
            formData: workawayData
          }).toPromise()
        );
      }

      if (this.selectedServices.itSubcontract) {
        const itSubData = {
          ...commonData,
          ...this.unifiedForm.get('itSubcontract')?.value,
          ...contactData,
          serviceType: 'IT Subcontracting',
          hasDemandReady: this.unifiedForm.get('itSubcontractHasDemandReady')?.value
        };
        submissionPromises.push(
          this.itSubcontractService.submitItSubContractData({
            formType: 'itSubcontractForm',
            formData: itSubData
          }).toPromise()
        );
      }

      if (this.selectedServices.e2eQA) {
        const e2eData = {
          ...commonData,
          ...this.unifiedForm.get('e2eQA')?.value,
          ...contactData,
          serviceType: 'E2E QA Services',
          hasDemandReady: this.unifiedForm.get('e2eQAHasDemandReady')?.value
        };
        submissionPromises.push(
          this.formDataService.submitCompleteFormData({
            formType: 'e2eQaServiceForm',
            formData: e2eData
          }).toPromise()
        );
      }

      // Execute all submissions
      Promise.all(submissionPromises)
        .then((responses) => {
          this.isSubmitting = false;
          const allSuccess = responses.every(response => response?.status === true);
          
          if (allSuccess) {
            this.toastr.success('All forms submitted successfully!', 'Success');
            this.resetAllForms();
            this.router.navigate(['/success-message']);
          } else {
            this.toastr.error('Some forms failed to submit. Please try again.', 'Error');
          }
        })
        .catch((error) => {
          console.error('Error submitting forms:', error);
          this.isSubmitting = false;
          this.toastr.error('Failed to submit forms. Please try again.', 'Error');
        });
    } else {
      this.markFormGroupTouched(this.contactForm);
      this.toastr.warning('Please fill in all required contact fields correctly.', 'Warning');
    }
  }

  private resetAllForms(): void {
    this.unifiedForm.reset();
    this.contactForm.reset();
    this.selectedServices = { workaway: false, itSubcontract: false, e2eQA: false };
    this.hasDemandReady = { workaway: false, itSubcontract: false, e2eQA: false };
    this.selectedTechnologies = [];
    this.fileUpload = null;
    this.currentStep = 1;
    
    // Reset to default values
    this.unifiedForm.patchValue({
      commonRegistrationType: 'representative',
      commonWhiteLabelOption: false
    });
  }

  // Navigation
  goBack(): void {
    if (this.currentStep > 1) {
      this.previousStep();
    } else {
      this.router.navigate(['/our-services/workaway']);
    }
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
  NumberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

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

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // Getter methods for template
  get workawayForm() { return this.unifiedForm.get('workaway') as FormGroup; }
  get itSubcontractForm() { return this.unifiedForm.get('itSubcontract') as FormGroup; }
  get e2eQAForm() { return this.unifiedForm.get('e2eQA') as FormGroup; }

  // Cart getters (copied from cart component)
  get workawayItems() {
    return this.cartItems.items?.filter((item: any) => item.itemType === 'candidate') || [];
  }

  get resourceSharingItems() {
    return this.cartItems.items?.filter((item: any) => item.itemType !== 'candidate') || [];
  }

  getExperienceRange(years: number): string {
    if (years <= 0) {
      return "0";
    } else if (years > 0 && years <= 3) {
      return "1-3";
    } else if (years > 3 && years <= 5) {
      return "3-5";
    } else if (years > 5 && years <= 10) {
      return "5-10";
    } else {
      return "10+";
    }
  }

  calculateExperience(yearOfEstablishment: string | null): string {
    if (!yearOfEstablishment) return "0";

    const establishmentDate = new Date(yearOfEstablishment);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - establishmentDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    return this.getCompanyExperienceRange(diffYears);
  }

  getCompanyExperienceRange(years: number): string {
    if (years <= 0) {
      return "0";
    } else if (years > 0 && years <= 3) {
      return "1-3";
    } else if (years > 3 && years <= 5) {
      return "3-5";
    } else if (years > 5 && years <= 10) {
      return "5-10";
    } else {
      return "10+";
    }
  }

  resourceCapacity(value: number): string {
    if (value === 0) {
      return "0";
    } else if (value > 0 && value <= 20) {
      return "1-20";
    } else if (value > 20 && value <= 50) {
      return "21-50";
    } else if (value > 50 && value <= 100) {
      return "50-100";
    } else if (value > 100 && value <= 200) {
      return "100-200";
    } else {
      return "200+";
    }
  }
}
