/**
 * @ngdoc Directive
 * @name reviJs.core.grid.dataViewGrid.events.
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.events Sets the event subscriptions for the dataViewGrid.
 *
 * @Required
 * reviJs.core.grid.dataViewGrid  Directive.
 *
 * @sample
 * <revi-events></revi-events>
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid.events');
    app.directive('reviEvents', reviEvents);

    function reviEvents() {
        return {
            strict: 'E',
            scope: {},
            transclude: true,
            template: '<ng-transclude></ng-transclude>',
            link: link,
            require: ['reviEvents', '^reviDataViewGrid'],
            controller: 'reviEventsController',
            replace: true
        };

        function link($scope, element, attr, controllers) {
            var reviEvents = controllers[0];
            var reviDataViewGrid = controllers[1];
            reviDataViewGrid.setEvents(reviEvents.getEvents());
            reviDataViewGrid.setExternalEvents(reviEvents.getExternalEvents());
        }
    }

    reviEvents.$inject = [];
})();