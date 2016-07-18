reviJs.core.control.directive('reviControlInputField',['$compile',function($compile){
	
	var getTemplate=function(type){
		
   	 var resource=null;
     switch(type) {
         default:
         case '1':
         	resource =  '<div ><input class="revi-field" data-ng-model="ngModel.value" data-ng-pattern="ngPattern" ng-trim="false" title="{{title}}" name="{{ngModel.name}}" ng-readonly="reviReadOnly()" ng-change="ngChange()" ng-disabled="ngDisabled()" ng-required="!ngDisabled()" /></div>';
             break;
         case '2':
         	resource = '<div><input type="text" class="revi-field" data-ng-model="ngModel.value"ndata-ng-pattern="ngPattern" ng-trim="false" title="{{title}}" name="{{ngModel.name}}" ng-readonly="reviReadOnly()" ng-change="ngChange()" ng-disabled="ngDisabled()" ng-required="!ngDisabled()" revi-control-range-validator="ngModel.value" min-value="{{ngModel.min}}" max-value="{{ngModel.max}}" /></div>';
             break;
         case '4':
         	resource = '<div><select class="revi-field revi-select" data-ng-model="ngModel.value" data-ng-options="option.value as option.label for option in options | filter: reviOptionFilter()" title="{{title}}" name="{{ngModel.name}}" ng-change="ngChange()" ng-disabled="ngDisabled()" ng-required="!ngDisabled()" ng-class="ngClass()"></select></div>';
             break;
     }
     return resource;
	} 
    return {
        restrict: 'E',
        replace: true,
        require: '?ngModel',
        scope : {
            ngModel : '=',
            ngPattern : '=',
            ngChange: '&',
            ngDisabled: '&',
            ngClass: '&',
            options : '=',
            title: '@title',
            reviReadOnly: '=',
            reviOptionFilter:  '&'
        },
        link: function(scope, element, attrs){
            element.html(getTemplate(attrs.type)).show();
            $compile(element.contents())(scope);
        }

    };
}]);