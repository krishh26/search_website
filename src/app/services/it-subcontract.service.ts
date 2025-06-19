import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environment/environment-prod';

export interface Role {
  id: number;
  name: string;
  // Add other properties as needed based on API response
}

export interface CandidateFilter {
  jobTitle: string;
  numberOfResources: number;
  experience: string;
  skills?: string[];
}

export interface Tag {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagResponse {
  message: string;
  status: boolean;
  data: {
    tags: Tag[];
    total: number;
  };
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

  saveCandidateFilters(filters: CandidateFilter[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/candidate/save-filter`, filters);
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<TagResponse>(`${this.baseUrl}/tags/public`).pipe(
      map(response => response.data.tags)
    );
  }
}
