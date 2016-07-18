reviJs.core.menu.directive('reviMenu', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            reviModel: '='
        },
        templateUrl: 'core/menu/menu.html',
        controller: 'reviJs.core.menu.Controller'
    };
});