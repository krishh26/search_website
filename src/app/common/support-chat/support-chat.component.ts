import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupportChatService, SupportChatMessage, SupportChatSession } from '../services/support-chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-support-chat',
  templateUrl: './support-chat.component.html',
  styleUrls: ['./support-chat.component.scss']
})
export class SupportChatComponent implements OnInit, OnDestroy {
  isChatOpen = false;
  currentMessage = '';
  chatSession: SupportChatSession | null = null;
  isLoading = false;
  private subscription = new Subscription();

  constructor(private supportChatService: SupportChatService) { }

  ngOnInit(): void {
    // Generate anonymous user ID for this session
    const anonymousUserId = this.generateAnonymousUserId();
    localStorage.setItem('anonymousUserId', anonymousUserId);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  toggleChat(): void {
    if (!this.isChatOpen) {
      this.startChat();
    } else {
      this.isChatOpen = false;
    }
  }

  startChat(): void {
    this.isLoading = true;
    const anonymousUserId = localStorage.getItem('anonymousUserId') || this.generateAnonymousUserId();

    this.subscription.add(
      this.supportChatService.startChat(undefined, anonymousUserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.chatSession = response.data;
            this.isChatOpen = true;
          }
        },
        error: (error) => {
          console.error('Error starting chat:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      })
    );
  }

  sendMessage(): void {
    if (!this.currentMessage.trim() || !this.chatSession) return;

    const message = this.currentMessage.trim();
    this.currentMessage = '';

    // Add user message to chat immediately for better UX
    this.chatSession.messages.push({
      message,
      isUser: true,
      timestamp: new Date()
    });

            const anonymousUserId = localStorage.getItem('anonymousUserId') ?? undefined;

        this.subscription.add(
            this.supportChatService.sendMessage(this.chatSession.sessionId, message, undefined, anonymousUserId).subscribe({
        next: (response) => {
          if (response.status) {
            this.chatSession = response.data;
          }
        },
        error: (error) => {
          console.error('Error sending message:', error);
        }
      })
    );
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  closeChat(): void {
    this.isChatOpen = false;
    this.chatSession = null;
  }

  private generateAnonymousUserId(): string {
    return 'anon_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  getMessageTime(timestamp: Date): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
