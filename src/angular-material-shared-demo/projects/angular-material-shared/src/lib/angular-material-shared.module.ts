import { CommonModule } from '@angular/common';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NgModule } from '@angular/core';
import { TinyMceComponent } from './components/tiny-mce/tiny-mce.component';

@NgModule({
  imports: [CommonModule, FooterComponent, HeaderComponent, TinyMceComponent],
  exports: [FooterComponent, HeaderComponent, TinyMceComponent]
})
export class AngularMaterialSharedModule { }
