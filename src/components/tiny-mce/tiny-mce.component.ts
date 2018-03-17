import { Component, AfterViewInit, OnDestroy, Output, EventEmitter, forwardRef, Inject } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, Validator, FormControl, AbstractControl, NgModel } from '@angular/forms';
import { GuidGenerator } from '../utils/guid-generator/guid-generator';

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

  elementId = GuidGenerator.generatePseudoRandomGuid();
  editor: any;
  private _editorContent: string;
  get editorContent(): string {
    return this._editorContent;
  }
  set editorContent(value: string) {
    if (value !== this._editorContent) {
      this._editorContent = value;
      this.onChangeCallback(value);
    }
  }

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor(@Inject('TINYMCE_SKIN_URL') private skinUrl: string) { }

  ngAfterViewInit() {
    tinymce.init({
      selector: '#' + this.elementId,
      plugins: ['link', 'paste', 'table', 'image', 'code'],
      skin_url: this.skinUrl,
      branding: false, // To disable 'POWERED BY TINYMCE' in footer
      setup: editor => {
        this.editor = editor;
        editor.on('change', () => {
          const content = editor.getContent();
          this.editorContent = content;
        });
      },
    });
  }

  ngOnDestroy() {
    tinymce.remove(this.editor);
  }

  writeValue(obj: any): void {
    if (!this.editor) {
      return;
    }
    obj = obj || '';
    const tinyMceContent = this.editor.getContent();
    if (tinyMceContent !== obj) {
      this.editor.setContent(obj);
    }
    this.editorContent = obj;
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
