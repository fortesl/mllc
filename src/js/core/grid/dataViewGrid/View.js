/**
 * @ngdoc Directive
 * @name Data View Grid.
 *
 * @description
 * The reviJs.core.grid.dataViewGrid renders the directive that handles grouping in the application, "The Rollup Grids", using the Slick Grid Plug in as base.
 *
 * @sample
 * <revi-data-view-grid></revi-data-view-grid>
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid');
    app.directive('reviDataViewGrid', reviDataViewGrid);

    var options = {
        editable: false,
        enableCellNavigation: true,
        asyncEditorLoading: false,
        autoEdit: true,
        enableAsyncPostRender: true,
        showHeaderRow: true,
        explicitInitialization: true,
        headerRowHeight: 33, //pixels
        enableColumnReorder: true
    };

    function reviDataViewGrid(cellRenderer, $window, gridNotifier, groupItemHelpers) {
        var rowIds = ['id'];

        return {
            scope: {
                rowIds: '=',
                rowSelectionModel: '=',
                gridClass: '@'
            },
            transclude: true,
            strict: 'E',
            replace: true,
            template: '<div class="revi-data-grid slick-grid-container"><ng-transclude></ng-transclude></div>',
            require: ['reviDataViewGrid', 'ngModel'],
            controller: 'reviJs.core.grid.dataViewGrid.Controller',
            link: {
                pre: link,
                post: postLink
            }
        };

        function link($scope, element, attr, controllers) {
            var controller = controllers[0];
            var ngModel = controllers[1];

            //Add class name to the Grid
            if (attr.gridClass) {
                element.addClass(attr.gridClass);
            }

            initialGrid($scope, element, controller);
            initializeModelController(ngModel, $scope);

            angular.element($window).resize(function () {
                $scope.grid.resizeCanvas();
            });

            gridNotifier.subscribeRerenderCanvas(function () {
                setTimeout(function () { $scope.grid.resizeCanvas(); }, 0);//Hack to take the real size of the grid
            }, $scope);
        }

        function postLink($scope, element, attr, controllers) {
            controllers[0].subscribeEvents($scope.grid);
        }

        function initialGrid($scope, element, controller) {
            var dataView, grid;

            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider({
                getRowMetadata: groupItemHelpers.GetRowMetadata
            });
            $scope.dataView = dataView = new Slick.Data.DataView({
                groupItemMetadataProvider: groupItemMetadataProvider,
                inlineFilters: true
            });
            $scope.grid = grid = new Slick.Grid(element, dataView, [], options);
            grid.registerPlugin(groupItemMetadataProvider);

            if ($scope.rowSelectionModel) {
                $scope.grid.setSelectionModel($scope.rowSelectionModel);
            } else {
                var _rowSelectionModel = new Slick.RowSelectionModel();
                grid.setSelectionModel(_rowSelectionModel);
            }

            $scope.dataView.syncGridSelection($scope.grid, true);

            listenOnEvents();

            dataView.onRowCountChanged.subscribe(function (e, args) {
                $scope.grid.updateRowCount();
                $scope.grid.render();
            });
            dataView.onRowsChanged.subscribe(function (e, args) {
                $scope.grid.invalidateRows(args.rows);
                $scope.grid.render();
            });

            grid.init();
            controller.setGrid(grid);

            function listenOnEvents() {
                var events = controller.getExternalEvents();
                var _externalEventsLength = events.length;
                var singleExternalEvent;
                for (var index = 0; index < _externalEventsLength; index++) {
                    singleExternalEvent = events[index];
                    $scope.$on(singleExternalEvent.name, singleExternalEvent.processor.bind({ grid: grid }));
                }
            }
        }

        function initializeModelController(modelController, $scope) {
            if ($scope.rowIds && angular.isArray($scope.rowIds)) {
                rowIds = $scope.rowIds;
            }
            $scope.$watch(function () { return modelController.$viewValue; }, function (newVal) {
                if (!newVal) {
                    return;
                }

                $scope.dataView.beginUpdate();
                $scope.dataView.setItems(newVal.Results, rowIds);
                $scope.dataView.endUpdate();
            });
        }
    }

    reviDataViewGrid.$inject = [
        'reviJs.core.grid.dataGrid.renderer.Cell',
        '$window',
        'reviJs.core.grid.notifier',
        'reviJs.markdown.plans.dataViewGrid.groupItemMetadataHelper'
    ];
})();