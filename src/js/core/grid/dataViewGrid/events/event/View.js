/**
 * @ngdoc Directive
 * @name reviJs.core.grid.dataViewGrid.events.event
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.events.event passes "Event" directive scope variable values to "Events" Directive
 * for registering and subscribing to event in the dataViewGrid
 *
 * @required
 * reviJs.core.grid.dataViewGrid.events directive controller.
 *
 * @sample
 * <revi-event></revi-event>
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid.events.event');
    app.directive('reviEvent', reviEvent);

    function reviEvent() {
        return {
            strict: 'E',
            scope: {
                callback: '='
            },
            link: link,
            template: '',
            replace: true,
            require: ['^reviEvents']
        };

        function link($scope, element, attr, controllers) {
            var reviEvents = controllers[0];
            reviEvents.addEvent(attr.name, $scope.callback);
        }
    }

    reviEvent.$inject = [];
})();

