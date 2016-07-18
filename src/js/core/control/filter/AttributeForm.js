/**
 * Directive facilitating configuring and adding an attribute/field filter.
 */
reviJs.core.control.filter.directive('reviControlFilterAttributeForm',['$q', 'reviJs.markdown.core.data.Enums',function($q, enums){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            reviOnCancel: '&',
            reviOnAdd: '&',
            reviModel: '='
        },
        templateUrl : 'core/control/filter/AttributeForm.html',
        link : function(scope, element, attrs, ctrls){

            var fields = scope.reviModel.fields,
                pristineFields = angular.copy(fields);

            function getSelectedAttribute() {
                return $.grep(fields.attributeField.options,function(n,i){
                    return (n.value === fields.attributeField.value);
                })[0];
            }

            function getSelectedOperator() {
                return $.grep(fields.operatorField.options,function(n,i){
                    return (n.value === fields.operatorField.value);
                })[0];
            }

            function getValue() {
                var attribute = getSelectedAttribute();
                switch (attribute.properties.DataType) {
                    case enums.filterDataTypes.INTEGER:
                    case enums.filterDataTypes.DECIMAL:
                        return fields.numericField.value;
                    case enums.filterDataTypes.DATE:
                        return moment(fields.dateField.value).format(reviJs.configParams.defaultDateFormat);
                    case enums.filterDataTypes.MONEY:
                        return fields.moneyField.value;
                    default:
                        return fields.textField.value;
                }
            }

            // Toggle numeric field validation to allow a wildcard for 'Like' and whitespace/commas for 'In'.
            function updateNumericValidation() {
                var operator = getSelectedOperator();
                var attribute = getSelectedAttribute();
                if (operator.value === 'Like') {
                    // Allow use of wildcards (*) with Like operator.
                    fields.numericField.validation = attribute.properties.DataType === enums.filterDataTypes.DECIMAL ? /^-?[\d.*]+$/ : /^-?[\d*]+$/;
                }
                else if (operator.value === 'In') {
                    // Allow use of commas and whitespace with In operator.
                    fields.numericField.validation = attribute.properties.DataType === enums.filterDataTypes.DECIMAL ? /^-?[\d.\s,]+$/ : /^-?[\d\s,]+$/;
                }
                else {
                    fields.numericField.validation = attribute.properties.DataType === enums.filterDataTypes.DECIMAL ? /^-?\d+(\.\d{1,2})?$/ : pristineFields.numericField.validation;
                }
            }

            scope.submit = function() {
                var attribute = getSelectedAttribute();
                var operator = getSelectedOperator();
                var item = {
                    id: getValue(),
                    attributeType: attribute.value,
                    operatorType: operator.value,
                    dataType: attribute.properties.DataType,
                    title: attribute.label + ' : ' + getValue(),
                    details: attribute.label + ' ' + operator.label + ' \'' + getValue()+ '\'',
                    nodeType: '3'
                };
                scope.reviOnAdd({item:item});
                scope.cancel();
            };

            scope.availableOperators = function(operator, index, allOperators) {
                var attribute = getSelectedAttribute();
                if (attribute.properties.AllowedOperators.indexOf(index) === -1) {
                    // If current operator selection is not allowed for this attribute, reset it to a valid option.
                    if (operator.value === fields.operatorField.value) {
                        fields.operatorField.value = fields.operatorField.options[attribute.properties.AllowedOperators[0]].value;
                    }
                    return false;
                }
                return true;
            };

            scope.showTextField = function() {
                var attribute = getSelectedAttribute();
                return attribute.properties.DataType === enums.filterDataTypes.TEXT;
            };

            scope.showNumericField = function() {
                var attribute = getSelectedAttribute();
                return attribute.properties.DataType === enums.filterDataTypes.INTEGER || attribute.properties.DataType === enums.filterDataTypes.DECIMAL;
            };

            scope.showMoneyField = function () {
                var attribute = getSelectedAttribute();
                return attribute.properties.DataType === enums.filterDataTypes.MONEY;
            };

            scope.showDateField = function() {
                var attribute = getSelectedAttribute();
                return attribute.properties.DataType === enums.filterDataTypes.DATE;
            };

            scope.attributeChanged = function() {
                updateNumericValidation();
            };

            scope.operatorChanged = function() {
                updateNumericValidation();
            };

            scope.neverDisableDate = function() {
                return false;
            };

            scope.cancel = function(){
                fields.textField.value = pristineFields.textField.value;
                fields.numericField.value = pristineFields.numericField.value;
                fields.dateField.value = pristineFields.dateField.value;
                scope.reviOnCancel();
            };
        }
    };
}]);