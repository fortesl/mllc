/*
 * Example loader service which will request rows from the server as needed.
 * This is based on the remote model example provided with slickgrid in 
 * slick.remotemodel.js .
 * 
 * The loader exposes a data object which is passed into slickgrid construction.
 * When the user scrolls down and requests rows which have not yet been loaded, 
 * the loader will notify the grid using a onDataLoading event.  Once the rows have
 * been retrieved, the loader will notify the grid using an onDataLoaded event.
 * 
 * Usage:
 * 
 * Include the remoteloader as a dependency in the angular component you'd like 
 * to use it from.  To instantiate it, you need to pass it a function which returns
 * a promise which will resolve with an object that looks like:
 * {
 *      totalItems: Number,  // Total number of rows matched with this query
 *      pageSize: Number,    // Maximum number of rows retrieved at a time.
 *      sort: [
 *          {
 *              field: String, // Column field we're sorting on.
 *              direction: -1 or 1 // 1 is ascending, -1 is descending.
 *          }
 *      ],
 *      aggregate: {
 *          {columnField}: value, // Column field references the column this data is for
 *                                // value is the value of the aggregate cell which will be
 *                                // rendered using the renderer of the column.
 *      },
 *      items: []     // array of item objects that will be populated into the data object.
 * }
 * 
 * 
 * After you have instantiated the object with something like
 * 
 * var loader = new RemoteLoader(retrieverFunction);
 * 
 * loader will be an object which exposes the following objects and functions:
 * 
 * {
 *    // data object which contains rows that have been retreived.
 *    "data": data,
 *    // Contains aggregate row data
 *    "aggregate":aggregate,
 *    // methods
 *    "clear": clear,
 *    "isDataLoaded": isDataLoaded,
 *    "ensureData": ensureData,
 *    "reloadData": reloadData,
 *    "setSort": setSort,
 *    "setSearch": setSearch,
 *    // events
 *    "onDataLoading": onDataLoading,
 *    "onDataLoaded": onDataLoaded,
 * }
 * 
 */
