import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  footerOptions = {
    logoInitials: 'GD',
    copyrightUrl: 'https://www.dangl-it.com',
    companyNameHtml: 'Dangl<strong>IT</strong> GmbH'
  };

  menuButtonClicked() {
    alert('Button clicked');
  }

}
