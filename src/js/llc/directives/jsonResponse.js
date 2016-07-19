
(function () {
    'use strict';

    angular.module('Markdownllc').directive('jsonResponse', function() {
        return {
            restrict: 'E',
            scope: {
                name: '@',
                response: '=',
                openBranches: '@'
            },
            template: '<div class="revi-json">' +
                        '<div class="revi-json-label">{{name}}</div>' +
                        '<json-formatter json="response" open="openBranches"></json-formatter>' +
                        '<hr>' +
                      '</div>'
        };
    });

})();