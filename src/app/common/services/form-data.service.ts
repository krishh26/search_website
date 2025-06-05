import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environment/environment-prod';

interface FormData {
  formType: string;
  formData: any;
}

interface StepOneData {
  serviceType: string;
  professionType: string;
  hasDemandReady: boolean;
  bankingOption: string;
  whiteLabelOption: boolean;
  timestamp: string;
}

interface StepTwoData {
  businessName: string;
  address: string;
  fullName: string;
  phoneNumber: string;
  jobTitle: string;
  emailAddress: string;
  howDidYouHear: string;
}

interface RegistrationResponse {
  status: boolean;
  message?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  private baseUrl: string;
  private stepOneDataSubject = new BehaviorSubject<StepOneData | null>(null);
  private stepOneData: any;

  constructor(private http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

  // Store step one data temporarily
  storeStepOneData(data: StepOneData): void {
    this.stepOneDataSubject.next(data);
    // Also store in localStorage as backup
    localStorage.setItem('workAwayStepOne', JSON.stringify(data));
    this.stepOneData = data;
  }

  // Get stored step one data
  getStepOneData(): StepOneData | null {
    const current = this.stepOneDataSubject.value;
    if (current) {
      return current;
    }

    // Fallback to localStorage
    const stored = localStorage.getItem('workAwayStepOne');
    if (stored) {
      const data = JSON.parse(stored);
      this.stepOneDataSubject.next(data);
      this.stepOneData = data;
      return data;
    }

    return null;
  }

  // Submit complete form data
  submitCompleteFormData(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/search-ui/formdata`, data);
  }

  // Clear stored data after successful submission
  clearStoredData(): void {
    this.stepOneDataSubject.next(null);
    localStorage.removeItem('workAwayStepOne');
    this.stepOneData = null;
  }

  // Check if step one is completed
  isStepOneCompleted(): boolean {
    return this.getStepOneData() !== null;
  }

  // Upload project files
  uploadProjectFiles(file: File): Observable<RegistrationResponse> {
    const formData = new FormData();
    formData.append('files', file);
    return this.http.post<RegistrationResponse>(`${this.baseUrl}/project/upload-public`, formData);
  }

  // Upload with array data (alternative method if you need to send structured data)
  uploadWithArrayData(data: any[]): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.baseUrl}/bulk-upload`, { data });
  }

  submitRegistrationData(data: any): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.baseUrl}/search-ui/formdata`, data);
  }
}
