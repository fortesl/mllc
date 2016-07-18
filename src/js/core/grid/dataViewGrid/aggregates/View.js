/**
 * @ngdoc Directive
 * @name reviJs.core.grid.dataViewGrid.aggregates
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.aggregates passes "aggregates" data to the parent "dataViewGrid" Directive reviJs.core.grid.dataViewGrid
 *
 * @Required
 * reviJs.core.grid.dataViewGrid  Directive.
 *
 * @sample
 * <revi-aggregates></revi-aggregates>
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid.aggregates');
    app.directive('reviAggregates', reviAggregates);

    function reviAggregates() {
        return {
            strict: 'E',
            scope: {},
            link: link,
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            replace: true,
            require: ['reviAggregates', '^reviDataViewGrid', 'ngModel'],
            controller: 'reviJs.core.grid.dataViewGrid.aggregates.Controller'
        };

        function link($scope, element, attr, controllers) {
            var localController = controllers[0];
            var parentController = controllers[1];
            var ngModel = controllers[2];
            ngModel.$render = renderer;
            var grid = parentController.getGrid();
            var aggregates = localController.getAggregates();

            function renderer() {
                initializeAggregates();
            };

            function initializeAggregates() {
                if (!angular.isArray(ngModel.$viewValue) || !ngModel.$viewValue.length) {
                    grid.getData().beginUpdate();
                    grid.getData().setGrouping([]);
                    grid.getData().endUpdate();
                    return;
                }

                var requiresFiltering = ngModel.$viewValue.some(function (element) {
                    return angular.isArray(element.filteredIds) && element.filteredIds.length;
                });

                var dataView = grid.getData();
                dataView.beginUpdate();
                var categories = ngModel.$viewValue;

                dataView.setGrouping(
                    categories.map(function (item) {
                        return angular.extend({
                                getter: item.name,
                                aggregateCollapsed: true,
                                collapsed: true
                            },
                            item, {
                                // Append aggregators specified in the column definition to aggregators from directives.
                                aggregators: angular.isArray(item.aggregators) ? item.aggregators.concat(aggregates) : aggregates
                            });
                    }));

                if (requiresFiltering) {
                    dataView.setFilterArgs({ 'categories': categories });

                    dataView.setFilter(function (item, args) {
                        var index = args.categories.length, category;
                        while (index--) {
                            category = args.categories[index];
                            if (!category.displayItem(item, category)) {
                                return false;
                            }
                        }
                        return true;
                    });

                    dataView.expandAllGroups();
                } else {
                    dataView.setFilterArgs({});
                    dataView.setFilter(function (item, args) {
                        return true;
                    });
                    dataView.collapseAllGroups();
                }

                dataView.endUpdate();
            }
        }
    }

    reviAggregates.$inject = [];
})();