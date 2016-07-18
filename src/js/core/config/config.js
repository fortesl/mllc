/**
 * @ngdoc service
 * @name core.config
 *
 * @description
 * A service to use when needing core configuration data like paths
 *
 */

reviJs.core.config = reviJs.core.factory('reviJs.core.config', ['$location',
    function ($location) {

        var apiRootPath = '';

        /**
        * parses the url and returns only the relative parts that make up the root path of the application
        * @return {string} a string containing  the relative parts of the url that make up the root path of the application
        */
        var getRootWebSitePath = function () {
            var _location = $location.absUrl();
            var applicationNameIndex = _location.indexOf('/', _location.indexOf('://') + 3);
            var markdownIndex = _location.toUpperCase().indexOf('/MARKDOWN/', _location);

            if (markdownIndex == -1)
                return '';

            var webFolderFullPath = _location.substring(applicationNameIndex, markdownIndex) + '/';

            return webFolderFullPath;
        }

        /**
        * Initializes the service.
        */
        var init = function () {

            apiRootPath = getRootWebSitePath();
        };

        init();

        return {
            paths: {
                apiRoot: apiRootPath
            }
        };
    }]);