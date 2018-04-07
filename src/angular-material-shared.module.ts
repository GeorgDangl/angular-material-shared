import { NgModule } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { TinyMceComponent } from './components/tiny-mce/tiny-mce.component';

import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    TinyMceComponent
  ],
  imports: [
    MatToolbarModule
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    TinyMceComponent
  ]
})
export class AngularMaterialSharedModule { }
