import { NgModule } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { TinyMceComponent } from './components/tiny-mce/tiny-mce.component';

@NgModule({
  declarations: [
    FooterComponent,
    TinyMceComponent
  ],
  exports: [
    FooterComponent,
    TinyMceComponent
  ]
})
export class AngularMaterialSharedModule { }
