reviJs.core.menu.controller('reviJs.core.menu.Controller', [
    '$scope',
    '$rootScope',
    '$timeout',
    function ($scope, $rootScope, $timeout) {
        var vm = $scope;
        var removeListenerShowMenu = null;

        vm.model = $scope.reviModel;

        vm.clickMenuItem = function (eventName) {
            // Emit the event for the clicked item
            $rootScope.$emit(eventName);

            $timeout(function () {
                // Hide the menu
                vm.model.showMenu = false;
            });
        };

        var setupListeners = function () {
            if (removeListenerShowMenu === null) {
                removeListenerShowMenu = $rootScope.$on(reviJs.markdown.rulesets.EVENTS.SHOW_MENU, function () {
                    vm.model.showMenu = !vm.model.showMenu;
                });
            }
        };

        vm.init = function () {
            setupListeners();
        };

        $scope.$on("$destroy", function handler() {
            if (removeListenerShowMenu !== null)
            {
                removeListenerShowMenu();
                removeListenerShowMenu = null;
            }  
        });

        // Initialize the controller
        $timeout(function () {
            vm.init();
        });
    }
]);