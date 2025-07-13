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

export interface SearchParams {
  search?: string;
  page?: number;
  limit?: number;
}

export interface Partner {
  _id: string;
  companyName: string;
  expertise: string;
  location: string;
  companySize: string;
  experience: number;
  technologies: string[];
  active: boolean;
}

export interface PartnerResponse {
  status: boolean;
  message: string;
  data: Partner[];
  meta_data: {
    items: number;
    pages: number | null;
  };
  activePartnersCount: number;
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
    if (localStorage.getItem('anonymousUserId')) {
      payload['anonymousUserId'] = localStorage.getItem('anonymousUserId');
    }
    return this.http.post(`${this.baseUrl}/search-ui/formdata`, payload);
  }

  getRolesList(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.baseUrl}/roles/public/get-list`);
  }

  getSupplierList(payload: { limit: number, search: string, projectName: string, tags: string, expertise: string }): Observable<any> {
    let params = new HttpParams().set('limit', payload?.limit?.toString() || "10");
    if (payload?.search) {
      params = params.set('search', payload.search);
    }
    if (payload?.projectName) {
      params = params.set('projectName', payload.projectName);
    }
    if (payload?.tags) {
      params = params.set('tags', payload.tags);
    }
    if (payload?.expertise) {
      params = params.set('expertise', payload.expertise);
    }
    return this.http.get(`${this.baseUrl}/user/public/suplier/list`, { params });
  }

  getCandidateList(params?: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/candidate/public/get-list`, { params });
  }

  saveCandidateFilters(filters: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/candidate/public/save-filter`, filters);
  }

  saveSupplierFilters(filters: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/public/supplier-filter/save`, filters);
  }

  getCandidateFilters(): Observable<any> {
    let params = new HttpParams();
    if (localStorage.getItem('anonymousUserId')) {
      params = new HttpParams().set('anonymousUserId', localStorage.getItem('anonymousUserId') || "");
    }
    return this.http.get(`${this.baseUrl}/candidate/public/filter-list`, { params });
  }

  getCandidateFilterByList(id: string, page: number = 1, limit: number = 10000): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString());

    return this.http.get(`${this.baseUrl}/candidate/public/filter/${id}/candidates`, { params });
  }

  removeCandidateFilters(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/candidate/filter/${id}`);
  }

  // Function to be used to the get job title list
  getJobTitles(search?: any): Observable<any> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.baseUrl}/roles/public/get-all-roles`, { params });
  }

  // Function to be used to the get job title list
  getExpertise(search?: any): Observable<any> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.baseUrl}/web-user/public/expertise-list`, { params });
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<TagResponse>(`${this.baseUrl}/tags/public`).pipe(
      map(response => response.data.tags)
    );
  }

  getExpertiseList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/web-user/public/expertise-list`);
  }

  getSupplierFilterList(page: number = 1, limit: number = 10000): Observable<any> {
    let params = new HttpParams();
    if (localStorage.getItem('anonymousUserId')) {
      params = new HttpParams().set('anonymousUserId', localStorage.getItem('anonymousUserId') || "");
    }

    params = params.set('limit', limit.toString())
    params = params.set('page', page.toString());

    return this.http.get(`${this.baseUrl}/user/public/supplier-filter/list`, { params });
  }

  // New methods for partner search
  searchPartners(params: SearchParams): Observable<PartnerResponse> {
    return this.http.get<PartnerResponse>(`${this.baseUrl}/partners/search`, { params: params as any });
  }

  getPartnersByFilter(filterId: string): Observable<PartnerResponse> {
    return this.http.get<PartnerResponse>(`${this.baseUrl}/partners/filter/${filterId}`);
  }

  removeSupplierFilter(filterId: string): Observable<{ status: boolean; message: string }> {
    return this.http.delete<{ status: boolean; message: string }>(`${this.baseUrl}/user/public/supplier-filter/${filterId}`);
  }

  getSuppliersByFilterId(filterId: string, page: number = 1, limit: number = 10000): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('page', page.toString());

    return this.http.get<any>(`${this.baseUrl}/user/public/supplier-filter/${filterId}/suppliers`, { params });
  }


  getTechnologies(payload: { search: string }): Observable<any> {
    let params = new HttpParams()
    if (payload?.search) {
      params = params.set('search', payload.search);
    }

    return this.http.get(`${this.baseUrl}/tech-language/public/technologies`, { params });
  }
}
