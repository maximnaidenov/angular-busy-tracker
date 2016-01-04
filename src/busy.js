angular.module('mnBusy',[])
.factory('busyTrackerFactory',['$timeout','$q',
  function($timeout,$q) {
    return function() {
      var tracker = {};
      tracker.delayPromise = null;
      tracker.durationPromise = null;
      tracker.processingPromise = null;
      tracker.busyPromise = null;

      tracker.reset = function(options) {
        // prepare tracked promises
        var promises = [];
        angular.forEach(options.promises,function(promise) {
          // skip invalid values
          if (!promise || typeof promise.then === 'undefined') {
            return;
          }
          // skipp already tracked promises
          if (promises.indexOf(promise) !== -1) {
            return;
          }
          promises.push(promise);
        });

        // nothing to track => no need to wait
        if (promises.length === 0) {
          return;
        }

        // start all delays
        options.delay = options.delay || 0;
        tracker.delayPromise = $timeout(function() {},parseInt(options.delay,10));
        tracker.delayPromise.then(
          function() {
            // delay timer expired
            tracker.delayPromise = null;
            options.minDuration = options.minDuration || 0;
            tracker.durationPromise = $timeout(
              function() {
                // minDuration timer expired
                tracker.durationPromise = null;
              },parseInt(options.minDuration,10));

            // start busy promise
            tracker.busyPromise =
              $q.all([tracker.durationPromise,tracker.processingPromise]).then(
                function() {
                  // busy promise expired
                  tracker.busyPromise = null;
                  if (options.onReady) {
                    options.onReady();
                  }
                }
              );
          },
          function() {
            // delay timer was canceled
            tracker.delayPromise = null;
            if (options.onReady) {
              options.onReady();
            }
          }
        );

        // track all promises at once
        tracker.processingPromise =
          $q.all(promises).then(
            function() {
              // progress promise expired => process it
              progressExpired();
            },
            function() {
              // progress promise was canceled => process it
              progressExpired();
            }
          );

        function progressExpired() {
          tracker.processingPromise = null;
          if ( tracker.delayPromise !== null) {
            // processing finioshed before delay is over => cancel delay and go on
            $timeout.cancel(tracker.delayPromise);
          }
        }
      };

      tracker.isBusy = function() {
        return tracker.delayPromise === null &&
          tracker.busyPromise !== null;
      };

      tracker.isActive = function() {
        return tracker.delayPromise !== null ||
          tracker.busyPromise !== null;
      };

      return tracker;
    };
  }
])
.directive('busyTracker',['$injector','busyTrackerFactory',
  function($injector,busyTrackerFactory){
    var config;

    function buildConfig(attrs){

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
        var busyConfigValueName = busyDefaultsName+
          busyConfigAttr.charAt(0).toUpperCase()+busyConfigAttr.slice(1);
        if($injector.has(busyConfigValueName)){
          angular.extend(config,$injector.get(busyConfigValueName));
        }
      }

      return config;
    }

    return {
      restrict: 'A',
      scope: true,
      transclude: true,
      templateUrl: function(tElement,tAttrs){
        config = buildConfig(tAttrs);
        return config.templateUrl;
      },
      link: function(scope,element,attrs) {
        // expose the tracker,config to template and children
        scope.$tracker = busyTrackerFactory();
        scope.$tracker.config = config;

        // watch the promises for change
        scope.$watchCollection(attrs['busyTracker'],function(promises) {
          // normalize to array of promises
          if (!angular.isArray(promises)) {
            promises = [promises];
          }

          // start tracker if not already running
          // skip reseting when some promise expires and is removed
          // specially handle the case when last promise is removed but
          // trackes has just expred and is marked inactive
          if (!scope.$tracker.isActive() && promises.length > 0) {
            scope.$tracker.reset({
              promises: promises,
              delay: config.delay,
              minDuration: config.minDuration,
              onReady: function() {
                var busyReadyExp = attrs['busyReady'];
                if (busyReadyExp) {
                  scope.$parent.$eval(busyReadyExp);
                }
              }
            });
          }
        },true);

        // watch params for change
        var busyParams = attrs['busyParams'];
        if (busyParams) {
          scope.$watchCollection(busyParams,function(params) {
            scope.$tracker.params = params;
          },true);
        }
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
