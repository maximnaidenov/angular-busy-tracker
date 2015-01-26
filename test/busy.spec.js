describe('util: busy', function() {

    // ng and ngMock modules are loaded by default, all others should be specified explicitly
    beforeEach(module('busy',
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

    describe('directive: busy', function() {
        var $scope,$compile,$q,$timeout,$templateCache,$provide;
        
        beforeEach(inject(
            function(_$rootScope_,_$compile_,_$q_,_$timeout_,_$templateCache_) {
                $scope = _$rootScope_;
                $compile = _$compile_;
                $q = _$q_;            
                $timeout = _$timeout_;
                $templateCache = _$templateCache_;
                
                $templateCache.put('template.html', 
                    '<div><div ng-if="$tracker.isBusy()">test</div></div>');   
                $templateCache.put('paramsTemplate.html', 
                    '<div>{{$params.message}}</div>'); 
        }));
        
        // test attribute parsig, template loading, tracking
        // test no delay, no min duration -> should show as long as promise is active
        it('should show during promise', function() {
        
            var element = $compile(
                    '<div busy-tracker="testPromise"></div>')($scope);
            
            var testDeferred = $q.defer();
            $scope.testPromise = testDeferred.promise;
            $scope.$digest();

            //ensure the elements are added
            expect(element.children().length).toBe(1); 

            // ensure busy indicator is shown as promise is ongoing
            expect(element.text()).toBe('test');
            
            testDeferred.resolve();            
            $scope.$digest();

            //ensure busy is not shown as the promise is resolved
            expect(element.text()).toBe('');
	});
        
        // test with self-cleaning promise array
        it('should show during dynamic promise array', function() {
        
            var trackPromises = function(promiseArray,newPromise){
                promiseArray.push(
                        newPromise.then(function(){
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

            //ensure the elements are added
            expect(element.children().length).toBe(1); 

            // ensure busy indicator is shown as both promises are ongoing
            expect(element.text()).toBe('test');
            
            // resolve and remove the first promise
            testDeferred1.resolve();            
            $scope.$digest();

            // ensure busy indicator is still shown as second promises is still ongoing
            expect(element.text()).toBe('test');
            
            // resolve and remove the second promise
            testDeferred2.resolve();            
            $scope.$digest();
            
            //ensure busy is not shown as all promises are resolved
            expect(element.text()).toBe('');
	});
       
        // test config parsing and extending
        // test delay and duration handling 
	it('should handle delay and min duration', function() {
                
            var element = $compile(
                '<div busy-tracker="testPromise" \n\
                    busy-config="DelayDuration"></div>')($scope);

            var testDeferred = $q.defer();
            $scope.testPromise = testDeferred.promise;
            $scope.$digest();

            //ensure the elements are added
            expect(element.children().length).toBe(1); 

            $timeout.flush(99);

            //ensure busy is not shown as delay is pending
            expect(element.text()).toBe('');
            
            $timeout.flush(2);
            
            // ensure busy indicator is shown as delay is over
            expect(element.text()).toBe('test');
            
            testDeferred.resolve();            
            $scope.$digest();
            
            $timeout.flush(98);
            
            // ensure busy indicator is shown as min duration is pending
            expect(element.text()).toBe('test');
            
            $timeout.flush(2);
            
            //ensure busy is not shown as min duration is over
            expect(element.text()).toBe('');
	});
        
        // test params parsing and interpolation
        it('should handle params', function() {
                
            var element = $compile(
                '<div busy-tracker="testPromise" \n\
                    busy-config="Params" \n\
                    busy-param-message="test_message"></div>')($scope);
            
            $scope.$digest();
            
            expect(element.text()).toBe('test_message');
        });
        
        // test busy-ready handling
        it('should handle busy-ready', function() {

            $scope.test = {key: 'old_value'};
            var element = $compile(
                '<div busy-tracker="testPromise" \n\
                    busy-ready="test.key=\'new_value\'"></div>')($scope);
                        
            var testDeferred = $q.defer();
            $scope.testPromise = testDeferred.promise;
            $scope.$digest();
            
            testDeferred.resolve();            
            $scope.$digest();
            
            expect($scope.test.key).toBe('new_value');
        });
    });
});

