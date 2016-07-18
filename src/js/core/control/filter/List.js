reviJs.core.control.filter.directive('reviControlFilterList',[function(){
    return {
        restrict: 'E',
        replace: true,
        scope : {
            activeFilters:'=reviModel',
            reviUpdateCallback:'&reviOnReorder',
            reviRemoveCallback:'&reviOnRemove',
            reviOperatorChangeCallback:'&reviOnOperatorChange'
        },
        templateUrl : 'core/control/filter/List.html',
        link : function(scope, element, attrs, ctrls){
            scope.previousIndex = null;

            scope.reviOnUpdate = function(event, ui){
                scope.reviUpdateCallback({previousIndex:scope.previousIndex,currentIndex:ui.item.index(),filter:ui.item.scope().$parent.filter});

            };
            scope.reviOnRemove = function(index){
                scope.reviRemoveCallback({index:index});
            };

            scope.reviOnOperatorChange = function(index){
                scope.reviOperatorChangeCallback({index:index});
            };

            scope.reviOnStartMove = function(event,ui){
                scope.previousIndex = ui.item.index();
            };

            /* Setup */
            scope.sortableOptions = {
                axis: 'y',
                cursor: 'move',
                start: scope.reviOnStartMove,
                stop: scope.reviOnUpdate
            };
        }
    };
}]);