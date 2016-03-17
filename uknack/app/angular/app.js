/*######################################################
 This app returns a ng module which is declared to
 be the main module for the entire app.

 Logic can be applied to set up the home page
 ######################################################*/
'use strict';

define(['angularAMD',
        'jquery',
        'masonry',
        'jquery-bridget',
        'uiRouter',
        'uiBootstrap',
        'routeResolver',
        'ui.utils',
        'angularResource',
        'angularLocalStorage',
        'underscore',
        'angularFileUpload',
        'angularFileModel',
        'angularNiceScroll',
        'angularNouislider',
        'imagesloaded',
        'smoothscroll',
        'retinajs',
        'jquery.magnific-popup',
        'angular-masonry',
        'checklist-model',
        'angular-loading-bar',
        'angular-websocket',
        'modals',
        'chatbox',
        'photoSlider',
        'fileInput',
        'header',
        'footer',
        'menubar',
        'bottombar',
        'angular-headroom',
        'lightslider',
        'angular-sanitize',
        'videogular',
        'vg-controls',
        'vg-overlay-play',
        'vg-poster',
        'vg-buffering',
        'smile-emoji',
        'angular-cookies',
        'emoji-config',
        'emoji-controls',
        'angular-img-cropper'
    ],
    function (angularAMD) {
        'use strict';

        var app = angular.module('app', [
            'ui.router',
            'ui.route',
            'ui.bootstrap',
            'routeResolverServices',
            'ngResource',
            'LocalStorageModule',
            'angularFileUpload',
            'file-model',
            'angular-nicescroll',
            'nouislider',
            'wu.masonry',
            'checklist-model',
            'angular-loading-bar',
            'ngWebSocket',
            'headroom',
            'ngSanitize',
            'com.2fdevs.videogular',
            'com.2fdevs.videogular.plugins.controls',
            'com.2fdevs.videogular.plugins.overlayplay',
            'com.2fdevs.videogular.plugins.poster',
            'emoji',
            'ngCookies',
            'emojiApp',
            'angular-img-cropper'
        ]);
        app.run(function ($rootScope, $http, $resource, $state) {

            $rootScope.is_authenticated = false;
            $rootScope.profile_user = null;
            $rootScope.dashCollapsed = true;
            $rootScope.serverProtocal = "http";
            $rootScope.serverURL = "/";
            $rootScope.currentMenu = "home";
            $rootScope.knackCategories = [];
            $rootScope.itemCategories = [];
            $rootScope.colleges = [];
            $rootScope.years = [];
            $rootScope.milesCategories = [];
            $rootScope.chargeType = [];
            $rootScope.knackTypes = [];
            $rootScope.new_message_count = 0;
            $rootScope.heartbeat_msg = "--heartbeat--";
            $rootScope.new_email = ""
            $rootScope.$state = $state;
            $rootScope.isSidebarOpen = false;
            $rootScope.isMenubarOpen = false;
            $rootScope.isIdea = 'all';

            $rootScope.restProtocol = "http";
            $rootScope.restURL = "52.10.177.231";
            //$rootScope.restURL = "127.0.0.1:8000";
            $rootScope.isGoToFeed = false;

            var categoryCollection = $resource(":protocol://:url/api/knacks/categories", {
                protocol: $rootScope.restProtocol,
                url: $rootScope.restURL
            });
            categoryCollection.get(function (categories) {
                angular.extend($rootScope.knackCategories, categories.results);
            });

            var itemCategoryCollection = $resource(":protocol://:url/api/items/categories", {
                protocol: $rootScope.restProtocol,
                url: $rootScope.restURL
            });
            itemCategoryCollection.get(function (categories) {
                angular.extend($rootScope.itemCategories, categories.results);
            });

            var colleges_resource = $resource(":protocol://:url/api/accounts/colleges",{
                protocol: $rootScope.restProtocol,
                url: $rootScope.restURL
            });
            colleges_resource.get(function (colleges) {
                angular.forEach(colleges.results, function(value, key) {
                    $rootScope.colleges.push(value.name);
                });
            });

            var years_resource = $resource(":protocol://:url/api/accounts/years",{
                protocol: $rootScope.restProtocol,
                url: $rootScope.restURL
            });
            years_resource.get(function (years) {
                angular.forEach(years.results, function(value, key) {
                    $rootScope.years.push(value.name);
                });
            });

            var miles_resource = $resource(":protocol://:url/api/knacks/miles",{
                protocol: $rootScope.restProtocol,
                url: $rootScope.restURL
            });
            miles_resource.get(function (miles) {
                angular.forEach(miles.results, function(value, key) {
                    $rootScope.milesCategories.push({name: value[0]});
                });
            });

            var charge_resource = $resource(":protocol://:url/api/knacks/how_charge",{
                protocol: $rootScope.restProtocol,
                url: $rootScope.restURL
            });
            charge_resource.get(function (charges) {
                angular.forEach(charges.results, function(value, key) {
                    $rootScope.chargeType.push({name: value[0]});
                });
            });

            var types_resource = $resource(":protocol://:url/api/knacks/types",{
                protocol: $rootScope.restProtocol,
                url: $rootScope.restURL
            });
            types_resource.get(function (types) {
                angular.extend($rootScope.knackTypes, types.results);
            });

            $rootScope.genderCategories = [
                {name: 'Male'},
                {name: 'Female'},
                {name: 'Trans'},
                {name: 'Andro'},
                {name: 'Exploring'},
                {name: 'Alien'},
                {name: 'No Gender'}
            ];

            //if($rootScope.token) {
            //    $rootScope.is_authenticated = true;
            //    $http.defaults.headers.common['Authorization'] = $rootScope.token;
            //}
            $rootScope.$on('$stateChangeSuccess', function() {
               document.body.scrollTop = document.documentElement.scrollTop = 0;
            });

            if(navigator.splashscreen) {
                setTimeout(function() {
                    navigator.splashscreen.hide();
                }, 1000);
            }
        });

        app.config([
            'routeResolverProvider', '$stateProvider', '$urlRouterProvider', '$httpProvider',
            function (routeResolverProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
                var route = routeResolverProvider.route;
                $stateProvider
                    //LoggedIn and LoggedOut
                    .state('home', route.resolve('/', 'views/homepage/index'))
                    .state('about', route.resolve('/about', 'views/homepage/about'))
                    .state('mission', route.resolve('/mission', 'views/homepage/mission'))
                    .state('terms', route.resolve('/terms', 'views/homepage/terms'))
                    .state('how', route.resolve('/how', 'views/homepage/how'))
                    .state('features', route.resolve('/features', 'views/homepage/features'))
                    .state('guidelines', route.resolve('/guidelines', 'views/homepage/guidelines'))
                    .state('gethired', route.resolve('/gethired', 'views/homepage/gethired'))
                    .state('economy', route.resolve('/economy', 'views/homepage/economy'))
                    .state('faqs', route.resolve('/faqs', 'views/homepage/faqs'))
                    .state('knack-offered', route.resolve('/knacks/offered', 'views/knacks/offered'))
                    .state('knack-offered-single', route.resolve('/knacks/offered/:id', 'views/knacks/offered'))
                    .state('knack-wanted', route.resolve('/knacks/wanted', 'views/knacks/wanted'))
                    .state('knack-wanted-single', route.resolve('/knacks/wanted/:id', 'views/knacks/wanted'))
                    .state('marketplace', route.resolve('/marketplace', 'views/marketplace/ioffered'))
                    .state('item-offered', route.resolve('/marketplace/offered', 'views/marketplace/ioffered'))
                    .state('item-wanted', route.resolve('/marketplace/wanted', 'views/marketplace/iwanted'))
                    .state('item-wanted-single', route.resolve('/marketplace/wanted/:id', 'views/marketplace/iwanted'))
                    .state('item-offered-single', route.resolve('/marketplace/offered/:id', 'views/marketplace/ioffered'))
                    .state('messages', route.resolve('/messages', 'views/messages'))
                    .state('messages-to', route.resolve('/messages/:id', 'views/messages'))
                    .state('profile', route.resolve('/welcome-profile', 'views/profile'))
                    .state('register', route.resolve('/register/:uuid', 'views/profile'))
                    .state('private-profile', route.resolve('/private-profile', 'views/profile/private'))
                    .state('feed', route.resolve('/feed', 'views/feed/knacks'))          //*******//
                    .state('feed-knacks', route.resolve('/feed/knacks', 'views/feed/knacks'))
                    .state('feed-business', route.resolve('/feed/business', 'views/feed/business'))
                    .state('public-profile', route.resolve('/public/:public_url', 'views/profile/public'))
                    // .state('page-not-found', route.resolve('/page_not_found', 'views/profile'))

                $urlRouterProvider.otherwise("/");
                $httpProvider.defaults.xsrfCookieName = 'csrftoken';
                $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
                // $httpProvider.interceptors.push('httpInterceptor');
            }
        ]);

        app.service('rest', ['$rootScope', function ($rootScope) {
            $rootScope.restProtocol = "http";
            $rootScope.restURL = "52.10.177.231";
            //$rootScope.restURL = "127.0.0.1:8000";
        }]);

        app.service('restricted', ['$rootScope', 'localStorageService', '$http',
            function ($rootScope, localStorageService, $http) {
            $rootScope.restricted = function () {
                $rootScope.token = localStorageService.get('Authorization');
                $http.defaults.headers.common['Authorization'] = localStorageService.get('Authorization');
                if ($rootScope.token === null) {
                    $rootScope.is_authenticated = false;
                    $rootScope.profile_user = null;
                } else {
                    $rootScope.is_authenticated = true;
                    $rootScope.profile_user = {
                        'user_id': localStorageService.get('user_id'),
                        'full_name': localStorageService.get('full_name'),
                        'college': localStorageService.get('college'),
                        'picture': localStorageService.get('picture') ? localStorageService.get('picture'):'images/users/no_avatar.png'
                    };
                }
                //setTimeout(function () {
                //    if ($rootScope.token === null) {
                //        console.log('Empty token auth');
                //        $rootScope.is_authenticated = false;
                //        // window.location = "#/login";
                //    }
                //}, 100);
            };
        }]);

        app.service('tokenError', ['localStorageService', '$rootScope',
            function (localStorageService, $rootScope) {
            $rootScope.checkTokenError = function (error) {
                if (error.data && error.data['detail'] == 'Invalid token') {
                    console.log('invalid token');
                    localStorageService.clearAll();
                    $rootScope.restricted();
                }
            }
        }]);


        app.directive('fileModel', ['$parse', function ($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function(){
                        scope.$apply(function(){
                            modelSetter(scope, element[0].files[0]);
                        });
                    });
                }
            };
        }]);

        app.directive("outsideClick", ['$document','$parse', function( $document, $parse ){
            return {
                link: function( $scope, $element, $attributes ){
                    var scopeExpression = $attributes.outsideClick,
                        onDocumentClick = function(event){
                            var isChild = $element.get(0) == event.target || $element.find(event.target).length > 0;
                            var isVisible = $element.is(':visible');

                            if(!isChild && isVisible) {
                                $scope.$apply(scopeExpression);
                            }
                        };

                    $document.on("click", onDocumentClick);

                    $element.on('$destroy', function() {
                        $document.off("click", onDocumentClick);
                    });
                }
            }
        }]);

        app.directive('selectOnClick', ['$window', function ($window) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.on('click', function () {
                        if (!$window.getSelection().toString()) {
                            // Required for mobile Safari
                            this.setSelectionRange(0, this.value.length)
                        }
                    });
                }
            };
        }]);

        app.factory('Message', function($websocket, $rootScope) {
            // setTimeout(function() {
            //   ws.close();
            // }, 500)

            return function(token, room_id){
                //var WS_URL = '127.0.0.1:8000';
                var WS_URL = '52.10.177.231';
                var ws = $websocket('ws://' + WS_URL + '/ws/'+ room_id + '?subscribe-broadcast&publish-broadcast&echo&token=' + token);
                var collection = [];

                ws.onMessage(function(event) {
                    if(event.data === $rootScope.heartbeat_msg){
                        return;
                    }

                    var res;
                    try {
                      res = JSON.parse(event.data);
                    } catch(e) {
                      res = {'username': 'anonymous', 'message': event.data};
                    }

                    collection.push({
                      data: res,
                      timeStamp: event.timeStamp
                    });
                });

                ws.onError(function(event) {
                    console.log('connection Error', event);
                });

                ws.onClose(function(event) {
                    console.log('connection closed', event);
                });

                ws.onOpen(function() {
                    console.log('connection open');
                });

                return {
                    collection: collection,
                    status: function () {
                        return ws.readyState;
                    },
                    send: function (message) {
                        if (angular.isString(message)) {
                            ws.send(message);
                        }
                        else if (angular.isObject(message)) {
                            ws.send(JSON.stringify(message));
                        }
                    }
                }
            };
        })

        //Bootstrap Angular
        angularAMD.bootstrap(app);
        angularAMD.processQueue();

        return app;
    });
