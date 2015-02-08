#angular-busy-tracker
Show flexible busy indicator on any element while a promise is pending. Inspired by [angular-busy](https://github.com/cgross/angular-busy) and [angular-promise-tracker](https://github.com/ajoslin/angular-promise-tracker).

##Features
* Flexible templates, easily accommodate overlay and in-line busy indicators.
* All visual content comes from templates, no hardcoded DOM manipulations.
* Generic and consistent interface simplifies extensions.
* Tracked promise is simply passed to directive, no need for string ids.

##Installation

Download the code from [target folder](target/) or install it using bower:
```sh
$ bower install angular-busy-tracker
```
Load the library in your markup:
```html
<script type="text/javascript" src="angular.js"></script>
<script type="text/javascript" src="angular-busy-tracker.js"></script>
```
Add the bundled templates css:
```html
<link rel="stylesheet" href="overlay.css">
```
The bundled templates use **glyphicon-refresh** glyph from [Glyphicon](http://glyphicons.com) Halflings set that comes with [Bootstrap](http://getbootstrap.com/) so add it:
```html
<link rel="stylesheet" href="bootstrap.css">
```
Load the `mnBusy` module in your AngularJS application:
```javascript
angular.module('yourApp', ['mnBusy']);
```

##Usage

###Show an overlay spinner
Place the content inside the busy tracker directive:
```html
<div busy-tracker="loadingPromises"
     busy-config="Overlay">
    ...your content goes here...
</div>
```

###Show a spinner in a button
Place the busy tracker directive as attribute on the button:
```html
<button ng-click="save()"
        busy-tracker="savingPromises"
        busy-config="Button"
        busy-param-message="Saving">
</button>
```

###Change the delay and min duration
```javascript
angular.module('yourApp')
.value('busyDefaults',{
    delay: 200,
    minDuration: 500
});
```
##[More Examples and Docs ](http://maximnaidenov.github.io/angular-busy-tracker/)

[Codepen Collection](http://codepen.io/collection/DKpPMZ/)

##Change log
**1.1.0** - 8/02/2015
* Bundled templates are preloded in template cache
* One css for all bundled templates
* Config names could be lowercase

**1.0.0** - 5/02/2015
* initial release

##License
[MIT](https://github.com/maximnaidenov/angular-busy-tracker/blob/master/LICENSE)
