import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
