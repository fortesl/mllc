(function event() {
    var app = angular.module('reviJs.core.grid');

    app.factory('reviJs.core.grid.event', event);
    app.factory('reviJs.core.grid.notifier', notifier);

    function event() {
        return {
            RERENDER_CANVAS: 'reviJs.core.grid.Event.RerenderCanvas'
        };
    }

    function notifier(notifier) {
        return notifier.notifierFactory(event());
    }

    notifier.$inject = ['reviJs.core.comm.Notifier'];
})();