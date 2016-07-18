reviJs.core.control.directive('reviControlRangeValidator', [function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            modelValue: '=reviControlRangeValidator',
            maxValue: '@',
            minValue: '@'
        },

        link: function (scope, elem, attrs, ctrl) {
            scope.$watch('modelValue', function (value) {
                if (value) {
                    var isValid = Number(value) >= Number(scope.minValue) && Number(value) <= Number(scope.maxValue)
                    ctrl.$setValidity(attrs.ngModel, isValid);
                }
            });
        }
    };

}]);
