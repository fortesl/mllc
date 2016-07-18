/*
 * Wraps slickgrid in an angular component.  Based on an example directive linked
 * from <https://groups.google.com/forum/#!topic/angular/3AdNX1Pupmc>.  Original
 * jsFiddle: <http://jsfiddle.net/tUpAb/>.
 *
 * Usage:
 * <revi-core-data-grid revi-columns="columns" revi-loader="loader"></revi-core-data-grid>
 *
 * columns = {
 *      columnGroups:  {...},
 *      columns: {...}
 * }
 *
 * Please see reviJs.core.grid.dataGrid.remoteLoader.Service for a loader
 * implementation.
 *
 */
reviJs.core.grid.dataGrid.directive('reviCoreDataGrid',
    ['reviJs.core.grid.dataGrid.formatters.templateRenderer', 'reviJs.markdown.core.data.Enums', 'reviJs.core.grid.notifier',
        function(templateRenderer, enums, gridNotifier){

    var gridSorting = false;
    var setSortDirection = function (column, gridColumns) {
        /// find the column in the column definition that is sorted
        var columnDef = gridColumns.filter(
            function (col) {
                return col.id === Number(column.id);
            });

        /// could not find column, return first column
        if (!columnDef.length) {
            return gridColumns[0];
        }

        columnDef = columnDef[0];

        /// rotate found column
        switch (columnDef.sortDirection) {
            case enums.dataSortDirections.descending:
                columnDef.sortDirection = enums.dataSortDirections.none;
                break;
            case enums.dataSortDirections.ascending:
                columnDef.sortDirection = enums.dataSortDirections.descending;
                break;
            default:
                columnDef.sortDirection = enums.dataSortDirections.ascending;
                break;
        }

        return columnDef;
    };

    return {
        restrict: 'E',
        replace: true,
        scope: {
            reviRowSelection: '=',
            reviColumns: '=',
            reviLoader: '=',
            reviNoDataMessage: '=',
            reviRowSelectionChangedCallback: '&reviRowSelectionChanged',
            reviRowSelectionDblclick: '&',
            reviRowButtonClick: '&',
            reviDataGridOptions: '=',
            reviInvalidate: '=',
            reviReorderedColumnsEvent: '&'
        },
        templateUrl: 'core/grid/dataGrid/dataGrid.html',
        link: function($scope, element) {
            $scope.state = {};
            $scope.state.columns = [];
            $scope.state.columnGroups = {};
            $scope.grid = null;
            var initialized = false;
            var loader = null;
            var sortArrowUpElement = window.document.createElement('SPAN');
            var sortArrowDownElement = window.document.createElement('SPAN');
            var lastRowSelected = -1;

            var applyColumnSortStyles = function(column) {
                removeColumnSortStyles(column);
                var headerColumn = element.find('[id*=' + column.id + '].slick-header-column');
                if (column.sortDirection === enums.dataSortDirections.ascending) {
                    headerColumn[0].insertBefore(sortArrowUpElement, headerColumn[0].childNodes[0]);
                    headerColumn.addClass('revi-sorted-column-underline-color');
                    $scope.state.columns[column.columnPosition].cssClass = 'revi-sorted-column-data';
                }
                else if (column.sortDirection === enums.dataSortDirections.descending) {
                    headerColumn[0].insertBefore(sortArrowDownElement, headerColumn[0].childNodes[0]);
                    headerColumn.addClass('revi-sorted-column-underline-color');
                    $scope.state.columns[column.columnPosition].cssClass = 'revi-sorted-column-data';
                }
            };

            var removeColumnSortStyles = function(column) {
                if ('undefined' !== sortArrowDownElement.parentNode && sortArrowDownElement.parentNode) {
                    sortArrowDownElement.parentNode.removeChild(sortArrowDownElement);
                }
                if('undefined' !== sortArrowUpElement.parentNode && sortArrowUpElement.parentNode) {
                    sortArrowUpElement.parentNode.removeChild(sortArrowUpElement);
                }
                for (var i=0; i< $scope.state.columns.length; i++) {
                    $scope.state.columns[i].cssClass = '';
                }
                element.find('.slick-header-column').removeClass('revi-sorted-column-underline-color');
            };

            var sortHandler = function (argColumn, loaderFn) {
                if ('undefined' !== typeof $scope.reviRowSelection && !$scope.columnResized) {
                    var column = setSortDirection(argColumn, $scope.state.columns);
                    if (column.sortable) {
                        gridSorting = true;
                        applyColumnSortStyles(argColumn);
                        if (column.sortDirection !== enums.dataSortDirections.none) {
                            loader.setSort(argColumn.field, column.sortDirection);
                        }
                        else {
                            loader.setSort(null);
                            column = setSortDirection({ id: 101 }, $scope.state.columns);
                            applyColumnSortStyles(column);
                        }
                        loaderFn();
                    }
                }
                $scope.columnResized = false;
            };

            /*
             * Use a loader to provide rows to the grid.
             */
            loader = $scope.reviLoader;

            init();
            /*
             * Get transformed column data and update the model while maintaining
             * object references.
             */
            function updateColumns() {
                angular.copy($scope.reviColumns.columns, $scope.state.columns);
                angular.copy($scope.reviColumns.columnGroups, $scope.state.columnGroups);
            }

            function init() {
                $scope.columnResized = false;
                $(sortArrowUpElement).addClass('revi-sort-arrow-up');
                $(sortArrowDownElement).addClass('revi-sort-arrow-down');

                updateColumns();

                // SETUP DEFAULT GRID OPTIONS
                var defaults = {
                    editable: true,
                    enableCellNavigation: true,
                    asyncEditorLoading: false,
                    autoEdit: true,
                    enableAsyncPostRender:true,
                    showHeaderRow:true,
                    explicitInitialization:true,
                    headerRowHeight: 33, //pixels
                    enableColumnReorder:true
                };

                /*
                 * Called whenever the aggregate row needs to be updated.  Uses
                 * $scope.grid.getHeaderRowColumn() to get the rowColumn node and
                 * pass it into _renderAggregateCell();
                 *
                 * @returns {undefined}
                 */
                $scope._renderAggregateRow = function renderAggregateRow() {
                    angular.forEach($scope.reviColumns.columns, function(column) {
                        if(!angular.isDefined(loader.aggregate[column.field])) return;
                        $scope._renderAggregateCell($scope.grid.getHeaderRowColumn(column.id), column);
                    });
                };
                /*
                 * Check to make sure we have something to render.  If so, pass
                 * it to templateRenderer.headerCellRenderer.
                 *
                 * @param {DOMElement} el
                 * @param {string} columnId
                 * @returns {undefined}
                 */
                $scope._renderAggregateCell = function renderAggregateCell(el, column) {
                    $(el).empty();
                    if (angular.isDefined(loader.aggregate[column.field])) {
                        templateRenderer.headerCellRenderer(el, column, loader.aggregate[column.field], loader.aggregate);
                    }
                };

                // Utility function for finding the slick grid column based on the columnId.
                function getReviColumn(columnId) {
                    var column = $.grep($scope.state.columns, function(column) {
                         return column.field == columnId;
                    })[0];

                    return column;
                }

                // Merge provided options with defaults.
                var options = angular.extend({}, defaults, $scope.reviDataGridOptions || {});

                // Create grid object.
                $scope.grid = new Slick.Grid( element , loader.data, $scope.state.columns, options);
                gridNotifier.subscribeRerenderCanvas(function () {
                    setTimeout(function () { $scope.grid.resizeCanvas(); }, 0);//Hack to take the real size of the grid
                }, $scope);

                //handle double-click
                $scope.grid.onDblClick.subscribe(function(e, args) {
                    $scope.reviRowSelectionDblclick();
                });

                $scope.grid.onColumnsReordered.subscribe(function (e, args) {
                    var reOrderedColumns = args.grid.getColumns().map(function (column) {
                        return {
                            id: column.field,
                            label: column.name,
                            width: 300
                        };
                    });

                    $scope.reviReorderedColumnsEvent({ columns: reOrderedColumns });
                });

                //handle header click
                $scope.grid.onHeaderClick.subscribe(function (e, args) {
                    sortHandler(args.column, function () {
                        loader.reloadData();
                    });
                });

                //handle column resized
                $scope.grid.onColumnsResized.subscribe(function (e, args) {
                    $scope.columnResized = true;
                });


                // Allows selecting and styling of multiple rows.
                $scope.grid.setSelectionModel(new Slick.RowSelectionModel());

                // This event is called after the header row elements are rendered.
                // We can then add our own elements.
                $scope.grid.onHeaderRowCellRendered.subscribe(function(e, args) {
                    $scope._renderAggregateCell(args.node, args.column);
                });

                $scope.grid.onSelectedRowsChanged.subscribe(function() {
                    var selectedRows = $scope.grid.getSelectedRows();
                    if (selectedRows.length && !angular.equals(selectedRows, lastRowSelected)) {
                        $scope.reviRowSelectionChangedCallback({ returnValue: { selectedIndexes: selectedRows, allRowsSelected: (selectedRows.length == loader.data.length && loader.data.length != 0) } });
                        lastRowSelected = selectedRows;
                    }
                    else if (selectedRows.length) {
                        $scope.reviRowSelectionChangedCallback();
                        lastRowSelected = [];
                        $scope.grid.setSelectedRows([]);
                    }
                });

                $scope.grid.onClick.subscribe(function(e) {
                    var cell = $scope.grid.getCellFromEvent(e);
                    var row = (cell) ? cell.row : 0;
                    $scope.grid.setSelectedRows([row]);
                });

                /*
                 * Any time the grid is scrolled, this event is emitted.
                 */
                var existingTimeout = null;
                $scope.grid.onViewportChanged.subscribe(function (e, args) {
                    var vp = $scope.grid.getViewport();

                    /*
                     * No need to call $scope.$apply if we aren't yet initialized
                     * since the first onViewportChanged event is generated
                     * programmatically inside an angular context.
                     */
                    if(initialized) {

                        loader.ensureData(vp.top, vp.bottom);
                        /*
                         *
                         * It would be nice if we could just call $scope.$apply()
                         * once after all of the formatters have run, but there
                         * doesn't seem to be a simple way to know when that is.
                         * Instead, we just schedule a $scope.$apply() in the next
                         * cycle if one hasn't already been scheduled.
                         */
                        if(!existingTimeout) {
                            existingTimeout = setTimeout(function () {
                                existingTimeout = null;
                                $scope.$apply();
                            }, 50);
                        }
                    }
                });

                // Column has been sorted.
                $scope.grid.onSort.subscribe(function (e, args) {
                    //loader.setSort(args.sortCol.field, args.sortAsc ? 1 : -1);
                    e.stopPropagation();
                    sortHandler(args.sortCol, function () {
                        var vp = $scope.grid.getViewport();
                        loader.ensureData(vp.top, vp.bottom);
                    });
                });

                // Data loaded.
                loader.onDataLoaded.subscribe(function (e, args) {
                    if(args.aggregateChanged) {
                        $scope._renderAggregateRow();
                    }
                    // Just in case the grid has stale data for these rows, we
                    // invalidate them.
                    for (var i = args.from; i <= Math.max(args.to, $scope.grid.getDataLength()); i++) {
                      $scope.grid.invalidateRow(i);
                    }

                    // Tell the grid to look at the updated data object and render.
                    $scope.grid.updateRowCount();
                    $scope.grid.render();
                    $scope.columnResized = false;
                    if (gridSorting === false) {
                        if ('undefined' !== typeof $scope.reviRowSelection) {
                            var column = setSortDirection({ id: 101 }, $scope.state.columns);
                            if (column) {
                                applyColumnSortStyles(column);
                                gridSorting = true;
                            }
                        }
                    }
                });

                // Because we are using explicitInitialization: true, the grid
                // doesn't actually attach itself to the DOM until init() is
                // called.
                $scope.grid.init();

                /*
                 * Enable nested or grouped columns.
                 */
                // load the first page
                $scope.grid.onViewportChanged.notify();
                initialized = true;

                $(window).resize(function () {
                    $scope.grid.resizeCanvas();
                });

                /*
                 * Update the grid when columns change.
                 */
                $scope.$watch('reviColumns', function() {
                    updateColumns();
                    $scope.grid.setColumns($scope.state.columns);

                    // Re-apply options if necessary - frozen column will not apply until columns array is populated.
                    if (options.frozenColumn > -1 && $scope.grid.getOptions().frozenColumn == -1 && options.frozenColumn < $scope.state.columns.length) {
                        $scope.grid.setOptions(options);
                    }

                    $scope.grid.render();
                    $scope.grid.onColumnsResized.notify();
                }, true);

                /*
                 * Update the aggregate row if it changes.
                 */
                $scope.$watch('reviLoader.aggregate', function(newVal) {
                    if(newVal == null || angular.equals(newVal, {})) return;
                    $scope.grid.invalidate();
                }, true);

                /*
                 * Update the row selections as needed
                 */
                $scope.$watch('reviRowSelection', function (newValue) {
                    if (newValue == null || angular.equals(newValue, {})) return;

                    switch (newValue)
                    {
                        case true:
                            var rowsToSelect = [];

                            for (var i = 0; i < loader.data.length; i++)
                                rowsToSelect.push(i)

                            $scope.grid.getSelectionModel().setSelectedRows(rowsToSelect);

                            break;
                        case false:
                            $scope.grid.getSelectionModel().setSelectedRows([]);
                            break;
                        case "":
                        default:
                            break;
                    }
                }, true);

                $scope.$watch('reviNoDataMessage', function (textToDisplay) {
                    if (textToDisplay !== null && textToDisplay !== "" && loader.data.length == 0) {
                        $(element).find(".grid-canvas").append("<div class='revi-nogridrows revi-highemphasis'></div>");
                        $(element).find(".grid-canvas .revi-nogridrows").text(textToDisplay);
                    }
                    else if ($(element).find(".grid-canvas .revi-nogridrows")) {
                        $(element).find(".grid-canvas .revi-nogridrows").remove();
                    }
                });

                function updateGridOptions() {
                    options = angular.extend({}, defaults, $scope.reviDataGridOptions || {});
                    $scope.grid.setOptions(options);
                }

                // Update the grid when options change.
                $scope.$watch('reviDataGridOptions', updateGridOptions);

                angular.element('.revi-data-grid').on('click', "input[type='button']", processButtonClick);
            }
            function processButtonClick(event) {
                var $el = angular.element(event.target);
                var rowIndex = $el.attr('data-revi-row');
                var planId = $el.attr('data-revi-planid');
                var parsedRowIndex = parseInt(rowIndex, 10);
                var parsedPlanId = parseInt(planId, 10);

                if ((parsedRowIndex + '') !== rowIndex) {
                    console.log('Unable to determine row index');
                    return;
                }
                var dataRow = $scope.grid.getDataItem(parsedRowIndex);

                $scope.reviRowButtonClick({ dataRow: dataRow, element: { element: $el }, planId: parsedPlanId, rowIndex: parsedRowIndex });
            }
        }
    };
}]);