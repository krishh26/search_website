import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment-prod';

export interface Role {
  id: number;
  name: string;
  // Add other properties as needed based on API response
}

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

  getRolesList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles/public/get-list`);
  }

  getSupplierList(limit: number = 10, search: string = ''): Observable<any> {
    let params = new HttpParams().set('limit', limit.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.baseUrl}/user/public/suplier/list`, { params });
  }

  getCandidateList(params?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/public/get-list`, { params });
  }
}
