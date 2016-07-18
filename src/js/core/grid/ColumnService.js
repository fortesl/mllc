(function () {
    angular.module('reviJs.core.grid')
      .factory('reviJs.core.grid.ColumnService', columnService);

    function columnService(http, coreFormatters, coreGroupFormatters, templateRenderer) {

        var baseRequest = {
            restrict: http.restrictions.SINGLE,
            cacheName: 'reviJsCoreGridColumnService',
            invalidateCache: false,
            data: {}
        };

        return {
            'getColumnsDefinition': getColumnsDefinition
        };

        function getColumnsDefinition(commandObj, formatters, groupFormatters, aggregators, preProcessor) {
            return _getGridColumnDefinition(commandObj).then(function (response) {
                response = angular.isFunction(preProcessor) ? preProcessor(response) : response;
                response = _processColumns(response, formatters, groupFormatters, aggregators);
                return response;
            });
        }

        function _processColumns(columnsDefinition, formatters, groupFormatters, aggregators) {
            var result = angular.copy(columnsDefinition),
                columns = columnsDefinition.columns;

            formatters = angular.isObject(formatters) ? formatters : coreFormatters;
            groupFormatters = angular.isObject(groupFormatters) ? groupFormatters : coreGroupFormatters;
            aggregators = angular.isObject(aggregators) ? aggregators : Slick.Data.Aggregators;

            result.columns = [];
            result.aggregators = [];

            var columnPosition = 0;
            angular.forEach(columns, function(value, key) {
                var newColumn = {
                    'id': value.id,
                    'field': key,
                    'columnPosition': columnPosition++,
                    'name': value.label,
                    'width': value.width,
                    'groupKey': value.groupKey,
                    'path1': value.path1,
                    'path2': value.path2,
                    'minWidth': value.minWidth,
                    'userOptions': value.userOptions,
                    'isFrozen': value.isFrozen ? true : false,
                    'groupFormula': value.formula? value.formula : null
                };

                _setFormatter(value, newColumn, formatters, groupFormatters);
                _setAggregator(value, result, aggregators, key);

                if (angular.isDefined(value.isSortable)) {
                    newColumn.sortable = value.isSortable;
                }

                result.columns.push(newColumn);
            });

            return result;
        }

        function _setFormatter(value, newColumn, formatters, groupFormatters) {
            /*
             * Three ways of displaying a cell in order of precedence.
             * 1. Template.  This can be an angular template or a slickgrid template.
             * 2. Renderer function which returns an html string.
             * 3. dataDisplayFormat
             */
            if (angular.isString(value.cellTemplate)) {
                /*
                 * ng-include must be wrapped in a div element.  See
                 * <https://github.com/angular/angular.js/commit/1453fb72ffc1c013a1483886fd4926c789ae42b0>
                 */
                newColumn.template = '<div><ng-include src="\'' + value.cellTemplate + '\'"></ng-include></div>';
                newColumn.formatter = templateRenderer.formatter;
                newColumn.asyncPostRender = templateRenderer.asyncPostRender;
            }
            else if (angular.isFunction(value.formatter)) {
                newColumn.formatter = value.formatter;
            }
            else if (angular.isString(value.formatName)) {
                var formatSplit = value.formatName.split(':');
                value.formatName = formatSplit.shift();
                if (angular.isFunction(formatters[value.formatName])) {
                    if (formatSplit.length > 0) {
                        newColumn.formatter = function(row, cellElement, fieldValue, columnDef, dataContext) {
                            return formatters[value.formatName](row, cellElement, fieldValue, columnDef, dataContext, formatSplit);
                        };
                    }
                    else {
                        newColumn.formatter = formatters[value.formatName];
                    }
                }
            }

            if (!angular.isFunction(newColumn.formatter)) {
                newColumn.formatter = formatters.Cell;
                value.formatName = 'Cell';
            }

            if (angular.isFunction(value.headerFormatter)) {
                newColumn.headerFormatter = value.headerFormatter;
            }
            else if (angular.isString(value.aggregateName) && angular.isFunction(formatters[value.aggregateName])) {
                newColumn.headerFormatter = formatters[value.aggregateName];
            }
            else {
                newColumn.headerFormatter = newColumn.formatter;
            }

            if (angular.isFunction(value.cellTooltipRenderer)) {
                newColumn.cellTooltipRenderer = value.cellTooltipRenderer;
            }
            //IE 11 does not have support for startsWith, for some reason polfill is not working here
            if (angular.isString(value.formatName) && angular.isString(value.aggregateName)) {
                if (value.aggregateName === 'Range') {
                    if (value.formatName.indexOf('Number')!==-1) {
                        newColumn.groupTotalsFormatter = groupFormatters.integerRange;
                    } else if (value.formatName.indexOf('Currency')!==-1) {
                        newColumn.groupTotalsFormatter = groupFormatters.currencyRange;
                    } else if (value.formatName.indexOf('Percent')!==-1) {
                        newColumn.groupTotalsFormatter = groupFormatters.percentRange;
                    } else if (value.formatName.indexOf('Date')!==-1) {
                        newColumn.groupTotalsFormatter = groupFormatters.dateRange;
                    }
                } else if (value.aggregateName === 'UniqueString') {
                    newColumn.groupTotalsFormatter = groupFormatters.uniqueString;
                } else if (value.aggregateName === 'Max') {
                    newColumn.groupTotalsFormatter = groupFormatters['max' + value.formatName];
                } else if (value.aggregateName === 'Sum') {
                    newColumn.groupTotalsFormatter = groupFormatters['sum' + value.formatName];
                } else if (value.aggregateName === 'Avg') {
                    if (value.formula) {
                        newColumn.groupTotalsFormatter = function(totals,columnDef) {
                            var val = 0, denominator, denominatorPos = columnDef.groupFormula.search('/');
                            if (denominatorPos>-1) {
                                denominator = eval(columnDef.groupFormula.substring(denominatorPos+1));
                            }
                            if ('undefined' === typeof denominator || denominator>=1) {
                                val = eval(columnDef.groupFormula);
                            }
                            return "<div class='revi-cell revi-numeric'><span class='revi-symbol'>%</span>" + val.toFixed(1) + "</div>";
                        }
                    }
                    else {
                        newColumn.groupTotalsFormatter = groupFormatters['avg' + value.formatName];
                    }
                }
            }
        }
        
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function(searchString, position){
              position = position || 0;
              return this.substr(position, searchString.length) === searchString;
          };
        }


        function _setAggregator(value, result, aggregators, key) {
            if (angular.isString(value.aggregateName) && angular.isObject(aggregators)) {
                var aggregateName = value.aggregateName.charAt(0).toUpperCase() + value.aggregateName.slice(1);
                if (angular.isFunction(aggregators[aggregateName])) {
                    result.aggregators.push(new aggregators[aggregateName](key));
                } else if (angular.isFunction(aggregators[value.formatName + aggregateName])){
                    result.aggregators.push(new aggregators[value.formatName + aggregateName](key));
                } else {
                    switch (value.formatName.toLowerCase()) {
                        case "currency":
                        case "percent":
                            result.aggregators.push(new aggregators["NumberRange"](key));
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        function _getGridColumnDefinition(commandObj) {
            var request = $.extend({}, baseRequest);
            request.url = 'GetGridColumnDefinitions?bust=' + commandObj.command.gridType;
            request.data = commandObj;
            return http.request(request).then(function (response) {
                var columns =response.columnsDefinition.columns;
                if (commandObj.command.gridType === 1) {
                    columns.IsAccepted.isFrozen = true;
                    columns.Color.isFrozen = true;
                    columns.Style.isFrozen = true;
                }
                return response.columnsDefinition;
            });
        }
    }

    columnService.$inject = [
        'reviJs.core.comm.Http',
        'reviJs.core.grid.dataGrid.renderer.Cell',
        'reviJs.core.grid.dataViewGrid.renderer.GroupCell',
        'reviJs.core.grid.dataGrid.formatters.templateRenderer'
    ];
})();
