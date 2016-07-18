reviJs.core.control.filter.directive('reviControlFilterStatusForm',['$q',function($q){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            reviOnCancel: '&',
            reviOnAdd: '&',
            reviModel: '='
        },
        templateUrl : 'core/control/filter/StatusForm.html',
        link : function(scope){
            scope.submit = function() {
                var fields = scope.reviModel.fields;
                var statusLabel = fields[0].label;
                var operator = $.grep(fields[0].options, function (n, i) {
                    return (n.value === fields[0].value);
                })[0];
                var item = {
                    id: fields[0].value,
                    title: statusLabel + ' : ' + operator.label,
                    details: '\'' + operator.label + '\' ' + fields[0].operatorLabel + ' ' + statusLabel,
                    nodeType: '4'
                };

                scope.reviOnAdd({ item: item });
                scope.cancel();
            };

            scope.cancel = function () {
                scope.reviOnCancel();
            };
        }
    };
}]);