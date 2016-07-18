var i18nDeffered;

(function() {
        globalConfig.i18nOptions = {
            lng: globalConfig.api.preferedCulture.toLowerCase(),
            fallbackLng: 'en',
            defaultLoadingValue: '',
            useCookie: true,
            useLocalStorage: false,
            resGetPath: globalConfig.contextPath + "/i18n/__ns__-__lng__.json",
            detectLngFromHeaders: false,
            ns: {
                namespaces: ['promo'],
                defaultNs: 'promo'
            }
        };

        if(window.i18n) {
            i18nDeferred = window.i18n.init(globalConfig.i18nOptions);
        }

        angular.module('jm.i18next').config(function ($i18nextProvider) {
            $i18nextProvider.options = globalConfig.i18nOptions;
        });

        angular.module("ngLocale").config(function ($localeProvider) {
            if(globalConfig.appSettings.defaultCurrencySymbol) {
                $localeProvider.$get().NUMBER_FORMATS.CURRENCY_SYM = globalConfig.appSettings.defaultCurrencySymbol;
            }
        });
})();
