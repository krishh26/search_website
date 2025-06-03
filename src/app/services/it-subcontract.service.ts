import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment-prod';

@Injectable({
  providedIn: 'root'
})
export class ItSubcontractService {
  baseUrl!: string;

  constructor(
    private http: HttpClient
  ) {
    this.baseUrl = environment.baseUrl;
  }

  submitItSubContractData(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/search-ui/formdata`, payload);
  }
}
