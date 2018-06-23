import { Component, Input, EventEmitter, Output } from '@angular/core';

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
  @Output() legalNoticeCallback = new EventEmitter();
  
}
