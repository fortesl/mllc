(function () {
    angular.module('reviJs.core.grid.dataGrid.renderer')
      .factory('reviJs.core.grid.dataGrid.renderer.Cell', cellRenderer);

    function cellRenderer($templateCache, $filter) {

        return {
            "Cell": cell,
            "Currency": currency,
            "Number": integer,
            "Percent": percent,
            "Date": date
        };

        /** PUBLIC API METHODS */

        /**
         * Render generic data-grid cell with single template value replacement (not angular interpolation).
         * @param row
         * @param cellElement
         * @param value
         * @returns {String} Rendered cell HTML markup injectable into DOM.
         */
        function cell(row, cellElement, value) {
            // interpolation is too expensive, renders get called when scrolling
            return $templateCache.get('core/grid/dataGrid/cell.html').replace(/{([^]+)}/g, value);//$interpolate($templateCache.get('core/grid/dataGrid/cell.html'))(cellScope);
        }

        /**
         * Render currency data-grid cell with single template value replacement (not angular interpolation).
         * @param row
         * @param cellElement
         * @param value
         * @returns {String} Rendered cell HTML markup injectable into DOM.
         */
        function currency(row, cellElement, values, columnDef, dataContext, formatExtra) {
            var filter = function (value) { return $filter('currency')(value, ''); };
            return range(row, cellElement, values, columnDef, dataContext, filter).addClass('revi-numeric').prepend('<span class="revi-symbol">' + jQuery.revionics.defaultCurrencySymbol + '</span>')[0].outerHTML;
        }

        /**
         * Render whole number (integer) data-grid cell with single template value replacement (not angular interpolation).
         * @param row
         * @param cellElement
         * @param value
         * @param columnDef
         * @param dataContext
         * @returns {String} Rendered cell HTML markup injectable into DOM.
         */
        function integer(row, cellElement, values, columnDef, dataContext, formatExtra) {
            var precision = angular.isArray(formatExtra) && angular.isDefined(formatExtra[0]) ? formatExtra[0] : 0;
            var filter = function (value) { return $filter('number')(value, precision); };
            return range(row, cellElement, values, columnDef, dataContext, filter).addClass('revi-numeric')[0].outerHTML;
        }

        /**
         * Render percent data-grid cell with single template value replacement (not angular interpolation).
         * @param row
         * @param cellElement
         * @param value
         * @returns {String} Rendered cell HTML markup injectable into DOM.
         */
        function percent(row, cellElement, values, columnDef, dataContext, formatExtra) {
            var filter = function (value) { return $filter('number')(value, 1); };
            return range(row, cellElement, values, columnDef, dataContext, filter).addClass('revi-numeric').prepend('<span class="revi-symbol">%</span>')[0].outerHTML;
        }

        function date(row, cellElement, values, columnDef, dataContext, formatExtra) {
            var format = angular.isArray(formatExtra) && angular.isDefined(formatExtra[0]) ? formatExtra[0] : reviJs.configParams.defaultDateFormat;
            var filter = function (value) { if (!value) { return ''; } return moment(value).format(format); };
            return range(row, cellElement, values, columnDef, dataContext, filter).addClass('revi-date-format')[0].outerHTML;
        }

        /** PRIVATE HELPER METHODS */

        function formatRange(values, filter, separator) {
            separator = separator || ' - ';
            if (!Array.isArray(values)) {
                values = filter ? filter(values) : values;
            }
            else {
                values = (filter ? values.map(filter) : values).join(separator);
            }
            return values;
        }

        function range(row, cellElement, values, columnDef, dataContext, filter, separator) {
            return $(cell(row, cellElement, formatRange(values, filter, separator), columnDef, dataContext));
        }
    }

    cellRenderer.$inject = [
        '$templateCache',
        '$filter',
    ];
})();