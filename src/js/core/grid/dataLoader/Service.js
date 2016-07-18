/// <reference path="../../../../../typings/angularjs/angular.d.ts"/>
(function () {
    angular.module('reviJs.core.grid.dataLoader')
        .service('reviJs.core.grid.dataLoader.Service', dataLoaderService);

    function dataLoaderService($q) {

        this.createInstance = createInstance;

        function createInstance() {
            /**
            * Private variables
            */
            var _request,
                _cache = [],
                _secondaryCache,
                _cacheHelper,
                _lastRequestedOptions,
                _DEFAULT_OPTIONS = {
                    rowIdFieldName: 'id',
                    useCache: true
                },
                _options;

            /**
            * API
            */
            return {
                init: init, // (request),
                getData: getData // (take, skip)
            };

            /**
            * init (Constructor)
            *
            * Request - function that takes in params in order to make the request
            *              ex. function ({ Take: 500, Skip: 0,
            *                              Filter: [], Metadata: {},
            *                              other: 'and so on depending on what is required in the requested service call' })
            */
            function init(request, cacheHelper, options) {
                if (angular.isFunction(request)) {
                    _request = request;
                }
                if (angular.isFunction(cacheHelper)) {
                    _cacheHelper = cacheHelper;
                }
                _options = angular.extend({}, _DEFAULT_OPTIONS, options || {});
            }

            /**
            * getData
            *      obtain data from application
            *
            * Take - maximum number of records expected in response
            * Skip - number of records to ignore before returned records are returned
            * Options - Request data
            */
            function getData(take, skip, options) {
                skip = (skip || 0) < 0 ? 0 : skip; // default value to 0
                take = (take || 1) < 1 ? 1 : take; // default value to 1

                if (!angular.isFunction(_request)) {
                    return $q.reject('Factory was initialized without a request function');
                }

                if (!angular.equals(_lastRequestedOptions, options)) {
                    _cache = [];
                    _lastRequestedOptions = angular.copy(options);
                }

                if (allCached(skip, take)) {
                    return buildResponseFromCache(skip, take);
                }

                var p = $q.defer();

                _request(
                    { limit: take + skip, start: skip, options: options }
                    ).then(function (response) {
                        response.cache = false;
                        tagRows(response, skip);
                        processCache(response, skip);
                        p.resolve(response);
                    }).catch(function (response) {
                        p.reject(response);
                    });

                return p.promise;
            }

            /**
            * tagRows
            *      add a unique sequencial row number to each item
            *
            * Take - maximum number of records expected in response
            * Skip - number of records to ignore before returned records are returned
            */
            function tagRows(response, skip) {
                angular.forEach(response.items, function (item, index) {
                    item[_options.rowIdFieldName] = skip + index + 1;
                });
            }

            /**
            * buildResponseFromCache
            *      using cached data to mocke responses
            *
            * Take - maximum number of records expected in response
            * Skip - number of records to ignore before returned records are returned
            */
            function buildResponseFromCache(skip, take) {
                var items = _cache.slice(skip, skip + take);

                var response = _secondaryCache || {};
                response = angular.copy(response);
                angular.extend(response, {
                    cache: true,
                    items: items,
                    reletiveLength: items.length
                })

                return $q.when(response);
            }

            /**
            * allCached
            *      determines if the requested data can be build from cached data
            *
            * Take - maximum number of records expected in response
            * Skip - number of records to ignore before returned records are returned
            */
            function allCached(skip, take) {
                for (var index = skip + take - 1; index >= skip; index--) {
                    if (!_cache[index]) {
                        return false;
                    }
                }
                return true;
            }

            /**
            * processCache
            *
            * Response - http response
            * Skip - number of records to ignore before returned records are returned
            */
            function processCache(response, skip) {
                if (angular.isFunction(_cacheHelper)) {
                    var nonListCache = _cacheHelper(response);
                    nonListCache.items = undefined;
                    nonListCache.reletiveLength = undefined;
                    _secondaryCache = nonListCache;
                }
                angular.forEach(response.items, function (item, itemIndex) {
                    var key = skip + itemIndex;
                    _cache[key] = angular.copy(item);
                });
            }
        };
    };
    dataLoaderService.$inject = ['$q'];
})();