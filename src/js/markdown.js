(function () {
    'use strict';

    angular.module('Markdownllc', ['jm.i18next', 'reviJs.core', 'ngRoute', 'jsonFormatter'])

        .config(function ($routeProvider) {

            $routeProvider.
                when('/calendar', {
                    controller: 'MarkdownCalendarController as calendarCtrl',
                    templateUrl: reviJs.configParams.templateRoot + 'src/templates/llc/calendar/calendarView.html'
                }).
                when('/rulesets', {
                    controller: 'MarkdownRulesetsController as rulesetsCtrl',
                    templateUrl: reviJs.configParams.templateRoot + 'src/templates/llc/rulesets/rulesetsView.html'
                }).
                otherwise({ redirectTo: '/calendar' });
        });

})();
