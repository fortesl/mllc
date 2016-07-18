/**
 * @ngdoc Factory
 * @name reviJs.core.grid.dataViewGrid.renderer Factory.
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.renderer.GroupCell defines dataViewGrid cells different formatter options.
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid.renderer');
    app.factory('reviJs.core.grid.dataViewGrid.renderer.GroupCell', factory);

    function factory($templateCache, $filter) {
        return {
            "Cell": cell,
            "Currency": currency,
            "Number": integer,
            "Percent": percent,
            decimal: decimal,
            "Range": cellRange,
            currencyRange: currencyRange,
            percentRange: percentRange,
            date: date
        };

        function cell(totalsField) {
            return basic(totalsField, 'core/grid/dataGrid/cell.html', noFilter);
        }

        function currency(totalsField) {
            return basic(totalsField, 'core/grid/dataGrid/currency.html',
                filter('currency', ''));
        }

        function date(totalsField) {
            return basic(totalsField, 'core/grid/dataGrid/date.html',
                filter('date', reviJs.configParams.defaultDateFormat));
        }

        function integer(totalsField) {
            return basic(totalsField, 'core/grid/dataGrid/cell.html',
                filter('number', 0), 'revi-numeric');
        }

        function percent(totalsField, numberOfDigitsAfterDecimalPoint) {
            numberOfDigitsAfterDecimalPoint = numberOfDigitsAfterDecimalPoint || 1;
            return basic(totalsField, 'core/grid/dataGrid/percent.html',
                filter('number', numberOfDigitsAfterDecimalPoint), 'revi-numeric');
        }

        function decimal(totalsField, numberOfDigitsAfterDecimalPoint) {
            numberOfDigitsAfterDecimalPoint = numberOfDigitsAfterDecimalPoint || 1;
            return basic(totalsField, 'core/grid/dataGrid/cell.html',
                filter('number', numberOfDigitsAfterDecimalPoint), 'revi-numeric');
        }

        function cellRange(totalsField) {
            return range(totalsField, 'core/grid/dataGrid/cell.html', noFilter);
        }

        function currencyRange(totalsField) {
            return range(totalsField, 'core/grid/dataGrid/currency.html',
                filter('currency', ''));
        }

        function percentRange(totalsField, numberOfDigitsAfterDecimalPoint) {
            numberOfDigitsAfterDecimalPoint = numberOfDigitsAfterDecimalPoint || 2;
            return range(totalsField, 'core/grid/dataGrid/percent.html',
                filter('number', numberOfDigitsAfterDecimalPoint));
        }

        function range(totalsField, templateUrl, filter, className) {
            return function(totals, columnDef) {
                var val = totals[totalsField] && totals[totalsField][columnDef.field];
                if (!val) {
                    return "";
                }

                val = val.join(' - ');
                var element = $templateCache.get(templateUrl).replace(/{([^]+)}/g, val);

                if (className){
                    element = $(element).addClass(className)[0].outerHTML;
                }

                return element;
            }
        }

        function basic(totalsField, templateUrl, filter, className) {
            return function(totals, columnDef) {
                var element;
                var val = totals[totalsField] && totals[totalsField][columnDef.field];
                if (!val) {
                    return "";
                }

                element = $templateCache.get(templateUrl).replace(/{([^]+)}/g, filter(val));

                if (className){
                    element = $(element).addClass(className)[0].outerHTML;
                }

                return element;
            }
        }

        function noFilter(value) {
            return value;
        }

        function filter(name, option){
            return function(value){
                return $filter(name)(value, option);
            };
        }


    }

    factory.$inject = ['$templateCache', '$filter'];
})();
