import { Component } from '@angular/core';
import { FooterComponent, FooterOptions, HeaderComponent, } from 'angular-material-shared';
import { TinyMceComponent } from 'angular-material-shared/tiny-mce';

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
