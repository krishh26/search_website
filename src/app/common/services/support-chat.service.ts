import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export interface SupportChatMessage {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export interface SupportChatSession {
  sessionId: string;
  messages: SupportChatMessage[];
  currentStep: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupportChatService {
  private apiUrl = `${environment.baseUrl}/support-chat`;

  constructor(private http: HttpClient) { }

  startChat(userId?: string, anonymousUserId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/start`, { userId, anonymousUserId });
  }

  sendMessage(sessionId: string, message: string, userId?: string, anonymousUserId?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, { sessionId, message, userId, anonymousUserId });
  }

  getChatHistory(sessionId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/history?sessionId=${sessionId}`);
  }

  getActiveChats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/active`);
  }

  closeChat(sessionId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/close/${sessionId}`, {});
  }
}
