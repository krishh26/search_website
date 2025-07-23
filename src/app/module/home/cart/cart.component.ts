import { Component, OnInit } from '@angular/core';
import { ItSubcontractService } from 'src/app/services/it-subcontract.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease', style({ opacity: 1, transform: 'none' }))
      ])
    ])
  ]
})
export class CartComponent implements OnInit {
  cartItems: any = [];
  selectedFilter: string = 'all';

  constructor(private itSubcontractService: ItSubcontractService) { }

  ngOnInit(): void {
    this.getCartItems();
  }

  getCartItems() {
    this.cartItems = [];
    this.itSubcontractService.getCartItems().subscribe((response: any) => {
      if (response?.status) {
        this.cartItems = response?.data || [];
      }
    })
  }

  removeCartItem(itemId: string) {
    this.itSubcontractService.removeFromCart(itemId).subscribe({
      next: () => this.getCartItems(),
      error: (err) => console.error('Failed to remove item from cart', err)
    });
  }

  maskName(name: string | undefined | null): string {
    if (!name || typeof name !== 'string') {
      return '';
    }
    const words = name.split(' ');

    return words.map((word, index) => {
      if (index === 0) {
        // First word: show 1st, 3rd, 5th
        return word
          .split('')
          .map((char, i) => (i === 0 || i === 2 || i === 4 ? char : '*'))
          .join('');
      } else if (index === 1) {
        // Second word: show 1st and 3rd
        return word
          .split('')
          .map((char, i) => (i === 0 || i === 2 ? char : '*'))
          .join('');
      } else {
        // All other words: full mask
        return '*'.repeat(word.length);
      }
    }).join(' ');
  }

  getBorderColor(index: number): string {
    // Colors: green, blue, pink, gold, yellow (from image: #ffd600)
    const colors = ['#22c55e', '#2563eb', '#f9a8d4', '#fbbf24'];
    return colors[index % colors.length];
  }

  get workawayItems() {
    return this.cartItems.items?.filter((item: any) => item.itemType === 'candidate') || [];
  }

  get resourceSharingItems() {
    return this.cartItems.items?.filter((item: any) => item.itemType !== 'candidate') || [];
  }

  getExperienceRange(years: number): string {
    if (years <= 0) {
      return "0";
    } else if (years > 0 && years <= 3) {
      return "1-3";
    } else if (years > 3 && years <= 5) {
      return "3-5";
    } else if (years > 5 && years <= 10) {
      return "5-10";
    } else {
      return "10+";
    }
  }

  calculateExperience(yearOfEstablishment: string | null): string {
    if (!yearOfEstablishment) return "0";

    const establishmentDate = new Date(yearOfEstablishment);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - establishmentDate.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    return this.getCompanyExperienceRange(diffYears);
  }

  getCompanyExperienceRange(years: number): string {
    if (years <= 0) {
      return "0";
    } else if (years > 0 && years <= 3) {
      return "1-3";
    } else if (years > 3 && years <= 5) {
      return "3-5";
    } else if (years > 5 && years <= 10) {
      return "5-10";
    } else {
      return "10+";
    }
  }

  resourceCapacity(value: number): string {
    if (value === 0) {
      return "0";
    } else if (value > 0 && value <= 20) {
      return "1-20";
    } else if (value > 20 && value <= 50) {
      return "21-50";
    } else if (value > 50 && value <= 100) {
      return "50-100";
    } else if (value > 100 && value <= 200) {
      return "100-200";
    } else {
      return "200+";
    }
  }
}
