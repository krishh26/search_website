import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isHomePage: boolean = false;
  totalCount: number = 0;


  constructor(private router: Router, private itSubcontractService: ItSubcontractService) { }

  ngOnInit() {
    // Check initial route
    this.checkIfHomePage();
    this.getCartItems();

    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkIfHomePage();
    });
  }

  private checkIfHomePage() {
    const currentUrl = this.router.url;
    this.isHomePage = currentUrl === '/' || currentUrl === '/home';
  }

  getCartItems() {
    this.itSubcontractService.getCartItems().subscribe((response: any) => {
      if (response?.status) {
        this.totalCount = response?.data?.total || 0;
      }
    })
  }
}
