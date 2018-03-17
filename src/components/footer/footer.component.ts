import { Component } from '@angular/core';

@Component({
  selector: 'dangl-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  private currentYear = new Date().getFullYear();
  private initialYear = 2017;
  copyrightTime = this.initialYear === this.currentYear
    ? this.initialYear.toString()
    : `${this.initialYear} - ${this.currentYear}`;
}
