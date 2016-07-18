/**
 * @ngdoc object
 * @name grid
 *
 * @description
 * The reviJs.core.grid module defines the core system namespace and package for the client grids.
 *
 */
reviJs.core.grid = angular.module('reviJs.core.grid', [
    'reviJs.core.grid.dataGrid',
    'reviJs.core.grid.dataViewGrid',
    'reviJs.core.grid.dataLoader'
]);