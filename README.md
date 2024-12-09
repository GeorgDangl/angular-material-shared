
# angular-material-shared

Shared components & styles to be used in Angular Material apps.

## Installation

Install as a dev dependency via [npm](https://www.npmjs.com/):

```bash
npm install --save-dev  @dangl/angular-material-shared
```

## Usage
To use these components in an Angular app, import components to your module or component. 

```javascript
import { FooterComponent, FooterOptions, HeaderComponent } from '@dangl/angular-material-shared';
import { GuidGenerator } from '@dangl/angular-material-shared/guid-generator';
import { TinyMceComponent } from '@dangl/angular-material-shared/tiny-mce';
```


### Demo

You can run `ng serve` in the `src/angular-material-shared-demo` folder to run a
demo locally. Make sure that the library was built first with `npm run build:library`.


## Styles

This package defines a common theme to be used in all Dangl**IT** apps.

Add this import to your global `styles.scss` file:

### For using Material 2

    @import '@dangl/angular-material-shared/styles/material-style.scss';

### For using Material 3

    @import '@dangl/angular-material-shared/styles/m3-theme.scss';

To access color variables, just use css var():
 Example: 
  background-color: var(--color-accent);
 Colors: var(--color-primary), var(--color-accent) , var(--color-warn) , var(--color-dark),var(--color-light)

### Fonts

The package also includes the `Roboto` font, which is the default font for Angular Material. To use it, add this import to your global `styles.scss` file:

    @import url(https://fonts.googleapis.com/css?family=Roboto:300,400,500);

### Icons

The package includes the `Material Icons` font. To use it, add this import to your global `styles.scss` file:

    @import url(https://fonts.googleapis.com/icon?family=Material+Icons);

### Errors During SCSS Import

Since Angular 13, importing styles via the SASS-Loaded from `node_modules` has been disabled, so you need to update the `angular.json` file with the following snippet at the `projects:PROJECT_NAME:architect:build:options` path:

```json
"stylePreprocessorOptions": {
  "includePaths": ["./node_modules"]
}
```

### Header

The `dangl-header` component can display a common header in all Dangl**IT** apps. It additionally supports to display an information if it is in a preview environment. The header supports right-aligned content via a projected `ng-content`.

You can optionally specify the logo initials by setting `logoInitials="GD"`. They default to `GD`. You can disable the logo by setting `[logoInitials]="null"`.

#### Header Logo

By setting the `iconUrl` value on the `dangl-header`, you can optionally specify an image to be displayed in the header.

### Footer

There is a `dangl-footer` component that shows copyright info.  
If the legal notice link is enabled, it can either be configured to route to a location or to emit an event when the legal notice is requested.

You can optionally pass in footer options as `[options]` to use custom values:

```typescript
FooterOptions {
    logoInitials?: string;
    copyrightUrl?: string;
    companyNameHtml?: string;
}
```

### TinyMCE Editor

A rich-text WYSIWYG editor is available as `dangl-tiny-mce` component. This one requires the package `tinymce` to be referenced and available as global variable. To make it available, add this to your `scripts` section in `.angular-cli.json`:

    "scripts": [
      "../node_modules/tinymce/tinymce.js"
    ]

Additionally, TinyMCE must load skins and other assets at runtime and requires the path to it. You can inject it in your `AppModule`:

    providers: [
      {
        provide: 'TINYMCE_BASE_URL',
        useValue: tinyMceBaseUrl // e.g. '/assets/tinymce-assets'
      }
    ]

Depending on your setup, you can copy these assets via a `postinstall` script in `package.json` to a folder in your app:

    "postinstall": "xcopy /I /E /Y node_modules\\@dangl\\angular-material-shared\\tinymce-assets src\\assets\\tinymce-assets"

Because the paths might be dependent on your environment, you can use the following helper:

    import { environment } from '../environments/environment';

    const tinyMceBaseUrl = environment.production
      ? '/dist/assets/tinymce-assets'
      : '/assets/tinymce-assets';

#### TinyMCE Dependencies

If you want to use the `TinyMCE` component, you need those two dependencies as well:

```
    "tinymce": "6.8.3",
    "@tinymce/tinymce-angular": "^8.0.0",
```

#### TinyMCE Localization / i18n

By default, the TinyMCE editors language is English. You can include other languages as well. This package includes all the language files. To use them, the following must be done:

1. Supply the url to the language file and the language code to the component:

   <dangl-tiny-mce tinyMceLanguageCode="de"></dangl-tiny-mce>

Available languages can be found here: https://www.tiny.cloud/get-tiny/language-packages/

### GuidGenerator

The `GuidGenerator` provides a static method to create pseudo-random Guids.


