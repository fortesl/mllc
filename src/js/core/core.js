/**
 * @ngdoc object
 * @name core
 *
 * @description
 * The reviJs.core module defines the core system namespace and package for the client side application. The module
 * facilitates core functionality, configuration, and dependency injection across portal projects.
 *
 */
window.reviJs = window.reviJs || {};

reviJs.core = angular.module('reviJs.core',
    ['reviJs.core.control', 'reviJs.core.menu', 'reviJs.core.help', 'reviJs.core.comm', 'reviJs.core.grid', 'reviJs.core.helpers',
        'revi-toastr']);