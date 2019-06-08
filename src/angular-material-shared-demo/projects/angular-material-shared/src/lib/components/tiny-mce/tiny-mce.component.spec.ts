import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TinyMceComponent } from './tiny-mce.component';

describe('TinyMceComponent', () => {
  let component: TinyMceComponent;
  let fixture: ComponentFixture<TinyMceComponent>;
  let tinyMceInitParam: any;
  let tinyMceRemoveCalled = false;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TinyMceComponent ],
      providers: [
        {
          provide: 'TINYMCE_SKIN_URL',
          useValue: 'injected/url.css'
        },
        {
          provide: 'TINYMCE_CONTENT_CSS_URL',
          useValue: 'injected/content.css'
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    (<any>global).tinymce = {
      init: x => { tinyMceInitParam = x; },
      remove: x => { tinyMceRemoveCalled = true; }
    };
    tinyMceInitParam = null;
    tinyMceRemoveCalled = false;

    fixture = TestBed.createComponent(TinyMceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Calls tinyMce init', () => {
    expect(tinyMceInitParam).toBeTruthy();
  });

  it('should have injected correct url for skin', () => {
    expect(tinyMceInitParam.skin_url).toEqual('injected/url.css');
  });

  it('should have injected correct url for content', () => {
    expect(tinyMceInitParam.content_css).toEqual('injected/content.css');
  });

  it('should call remove on destroy', () => {
    expect(tinyMceRemoveCalled).toBeFalsy();
    component.ngOnDestroy();
    expect(tinyMceRemoveCalled).toBeTruthy();
  });
});
