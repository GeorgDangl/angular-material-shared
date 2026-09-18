import { Component, Input, input, output } from '@angular/core';

import { FooterOptions } from '../../models/footer-options';

import { RouterModule } from '@angular/router';

@Component({
    selector: 'dangl-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [
    RouterModule
]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  readonly showLegalNotice = input(false);
  readonly showPrivacy = input(false);
  readonly legalNoticeText = input('Legal Notice');
  readonly privacyText = input('Privacy');
  readonly legalNoticeLink = input('legal-notice');
  readonly privacyLink = input('privacy');
  readonly useLegalNoticeCallback = input(false);
  readonly usePrivaceCallback = input(false);
  @Input() options?: FooterOptions;
  readonly legalNoticeCallback = output();
  readonly privacyCallback = output();
}
