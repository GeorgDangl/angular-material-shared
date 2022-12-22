import { AngularMaterialSharedModule } from '../../projects/angular-material-shared/src/public_api';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
    AngularMaterialSharedModule,
    MatButtonModule
  ],
  providers: [{
    provide: 'TINYMCE_BASE_URL',
    useValue: '/assets/tinymce-assets'
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
