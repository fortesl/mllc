/**
 * @ngdoc service
 * @name core.comm.Http
 *
 * @description
 * The reviJs.core.comm.Http data requests to external services.
 *
 */
reviJs.core.comm.factory('reviJs.core.comm.Http', [
    '$q',
    '$http',
    '$rootScope',
    'CacheFactory',
    'reviJs.core.comm.Event',
    'reviJs.core.comm.StatusCode',
    'reviToastrService',
    '$location',
    '$window',
    function ($q, $http, $rootScope, DSCacheFactory, event, statusCode, toastrService, $location, $window) {

        'use strict';

        var restrictEnum = {
                NONE: '0', // No restriction on pending requests
                SINGLE: '1', // Restrict pending requests to one; abort preceding requests
                SAME: '2' // Restrict pending requests to one of the same request (url and parameters)in order to not duplicate requests
            },
            defaultConfig = {
                method: 'post',
                url: null,
                restrict: restrictEnum.NONE,
                cacheTimeout: 900000
            },
            pendingRequests = {},
            cache = {
            };

        /**
         * Evaluate request restrictions. Default to NONE.
         * @param config
         */
        function restrictRequest(config){
            switch(config.restrict){
                case restrictEnum.SINGLE:
                    if(pendingRequests[config.url]){
                        pendingRequests[config.url].abort();
                    }
                    break;
                default:
                    break;
            }
        }

        /**
         * Register request as pending.
         * @param request
         * @param config
         */
        function registerRequest(request, config){
            pendingRequests[config.url] = request;
        }

        var getRootWebSitePath = function() {
            var _location = $location.absUrl();
            var applicationNameIndex = _location.indexOf('/', _location.indexOf('://') + 3);
            var markdownIndex = _location.toUpperCase().indexOf('/MARKDOWN/', _location);

            if (markdownIndex === -1) {
                return '';
            }

            return _location.substring(applicationNameIndex, markdownIndex) + '/Markdown/ShortLifecycle/';
        };
        var rootWebSitePath = getRootWebSitePath();

        var displayServiceMessage = function(data, url) {
            var toast = {};
            toast.message = data.DisplayMessage;
            toast.type =  data.SeverityLevel;
            toast.title = data.toastTitle;
            toast.url = url;
            toastrService.showToast(toast);
        };

        function request(requestConfig) {
            var config = {},
                deferredAbort = $q.defer(),
                httpRequest,
                wrapper,
                currentCache = cache[requestConfig.cacheName];

            requestConfig.url = rootWebSitePath + requestConfig.url;

            config.timeout = deferredAbort.promise;
            $.extend(config, defaultConfig, requestConfig);

            if (config.invalidateCache && currentCache) {
                currentCache.removeAll();
            }

            if (config.cacheName && config.cacheName !== '') {
                // Create a cache if it does not exists
                currentCache = cache[config.cacheName];
                if (!currentCache) {
                    var newCache = new DSCacheFactory(config.cacheName);

                    newCache.setMaxAge(config.cacheTimeout);
                    // There are three options: None (Default), Passive, and Aggressive.  I don't think we want anything other than
                    // Aggressive ever...
                    //  None - Items will not be removed from the cache even if they have expired.
                    //  Passive - Items will be deleted if they are requested after they have expired, resulting in a miss.
                    //  Aggressive - Items will be deleted as soon as they expire.
                    newCache.setDeleteOnExpire('aggressive');
                    cache[config.cacheName] = newCache;
                    currentCache = cache[config.cacheName];
                }

                // Using a create Cache on the Cache Array see if the data exists and use it if it is there
                var cacheId = config.url + $.param(JSON.stringify(config.data)),
                    cachePromise = $q.defer(),
                    data = currentCache.get(cacheId);

                if (data) {
                    wrapper = cachePromise.promise;
                    cachePromise.resolve(data);

                    return wrapper;
                }
            }

            // Handle request restrictions
            restrictRequest(config);

            httpRequest = $http(config);

            wrapper = httpRequest.then(
                function (response) {
                    delete pendingRequests[response.config.url];

                    // Check that response from server has valid format for handling
                    if(response.data && response.data.Successful !== undefined) {
                        // Request successful on server
                        if (response.data.Successful) {
                            if (currentCache) {
                                // If Cache Exists put it on the Current Cache
                                currentCache.put(cacheId, response.data);
                            }
                        }
                        // Request failed on server
                        else {
                            response.data.Reason = true; //make a toast for all API errors
                        }

                        //display toast
                        if (response.data.Reason) {
                            displayServiceMessage(response.data, response.config.url);
                        }
                    }
                    return (response.data);
                },
                function (response) {
                    switch(response.status){
//                        case statusCode.SESSION_EXPIRED:
//                            $rootScope.$emit(event.SESSION_EXPIRED);
                        //                            break;
                        case 401:
                            $window.location.href = response.data.loginPageUrl;
                            break;
                   }
                    return ($q.reject(response));
                }
            );
            wrapper.deferredAbort = deferredAbort;
            wrapper.config = config;
            wrapper.abort = function () {
                pendingRequests[config.url].deferredAbort.resolve(null);
                delete pendingRequests[config.url];
            };

            wrapper["finally"]( // es5 compliant for use of reserved word 'finally'
                function () {
                    // TODO: May need to clean up references to deferred promise
                }
            );

            registerRequest(wrapper, config);

            return wrapper;
        }

        function generateUrl(path) {
            return rootWebSitePath + path;
        }

        // Expose public methods and properties
        return {
            request : request,
            restrictions : restrictEnum,
            defaultConfig: defaultConfig,
            generateUrl: generateUrl
        };
    }
]);