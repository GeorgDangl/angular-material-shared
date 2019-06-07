import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialSharedModule } from 'angular-material-shared';
import { RouterModule } from '../../node_modules/@angular/router';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    AngularMaterialSharedModule
  ],
  providers: [{
    provide: 'TINYMCE_SKIN_URL',
    useValue: '/assets/skins/ui/oxide'
  },
  {
    provide: 'TINYMCE_CONTENT_CSS_URL',
    useValue: '/assets/skins/ui/oxide/content.min.css'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
