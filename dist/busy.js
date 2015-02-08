angular.module('mnBusy',[])
.factory('busyTrackerFactory',['$timeout','$q',
  function($timeout,$q){
    return function(){

      var tracker = {};
      tracker.delayPromise = null;
      tracker.durationPromise = null;
      tracker.processingPromise = null;

      tracker.reset = function(options){

        // prepare tracked promises
        var promises = [];
        angular.forEach(options.promises,function(promise){
          // skipp invalid values
          if (!promise || typeof promise.then === 'undefined') {
            return;
          }

          // skipp already tracked promises
          if (promises.indexOf(promise) !== -1){
            return;
          }
          promises.push(promise);
        });

        // nothing to track => no need to wait
        if (promises.length === 0){
          return;
        }

        // start all delays
        if (options.delay) {
          tracker.delayPromise = $timeout(function(){
            tracker.delayPromise = null;
          },parseInt(options.delay,10));
        }
        if (options.minDuration) {
          tracker.durationPromise = $timeout(function(){
            tracker.durationPromise = null;
          },parseInt(options.minDuration,10) +
          (options.delay ? parseInt(options.delay,10) : 0));
        }

        tracker.processingPromise = $q.all(promises).then(function(){
          if(options.onReadyFn){
            options.onReadyFn();
          }
          tracker.processingPromise = null;
        },function(){
          tracker.processingPromise = null;
        });
      };

      tracker.isBusy = function(){
        return tracker.delayPromise === null &&(
          tracker.durationPromise !== null ||
          tracker.processingPromise !== null);
        };

        tracker.isActive = function(){
          return tracker.processingPromise !== null;
        };

        return tracker;
      };
    }
  ])
.directive('busyTracker',['$injector','busyTrackerFactory',
  function($injector,busyTrackerFactory){

    var buildConfig = function(attrs){

      // start with empty config
      var config = {};

      // add global defaults
      var busyDefaultsName = 'busyDefaults';
      if ($injector.has(busyDefaultsName)){
        angular.extend(config,$injector.get(busyDefaultsName));
      }

      // add instance configs
      var busyConfigAttr = attrs['busyConfig'];
      if (busyConfigAttr){
        var busyConfigValueName = busyDefaultsName+busyConfigAttr.charAt(0).toUpperCase();
        if($injector.has(busyConfigValueName)){
          angular.extend(config,$injector.get(busyConfigValueName));
        }
      }

      // add ready expression
      var busyReadyAttr = attrs['busyReady'];
      if (busyReadyAttr){
        config.onReadyExp = busyReadyAttr;
      }

      return config;
    };

    var buildParams = function(attrs){
      var params = {};
      var paramPrefix = 'busyParam';
      var attrName;
      for (attrName in attrs){
        if (attrName.indexOf(paramPrefix) !== -1){
          var paramName = attrName.substr(paramPrefix.length).toLowerCase();
          params[paramName] = attrs[attrName];
        }
      }

      return params;
    };

    return {
      restrict: 'A',
      scope: true,
      transclude: true,
      templateUrl: function(tElement,tAttrs){
        return buildConfig(tAttrs).templateUrl;
      },
      link: function(scope,element,attrs) {

        // expose the tracker,config and params for template
        // attrs are
        scope.$tracker = busyTrackerFactory();
        scope.$config = buildConfig(attrs);
        scope.$params = buildParams(attrs);

        // watch the promises for change
        scope.$watchCollection(attrs['busyTracker'],function(promises){

          // normalize to array of promises
          if (!angular.isArray(promises)){
            promises = [promises];
          }

          // start tracker if not already running
          // skip reseting when some promise expires and is removed
          // specially handle the case when last promise is removed but
          // trackes has just expred and is marked inactive
          if (!scope.$tracker.isActive() && promises.length>0){

            scope.$tracker.reset({
              promises:promises,
              delay:scope.$config.delay,
              minDuration: scope.$config.minDuration,
              onReadyFn: (scope.$config.onReadyExp ?
                function(){
                  scope.$eval(scope.$config.onReadyExp);
                }: null)
            });
          }
        },true);
      }
    };
  }
])
.value('busyDefaults',{
    delay: 200,
    minDuration: 500
})
.value('busyDefaultsButton',{
    templateUrl:'mnBusy/button.html'
})
.value('busyDefaultsOverlay',{
    templateUrl:'mnBusy/overlay.html'
});

angular.module('mnBusy').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('mnBusy/button.html',
    "<div><div ng-if=\"$tracker.isBusy()\"><span class=\"glyphicon glyphicon-refresh glyphicon-spin\"></span> {{$params.message}}</div><div ng-if=\"!$tracker.isBusy()\"><div ng-transclude></div></div></div>"
  );


  $templateCache.put('mnBusy/overlay.html',
    "<div class=\"busy-overlay-container\"><div ng-if=\"$tracker.isBusy()\"><span class=\"glyphicon glyphicon-refresh glyphicon-spin busy-overlay-sign\"></span><div class=\"busy-overlay-backdrop\"></div></div><div ng-transclude></div></div>"
  );

}]);
