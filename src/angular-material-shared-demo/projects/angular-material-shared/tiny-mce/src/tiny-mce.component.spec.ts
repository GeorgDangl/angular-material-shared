import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Editor, RawEditorOptions } from 'tinymce';

import { TinyMceComponent } from './tiny-mce.component';

interface TinymceStub {
  init(options: RawEditorOptions): Promise<Editor[]>;
  remove(): void;
}

(window as unknown as { global: Window }).global = window;

describe('TinyMceComponent', () => {
  let component: TinyMceComponent;
  let fixture: ComponentFixture<TinyMceComponent>;
  let tinyMceInitParam: RawEditorOptions | null;
  let tinyMceRemoveCalled = false;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TinyMceComponent],
      providers: [
        {
          provide: 'TINYMCE_BASE_URL',
          useValue: 'tinymce-assets'
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    const tinymceStub: TinymceStub = {
      init: (options) => {
        tinyMceInitParam = options;
        return Promise.resolve([]);
      },
      remove: () => { tinyMceRemoveCalled = true; }
    };
    (globalThis as unknown as { tinymce: TinymceStub }).tinymce = tinymceStub;
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
    expect(tinyMceInitParam?.base_url).toEqual('tinymce-assets');
  });
});
