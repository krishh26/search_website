import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'search_ui';

  constructor() {
    const existingAnonymousUserId = localStorage.getItem('anonymousUserId');
    if(!existingAnonymousUserId) {
      const id = uuidv4();
      localStorage.setItem(`anonymousUserId`, id);
    }
  }
}
