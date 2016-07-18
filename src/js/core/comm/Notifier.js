/**
 * @ngdoc Services
 * @name reviJs.core.comm.Notifier
 *
 * @description
 * ThereviJs.core.comm.Notifier has methods for subscribing to angular events in the app.
 *
 */

(function () {
    angular.module('reviJs.core.comm')
        .service('reviJs.core.comm.Notifier', service);

    function service($rootScope) {
        this.notify = notify;
        this.subscribe = subscribe;
        this.notifierFactory = notifierFactory;

        function notify(name, args) {
            $rootScope.$emit(name, args);
        }

        function subscribe(name, callBack, scope) {
            var event = $rootScope.$on(name, callBack);
            scope.$on("$destroy", event);
            return event;
        }

        // Generates a notifier from any event enum.
        function notifierFactory(event) {
            var notifier = {};
            angular.forEach(event, function(value, key) {
                // Convert event names to camel case (ACTIVE_FILTERS_UPDATED > ActiveFiltersUpdated).
                var newKey = key[0].toUpperCase() + jQuery.camelCase(key.toLowerCase().replace(/_/g, '-')).substr(1);
                notifier['subscribe' + newKey] = function (callBack, scope) {
                    return subscribe(value, callBack, scope);
                };
                notifier['notify' + newKey] = function (args) {
                    notify(value, args);
                };
            });
            return notifier;
        }
    }

    service.$inject = ['$rootScope'];
})();