reviJs.core.grid.dataGrid.remoteLoader.factory('reviJs.core.grid.dataGrid.remoteLoader.Service', [
    function() {
        var RemoteModel = function (retriever, getItemMetaData) {
            if (typeof reviJs.configParams.gridPageSize != 'undefined') {
                this._PAGESIZE = reviJs.configParams.gridPageSize;
            }
            else {
                this._PAGESIZE = 500;
            }
            this.data = {length: 0};
            if(getItemMetaData) {
                this.data.getItemMetadata = getItemMetaData;
            }

            this.dataWindow = {
                from : 0,
                to : this._PAGESIZE
            };

            this.aggregate = {};
            this.searchstr = "";
            this.sortcol = null;
            this.sortdir = 1;
            this._h_request = null;
            this._req = null; // ajax request
            this._retriever = retriever;
            
            
            // events
            this.onDataLoading = new Slick.Event();
            this.onDataLoaded = new Slick.Event();
        }


        /*
         * Has the data been retreived from the server yet?
         */
        RemoteModel.prototype.isDataLoaded = function (from, to) {
            var self = this;
            from = ((angular.isUndefined(from)) ? self.dataWindow.from : from);
            to = ((angular.isUndefined(to)) ? self.dataWindow.to : to);

            for (var i = from; i <= to; i++) {
                if (self.data[i] == undefined || self.data[i] == null) {
                    return false;
                }
            }

            return true;
        }

        /*
         * Clear all keys on the data object.
         */
        RemoteModel.prototype.clear = function () {
            var self = this;
            for (var key in self.data) {
                if(key != "getItemMetadata"){
                    delete self.data[key];
                }
            }
            self.data.length = 0;
        };

        /*
         * Ensure that we have loaded the requested rows.  If not, fire off an
         * ajax request to grab those rows and notify the grid via an onDataLoading
         * event.
         */
        RemoteModel.prototype.ensureData = function (from, to) {
            var self = this;
            var _griddata = self.data.length;
            if (typeof reviJs.configParams.gridPageSize != 'undefined') {
                self._PAGESIZE = reviJs.configParams.gridPageSize;
            }
            
            var fromPage = 0;
            var toPage = 0;
            from = ((angular.isUndefined(from))? self.dataWindow.from : from);
            to = ((angular.isUndefined(to))? self.dataWindow.to : to);

          if (self._req) {
            for (var i = self._req.fromPage; i <= self._req.toPage; i++) {
              self.data[i * self._PAGESIZE] = undefined;
            }
              self._req = null;
          }

          if (from < 0) {
            from = 0;
          }
          if (typeof self.aggregate.UPC != 'undefined') {
              _griddata = self.data.length + 1;
          }
          else {
              _griddata = self.data.length;
          }
          
          if (self.data.length > 0 && (self.data.length == to || self.data.length == (to + 1) || self.data.length == (to - 1))) {
              fromPage = 0;
              toPage = Math.ceil((_griddata) / self._PAGESIZE) + 1;
          }

          if (_griddata < self._PAGESIZE) {
              fromPage = 0;
              toPage = 0;
          }

          if (_griddata % self._PAGESIZE != 0) {
              fromPage = 0;
              toPage = 0;
          }

          if (fromPage > toPage || ((fromPage == toPage) && self.data[fromPage * self._PAGESIZE] !== undefined)) {
            // TODO:  look-ahead
            self.onDataLoaded.notify({from: from, to: to, aggregateChanged: false});
            return;
          }

          //if (self._h_request != null) {
          //  clearTimeout(self._h_request);
          //}

          /*
           * We put the ajax request inside a setTimeout() so that if the grid 
           * requests another set of rows during this cycle, we can cancel the 
           * original request and issue a new one.
           */
          //self._h_request = setTimeout(function () {
            for (var i = fromPage; i <= toPage; i++) {
                self.data[i * self._PAGESIZE] = null; // null indicates a 'requested but not available yet'
            }

            var start = fromPage * self._PAGESIZE;
            var limit = (((toPage - fromPage) * self._PAGESIZE));// + self._PAGESIZE
            limit = limit || self._PAGESIZE;

            var filters = {
                start: start,
                limit: limit,
                sortColumn: self.sortcol,
                sortDirection: self.sortdir
            };

            self.onDataLoading.notify({from: from, to: to});
            self._req = self._retriever(filters);
            self._req.fromPage = fromPage;
            self._req.toPage = toPage;

            self._req.then(function (response) {
                /*
                 * We got a response.  Call the onSuccess function to populate 
                 * the data object and notify the grid.
                 */
                self.onSuccess({                    
                    request: {
                        start: start
                    },                    
                    results: response.items,
                    hits: response.totalItems,
                    aggregate: response.aggregate
                });
            },
            function(error) {
                self.onError();
            });
            
          //}, 10);
        };
        
        // Stub
        RemoteModel.prototype.onError = function () {
            var self = this;
        };

        /*
         * When we get a response back, we populate the data object with the
         * retrieved rows.
         */
        RemoteModel.prototype.onSuccess = function (resp) {
            var self = this;
          var from = resp.request.start, to = from + resp.results.length;
          self.data.length = resp.hits;
          for (var i = 0; i < resp.results.length; i++) {
            var item = resp.results[i];

            self.data[from + i] = item;
            self.data[from + i].index = from + i;
          }
          
          var aggregateChanged = false;
          if(!angular.equals(resp.aggregate, self.aggregate)) {
            aggregateChanged = true;  
            angular.copy(resp.aggregate, self.aggregate);
          }

          self._req = null;

          self.onDataLoaded.notify({from: from, to: to, aggregateChanged: aggregateChanged});
        };

        /*
         * Delete object keys and request them again.
         */
        RemoteModel.prototype.reloadData = function (from, to) {
            var self = this;
            for (var i = from; i <= to; i++) {
                delete self.data[i];
            }

            self.ensureData(from, to);
        };

        /*
         * Set the sorting column and direction.
         */
        RemoteModel.prototype.setSort = function (column, dir) {
            var self = this;
          self.sortcol = column;
          self.sortdir = dir;
          self.clear();
        };

        /*
         * Set the search string and clear the data object.
         */
        RemoteModel.prototype.setSearch = function (str) {
            var self = this;
          self.searchstr = str;
          self.clear();
        };
        $.extend(true, window, { Slick: { Data: { RemoteModel: RemoteModel } } });
        return RemoteModel;
    }]);
