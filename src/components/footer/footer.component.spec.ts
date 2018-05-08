import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [RouterModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /*
  it('should have 2017 as initial year', () => {
    expect(component.copyrightTime.substr(0, 4)).toEqual('2017');
  });

  it('should have the correct copyright format', () => {
    const currentYear = new Date().getFullYear();
    const expectedFormat = `2017 - ${currentYear}`;
    expect(component.copyrightTime).toEqual(expectedFormat);
  });
  */

});
