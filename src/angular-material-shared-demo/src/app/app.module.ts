import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialSharedModule } from 'angular-material-shared';
import { RouterModule } from '@angular/router';

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
    provide: 'TINYMCE_BASE_URL',
    useValue: '/assets/tinymce-assets'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
