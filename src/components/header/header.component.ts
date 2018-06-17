import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'dangl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() prefix: string;
  @Input() postfix: string;
  @Input() showMenuButton = false;
  @Output() onMenuButtonClicked = new EventEmitter();

  @Input() preReleaseVersion: string;
  @Input() preReleaseBuildDate: Date;
  @Input() preReleaseLiveSiteLink: string;
  showPrerelease = false;

  ngOnInit() {
    this.showPrerelease = this.preReleaseVersion != null
      || this.preReleaseBuildDate != null
      || this.preReleaseLiveSiteLink != null;
    if (this.preReleaseVersion != null && typeof (Storage) !== 'undefined') {
      this.showPrerelease = this.preReleaseVersion != localStorage.getItem('dangl_preview_notice_header_hide_version');
    }
  }

  hideForCurrentVersion() {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('dangl_preview_notice_header_hide_version', this.preReleaseVersion);
      this.showPrerelease = false;
    }
  }
}
