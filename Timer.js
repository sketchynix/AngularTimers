/**
 * This service is meant to handle data that needs to be
 * reloaded at an interval and cancelled on app event types.
 *
 * Example use
 	pageChange event:

		Timer.add(function(){
			console.log('I get called every 5 seconds');
		}, 5000, true, 'pageChange');


	resolve event:

		Timer.add(function(){
			var d = $q.defer();
				if(1){
					console.log('I get resolved and then removed automatically');
					d.resolve();
				} else {
					d.reject();
				}
			});
			return d.promise;
		}, 5000, true, 'resolve');
 */
angular.module('epTimer', []).factory('Timer', function($rootScope, $timeout){
	"use strict";

	var timers = {},
		paused = false,
		i = 0;

	function cancelTimer(index){
		var exists = angular.isObject(timers[index]);
		if(exists){
			if(timers[index] !== null)
			$timeout.cancel(timers[index].cancel);
			delete timers[index];
		}

		return exists;
	};

	function cancelTimers(event){
		for (var timer in timers) {
  			if (timers.hasOwnProperty(timer) && timers[timer].event === event){
        		cancelTimer(timer);
        	}
        }
	}

	function pauseTimers(){
		paused = true;
	};

	function restartTimers(){
		paused = false;
	};

	/**
	 * Cancel any timers for the pageChange event
	 */
	$rootScope.$on('$locationChangeStart', function(){
		cancelTimers('pageChange');
		// cancelTimers('resolve');
    });

	// $rootScope.$on('pageHidden', pauseTimers);
	// $rootScope.$on('pageVisible', restartTimers);

	var prod = {
		/**
		 * @param {function} func 			Function to be called on a timer
		 * @param {int} interval    		Interval at which to call the function
		 * @param {bool} immediateStart		Should the function be called immediately, or wait the interval time to run
		 * @param {string} cancelEvent 		Event on which to cancel the timer (currently only resolve & pageChange supported)
		 */
		add: function(func, interval, immediateStart, cancelEvent){
			var method = function(){
					var removeTimer = false;
					if(!paused){
						removeTimer = func();
					}
					delete timers[i];

					if(cancelEvent !== 'resolve'){
						prod.add(func, interval, false, cancelEvent);
					} else {
						//for the management of timers that should be cancelled once their callback resolves correctly
						//image uploading
						removeTimer.then(function(){
							//Successfully deleted the timer
						}, function(){
							prod.add(func, interval, false, cancelEvent);
						});
					}
				};

			if(immediateStart === true){
				func();
			}

			timers[i] = {
				cancel:  $timeout(method, interval),
				event: cancelEvent,
				method: method,
				interval: interval,
				immediateStart: immediateStart
			};

			i+=1;

			return i-1;
		},

		cancel: function(index){
			return cancelTimer(index);
		},

		cancelAll: function(){
			pauseTimers();
			for (var timer in timers) {
				cancelTimer(timer);
			}
			restartTimers();
		}
	};

	return prod;
});