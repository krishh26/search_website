import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent implements OnInit, OnDestroy {
  isVisible = false;
  private scrollThreshold = 300;

  constructor() { }

  ngOnInit(): void {
    this.checkScrollPosition();
  }

  ngOnDestroy(): void {
    // Clean up any event listeners if needed
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    this.isVisible = window.pageYOffset >= this.scrollThreshold;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
