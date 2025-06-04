import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toasts: ToastrService) { }

  showSuccess(message: string, title?: string) {
    this.toasts.success(message || '', title || 'Success', { positionClass: 'toast-top-center' })
  }

  showError(message: string, title?: string) {
    this.toasts.error(message || 'Something Went Wrong!', title || 'Error', { positionClass: 'toast-top-center' })
  }

  showInfo(message: string, title?: string) {
    this.toasts.info(message || '', title || 'Info', { positionClass: 'toast-top-center' })
  }

  showWarning(message: string, title?: string) {
    this.toasts.warning(message || '', title || 'Warning', { positionClass: 'toast-top-center' })
  }
}
