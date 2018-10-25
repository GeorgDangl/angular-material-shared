import { Component, AfterViewInit, OnDestroy, forwardRef, Inject, NgZone, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { GuidGenerator } from '../../utils/guid-generator';

declare var tinymce: any;

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
  ]
})
export class TinyMceComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

  @Input() tinyMceLanguageUrl: string;

  elementId = GuidGenerator.generatePseudoRandomGuid();
  editor: any;
  private _editorContent: string;
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

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor(@Inject('TINYMCE_SKIN_URL') private skinUrl: string,
    private ngZone: NgZone) { }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table', 'image', 'code'],
      skin_url: this.skinUrl,
      language_url: this.tinyMceLanguageUrl,
      branding: false, // To disable 'POWERED BY TINYMCE' in footer
      setup: editor => {
        editor.on('change keyup', () => {
          const content = editor.getContent();
          this.editorContent = content;
        });
      },
      init_instance_callback: editor => {
        if (editor && this.editorContent) {
          editor.setContent(this.editorContent);
        }
        this.editor = editor;
      }
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
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
    throw new Error('Method not implemented.');
  }

}
