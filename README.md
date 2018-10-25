# angular-material-shared
Shared components & styles to be used in Angular Material apps.  

## Usage

To use these styles in an Angular app, add this package to your project. It's published as `@dangl/angular-material-shared`.
Then, simply import the module:

    import { AngularMaterialSharedModule } from '@dangl/angular-material-shared';

### Demo

You can run `ng serve` in the `src/angular-material-shared-demo` folder to run a
demo locally. Make sure that the library was built first with `npm run build:library`.

## Functionality

## Styles

This package defines a common theme to be used in all Dangl**IT** apps.

Add this import to your global `styles.scss` file:

    @import '~@dangl/angular-material-shared/styles/material-style.scss';

To access color variables, you can add this import to any file:

    @import '~@dangl/angular-material-shared/styles/material-variables.scss';
    // Provides the following colors:
    $color-primary: mat-color($dangl-app-primary);
    $color-accent:  mat-color($dangl-app-accent);
    $color-warn:    mat-color($dangl-app-warn);
    $color-dark: #3b4c55;
    $color-light: #bdbdbd;

### Header

The `dangl-header` component can display a common header in all Dangl**IT** apps. It additionally supports to display an information if it is in a preview environment. The header supports right-aligned content via a projected `ng-content`.

### Footer

There is a `dangl-footer` component that shows copyright info.  
If the legal notice link is enabled, it can either be configured to route to a location or to emit an event when the legal notice is requested.

### TinyMCE Editor

A rich-text WYSIWYG editor is available as `dangl-tiny-mce` component. This one requires the package `tinymce` to be referenced and available as global variable. To make it available, add this to your `scripts` section in `.angular-cli.json`:

    "scripts": [
      "../node_modules/tinymce/tinymce.js",
      "../node_modules/tinymce/themes/modern/theme.js",
      "../node_modules/tinymce/plugins/link/plugin.js",
      "../node_modules/tinymce/plugins/paste/plugin.js",
      "../node_modules/tinymce/plugins/table/plugin.js",
      "../node_modules/tinymce/plugins/image/plugin.js",
      "../node_modules/tinymce/plugins/code/plugin.js"
    ]

Additionally, TinyMCE must load skins at runtime and requires the path to it. You can inject it in your `AppModule`:

    providers: [
      {
        provide: 'TINYMCE_SKIN_URL',
        useValue: tinyMceSkinUrl
      }
    ]

Depending on your setup, you can copy these skins via a `postinstall` script in `package.json` to a folder in your app:

    "postinstall": "xcopy /I /E /Y node_modules\\tinymce\\skins src\\assets\\skins"

Because the paths might be dependent on your environment, you can use the following helper:

    import { environment } from '../environments/environment';

    const tinyMceSkinUrl = environment.production
      ? '/dist/assets/skins/lightgray'
      : '/assets/skins/lightgray';

#### TinyMCE Localization / i18n

By default, the TinyMCE editors language is English. You can include other languages as well. To do so, the following must be done:

  1. The package `tinymce-i18n` should be referenced in your `package.json`, to automatically get all language files for TinyMCE
  2. The language files should be available in your assets folder (or any other accessible location). You can use a `postinstall` script to copy them, just as with the regular assets:  

    "postinstall": "xcopy /I /E /Y node_modules\\tinymce\\skins src\\assets\\skins&&xcopy /I /E /Y node_modules\\tinymce-i18n\\langs src\\assets\\tinymce-langs"

  3. Supply the url to the language file to the component:

    <dangl-tiny-mce tinyMceLanguageUrl="/assets/tinymce-langs/de.js"></dangl-tiny-mce>

Available language can be found here: https://www.tiny.cloud/get-tiny/language-packages/

### GuidGenerator

The `GuidGenerator` provides a static method to create pseudo-random Guids.
