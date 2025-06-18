import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  selectedService: string = 'WorkAway'; // Default selection
  showSkills: boolean = true; // Show skills by default for WorkAway
  showServices: boolean = false; // Hide services by default

  onServiceChange(event: any) {
    this.selectedService = event.target.value;

    if (this.selectedService === 'WorkAway') {
      this.showSkills = true;
      this.showServices = false;
    } else if (this.selectedService === 'IT Subcontracting') {
      this.showSkills = false;
      this.showServices = true;
    }
  }
}
