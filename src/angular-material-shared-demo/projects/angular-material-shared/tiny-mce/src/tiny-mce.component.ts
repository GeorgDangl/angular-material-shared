import { Component, forwardRef, Inject, NgZone, OnInit, input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { EditorModule } from '@tinymce/tinymce-angular';
import { GuidGenerator } from '@dangl/angular-material-shared/guid-generator';
import { RawEditorOptions, Editor } from 'tinymce';
@Component({
    selector: 'dangl-tiny-mce',
    templateUrl: './tiny-mce.component.html',
    styleUrls: ['./tiny-mce.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TinyMceComponent),
            multi: true,
        }
    ],
    imports: [EditorModule]
})
export class TinyMceComponent implements OnInit, ControlValueAccessor {
  readonly tinyMceLanguageCode = input<string | undefined>(undefined);
  readonly additionalInit = input<Partial<RawEditorOptions> | undefined>(undefined);

  elementId = GuidGenerator.generatePseudoRandomGuid();
  editor!: Editor;
  init!: RawEditorOptions;
  private _editorContent = '';
  private _disabled = false;
  get editorContent(): string {
    return this._editorContent;
  }
  set editorContent(value: string) {
    if (value !== this._editorContent) {
      this._editorContent = value;
      this.ngZone.run(() => {
        // tinyMCE events are outside of the Angular zone
        // ngZone.run() makes sure everything runs in the
        // Angular zone, so it integrates in the Angular
        // lifecycle. Otherwise, e.g., 'required' validation
        // would not update on change
        this.onChangeCallback(value);
      });
    }
  }

  private onTouchedCallback: () => void = () => {};
  private onChangeCallback: (_: any) => void = () => {};

  constructor(
    @Inject('TINYMCE_BASE_URL') private baseUrl: string,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    const { setup, init_instance_callback, plugins, toolbar, ...restAdditional } = this.additionalInit || {};
    const defaultPlugins = ['link', 'table', 'image', 'code'];

    this.init = {
      selector:`#${this.elementId}`,
      plugins: [...defaultPlugins, ...(Array.isArray(plugins) ? plugins : [])].filter((v, i, a) => a.indexOf(v) === i),
      language: this.tinyMceLanguageCode,
      base_url: this.baseUrl,
      promotion: false,
      branding: false, // To disable 'POWERED BY TINYMCE' in footer
      setup: (editor: Editor) => {
        editor.on('change keyup', () => {
          const content = editor.getContent();
          this.editorContent = content;
        });
        if (setup) {
          setup(editor);
        }
      },
      init_instance_callback: (editor: Editor) => {
        if (editor && this.editorContent) {
          editor.setContent(this.editorContent);
        }
        this.editor = editor;
        this.setDisabledState(this._disabled);
        if (init_instance_callback) {
          init_instance_callback(editor);
        }
      },
      ...(toolbar ? { toolbar } : {}),
      ...restAdditional,
    };
  }

  writeValue(obj: any): void {
    obj = obj || '';
    this.editorContent = obj;
    if (!this.editor) {
      return;
    }
    const tinyMceContent = this.editor.getContent();
    if (tinyMceContent !== obj) {
      this.editor.setContent(obj);
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this._disabled = isDisabled;
    if (!this.editor) {
      return;
    }
    if (isDisabled) {
      this.editor.mode.set('readonly');
    } else {
      this.editor.mode.set('design');
    }
  }
}
