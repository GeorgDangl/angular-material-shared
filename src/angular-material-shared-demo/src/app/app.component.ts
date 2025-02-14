import { Component, inject } from '@angular/core';
import { FooterComponent, FooterOptions, HeaderComponent } from '@dangl/angular-material-shared';
import { GuidGenerator } from '@dangl/angular-material-shared/guid-generator';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [MatTabsModule,HeaderComponent, FooterComponent,RouterOutlet, RouterLink,RouterLinkActive, MatSnackBarModule],
    providers: [
        {
            provide: "TINYMCE_BASE_URL",
            useValue: "/assets/tinymce-assets",
        },
    ]
})
export class AppComponent {
  logoInitials ="GD"
  generatedId = GuidGenerator.generatePseudoRandomGuid();
  footerOptions: FooterOptions = {
    logoInitials: 'GD',
    copyrightUrl: 'https://www.dangl-it.com',
    companyNameHtml: 'Dangl<strong>IT</strong> GmbH'
  };
  private _snackBar = inject(MatSnackBar);

  menuButtonClicked(value: boolean) {
    this._snackBar.open(`Button clicked ( ${value} ) and ID ${this.generatedId} generated`, 'Close', { duration: 2000 });
  }

}
