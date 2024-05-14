import { Component } from '@angular/core';
import { FooterOptions } from '../../projects/angular-material-shared/src/public_api';
import { FooterComponent, HeaderComponent, TinyMceComponent } from 'angular-material-shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HeaderComponent, FooterComponent, TinyMceComponent],
  providers: [
    {
      provide: "TINYMCE_BASE_URL",
      useValue: "/assets/tinymce-assets",
    },
  ]
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
