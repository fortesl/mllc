(function () {
    'use strict';

    angular.module('Markdownllc').controller('MarkdownRulesetsController', ['llcServices',
        function(llcServices) {
            var self = this;
            self.message = "Hello There. Welcome to the Markdown Rulesets page";

            var getRulesets = function() {
                self.markdownRulesetsJson = {my: 'json'};

                llcServices.sendRequest({url: 'markdownRulesets'}).then(function(results) {
                    self.markdownRulesetsJson = results.fields;
                }, function() {
                    self.markdownRulesetsJson = {error: 'Could not get Markdown calendar data'};
                });
            };

            self.init = function () {
                getRulesets();
            };

            self.init();
        }
    ]);

})();