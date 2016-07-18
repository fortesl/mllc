/**
 * @ngdoc Directive
 * @name reviJs.core.grid.dataViewGrid.columns.column
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.columns.column hold the individual column info and options to be render later by the reviJs.core.grid.dataViewGrid.
 *
 * @Required
 * reviJs.core.grid.dataViewGrid.columns  Directive.
 *
 * @sample
 * <revi-column></revi-column>
 *
 *
 */
(function () {
    angular.module('reviJs.core.grid.dataViewGrid.columns.column')
        .directive('reviColumn', reviColumn);

    function reviColumn() {
        return {
            scope: {
                id: '@',
                width: '@',
                name: '@',
                field: '@',
                toolTipText: '@',
                formatter: '=',
                groupFormatter: '='
            },
            strict: 'E',
            replace: true,
            template: '',
            require: '^reviDbColumns',
            link: link
        };

        function link($scope, element, attr, reviDbColumnsCtrl) {
            var groupFormatter = angular.isFunction($scope.groupFormatter) ? $scope.groupFormatter : undefined;
            var formatter = angular.isFunction($scope.formatter) ? $scope.formatter : undefined;

            var col = {
                name: $scope.name,
                field:$scope.field,
                id: $scope.id,
                toolTip: $scope.toolTipText,
                formatter: formatter,
                groupTotalsFormatter: groupFormatter,
                width: parseInt($scope.width)
            };
            reviDbColumnsCtrl.addColumn(col);
        }
    }
})();