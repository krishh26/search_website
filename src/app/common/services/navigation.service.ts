import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private previousService: string = '';

  setPreviousService(service: string) {
    this.previousService = service;
  }

  getPreviousService(): string {
    return this.previousService;
  }

  clearPreviousService() {
    this.previousService = '';
  }
}
