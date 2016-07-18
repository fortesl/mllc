reviJs.core.control.directive('reviControlModal', function () {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'core/layers/modal.html',
        scope: {
            reviMessage: '=',
            reviClick: '=',
            reviShow: '='
        }
    };
});