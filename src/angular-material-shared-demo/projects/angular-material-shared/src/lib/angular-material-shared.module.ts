import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TinyMceComponent } from './components/tiny-mce/tiny-mce.component';

@NgModule({
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    CommonModule
  ],
  declarations: [FooterComponent, HeaderComponent, TinyMceComponent],
  exports: [FooterComponent, HeaderComponent, TinyMceComponent]
})
export class AngularMaterialSharedModule { }
