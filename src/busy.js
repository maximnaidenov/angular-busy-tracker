angular.module('busy',[]);

//inspired by angular-busy-tracker
angular.module('busy').factory('busyTrackerFactory',
    ['$timeout','$q',function($timeout,$q){
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
                if(options.onReadyFn)
                    options.onReadyFn();
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
            return tracker.processingPromise !== null
        }
        
        return tracker;
    };
}]);

angular.module('busy').directive('busyTracker',
    ['$injector','busyTrackerFactory',
    function($injector,busyTrackerFactory){        
                     
        var buildConfig = function(attrs){
            
            // start with empty config
            var config = {};
            
            // add global defaults      
            var busyDefaultsName = 'busyDefaults';
            if ($injector.has(busyDefaultsName)){
                angular.extend(config,
                    $injector.get(busyDefaultsName));
            }

            // add instance configs
            var busyConfigName = 'busyConfig';
            if (attrs[busyConfigName] && 
                $injector.has(busyDefaultsName+attrs[busyConfigName])){
                angular.extend(config,
                    $injector.get(busyDefaultsName+attrs[busyConfigName]));
            }
            
            // add ready expression
            var busyReadyName = 'busyReady';
            if (attrs[busyReadyName]){
                config.onReadyExp = attrs[busyReadyName];                            
            }    
                        
            return config;
        }
        
        var buildParams = function(attrs){
            var params = {};
            var paramPrefix = 'busyParam';
            for (attrName in attrs){
                if (attrName.indexOf(paramPrefix) !== -1){
                    var paramName = attrName.substr(paramPrefix.length).toLowerCase();
                    params[paramName] = attrs[attrName];
                }
            }
            
            return params;
        }
        
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
]);