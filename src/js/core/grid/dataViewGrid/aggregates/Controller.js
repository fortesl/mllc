/**
 * @ngdoc Controller
 * @name reviJs.core.grid.dataViewGrid.aggregates.Controller
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.aggregates.Controller handle passing aggregate data from the aggregates directive.
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid.aggregates');
    app.controller('reviJs.core.grid.dataViewGrid.aggregates.Controller', reviAggregatesController);

    function reviAggregatesController() {
        var _aggregate = [];

        this.addAggregate = addAggregate;
        this.getAggregates = getAggregates;

        function addAggregate(aggregate) {
            _aggregate.push(aggregate);
        };

        function getAggregates() {
            return _aggregate;
        };
    }

    reviAggregatesController.$inject = [];
})();