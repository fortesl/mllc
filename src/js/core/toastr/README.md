revi-toastr
===========

Include the following resources in your html file:

```html
    <link rel="stylesheet" href="bower_components/angular-toastr/dist/angular-toastr.css">
    <script src="bower_components/angular-toastr/dist/angular-toastr.tpls.js"></script>
```

Add to your Angular controller like below:

```javascript
    var myApp = angular.module('myApp', ['revi-toastr']);
    myApp.controller('MyController', ['reviToastrService', function(reviToastrService) {

        //call methods here as per API below

    });
```

API
===
Below are the available methods and examples on how to use them
<ol>
    <li><b>thereAreOpenedToasts</b> returns true if there are toasts, returns false otherwise
        <ul><li>Example:
            <code>if (reviToastrService.thereAreOpenedToasts() { ... do something ... }</code>
        </li></ul>
    </li>
    <li><b>clearToasts or hideTests</b> removes all opened toasts
        <ul><li>Example:
            <code>reviToastrService.clearToasts();</code>
        </li></ul>
    </li>
    <li><b>toastIsOpened or toastIsShown</b> returns true if a toast (defined by the message string) is opened, returns false otherwise
        <ul><li>Example:
            <code>
            if (reviToastrService.toastIsOpened('I love toasts') { ... do something ... }
            </code>
        </li></ul>
    </li>
    <li><b>openToast</b> opens a toast, given a message string, a title string, and an optional config object
        <ul><li>Example:
            <code>
            reviToastrService.openToast('I love toasts', 'TOAST ME', {type: 'success'});
            </code>
        </li></ul>
    </li>
    <li><b>showToast</b> opens a toast, given a toast object
        <ul><li>Example:
            <code>
            reviToastrService.openToast({message: 'I love toasts', title: 'TOAST ME', type: 'success'});
            </code>
        </li></ul>
    </li>
    <li><b>clearToast, or hideToast</b> removes a toast, given a message string
        <ul><li>Example:
            <code>
            reviToastrService.removeToast('I love toasts');
            </code>
        </li></ul>
    </li>
</ol>

The default configuration used by revi-angular-toastr is shown below:

```javascript
    toastDefaultOptions = {
        positionClass: 'toast-bottom-right',
        tapToDismiss: false,
        timeOut: 0,
        extendedTimeOut: 0,
        type: 'error'
    };
```

This configuration can be modified by the optional config object passed into the method <b>openToast()</b>.

DOCUMENTATION
=============
Find more information on all the possible configuration options and usage examples here:
<a href="https://github.com/Foxandxss/angular-toastr">Foxandxss angular-toasts</a>