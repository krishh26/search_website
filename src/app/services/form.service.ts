import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment-prod';
@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = '/search-ui/formdata';
  baseUrl!: string;
  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = environment.baseUrl;
  }

  submitForm(formData: any): Observable<any> {
    const payload = {
      formType: 'contactUsForm',
      formData: formData
    };
    return this.http.post(this.apiUrl, payload);
  }
}
