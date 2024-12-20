import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TinyMceComponent } from '@dangl/angular-material-shared/tiny-mce';

@Component({
  selector: 'tinyMce-en',
  imports: [TinyMceComponent],
  template: `
  <dangl-tiny-mce tinyMceLanguageCode="en"></dangl-tiny-mce>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TinyMceEnComponent { }
