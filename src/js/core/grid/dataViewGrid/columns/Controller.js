/**
 * @ngdoc Controller
 * @name reviJs.core.grid.dataViewGrid.columns
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.columns Controller that handles column definintions from the dataViewGrid.
 * Stores Columns in active Grid.
 *
 */
(function () {
    angular.module('reviJs.core.grid.dataViewGrid.columns')
        .controller('reviJs.core.grid.dataViewGrid.columns.Controller', controller);

    function controller() {
        var columns = [];

        this.addColumn = addColumn;
        this.getColumns = getColumns;
        this.toLookup = toLookup;

        function addColumn(column) {
            columns.push(column);
        }
        function getColumns() {
            return columns;
        }

        function toLookup(array, keyField) {
            var lookup = {};

            var index = array.length;
            while (index--) {
                var element = array[index];
                lookup[element[keyField]] = element;
            }
            return lookup;
        }
    }
})();