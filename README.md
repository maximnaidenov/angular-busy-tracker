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
Place the content inside the busy tracker directive.
```html
<div busy-tracker="loadingPromises"
     busy-config="overlay">
    ...your content goes here...
</div>
```
[Live](http://codepen.io/maximnaidenov/pen/azLWww)

###Show a spinner in a button 
Place the busy tracker directive as attribute on the button. Template could access any parameter provided as attribute **busy-param-\<name\>** over the **$params** object. So to provided the button text that is shown next to the spinner in the default button template simply set it to **busy-param-message** attribute.
```html
<button ng-click="save()"
        busy-tracker="savingPromises"
        busy-config="button"
        busy-param-message="Saving...">
</button>
```
[Live](http://codepen.io/maximnaidenov/pen/MYEaJO)

###Change the delay and min duration
Options are provided by redefining the **busyDefault** value object.
```javascript
angular.module('yourApp')
.value('busyDefaults',{
    delay: 300,
    minDuration: 400
});
```
Every configuration has a value object with name **busyDefault\<Name\>** that could override default options.
```javascript
angular.module('yourApp')
.value('busyDefaultsOverlay',{
    delay: 100
});
```

###Custom template - overlay spinner with spin.js
Template url is also an option in value object. So you could provide custom template and reference it from a new value object.
The spinjs example below uses [angular-spinner](https://github.com/urish/angular-spinner) to enclose [spin.js](https://github.com/fgnass/spin.js) so add them.
```html
<script src="spin.js" type="text/javascript"></script> 
<script src="angular-spinner.js" type="text/javascript"></script> 
```
For best performance preload the template in angular **$templateCache**. Configurations from the value objects are available on **$config** object
```html
<script type="text/ng-template" id="spinjs.html">
 <div class="busy-overlay-container">
   <div ng-if="$tracker.isBusy()">
     <span class="busy-overlay-sign" us-spinner="$config.options"></span>
     <div class="busy-overlay-backdrop"></div>
   </div>
   <div ng-transclude></div>
 </div>
</script>
```
Define a new value object and set the templateUrl. Provide any custom configurations.
```javascript
angular.module('yourApp')
.value('busyDefaultsSpinjs',{
    templateUrl: 'spinjs.html',
     options: {lines: 9, radius: 11, width:5, length: 9}
});
```
And simply request the new configuration in busy-config attribute.
```html
<button ng-click="save()"
        busy-tracker="savingPromises"
        busy-config="spinjs">
</button>
```
[Live](http://codepen.io/maximnaidenov/pen/QwqgLE)

###Disable the button
Tracker state is available on **$tracker** object. So the button could be disabled while the promise is pending by binding its ng-disabled attribute to **tracker.isBusy()**
```html
<button type="button" class="btn btn-default" ng-click="save()" 
                    busy-tracker="promise"
                    busy-config="button"
                    busy-param-message="Saving..."
                    ng-disabled="$tracker.isBusy()">Save</button> 
```
[Live](http://codepen.io/maximnaidenov/pen/ZYXKRB)

###Ready expression
If a **busy-ready** attribute is defined, its value will be evaluated as angular expression once the tracked promise is resolved. This expression will be evaluated in directive scope so use **$parent** to access the parent scope when setting primitive values.
```html
<button type="button" class="btn btn-default" ng-click="save()" 
                    busy-tracker="promise"
                    busy-config="Button"
                    busy-param-message="Saving..."
                    busy-ready="$parent.showReady=true">Save</button>
```
[Live](http://codepen.io/maximnaidenov/pen/ZYXKXO)

##Change log
**1.1.0** - 8/02/2015
* Bundled templates are preloded in template cache
* One css for all bundled templates
* Config names could be lowercase

**1.0.0** - 5/02/2015
* initial release

##License
[MIT](https://github.com/maximnaidenov/angular-busy-tracker/blob/master/LICENSE)
