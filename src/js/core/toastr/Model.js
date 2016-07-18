reviJs.core.toastr.factory('revi-toastr.model', [function() {

	return {

		errorToastr: {
			title: 'ERROR',
			type: 'error',
			timeOut: 0,
            extendedTimeOut: 0,
			closeButton: true
		},
		successToastr: {
			title: 'SUCCESS',
			type: 'success',
			timeOut: 10000,
            extendedTimeOut: 0,
			closeButton: true
		},
		warningToastr: {
			title: 'WARNING',
			type: 'warning',
			timeOut: 0,
            extendedTimeOut: 0,
			closeButton: true
		},
		infoToastr: {
			title: 'INFO',
			type: 'info',
			timeOut: 20000,
            extendedTimeOut: 0,
			closeButton: true
		},
		toastrTypeCritical: 0,
		toastrTypeError: 1,
		toastrTypeWarning: 2,
		toastrTypeInfo: 3,
		toastrTypeSuccess: 4,

		navigateBackOnClose: 1
	}

}]);