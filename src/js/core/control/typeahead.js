reviJs.core.control.directive('typeaheadOnFocus', function () {
    return {
        require: ['ngModel'],
        link: function (scope, element, attr, ctrls) {
            element.bind('focus', function () {
                ctrls[0].$setViewValue(ctrls[0].$viewValue);
            });
        }
    };
});