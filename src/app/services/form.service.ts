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
    const payload : any = {
      formType: 'contactUsForm',
      formData: formData
    };
    if (localStorage.getItem('anonymousUserId')) {
      payload['anonymousUserId'] = localStorage.getItem('anonymousUserId');
    }
    return this.http.post(this.apiUrl, payload);
  }
}
