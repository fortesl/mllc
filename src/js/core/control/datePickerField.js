﻿(function () {
    var app = angular.module('reviJs.core.control');
    app.directive('reviControlDatePickerField', directive);

    function directive($rootScope) {
        return {
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            scope: {
                ngRequired: '=',
                ngDisabled: '=',
                reviDateDisabled: '=',
                reviReadOnly: '=',
                ngModel: '=',
                reviCloseText: '@',
                reviPlaceholder:'@',
                reviTooltip: '@',
                ngChange: '=',
                reviButtonClass: '@'
            },
            link: link,
            templateUrl: 'core/control/datePicker/datePickerField.html',
        };

        function link(scope, element, attrs, ctrl) {
        	  scope.today = function() {
        		    scope.dt = scope.ngModel;
        		  };
        		  scope.today();

        		  scope.clear = function() {
        		    scope.dt = null;
        		  };

//        		  scope.inlineOptions = {
//        		    customClass: getDayClass,
//        		    minDate: new Date(),
//        		    showWeeks: false
//        		  };

        		  scope.reviDateDisabledFix = function(date) {
                  	var date=new Date(date);
                      var dateOnlyNoTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);

                      return scope.ngDisabled ? true : scope.reviDateDisabled(dateOnlyNoTime);
                  };
                  
//                  scope.dateOptions = {
//              		    formatYear: 'yy',
//              		    maxDate: new Date(2020, 5, 22),
//              		    minDate: new Date(),
//              		    startingDay: 4,
//              		    showWeeks: false
//              		  };
//        		
//        		  // Disable weekend selection
//        		  function disabled(data) {
//        		    var date = data.date,
//        		      mode = data.mode;
//        		    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
//        		  }
//
//        		  scope.toggleMin = function() {
//        		    scope.inlineOptions.minDate = scope.inlineOptions.minDate ? null : new Date();
//        		    scope.dateOptions.minDate = scope.inlineOptions.minDate;
//        		  };
//
//        		  scope.toggleMin();
//
//        		  scope.setDate = function(year, month, day) {
//        		    scope.dt = new Date(year, month, day);
//        		  };

        		  scope.formats = [reviJs.configParams.defaultDateFormat];//['MM/dd/yyyy'];
        		  scope.format = scope.formats[0].toLowerCase().replace("mm", "MM");
        		  scope.altInputFormats = ['M!/d!/yyyy'];

        		 

//        		  var tomorrow = new Date();
//        		  tomorrow.setDate(tomorrow.getDate() + 1);
//        		  var afterTomorrow = new Date();
//        		  afterTomorrow.setDate(tomorrow.getDate() + 1);
//        		  scope.events = [
//        		    {
//        		      date: tomorrow,
//        		      status: 'full'
//        		    },
//        		    {
//        		      date: afterTomorrow,
//        		      status: 'partially'
//        		    }
//        		  ];
//
//        		  function getDayClass(data) {
//        		    var date = data.date,
//        		      mode = data.mode;
//        		    if (mode === 'day') {
//        		      var dayToCheck = new Date(date).setHours(0,0,0,0);
//
//        		      for (var i = 0; i < scope.events.length; i++) {
//        		        var currentDay = new Date(scope.events[i].date).setHours(0,0,0,0);
//
//        		        if (dayToCheck === currentDay) {
//        		          return scope.events[i].status;
//        		        }
//        		      }
//        		    }
//
//        		    return '';
//        		  }
            scope.open = function ($event) {
                $rootScope.$broadcast('closeDatePickers');
                scope.opened = true;
            };

            scope.close = function() {
                scope.opened = false;
            }
            


            scope.$on('closeDatePickers', scope.close);

            // NOTE: Sometimes a time is added by the datepicker, it is the current time (even with another day selected).  Truncate it out.
            

        }
    }
    directive.$inject = [
        '$rootScope'
    ];
})();