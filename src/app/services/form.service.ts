import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private apiUrl = '/search-ui/formdata';

  constructor(private http: HttpClient) { }

  submitForm(formData: any): Observable<any> {
    const payload = {
      formType: 'contactUsForm',
      formData: formData
    };
    return this.http.post(this.apiUrl, payload);
  }
}
