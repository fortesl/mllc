(function() {
    'use strict';

    reviJs.core.control.
        directive('reviControlMinMaxValidator', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                minValue: '=reviControlMinMaxValidator',
                minField: '@',
                reviSetFieldStatus: '='
            },
            link: function (scope, element, attrs, ngModelCtrl) {
                ngModelCtrl.$validators.minMax = function(modelValue) {
                    var valid;
                    if ('undefined' === typeof scope.minValue || modelValue === null) {
                        valid = true;
                    }
                    else {
                        valid = Number(modelValue) >= Number(scope.minValue);
                    }

                    if (angular.isFunction(scope.reviSetFieldStatus)) {
                        scope.reviSetFieldStatus(scope.minField, valid);
                    }

                    return valid;
                };

                scope.$watch('minValue', function() {
                    ngModelCtrl.$validate();
                });
            }
        };

    }]);

})();