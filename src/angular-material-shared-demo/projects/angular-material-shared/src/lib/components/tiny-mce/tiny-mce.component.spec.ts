import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TinyMceComponent } from './tiny-mce.component';

(window as any).global = window

describe('TinyMceComponent', () => {
  let component: TinyMceComponent;
  let fixture: ComponentFixture<TinyMceComponent>;
  let tinyMceInitParam: any;
  let tinyMceRemoveCalled = false;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TinyMceComponent],
      providers: [
        {
          provide: 'TINYMCE_BASE_URL',
          useValue: 'tinymce-assets'
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

  it('should have injected correct base url', () => {
    expect(tinyMceInitParam.base_url).toEqual('tinymce-assets');
  });
});
