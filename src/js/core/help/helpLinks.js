/**
 * @ngdoc service
 * @name help.helpLinks
 *
 * @description
 * A service to use when needing to update the help links for a specifc topic
 *
 */

reviJs.core.help.factory('reviJs.core.help.helpLinks',
    ['$http','$location',
    function ($http, $location) {
        
        /**
        * Updates the help links in the UI to point to the help page of a specific topic
        * @param topic The topic with which to update the help links for.
        * @return {promise} The promise returned from requesting the server for topical help link.
        */
        var updateHelpLink = function (topic) {
            return getHelpLink(topic)
                .then(function (response) {
                    var helpUrl = response.data.url;
                    angular.element("#helpTextAnchor")[0].href = helpUrl;
                    angular.element("#helpImageAnchor")[0].href = helpUrl;
                });
        };

        var getRootWebSitePath = function () {
            var _location = $location.absUrl();
            var applicationNameIndex = _location.indexOf('/', _location.indexOf('://') + 3);
            var markdownIndex = _location.toUpperCase().indexOf('/MARKDOWN/', _location);

            if (markdownIndex == -1)
                return '';

            var webFolderFullPath = _location.substring(applicationNameIndex, markdownIndex) + '/';

            return webFolderFullPath;
        };
        

        /**
        * Requests the server for a specific help url based on a topic.
        * @param topic The topic with which to get the help url for.
        * @return {promise} The promise returned from requesting the server for topical help link.
        */
        var getHelpLink = function (topic) {
            var rootWebSitePath = getRootWebSitePath();
            if (rootWebSitePath === "") rootWebSitePath = "/";
            return $http.get(rootWebSitePath + 'HelpTopic/GetLink/' + topic);
        };

        return {
            updateHelpLink: updateHelpLink
        };
}]);