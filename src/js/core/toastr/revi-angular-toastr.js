/**
 * Name: revi-angular-toastr.js
 * Created by lfortes on 2/28/2015.
 */

(function () {
    'use strict';

    reviJs.core.toastr.factory('reviToastrService', ['toastr', 'revi-toastr.model', function (toastr, model) {

        var openedToasts = [], sessionToasts = [];
        var newToastMessage, newToastTitle, newToastType;
        var toastDefaultOptions = {
            positionClass: 'toast-bottom-right',
            tapToDismiss: false,
            timeOut: 0,
            extendedTimeOut: 0,
 			closeButton: true,
            type: 'error'
        };

        var thereAreOpenedToasts = function() {
            return openedToasts.length;
        };

        var clearToasts = function() {
            openedToasts.length = 0;
        };

        var toastIsOpened = function(message) {
            for (var i = 0; i < openedToasts.length; i++) {
                if (openedToasts[i].scope.message === message) break;
            }
            return (openedToasts.length && i < openedToasts.length);
        };

        function openToast(message, title, options) {
            var currentOptions = {};
            if (!options) {
                currentOptions = toastDefaultOptions;
            }
            else {
                currentOptions = angular.extend({}, toastDefaultOptions, options);
            }
            openedToasts.push(toastr[currentOptions.type](message, title, currentOptions));
        }

        var clearToast = function (message) {
            for (var i = 0; i < openedToasts.length; i++) {
                if (openedToasts[i].scope.message === message) break;
            }
            if (i < openedToasts.length) {
                openedToasts.splice(i, 1);
            }
        };

        /**
         * Opens at toast
         * params - toast (object with message, title, type, and onCloseCallback properties)
         */
        function showToast(toast) {
            var options=null;

            newToastMessage = 'No message  Given';
            newToastTitle = '';

            if ('undefined' !== typeof toast && toast.message) {
                newToastMessage = toast.message;
            }
            if ('undefined' !== typeof toast && toast.title) {
                newToastTitle = toast.title;
            }
            if ('undefined' !== typeof toast && toast.type) {
                newToastType = toast.type;
            }

            if ('undefined' === typeof toast.type || toast.type === model.toastrTypeError || toast.type === model.toastrTypeCritical) {
                options = model.errorToastr;
            }
            else if (toast.type === model.toastrTypeSuccess) {
                options = model.successToastr;
            }
            else if (toast.type === model.toastrTypeInfo) {
                options = model.infoToastr;
            }
            else if (toast.type === model.toastrTypeWarning) {
                options = model.warningToastr;
            }

            if ('undefined' !== typeof toast) {
                options.onHidden = removeToast;
            }

            if (!newToastTitle.length) {
                newToastTitle = options.title;
            }

            if ('undefined' !== typeof toast && toast.timeOut) {
                options.timeOut = toast.timeOut;
            }

            if (!toastIsOpened(newToastMessage)) {
                openToast(newToastMessage, newToastTitle, options);
                options.title = newToastTitle;
                options.message = newToastMessage;
                options.date = new Date();
                options.serviceToastType = toast.type;
                if (toast.url) {
                    options.serviceUrl = toast.url;
                }
                options.href = window.location.href;
                sessionToasts.push(options);
                window.sessionStorage.setItem('MarkdownSessionToasts', angular.toJson(sessionToasts));
            }
        }

        var removeToast = function() {
            if (toastIsOpened(newToastMessage)) {
                clearToast(newToastMessage);
            }
            //if (newToastType === model.toastrTypeError) {
            //    history.back();
            //}
        };

        // Service API
        return {
            openToast: openToast,
            showToast: showToast,
            clearToast: clearToast,
            clearToasts: clearToasts,
            toastIsOpened: toastIsOpened,
            thereAreOpenedToasts: thereAreOpenedToasts,
            type: {
                critical: model.toastrTypeCritical,
                error: model.toastrTypeError,
                warning: model.toastrTypeWarning,
                info: model.toastrTypeInfo,
                success: model.toastrTypeSuccess
            }
        };

    }]);

})();