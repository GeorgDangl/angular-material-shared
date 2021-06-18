import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dangl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() prefix: string;
  @Input() postfix: string;
  @Input() showMenuButton = false;
  @Input() logoInitials = 'GD';
  @Input() iconUrl: string;
  @Output() menuButtonClicked = new EventEmitter();

  @Input() preReleaseVersion: string;
  @Input() preReleaseBuildDate: Date;
  @Input() preReleaseLiveSiteLink: string;

  @Input() set showPrerelease(val: boolean) {
    this._showPrerelease = val ? this.checkPrereleaseData() : false;
  };

  get showPrerelease() {
    return this._showPrerelease;
  }

  private _showPrerelease: boolean;

  ngOnInit() {

  }

  checkPrereleaseData(): boolean {
    let isShowing  = this.preReleaseVersion != null
      || this.preReleaseBuildDate != null
      || this.preReleaseLiveSiteLink != null;
    if (this.preReleaseVersion != null && typeof (Storage) !== 'undefined') {
      isShowing = this.preReleaseVersion !== localStorage.getItem('dangl_preview_notice_header_hide_version');
    }
    return isShowing;
  }

  hideForCurrentVersion() {
    if (typeof (Storage) !== 'undefined') {
      localStorage.setItem('dangl_preview_notice_header_hide_version', this.preReleaseVersion);
      this.showPrerelease = false;
    }
  }

}
