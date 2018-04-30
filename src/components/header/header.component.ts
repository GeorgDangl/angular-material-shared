import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dangl-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() prefix: string;
  @Input() postfix: string;

  @Input() preReleaseVersion: string;
  @Input() preReleaseBuildDate: Date;
  @Input() preReleaseLiveSiteLink: string;
  showPrerelease = false;

  ngOnInit() {
    this.showPrerelease = this.preReleaseVersion != null
      || this.preReleaseBuildDate != null
      || this.preReleaseLiveSiteLink != null;
  }
}
