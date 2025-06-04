import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  private baseUrl = 'https://api.westgateithub.com/api/v1/search-ui'; // Adjust this to your actual API base URL
  private stepOneDataSubject = new BehaviorSubject<StepOneData | null>(null);

  constructor(private http: HttpClient) { }

  // Store step one data temporarily
  storeStepOneData(data: StepOneData): void {
    this.stepOneDataSubject.next(data);
    // Also store in localStorage as backup
    localStorage.setItem('workAwayStepOne', JSON.stringify(data));
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
      return data;
    }

    return null;
  }

  // Submit complete form data
  submitCompleteFormData(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/formdata`, data);
  }

  // Clear stored data after successful submission
  clearStoredData(): void {
    this.stepOneDataSubject.next(null);
    localStorage.removeItem('workAwayStepOne');
  }

  // Check if step one is completed
  isStepOneCompleted(): boolean {
    return this.getStepOneData() !== null;
  }

  // Upload project files
  uploadProjectFiles(file: File): Observable<any> {
    const data = new FormData();
    data.append('files', file);

    return this.http.post(`${this.baseUrl}/project/upload`, data);
  }

  // Upload with array data (alternative method if you need to send structured data)
  uploadWithArrayData(arrayData: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/project/upload`, arrayData);
  }
}
