#angular-busy-tracker
Show flexible busy indicator on any element while a promise is pending. Inspired by [angular-busy](https://github.com/cgross/angular-busy)

##Features

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
Load the `mnBusy` module in your AngularJS application:
```javascript
angular.module('yourApp', ['mnBusy']);
```

##Usage
The bundled templates use *glyphicon-refresh* glyph from [Glyphicon](http://glyphicons.com) Halflings set that is bundled with [Bootstrap](http://getbootstrap.com/) so you need to add it:
```html
<link rel="stylesheet" href="bootstrap.css">
```

###Show an overlay spinner during content loading
Add loading template css:
```html
<link rel="stylesheet" href="loading.css">
```
Configure the busy tracker:
```javascript
angular.module('yourApp')
.value('busyDefaults',{
    delay: 200,
    minDuration: 500
})
.value('busyDefaultsLoading',{
    templateUrl:'loading.html'
});
```
Place the busy tracker directive to enclose the content:
```html
<div busy-tracker="loadingPromises"
     busy-config="Loading">
    ...your content goes here...
</div>
```

###Show a spinner in a button during content saving
Add loading template css:
```html
<link rel="stylesheet" href="saving-button.css">
```
Configure the busy tracker:
```javascript
.value('busyDefaults',{
    delay: 200,
    minDuration: 500
})
.value('busyDefaultsSavingButton',{
    message: 'Saving...',
    templateUrl:'saving-button.html'
});
```
Place the busy tracker directive as attribute on the button:
```html
<button ng-click="save()"
        busy-tracker="savingPromises"
        busy-config="SavingButton">
</button>
```
##[Further Examples ](http://maximnaidenov.github.io/angular-busy-tracker/)

##Change log
[Releases](https://github.com/maximnaidenov/angular-busy-tracker/blob/master/CHANGELOG.md)

##License
[MIT](https://github.com/maximnaidenov/angular-busy-tracker/blob/master/LICENSE)
