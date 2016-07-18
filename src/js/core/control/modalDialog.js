reviJs.core.control.directive('reviControlModalDialog', function () {
    return {
        restrict: 'E',
        scope: {show: '='},
        replace: true,
        transclude: true,
        link: function (scope, element, attrs) {
            scope.hideModal = function () {
                scope.show = false;                
            };
        },
        templateUrl: 'core/control/modaldialog/modalDialog.html'
    };
});