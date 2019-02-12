import { Component, Input, EventEmitter, Output } from '@angular/core';
import { FooterOptions } from '../../models/footer-options';

@Component({
  selector: 'dangl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  currentYear = new Date().getFullYear();

  @Input() showLegalNotice = false;
  @Input() legalNoticeText = 'Legal Notice';
  @Input() legalNoticeLink = 'legal-notice';
  @Input() useLegalNoticeCallback = false;
  @Input() options: FooterOptions;
  @Output() legalNoticeCallback = new EventEmitter();

}
