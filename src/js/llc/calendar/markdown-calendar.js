(function () {
    'use strict';

    angular.module('Markdownllc').controller('MarkdownCalendarController', [
        'llcServices',
        function(llcServices) {
            var self = this;
            self.message = "Hello There. Welcome to the Markdown Calendar page";


            var getMarkdownCalendar = function() {
                self.markdownCalendarJson = {};
                self.isBusy = true;

                llcServices.sendRequest({url: 'markdownCalendar'}).then(function(results) {
                    self.markdownCalendarJson = results;
                }, function() {
                    self.markdownCalendarJson = {error: 'Could not get Markdown calendar data'};
                }).then(function() {
                    self.isBusy = false;
                });
            };

            var getMarkdownEventsList = function() {
                self.markdownEventsListJson = {my: 'json'};

                var today = moment();
                var endDate = moment().add(30, 'day');
                var params = {
                    StartDate: today,
                    EndDate: endDate,
                    StatusCode: 0,
                    EventName: '',
                    page: 1,
                    pageSize: 50,
                    skip: 0,
                    sort: [{FieldName: 'StartDate', Direction: 0}],
                    take: 50
                };

                self.isBusy = true;
                llcServices.sendRequest({url: 'markdownEventsList', data: params}).then(function(results) {
                    self.markdownEventsListJson = results;
                }, function() {
                    self.markdownEventsListJson = {error: 'Could not get Markdown Events List data'};
                }).then(function() {
                    self.isBusy = false;
                });
            };

            self.init = function () {
                getMarkdownCalendar();
                getMarkdownEventsList();
            };

            self.init();
        }
    ]);

})();