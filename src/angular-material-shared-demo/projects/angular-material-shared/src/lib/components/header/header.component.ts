import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'dangl-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    imports: [
        CommonModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        RouterLink
    ]
})
export class HeaderComponent implements OnChanges {
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
    if (val) {
      this._forceDisablePrereleaseHeader = false;
      this._showPrerelease = this.checkPrereleaseData();
    } else {
      this._forceDisablePrereleaseHeader = true;
      this._showPrerelease = false;
    }
  }

  get showPrerelease() {
    if (this._forceDisablePrereleaseHeader) {
      return false;
    }
    return this._showPrerelease;
  }

  private _showPrerelease: boolean;
  private _forceDisablePrereleaseHeader = false;

  ngOnChanges(_: SimpleChanges): void {
    if (!this._forceDisablePrereleaseHeader) {
      this._showPrerelease = this.checkPrereleaseData();
    }
  }

  checkPrereleaseData(): boolean {
    let isShowing =
      this.preReleaseVersion != null ||
      this.preReleaseBuildDate != null ||
      this.preReleaseLiveSiteLink != null;
    if (this.preReleaseVersion != null && typeof Storage !== "undefined") {
      isShowing =
        this.preReleaseVersion !==
        localStorage.getItem("dangl_preview_notice_header_hide_version");
    }
    return isShowing;
  }

  hideForCurrentVersion() {
    if (typeof Storage !== "undefined") {
      localStorage.setItem(
        "dangl_preview_notice_header_hide_version",
        this.preReleaseVersion
      );
      this.showPrerelease = false;
    }
  }
}
