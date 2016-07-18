var i18nDeferred;

var rev_i18nBootstrap =function() {

    'use strict';

    var language, currencySymbol;
    var i18nextContentDir = '/Scripts/Markdown/rev_i18n';

    var getQADir = function() {
      var urlPath = window.location.pathname;
        if (urlPath.search('Markdown') >= 0 && urlPath[1] != 'M') {
            var QAPathLength = urlPath.search('/Markdown/');
            return urlPath.substring(0, QAPathLength);
        }
        return '';
    };

    window.reviJs = reviJs || {};
    reviJs.configParams = reviJs.configParams || {};
    if (!jQuery.revionics) { //local mock data dev
        reviJs.configParams.mockDataRun = true;
        reviJs.configParams.templateRoot = './';
        language = 'en-Us';
        currencySymbol = '\u20ac';
        moment.locale("en");
        reviJs.configParams.defaultDateFormat = moment()._locale._longDateFormat.L;
    }
    else {
        reviJs.configParams.mockDataRun = false;
        reviJs.configParams.templateRoot = './MarkdownLlcUI/';
        reviJs.configParams.preferredCulture = jQuery.revionics.preferedCulture;
        reviJs.configParams.defaultCurrencySymbol = jQuery.revionics.defaultCurrencySymbol;
        language = jQuery.revionics.preferedCulture;
        currencySymbol = jQuery.revionics.defaultCurrencySymbol;
        moment.locale(reviJs.configParams.preferredCulture.substring(0, 2));
        reviJs.configParams.defaultDateFormat = moment()._locale._longDateFormat.L;
    }

     var i18nOptions  = {
        lng: language,
        fallbackLng: 'en',
        defaultLoadingValue: '',
        useCookie: true,
        useLocalStorage: false,
        debug: true,
         currencySymbol: currencySymbol,
        resGetPath: getQADir() + i18nextContentDir + "/__ns__-__lng__.json",
        detectLngFromHeaders: false,
        ns: {
            namespaces: ['markdown'],
            defaultNs: 'markdown'
        }
    };

    if(window.i18n ) {
        i18nDeferred = window.i18n.init(i18nOptions);
    }

    angular.module('jm.i18next').config(function ($i18nextProvider) {
        $i18nextProvider.options = i18nOptions;
    });

};
