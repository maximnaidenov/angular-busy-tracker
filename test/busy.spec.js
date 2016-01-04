describe('Module mnBusy', function() {
  // ng and ngMock modules are loaded by default, all others should be specified explicitly
  beforeEach(angular.mock.module('mnBusy'));

  describe('factory: busyTrackerFactory',function() {
    var deferred,$timeout,tracker;

    beforeEach(inject(
      function($q,_$timeout_,busyTrackerFactory) {
        deferred = $q.defer();
        $timeout = _$timeout_;
        tracker = busyTrackerFactory();
      })
    );

    afterEach(function() {
      $timeout.verifyNoPendingTasks();
    });

    // test progress < delay
    it('should handle delay>0,duration>0,progress<delay',function() {
      // confgure the tracker
      var config = {
        delay: 100,
        minDuration: 100,
        promises: [deferred.promise],
        onReady: function() {}
      };
      spyOn(config,'onReady');
      tracker.reset(config);
      $timeout.flush(0);

      // initial state
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // still in delay period
      $timeout.flush(50);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // resolve before delay
      deferred.resolve();
      $timeout.flush(0);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).toHaveBeenCalled();

      // past delay period
      $timeout.flush(100);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);

      // past minDuration period
      $timeout.flush(100);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
    });

    // test progress > delay, progress < duration
    it('should handle delay>0,duration>0,progress>delay,progress<duration',function() {
      // confgure the tracker
      var config = {
        delay: 100,
        minDuration: 100,
        promises: [deferred.promise],
        onReady: function() {}
      };
      spyOn(config,'onReady');
      tracker.reset(config);
      $timeout.flush(0);

      // initial state
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // still in delay period
      $timeout.flush(50);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // past delay period
      $timeout.flush(100);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // resolve after delay and before minDuration
      deferred.resolve();
      $timeout.flush(0);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // past minDuration period
      $timeout.flush(100);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).toHaveBeenCalled();
    });

    // test progress > delay, progress > duration
    it('should handle delay>0,duration>0,progress>duration',function() {
      // confgure the tracker
      var config = {
        delay: 100,
        minDuration: 100,
        promises: [deferred.promise],
        onReady: function() {}
      };
      spyOn(config,'onReady');
      tracker.reset(config);
      $timeout.flush(0);

      // initial state
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // still in delay period
      $timeout.flush(50);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // past delay period
      $timeout.flush(100);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // past minDuration period
      $timeout.flush(100);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // resolve after delay and after minDuration
      deferred.resolve();
      $timeout.flush(0);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).toHaveBeenCalled();
    });

    // test delay = 0, duration > 0
    // test progress < duration
    it('should handle delay=0,duration>0,progress<duration',function() {
      // confgure the tracker
      var config = {
        delay: 0,
        minDuration: 100,
        promises: [deferred.promise],
        onReady: function() {}
      };
      spyOn(config,'onReady');
      tracker.reset(config);
      $timeout.flush(0);

      // initial state
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // still in duration period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // resolve before minDuration
      deferred.resolve();
      $timeout.flush(0);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // past minDuration period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).toHaveBeenCalled();
    });

    // test delay = 0, duration > 0
    // test progress > duration
    it('should handle delay=0,duration>0,progress>duration',function() {
      // confgure the tracker
      var config = {
        delay: 0,
        minDuration: 100,
        promises: [deferred.promise],
        onReady: function() {}
      };
      spyOn(config,'onReady');
      tracker.reset(config);
      $timeout.flush(0);

      // initial state
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // still in duration period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // past minDuration period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // resolve before minDuration
      deferred.resolve();
      $timeout.flush(0);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).toHaveBeenCalled();
    });

    // test delay > 0, duration = 0
    // test progress < delay
    it('should handle delay>0,duration=0,progress<delay',function() {
      // confgure the tracker
      var config = {
        delay: 100,
        minDuration: 0,
        promises: [deferred.promise],
        onReady: function() {}
      };
      spyOn(config,'onReady');
      tracker.reset(config);
      $timeout.flush(0);

      // initial state
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // still in duration period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // resolve before delay
      deferred.resolve();
      $timeout.flush(0);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).toHaveBeenCalled();

      // past delay period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
    });

    // test delay > 0, duration = 0
    // test progress > delay
    it('should handle delay>0,duration=0,progress>delay',function() {
      // confgure the tracker
      var config = {
        delay: 100,
        minDuration: 0,
        promises: [deferred.promise],
        onReady: function() {}
      };
      spyOn(config,'onReady');
      tracker.reset(config);
      $timeout.flush(0);

      // initial state
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // still in delay period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).not.toHaveBeenCalled();

      // past delay period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // resolve after delay
      deferred.resolve();
      $timeout.flush(0);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).toHaveBeenCalled();
    });

    // test dalay = 0, duration = 0
    it('should handle delay=0,duration=0,progress',function() {
      // confgure the tracker
      var config = {
        delay: 0,
        minDuration: 0,
        promises: [deferred.promise],
        onReady: function() {}
      };
      spyOn(config,'onReady');
      tracker.reset(config);
      $timeout.flush(0);

      // initial state
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // after minDuration period
      $timeout.flush(60);
      expect(tracker.isActive()).toBe(true);
      expect(tracker.isBusy()).toBe(true);
      expect(config.onReady).not.toHaveBeenCalled();

      // resolve
      deferred.resolve();
      $timeout.flush(0);
      expect(tracker.isActive()).toBe(false);
      expect(tracker.isBusy()).toBe(false);
      expect(config.onReady).toHaveBeenCalled();
    });
  });

  describe('directive: busy', function() {
    var $scope,$compile,$q,$timeout,$templateCache;

    // inject mock config
    beforeEach(angular.mock.module('mnBusy',
      function($provide){
        $provide.value('busyDefaults',{
            templateUrl: 'template.html'
        });
        $provide.value('busyDefaultsDelayDuration',{
            delay: 100,
            minDuration: 100
        });
        $provide.value('busyDefaultsParams',{
            templateUrl: 'paramsTemplate.html'
        });
      })
    );

    beforeEach(inject(
      function(_$rootScope_,_$compile_,_$q_,_$timeout_,_$templateCache_) {
        $scope = _$rootScope_;
        $compile = _$compile_;
        $q = _$q_;
        $timeout = _$timeout_;
        $templateCache = _$templateCache_;

        $templateCache.put('template.html',
          '<div ng-if="$tracker.isBusy()">test</div>');
        $templateCache.put('paramsTemplate.html',
          '<div>{{$tracker.params.message}}</div>');
    }));

    // test attribute parsig, template loading, single promise tracking
    // test default config parsing, specific config extending
    // test no delay, no min duration -> should show as long as promise is active
    it('should show during promise',function() {
      var element = $compile(
        '<div busy-tracker="testPromise"></div>')($scope);

      var testDeferred = $q.defer();
      $scope.testPromise = testDeferred.promise;
      $scope.$digest();
      $timeout.flush(0);  // this is because the delay timer should anyway be executed

      //ensure the elements are added
      expect(element.children().length).toBe(1);

      // ensure busy indicator is shown as promise is ongoing
      expect(element.children().eq(0).text()).toBe('test');

      testDeferred.resolve();
      $scope.$digest();

      // validate busy is not shown as the promise is resolved
      expect(element.children().length).toBe(0);
    });

    // test with self-cleaning promise array
    it('should show during dynamic promise array',function() {
      var trackPromises = function(promiseArray,newPromise) {
        promiseArray.push(
          newPromise.then(function() {
            promiseArray.splice(
              promiseArray.indexOf(newPromise),1);
          }));
      }

      var element = $compile(
        '<div busy-tracker="testPromises"></div>')($scope);

      var testDeferred1 = $q.defer();
      var testDeferred2 = $q.defer();
      $scope.testPromises = [];
      trackPromises($scope.testPromises,testDeferred1.promise);
      trackPromises($scope.testPromises,testDeferred2.promise);
      $scope.$digest();
      $timeout.flush(0);  // this is because the delay timer should anyway be executed

      //ensure the elements are added
      expect(element.children().length).toBe(1);

      // ensure busy indicator is shown as both promises are ongoing
      expect(element.children().eq(0).text()).toBe('test');

      // resolve and remove the first promise
      testDeferred1.resolve();
      $scope.$digest();

      // ensure busy indicator is still shown as second promises is still ongoing
      expect(element.children().eq(0).text()).toBe('test');

      // resolve and remove the second promise
      testDeferred2.resolve();
      $scope.$digest();

      // validate busy is not shown as the promise is resolved
      expect(element.children().length).toBe(0);
    });

    // test params parsing and interpolation
    // specific config extending
    it('should handle params',function() {
      var element = $compile(
        '<div busy-tracker="testPromise" busy-config="params"' +
          'busy-params="{\'message\':\'test_message\'}"></div>')($scope);

      $scope.$digest();

      expect(element.text()).toBe('test_message');
    });

    // test busy-ready handling
    it('should handle busy-ready',function() {
      $scope.test = {key: 'old_value'};
      $compile('<div busy-tracker="testPromise"' +
        'busy-ready="test.key=\'new_value\'"></div>')($scope);

      var testDeferred = $q.defer();
      $scope.testPromise = testDeferred.promise;
      $scope.$digest();
      $timeout.flush(0);  // this is because the delay timer should anyway be executed

      testDeferred.resolve();
      $scope.$digest();

      expect($scope.test.key).toBe('new_value');
    });
  });
});
