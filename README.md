# angular-material-shared
Shared components to be used in Angular Material apps.  
They may partially depend on styles used in [angular-material-styles](https://github.com/GeorgDangl/angular-material-styles).

## Usage

To use these styles in an Angular app, add this repository as a submodule to your project.  
Then, simply import the module:

    import { AngularMaterialSharedModule } from '../../angular-material-shared/src/angular-material-shared.module';

## Functionality

### Header

The `dangl-header` component can display a common header in all Dangl**IT** apps. It additionally supports to display an information if it is in a preview environment.

### Footer

There is a `dangl-footer` component that shows copyright info.

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
