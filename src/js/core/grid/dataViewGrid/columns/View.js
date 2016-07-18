/**
 * @ngdoc Directive
 * @name reviJs.core.grid.dataViewGrid.columns
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.columns hold the columns and comunicates with the parent's directive.
 *
 * @Required
 * reviJs.core.grid.dataViewGrid  Directive.
 *
 * @sample
 * <revi-db-columns></revi-db-columns>
 *
 */
(function () {
    angular.module('reviJs.core.grid.dataViewGrid.columns')
        .directive('reviDbColumns', columns);

    function columns() {
        return {
            scope: {

            },
            strict: 'E',
            replace: true,
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            require: ['^reviDataViewGrid', 'reviDbColumns','ngModel'],
            link: link,
            controller: 'reviJs.core.grid.dataViewGrid.columns.Controller'
        };

        function link($scope, element, attr, ctrls) {
            var dataViewGridCtrl = ctrls[0];
            var columnsCtrl = ctrls[1];
            var ngModelCtrl = ctrls[2];

            ngModelCtrl.$render = renderer;

            var grid, dbColumnLookup,
                columns = columnsCtrl.getColumns();

            grid = dataViewGridCtrl.getGrid();

            function renderer() {
                if (!ngModelCtrl.$viewValue ||
                    !ngModelCtrl.$viewValue.columns) {
                    return;
                }

                dbColumnLookup = ngModelCtrl.$viewValue.columns;
                initializeColumns();
            }

            function initializeColumns() {
                if (!dbColumnLookup) { // grid or column def has not been defined yet
                    return;
                }

                // Default frozenColumn option is -1 (disabled).
                var frozenColumns = -1;
                for (var key in dbColumnLookup) {
                    if (dbColumnLookup[key].isFrozen) {
                        frozenColumns++;
                    }
                }

                var processedColumns = processColumns();
                grid.setColumns(processedColumns);
                grid.getData().refresh();

                if (grid.getOptions().frozenColumn !== frozenColumns) {
                    grid.setOptions({
                        frozenColumn: frozenColumns
                    });
                }
            }

            function processColumns() {
                var dbColumns = [], column;
                for (var columnName in dbColumnLookup) {
                    column = dbColumnLookup[columnName];
                    column.keyName = columnName;                    
                    //Array functions contains, remove and removeItem are also added
                    //to avoid functional columns, id check is added
                    if (!column.isHidden && column.id) {
                        dbColumns.push(column);
                    }
                }

                var localColumnLookup = columnsCtrl.toLookup(columns, 'id');
                var index = dbColumns.length, localColumn;
                while (index--) {
                    column = dbColumns[index];
                    localColumn = localColumnLookup[column.keyName] || {};

                    column.name = localColumn.name || column.name;
                    column.field = localColumn.field || column.field;
                    column.toolTip = localColumn.tooltip || column.tooltip;
                    column.width = localColumn.width || column.width;
                    column.formatter = angular.isFunction(localColumn.formatter) ? localColumn.formatter : column.formatter;
                    column.groupTotalsFormatter = angular.isFunction(localColumn.groupTotalsFormatter) ? localColumn.groupTotalsFormatter : column.groupTotalsFormatter;
                }

                return dbColumns;
            }
        }
    }
})();