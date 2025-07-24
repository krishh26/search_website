import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type ServiceType = 'workaway' | 'itSubcontracting' | 'e2eQA';

@Injectable({
  providedIn: 'root'
})
export class ServiceTypeService {
  constructor(private router: Router) {}

  navigateToRegistration(serviceType: ServiceType): void {
    const routes = {
      'workaway': '/our-services/workaway-registration',
      'itSubcontracting': '/our-services/workaway-registration',
      'e2eQA': '/our-services/workaway-registration'
    };

    // First clear navigation history
    window.history.pushState({}, '', '/');

    // Then navigate to the new route
    setTimeout(() => {
      this.router.navigate([routes[serviceType]]);
    }, 0);
  }

  getServiceTypeText(value: string): string {
    const serviceTypes: { [key: string]: string } = {
      'option1': 'WorkAway',
      'option2': 'IT Subcontracting',
      'option3': 'E2E QA Services'
    };
    return serviceTypes[value] || value;
  }

  getServiceTypeValue(type: ServiceType): string {
    const serviceTypes: { [key in ServiceType]: string } = {
      'workaway': 'option1',
      'itSubcontracting': 'option2',
      'e2eQA': 'option3'
    };
    return serviceTypes[type];
  }
}
