/**
 * @ngdoc Controller
 * @name reviJs.core.grid.dataViewGrid.events.
 *
 * @description
 * The reviJs.core.grid.dataViewGrid.events Controller for subscribing to events in the DataViewGrid Directive.
 *
 */
(function () {
    var app = angular.module('reviJs.core.grid.dataViewGrid.events');
    app.controller('reviEventsController', reviEventsController);

    function reviEventsController() {
        var events = [];
        var externalEvents = [];

        this.addEvent = addEvent;
        this.getEvents = getEvents;
        this.addExternalEvent = addExternalEvent;
        this.getExternalEvents = getExternalEvents;

        function addEvent(name, callback) {
            events.push({ name: name, callback: callback });
        }

        function getEvents() {
            return events;
        }

        function addExternalEvent(name, processor) {
            externalEvents.push({ name: name, processor: processor });
        }

        function getExternalEvents() {
            return externalEvents;
        }
    }

    reviEventsController.$inject = [];
})();