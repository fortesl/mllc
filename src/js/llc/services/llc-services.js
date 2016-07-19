(function() {
    'use strict';

    angular.module('Markdownllc').factory('llcServices', [
        'reviJs.core.comm.Http',
        function(http) {
            var llcBaseRequest = {
                restrict: http.restrictions.SINGLE,
                cacheName: 'llcService',
                invalidateCache: false,
                data: {}
            };

            var serviceEndPoints = {
                markdownCalendar: {
                    url:'RevMeta/GetDefaultDynaModelMetaData/13'
                  },
                markdownRulesets: {
                      url: 'RevMeta/GetDefaultDynaModelMetaData/13'
                },
                markdownEventsList: {
                    url: 'Markdown/GetEventsListKendo'
                }
            };

            function sendRequest(params) {
                var request = {};

                angular.extend(request, llcBaseRequest);

                request.url = serviceEndPoints[params.url].url;
                if (params.data) {
                    request.data = params.data;
                }

                return http.request(request);
            }


            return {
                sendRequest: sendRequest
            };
    }]);

})();
