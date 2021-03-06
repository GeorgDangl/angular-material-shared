import { Component } from '@angular/core';
import { FooterOptions } from '../../projects/angular-material-shared/src/public_api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  footerOptions: FooterOptions = {
    logoInitials: 'GD',
    copyrightUrl: 'https://www.dangl-it.com',
    companyNameHtml: 'Dangl<strong>IT</strong> GmbH'
  };

  menuButtonClicked() {
    alert('Button clicked');
  }

}
