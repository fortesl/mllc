/*
 * This directive renders angular templates/directives inside slickgrid.  Based
 * on <http://stackoverflow.com/questions/18392151/one-off-rendering-of-an-angular-template-string>.
 *
 * Performance guidelines:
 *
 * Formatter functions that return html will almost always be the fastest.
 *
 * If you're using a template, always use simple interpolation if possible.  This
 * will render synchronously has good performance because it does not require a
 * $scope.$apply.
 *      eg. '<div>{{var.bound.to.scope}}</div>'
 *
 * Some directives will render synchronously.  These should have similar performance
 * to interpolated templates.
 *
 * Other directives (such as those that use ng-repeat internally) will require a call to
 * scope.$apply.  The user will see a lag before these directives are displayed.
 * It should be possible to make all directives render synchronously, but this will probably
 * require a source code modification to slick.grid.js.
 *
 *
 */
reviJs.core.grid.dataGrid.formatters.factory('reviJs.core.grid.dataGrid.formatters.templateRenderer',
    ['$rootScope', '$interpolate', '$compile', function($rootScope, $interpolate, $compile) {
        var templates = new Array();
        function createGuid() {

            function s4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            function guid() {
                return (s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4());
            }

            return guid();
        };

        /*
         * This function renders the angular template and returns html to Slick
         * Grid.
         */
        function templateRenderer(row, cell, value, columnDef, dataContext) {

            var cellScope = $rootScope.$new(true);

            cellScope.value = value;
            cellScope.context = dataContext;
            // Interpolate (i.e. turns {{context.myProp}} into its value)
            var interpolated = $interpolate(columnDef.template)(cellScope);

            // Compile the interpolated string into an angular object
            var linker = $compile(interpolated);
            var o = linker(cellScope);

            // Create a guid to identify this object
            var guid = createGuid();

            // Set this guid to that object as an attribute
            o.attr("guid", guid);

            // Store that Angular object into a dictionary
            templates[guid] = o;

            // Returns the generated HTML: this is just so the grid displays the generated template right away, but if any event is bound to it, they won't work just yet
            return o[0].outerHTML;
        }

        /*
         * Because templateRenderer returns html, the angular directive/template
         * will be displayed, but the actual  nodes which have events bound to
         * them have not been inserted into the dom.  We insert them using the
         * asyncPostRender function of slickgrid.
         */
        function templatePostRender(cellNode) {
            // From the cell, get the guid generated on the formatter above
            var guid = $(cellNode.firstChild).attr("guid");

            if(!guid) return;

            // Get the actual Angular object that matches that guid
            var template = templates[guid];

            // Remove it from the dictionary to free some memory, we only need it once
            delete templates[guid];

            if (template) {
                // Empty the cell node...
                $(cellNode).empty();
                // ...and replace its content by the object (visually this won't make any difference, no flicker, but this one has event bound to it!)
                $(cellNode).append(template);

            } else {
                //console.log("Error: template not found");
            }
        }

        function headerCellRenderer(cell, column, value, row) {
            /*
             * Passing in coordinates ( -1, -1 ) to tell a formatter we're
             * rendering to a header cell.  Also pass in an empty object for
             * dataContext since a header cell is not associated with a row.
             */
            var html;

            if (angular.isDefined(column.headerFormatter)) {
                html = column.headerFormatter(-1, -1, value, column, row);
            } else {
                if (angular.isDefined(column.formatter)) {
                    html = column.formatter(-1, -1, value, column, row);
                } else {
                    html = '<div>' + value + '</div>';
                }
            }

            if(angular.isDefined(column.asyncPostRender)) {
                column.asyncPostRender(cell, -1, {}, column);
            } else {
                $(html).appendTo(cell);
            }

        }

        return {
            formatter: templateRenderer,
            asyncPostRender:templatePostRender,
            headerCellRenderer: headerCellRenderer
        };
}]);