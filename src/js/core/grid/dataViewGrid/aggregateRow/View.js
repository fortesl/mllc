/**
 * @ngdoc Directive
 * @name reviJs.core.grid.dataViewGrid.aggregateRow
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.aggregateRow handles population of Aggregate Row Data, passing to the dataViewGrid if there is an Aggregate data in the response from the server. Updates Aggregate Row if the data changes via ngModel.
 *
 * @Required
 * reviJs.core.grid.dataViewGrid  Directive.
 *
 *  @sample
 * <revi-aggregate-row></revi-aggregate-row>
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid.aggregateRow');
    app.directive('reviAggregateRow', reviAggregateRow);

    function reviAggregateRow(templateRenderer) {
        return {
            strict: 'E',
            link: link,
            template: '<div></div>',
            replace: true,
            require: ['^reviDataViewGrid','ngModel']
        };

        function link($scope, element, attr, controllers) {
            var parentController = controllers[0];
            var ngModel = controllers[1];
            ngModel.$render = renderer;

            function renderer() {
                setTimeout(function () {
                    renderAggregateRow(ngModel.$viewValue);
                }, 3000);
            }

            function renderAggregateRow(aggregates) {
                var grid = parentController.getGrid();
                var columns = grid.getColumns();

                if ($.isEmptyObject(aggregates) || !columns.length){
                    return;
                }

                angular.forEach(columns, function (columnDef) {
                    if(!aggregates.hasOwnProperty(columnDef.field)) return;
                    var rowColumn = grid.getHeaderRowColumn(columnDef.id);
                    renderAggregateCell(rowColumn, columnDef, aggregates);
                });
            }

            function renderAggregateCell(el, columnDef, aggregates) {
                $(el).empty();
                templateRenderer.headerCellRenderer(el, columnDef, aggregates[columnDef.field], aggregates);
            }
        }
    }

    reviAggregateRow.$inject = [
        'reviJs.core.grid.dataGrid.formatters.templateRenderer'
    ];
})();