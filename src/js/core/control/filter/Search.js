/**
 * Directive facilitating live search results from external source.
 */
reviJs.core.control.filter.directive('reviControlFilterSearch',['$q',function($q){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            reviPlaceholder: "@",
            reviSearchTerm: '=',
            reviOnSelect: '&',
            reviProvider:'&',
            reviLoadingFlag:'&',
            reviAttributeFormModel: '=',
            reviAttributeFilterToolTooltip:'@',
            reviStatusFilterToolTooltip: '@',
            reviStatusFormModel: '=',
            reviStatusFormDisplayed: '=',
            reviAttributeFilterFormDisplayed: '=',
        },
        templateUrl : 'core/control/filter/Search.html',
        link : function(scope, element, attrs, ctrls){

            /**
             * Flag for whether the add attribute filter flyout is visible;
             * @type {boolean}
             */
            scope.isAttributeFilterFormDisplayed = false;
            scope.isStatusFormDisplayed = false;
            scope.isAttributeFilterButtonDisplayed = scope.reviAttributeFilterFormDisplayed;
            scope.isStatusButtonDisplayed = scope.reviStatusFormDisplayed;

            scope.toggleAttributeFilterForm = function () {
                scope.isAttributeFilterFormDisplayed = !scope.isAttributeFilterFormDisplayed;
                scope.clearSearchTerm();
            };

            scope.toggleStatusFilterForm = function () {
                scope.isStatusFormDisplayed = !scope.isStatusFormDisplayed;
            };
            
            /**
             * Resets the search control value.
             */
            scope.clearSearchTerm = function(){
                scope.reviSearchTerm  = '';
            };

            /**
             * Calls passed callback function when the search term changes or control receives focus.
             * @param searchTerm The string value of the search input field.
             * @returns {*}
             */
            scope.onSearchTermChanged = function (searchTerm) {
                return scope.reviProvider({ searchTerm: searchTerm }).then(function (result) {
                    return result;
                });
            };

            /**
             * Pass through of filter item from attribute filter form to parent callback.
             * @param item
             */
            scope.onAttributeFilterAdd = function(item){
                scope.reviOnSelect({item:item});
            };
            
            /**
             * Calls passed callback when an item is selected for the search results list.
             * @param item
             */
            scope.onItemSelected = function(item){
                scope.reviOnSelect({item:item});
                scope.clearSearchTerm();
            };

            /**
             * Flag indicating whether the control is waiting for search results (a data provider response).
             * @returns {boolean}
             */
            scope.isSearching= function(){
                return scope.reviLoadingFlag();
            }
        }
    };
}]);