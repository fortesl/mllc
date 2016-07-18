reviJs.core.control.directive('reviControlBreadcrumb', ['$parse', function ($parse) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            reviModel: '=',
            reviTransformer: '='
        },
        template : '<div ng-include="getInputTemplateResource()"></div>',
        link: function (scope, element, attrs) {
            scope.levels = [];

            scope.$watch("reviModel", function (value, oldValue) {
                if (angular.isDefined(value) && angular.isDefined(scope.reviTransformer)) {
                    scope.levels = scope.reviTransformer(value);
                }else{
                    scope.levels = value;
                }
            });

            scope.getInputTemplateResource = function() {
                var resource = '';
                switch(attrs.type) {
                    default:
                    case 'link':
                        resource = 'core/control/breadcrumb/breadcrumb.html';
                        break;
                    case 'text':
                        resource = 'core/control/breadcrumb/textBreadcrumb.html';
                        break;
                }
                return resource;
            }
        }
    };
}]);