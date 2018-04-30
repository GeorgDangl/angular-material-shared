import { NgModule } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TinyMceComponent } from './components/tiny-mce/tiny-mce.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    TinyMceComponent
  ],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    TinyMceComponent
  ]
})
export class AngularMaterialSharedModule { }
