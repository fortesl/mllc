/**
 * @ngdoc service
 * @name core.helpers
 *
 * @description
 * A service to pull common string functions
 *
 */

reviJs.core.helpers.factory('reviJs.core.helpers.StringHelper', ['$templateCache',function ($templateCache) {
    function trim(inputString) {
        return inputString.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Minimal template interpolation using regex for faster cell rendering.
     * @param templateUrl
     * @param {Object} scope Single layer deep (object with flat properties).
     * @returns {*}
     */
    var fastInterpolateToFlatObject = function(templateUrl, scope) {
        return $templateCache.get(templateUrl).replace(/{{([^{}]+)}}/g, function(value, matchIndex) {
            var match = value.match(/([^{}\.]+)/g);
            if (match.length > 1) {
                return scope[match[1]];
            } else {
                return scope[match[0]];
            }
        });
    };

    // NOTE: Removes the white space around the inputString and its CSV elements
    function scrubCSVString(inputString) {
        var inputValue = this.trim(inputString).split(",");
        var outputValue = "";
        var self = this;

        angular.forEach(inputValue, function (entry) {
            entry = self.trim(entry);

            if (entry !== "" && outputValue === "")
                outputValue = entry;
            else if (entry !== "")
                outputValue += "," + entry;
        });

        return outputValue;
    }

    return { 
        trim: trim,
        scrubCSVString: scrubCSVString,
        fastInterpolateToFlatObject:fastInterpolateToFlatObject
    };

}]);