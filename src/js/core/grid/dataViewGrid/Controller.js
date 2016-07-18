/**
 * @ngdoc Controller
 * @name Data View Grid controller
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.Controller main controller for the Data View Grid Directive.
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid');
    app.controller('reviJs.core.grid.dataViewGrid.Controller', reviDataViewGridController);

    function reviDataViewGridController($scope, $q, cellRenderer) {
        var _columns = [];
        var _events = [];
        var _externalEvents = [];
        var _grid;

        this.addColumn = addColumn;
        this.getColumns = getColumns;
        this.getColumnLookup = getColumnLookup;
        this.setEvents = setEvents;
        this.setExternalEvents = setExternalEvents;
        this.getExternalEvents = getExternalEvents;
        this.subscribeEvents = subscribeEvents;
        this.getGrid = getGrid;
        this.setGrid = setGrid;

        function getGrid() {
            return _grid;
        }

        function setGrid(grid) {
            _grid = grid;
        }

        function getExternalEvents() {
            return _externalEvents;
        }

        function setExternalEvents(events) {
            _externalEvents = events;
        }

        function setEvents(events) {
            _events = events;
        }

        function subscribeEvents(grid) {
            angular.forEach(_events, function (item) {
                var onEvent = grid[item.name];
                if (onEvent && onEvent.subscribe) {
                    onEvent.subscribe(item.callback);
                }
            });
        }

        function getColumnLookup() {
            var lookupTable = {};

            if (!_columns || !_columns.length) {
                return lookupTable;
            }

            for (var index in _columns) {
                lookupTable[_columns[index].id] = _columns[index];
            }

            return lookupTable;
        }

        function addColumn(column) {
            if (!column) {
                return;
            }

            if (!angular.isFunction(column.formatter)) {
                column.formatter = cellRenderer.cell;
            }
            _columns.push(column);
        }

        function getColumns() {
            return angular.copy(_columns);
        }
    }

    reviDataViewGridController.$inject = [
        '$scope',
        '$q',
        'reviJs.core.grid.dataGrid.renderer.Cell'
    ];
})();