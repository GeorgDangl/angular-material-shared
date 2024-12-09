import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TinyMceComponent } from '@dangl/angular-material-shared/tiny-mce';

@Component({
  selector: 'tinyMce-de',
  imports: [TinyMceComponent],
  template: `<dangl-tiny-mce tinyMceLanguageCode="de"></dangl-tiny-mce>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TinyMceDeComponent { }
