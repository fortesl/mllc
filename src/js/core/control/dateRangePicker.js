reviJs.core.control.directive('reviControlDateRangePicker', ['$compile', '$parse', '$templateCache', function ($compile, $parse, $templateCache) {

    function link (isolateScope, domElement ,attributes,ngModel) {

        var options = {},
            element,
            inputElement,
            headerElement,
            scope;

        function setDateRange(startDate, endDate){
            inputElement.data('daterangepicker').startDate = moment(startDate);
            inputElement.data('daterangepicker').endDate = moment(endDate);
            inputElement.data('daterangepicker').updateView();
            inputElement.data('daterangepicker').updateCalendars();
            inputElement.data('daterangepicker').updateInputText();
        }

        function onWeekClick() {
            setDateRange(scope.reviRanges.week.startDate, scope.reviRanges.week.endDate);
            inputElement.data('daterangepicker').hide();
        }

        function onMonthClick() {
            setDateRange(scope.reviRanges.month.startDate, scope.reviRanges.month.endDate);
            inputElement.data('daterangepicker').hide();
        }

        function onQuarterClick() {
            setDateRange(scope.reviRanges.quarter.startDate, scope.reviRanges.quarter.endDate);
            inputElement.data('daterangepicker').hide();
        }

        function patchBootstrapDatepicker(element,scope,ngModel){
            var flyout = element.data('daterangepicker').container;

            // Remove unneeded controls
            flyout.find('.ranges').remove();

            // Setup date range button click callbacks
            scope.reviRanges.week.onClick = scope.reviRanges.week.onClick || onWeekClick;
            scope.reviRanges.month.onClick = scope.reviRanges.month.onClick || onMonthClick;
            scope.reviRanges.quarter.onClick = scope.reviRanges.quarter.onClick || onQuarterClick;

            // Setup custom labels
            scope.startDateLabel = scope.reviLabels.startDateCalendar;
            scope.endDateLabel = scope.reviLabels.endDateCalendar;

            // Update on start date click
            flyout.find('.calendar.left').on('click',function(e){
                if($(e.target).hasClass('available')){
                    inputElement.data('daterangepicker').updateInputText();
                    scope.$apply(function(){
                        ngModel.$setViewValue({ startDate: inputElement.data('daterangepicker').startDate, endDate: inputElement.data('daterangepicker').endDate });
                        ngModel.$render();
                    });
                }
            });

            // Apply on end date click
            flyout.find('.calendar.right').on('click',function(e){
                if($(e.target).hasClass('available')){
                    inputElement.data('daterangepicker').hide();
                }
            });

            // Inject custom header
            headerElement = $compile($templateCache.get('core/control/dateRangePicker/dateRangePickerHeader.html'))(scope);
            flyout.prepend(headerElement);
        }

        /**
         * Set date picker options.
         * @param attributes
         * @param scope
         * @returns {{}}
         */
        function parseOptions(attributes, scope) {
            var options = {};
            options.format = attributes.format || reviJs.configParams.defaultDateFormat;
            options.separator = attributes.separator || ' - ';
            options.ranges = attributes.reviRanges && $parse(attributes.reviRanges)(scope);
            options.minDate = scope.reviMinDate;
            options.maxDate = scope.reviMaxDate;
            options.dateLimit = scope.reviDateLimit;
            // Optionally wrap the dropdown in a known element.
            options.parentEl = scope.reviContainerClass ? $('<div />')
                .addClass('revi-daterangepicker-' + scope.reviContainerClass)
                .css('position', 'absolute')
                .appendTo('body') : null;
            options.opens = scope.opens || 'center';
            return options;
        }

        element = domElement;
        inputElement = $(element).find('input');
        scope = isolateScope;

        //HACK - handles arrow icon clicks.
        //Correct fix should have been adding a dom element to make the icon selectable
        //so that the fix could be unit tested.
        $(domElement).click(function () {
            inputElement.focus();
        });

        options = parseOptions(attributes, scope);

        scope.$watch("ngModel", function (modelValue) {
            if (!modelValue || (!modelValue.startDate)) {
                ngModel.$setViewValue({ startDate: moment().startOf('day'), endDate: moment().startOf('day') });
                ngModel.$render();
                return;
            }

            setDateRange(modelValue.startDate, modelValue.endDate);
        });

        inputElement.daterangepicker(options, function(start, end) {
            scope.reviOnApply({startDate:start,endDate: end});
        });

        patchBootstrapDatepicker(inputElement,scope,ngModel);
    }

    return {
        restrict: 'E',
        replace: true,
        scope: {
            reviRanges : '=',
            ngModel: '=',
            reviLabels: '=',
            reviOnApply: '&',
            reviMinDate:'=',
            reviMaxDate:'=',
            reviDateLimit: '=',
            opens: '=reviOpens',
            reviContainerClass: '='
        },
        require: '?ngModel',
        templateUrl: 'core/control/dateRangePicker/dateRangePicker.html',
        link: link
    };
}]);