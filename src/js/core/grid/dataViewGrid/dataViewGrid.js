/**
 * @ngdoc Module
 * @name Data View Grid Module.
 *
 * @description
 * The reviJs.core.grid.dataViewGrid defines Dataviewgrid module.
 *
 */
angular.module('reviJs.core.grid.dataViewGrid', [
    'reviJs.core.grid.dataViewGrid.columns',
    'reviJs.core.grid.dataViewGrid.events',
    'reviJs.core.grid.dataViewGrid.aggregates',
    'reviJs.core.grid.dataViewGrid.aggregateRow',
    'reviJs.core.grid.dataViewGrid.renderer'
]);