import { Component, Input } from '@angular/core';

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

}
