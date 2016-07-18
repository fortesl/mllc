//Validates a date value using the momentjs library 'isValidity' method.
//Expects a dateFormat string to be passed in as attribute.
reviJs.core.control.directive('reviControlDateFieldValidator', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
       // scope: {},
        link: function (scope, elem, attrs, ngModelCtrl) {

            //For DOM -> model validation
            ngModelCtrl.$parsers.unshift(function (value) {
                var valid = scope.validateDate(elem.val(), attrs.reviControlDateFieldValidator);
                ngModelCtrl.$setValidity('validDate', valid);
                return valid ? value : undefined;
            });

            scope.validateDate = function (date, format) {
                if (!date.length) {
                    return true;
                }
                else {
                    return moment(date, format.toUpperCase(), true).isValid();
                }
            };

        }
    };

}]);
