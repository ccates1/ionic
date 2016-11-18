// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ionic-material', 'ionic.closePopup', 'app.controllers', 'app.routes', 'app.services', 'satellizer'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })
    .config(function($authProvider, $ionicConfigProvider) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.views.maxCache(0);
        var commonConfig = {
            popupOptions: {
                location: 'no',
                toolbar: 'yes',
                width: window.screen.width,
                height: window.screen.height
            }
        };

        if (ionic.Platform.isIOS() || ionic.Platform.isAndroid()) {
            $authProvider.platform = 'mobile';
            $authProvider.cordova = true;
            commonConfig.redirectUri = 'http://localhost:8100';
        }

        $authProvider.loginUrl = 'http://192.168.1.13:3198/auth/login';
        $authProvider.signupUrl = 'http://192.168.1.13:3198/auth/signup';
        $authProvider.facebook({
            clientId: '289121131435901',
            url: 'http://192.168.1.13:3198/auth/facebook'
        });

        $authProvider.twitter({
            url: 'http://192.168.1.13:3198/auth/twitter'
        });

        $authProvider.oauth2({
            name: 'foursquare',
            url: '/auth/foursquare',
            clientId: 'MTCEJ3NGW2PNNB31WOSBFDSAD4MTHYVAZ1UKIULXZ2CVFC2K',
            redirectUri: window.location.origin || window.location.protocol + '//' + window.location.host,
            authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate'
        });
    });