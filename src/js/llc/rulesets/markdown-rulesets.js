(function () {
    'use strict';

    angular.module('Markdownllc').controller('MarkdownRulesetsController', ['llcServices',
        function(llcServices) {
            var self = this;
            self.message = "Hello There. Welcome to the Markdown Rulesets page";

            var getRulesets = function() {
                self.markdownRulesetsJson = {};

                self.isBusy = true;
                llcServices.sendRequest({url: 'markdownRulesets'}).then(function(results) {
                    self.markdownRulesetsJson = results.fields;
                }, function() {
                    self.markdownRulesetsJson = {error: 'Could not get Markdown calendar data'};
                }).then(function() {
                    self.isBusy = false;
                });
            };

            self.init = function () {
                getRulesets();
            };

            self.init();
        }
    ]);

})();