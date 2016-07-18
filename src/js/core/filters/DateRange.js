(function () {
    var app = angular.module('reviJs.filters');
    app.filter('reviDateRange', reviDateRange);

    function reviDateRange($filter) {
        return function(dates, dateFormat) {
            return dates.map(function(date) {
                return $filter('date')(date, dateFormat);
            }).join(' - ');
        };
    }
})();