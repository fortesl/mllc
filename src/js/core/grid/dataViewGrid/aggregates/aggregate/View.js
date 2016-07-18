/**
 * @ngdoc Directive
 * @name reviJs.core.grid.dataViewGrid.aggregates.aggregate
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.aggregates.aggregate catch individual aggregate and pass to his parent.
 *
 * @Required
 * reviJs.core.grid.dataViewGrid.aggregates  Directive.
 *
 *  * @sample
 * <revi-aggregate></revi-aggregate>
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid.aggregates.aggregate');
    app.directive('reviAggregate', reviAggregate);

    function reviAggregate() {
        return {
            strict: 'E',
            scope: {
                field: "@",
                object: '=',
                formatter: "="
            },
            link: link,
            template: '',
            replace: true,
            require: '^reviAggregates',
        };

        function link($scope, element, attr, reviAggregatesController) {
            var aggregator;

            if ($scope.field) {
                aggregator = new $scope.formatter($scope.field);
            } else if ($scope.object) {
                aggregator = new $scope.formatter($scope.object);
            }

            if (aggregator) {
                reviAggregatesController.addAggregate(aggregator);
            }
        }
    }
})();