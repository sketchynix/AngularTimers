AngularTimers
=============

This service is a way to manage long-polling across multiple pages in AngularJS applications. 

Use case: You need to load data every few seconds on one page, but want it to stop or be paused when on another page.

#Use
  angular.module('yourApp', ['epTimer]);
  
  angular.controller('yourController', function($scope, Timer){
    
    /**
		 * @param {function} func 			Function to be called on a timer
		 * @param {int} interval    		Interval at which to call the function
		 * @param {bool} immediateStart		Should the function be called immediately, or wait the interval time to run
		 * @param {string} cancelEvent 		Event on which to cancel the timer (currently only resolve & pageChange supported)
		 * 
		 * @return int - Index of timer to cancel
		 */
    var t = Timer.add(function(){
			console.log('I get called every 5 seconds');
		}, 5000, true, 'pageChange');
		
		//Timer.cancel(t);
		//Timer.cancelAll();
		
  });

#Examples
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
