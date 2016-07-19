var sources = {
    libs: {
        css: [
            'bower_components/slickgrid-revionics/slick.grid.css',
            'bower_components/angular-multi-select/isteven-multi-select.css',
            'bower_components/angular-toastr/dist/angular-toastr.css',
            'bower_components/json-formatter/dist/json-formatter.css'
        ],
        js: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/slickgrid-revionics/lib/jquery.event.drag-2.2.js',
            'bower_components/slickgrid-revionics/lib/jquery.event.drop-2.2.js',
            'bower_components/jquery-ui/ui/minified/jquery-ui.min.js',
            'bower_components/jquery-html5-placeholder-shim/jquery.html5-placeholder-shim.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-cache/dist/angular-cache.min.js',
            'bower_components/angular-route/angular-route.js',
            'bower_components/slickgrid-revionics/slick.core.js',
            'bower_components/slickgrid-revionics/slick.grid.js',
            'bower_components/slickgrid-revionics/slick.dataview.js',
            'bower_components/slickgrid-revionics/slick.formatters.js',
            'bower_components/slickgrid-revionics/slick.editors.js',
            'bower_components/slickgrid-revionics/slick.groupitemmetadataprovider.js',
            'bower_components/slickgrid-revionics/plugins/slick.cellselectionmodel.js',
            'bower_components/slickgrid-revionics/plugins/slick.rowselectionmodel.js',
            'bower_components/slickgrid-revionics/plugins/slick.cellrangeselector.js',
            'bower_components/slickgrid-revionics/plugins/slick.cellrangedecorator.js',
            'bower_components/slickgrid-revionics/plugins/slick.modelidrowselectionmodel.js',
            'bower_components/moment/moment.js',
            'bower_components/angular-placeholder-shim/angular-placeholder-shim.js',
            'bower_components/angular-multi-select/isteven-multi-select.js',
            'bower_components/json-formatter/dist/json-formatter.js',
            'bower_components/angular-toastr/dist/angular-toastr.tpls.js'
        ]
    },
    app: [
        'src/js/markdown.js',
        'dist/logic/markdownLlc.templates.js',
        'src/js/core/core.js',
        'src/js/core/comm/comm.js',
        'src/js/core/comm/Event.js',
        'src/js/core/comm/Http.js',
        'src/js/core/comm/Notifier.js',
        'src/js/core/comm/StatusCode.js',
        'src/js/core/menu/Menu.js',
        'src/js/core/menu/Model.js',
        'src/js/core/menu/Controller.js',
        'src/js/core/menu/View.js',
        'src/js/core/control/control.js',
        'src/js/core/control/breadcrumb.js',
        'src/js/core/control/inputField.js',
        'src/js/core/control/optionsDisabled.js',
        'src/js/core/control/typeahead.js',
        'src/js/core/control/dateFieldValidator.js',
        'src/js/core/control/datePickerField.js',
        'src/js/core/control/dateRangePicker.js',
        'src/js/core/control/minMaxValidator.js',
        'src/js/core/control/rangeValidator.js',
        'src/js/core/control/filter/filter.js',
        'src/js/core/control/filter/Search.js',
        'src/js/core/control/filter/List.js',
        'src/js/core/control/filter/AttributeForm.js',
        'src/js/core/control/filter/StatusForm.js',
        'src/js/core/filters/filters.js',
        'src/js/core/filters/DateRange.js',
        'src/js/core/grid/grid.js',
        'src/js/core/grid/Event.js',
        'src/js/core/grid/ColumnService.js',
        'src/js/core/grid/dataGrid/dataGrid.js',
        'src/js/core/grid/dataGrid/View.js',
        'src/js/core/grid/dataGrid/formatters/formatters.js',
        'src/js/core/grid/dataGrid/formatters/templateRenderer.js',
        'src/js/core/grid/dataGrid/remoteLoader/remoteLoader.js',
        'src/js/core/grid/dataGrid/remoteLoader/Service.js',
        'src/js/core/grid/dataGrid/renderer/renderer.js',
        'src/js/core/grid/dataGrid/renderer/Cell.js',
        // data view grid core component
        /// module defintions
        'src/js/core/grid/dataViewGrid/dataViewGrid.js',
        'src/js/core/grid/dataViewGrid/columns/columns.js',
        'src/js/core/grid/dataViewGrid/columns/column/column.js',
        'src/js/core/grid/dataViewGrid/events/events.js',
        'src/js/core/grid/dataViewGrid/renderer/renderer.js',
        'src/js/core/grid/dataViewGrid/events/event/event.js',
        'src/js/core/grid/dataViewGrid/aggregates/aggregates.js',
        'src/js/core/grid/dataViewGrid/aggregates/aggregate/aggregate.js',
        'src/js/core/grid/dataViewGrid/aggregateRow/aggregateRow.js',

        /// controller defintions
        'src/js/core/grid/dataViewGrid/Controller.js',
        'src/js/core/grid/dataViewGrid/events/Controller.js',
        'src/js/core/grid/dataViewGrid/aggregates/Controller.js',
        'src/js/core/grid/dataViewGrid/columns/Controller.js',

        /// directive defintions
        'src/js/core/grid/dataViewGrid/View.js',
        'src/js/core/grid/dataViewGrid/columns/View.js',
        'src/js/core/grid/dataViewGrid/columns/column/View.js',
        'src/js/core/grid/dataViewGrid/events/View.js',
        'src/js/core/grid/dataViewGrid/events/event/View.js',
        'src/js/core/grid/dataViewGrid/aggregates/View.js',
        'src/js/core/grid/dataViewGrid/aggregates/aggregate/View.js',
        'src/js/core/grid/dataViewGrid/aggregateRow/View.js',

        /// factory defintions
        'src/js/core/grid/dataViewGrid/renderer/GroupCell.js',

        // END of data view grid core components

        // data loader factory
        /// module defintions
        'src/js/core/grid/dataLoader/dataLoader.js',

        /// factory definitions
        'src/js/core/grid/dataLoader/Service.js',

        // END of data loader factory core components

        'src/js/core/control/modalDialog.js',
        'src/js/core/layers/modal.js',
        'src/js/core/help/help.js',
        'src/js/core/helpers/helpers.js',
        'src/js/core/helpers/stringHelper.js',
        'src/js/core/help/helpLinks.js',
        'src/js/core/toastr/toastr.js',
        'src/js/core/toastr/Model.js',
        'src/js/core/toastr/revi-angular-toastr.js',

        //i18n bundle
        'src/js/core/revi-i18n-bundle/i18next.js',
        'src/js/core/revi-i18n-bundle/rev-i18next-provider.js',
        'src/js/core/revi-i18n-bundle/rev-i18n-bootstrap.js',
        'src/js/core/revi-i18n-bundle/angular-i18next-filter.js',
        'src/js/core/revi-i18n-bundle/angular-i18next.js',


        //MARKDOWN LLC
        'src/js/llc/**/*.js'
    ]
};

module.exports = sources;