'use strict';
define(['app'], function (app) {
    app.register.controller('privateCtrl', [
        'localStorageService', '$rootScope', '$scope', '$cookies', '$resource', '$modal', '$state', '$stateParams',
        'restricted', 'rest',
        function (localStorageService, $rootScope, $scope, $cookies, $resource, $modal, $state, $stateParams) {

            var private_profile_resource = $resource(":protocol://:url/api/accounts/profile?social_backend=:social_backend&social_code=:social_code",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                social_backend: '@social_backend',
                social_code: '@social_code'
            });

            var public_profile_resource = $resource(":protocol://:url/api/accounts/profile?user_id=:id",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            });

            init();

            function init(){
                $scope.knacks = [];              // knacks list
                $scope.items = [];
                $scope.edit_field = null;       // a profile field to edit
                $scope.user = null;             // profile info
                $scope.is_public = false;       // boolean if this page is for public or private profile.
                $scope.user_post_data = {};      // data to post for profile edit
                $scope.edit_item= null;         // An user's item or knack to edit
                $scope.active_tab = 'knacks';
                $scope.active_r_tab = 'connections';
                $scope.isCollegeBoxOpened = false;
                $scope.isAgeBoxOpened = false;
                $rootScope.cropper0 = {};
                $rootScope.cropper0.sourceImage = null;
                $rootScope.cropper0.croppedImage = null;

                $scope.connections = [];
                $scope.connections.push({name: 'Derek Wilson', picture: 'images/users/user.png', college: 'Fisher College', category_name: 'Sophomore', age: 22, price: 2014, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'on'});
                $scope.connections.push({name: 'James Poter', picture: 'images/users/user.png', college: 'Harvard University', category_name: 'Sophomore', age: 21, price: 2014, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'off'});
                $scope.connections.push({name: 'Jennifer Parker', picture: 'images/users/user.png', college: 'Harvard University', category_name: 'Sophomore', age: 23, price: 14, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'on'});
                $scope.connections.push({name: 'Jack Mandosa', picture: 'images/users/user.png', college: 'Boston University', category_name: 'Sophomore', age: 25, price: 214, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'off'});
                $scope.connections.push({name: 'Joel Stakham', picture: 'images/users/user.png', college: 'Stanford University', category_name: 'Sophomore', age: 27, price: 101, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'off'});
                $scope.connections.push({name: 'Derek Wilson', picture: 'images/users/user.png', college: 'Fisher College', category_name: 'Sophomore', age: 29, price: 2014, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'on'});
                $scope.connections.push({name: 'James Poter', picture: 'images/users/user.png', college: 'Harvard University', category_name: 'Sophomore', age: 23, price: 2014, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'off'});
                $scope.connections.push({name: 'Jennifer Parker', picture: 'images/users/user.png', college: 'Harvard University', category_name: 'Sophomore', age: 22, price: 4, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'on'});
                $scope.connections.push({name: 'Jack Mandosa', picture: 'images/users/user.png', college: 'Boston University', category_name: 'Sophomore', age: 21, price: 20, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'off'});
                $scope.connections.push({name: 'Joel Stakham', picture: 'images/users/user.png', college: 'Stanford University', category_name: 'Sophomore', age: 29, price: 1, from_date: 'Since dec 2014', score: 4, last_seen: '2 hours ago', status: 'off'});

                $scope.user_not_found = false;

                if ($stateParams.id) {
                    $rootScope.currentMenu = 'profile';
                } else {
                    $rootScope.currentMenu = 'profile_edit';
                }

                $scope.restricted();

                if ($stateParams.id) {
                    $scope.is_public = true;
                    $scope.user = public_profile_resource.get({id: $stateParams.id}, function (result) {
                        $scope.user.picture = result.picture ? result.picture : 'images/users/no_avatar.png'
                        $scope.user.college = result.college == "null" ? "" : result.college;
                        $scope.knacks = result.knacks;
                        $scope.items = result.items;
                    }, function () {
                        $scope.user_not_found = true;
                    });
                } else {
                    var social_backend = '';
                    var social_code = '';
                    if ($cookies.social_backend != undefined) {
                        social_backend = $cookies.social_backend;
                    }
                    if ($cookies.social_code != undefined) {
                        social_code = $cookies.social_code;
                    }
                    if ($cookies.token != undefined) {
                        localStorageService.add('Authorization', 'Token ' + $cookies.token);
                        localStorageService.add('rest_token', $cookies.token);
                        $rootScope.restricted();
                        $rootScope.is_authenticated = true;
                    }
                    $scope.user = private_profile_resource.get({social_backend: social_backend, social_code: social_code}, function (result) {
                        result.picture = result.picture ? result.picture : 'images/users/no_avatar.png'
                        $scope.user_post_data = result;
                        $scope.knacks = result.knacks;
                        $scope.items = result.items;

                        localStorageService.add('user_id', result.id);
                        localStorageService.add('full_name', result.full_name);
                        localStorageService.add('college', result.college);
                        localStorageService.add('picture', result.picture);
                        $rootScope.restricted();

                        if (social_backend != '' && social_code != '') {
                            delete $cookies.social_backend;
                            delete $cookies.social_code;
                            delete $cookies.token;
                        }
                    }, $scope.checkTokenError);
                }
            }

            function show_welcome_popup(){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/views/modals/register-modal.html',
                    controller: 'RegisterModalCtl',
                    windowClass: 'vcenter-modal',
                    backdrop: 'static'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.openPostModal = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/post-knack-modal.html',
                    controller: 'PostModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        knack: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                        // [].push.apply($scope.knacks, data);
                        $scope.knacks.splice(0, 0, data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.openPostModalForItem = function () {

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/post-item-modal.html',
                    controller: 'PostItemModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        item: function () {
                            return null;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                        // [].push.apply($scope.items, data);
                        $scope.items.splice(0, 0, data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.gotoKnackIdea = function() {
                $state.go('knack-offered');
                $rootScope.isIdea = 'ideas';
            };

            $scope.toggleCollegeBox = function(college) {
                $scope.isCollegeBoxOpened = false;
                $scope.user_post_data.college = college;
            };

            $scope.toggleYearBox = function(year) {
                $scope.isAgeBoxOpened = false;
                $scope.user_post_data.year = year;
            };

            $scope.edit_profile = function(field_name, evt) {
                evt.preventDefault();
                evt.stopPropagation();
                if(!$scope.user_not_found)
                    $scope.edit_field = field_name;
            };

            $scope.edit_knack = function(knack_item) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/edit-knack-modal.html',
                    controller: 'EditKnackModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        knack_item: function () {
                          return knack_item;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                        angular.extend(knack_item, data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.edit_item = function(item) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/edit-item-modal.html',
                    controller: 'EditItemModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        item: function () {
                          return item;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                        angular.extend(item, data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.repost_knack = function(item) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/post-knack-modal.html',
                    controller: 'PostModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        knack: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                        $scope.knacks.splice(0, 0, data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.repost_item = function(item) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/post-item-modal.html',
                    controller: 'PostItemModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        item: function () {
                            return item;
                        }
                    }
                });
                modalInstance.result.then(function (data) {

                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.save_profile = function() {
                var private_profile_edit = $resource(":protocol://:url/api/accounts/profile/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('full_name', data['full_name']);
                            fd.append('college', data['college']);
                            fd.append('year', data['year']);
                            fd.append('age', data['age']);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.profileForm.$valid) {
                    var data = {
                        'full_name' : $scope.user_post_data.full_name,
                        'college': $scope.user_post_data.college,
                        'year': $scope.user_post_data.year,
                        'age': $scope.user_post_data.age,
                    };
                    private_profile_edit.save(data, function (result) {
                        $scope.user_post_data = result;

                        localStorageService.add('user_id', result.id);
                        localStorageService.add('full_name', result.full_name);
                        localStorageService.add('college', result.college);
                        localStorageService.add('picture', result.picture);
                        $rootScope.restricted();

                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_social = function() {
                var private_profile_social_edit = $resource(":protocol://:url/api/accounts/profile/social/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('twitter', data['twitter']);
                            fd.append('facebook', data['facebook']);
                            fd.append('instagram', data['instagram']);
                            fd.append('googleplus', data['googleplus']);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.socialForm.$valid) {
                    private_profile_social_edit.save($scope.user_post_data.social_links, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_reasons = function() {
                var private_profile_reasons_edit = $resource(":protocol://:url/api/accounts/profile/reasons/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            angular.forEach(data, function(value, key) {
                                fd.append(key, value);
                            });
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.reasonForm.$valid) {
                    private_profile_reasons_edit.save($scope.user_post_data.reasons, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_about = function() {
                var private_profile_about_edit = $resource(":protocol://:url/api/accounts/profile/about/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('about', data);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.aboutForm.$valid) {
                    private_profile_about_edit.save($scope.user_post_data.about_me, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_payment = function() {
                var private_profile_payment_edit = $resource(":protocol://:url/api/accounts/profile/payment/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('venmo', data['venmo']);
                            fd.append('paypal', data['paypal']);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.paymentForm.$valid) {
                    var data = {'venmo' : $scope.user_post_data.payment_venmo, 'paypal': $scope.user_post_data.payment_paypal};
                    private_profile_payment_edit.save(data, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.save_public_url = function() {
                var private_profile_publicurl_edit = $resource(":protocol://:url/api/accounts/profile/public_url/edit",{
                    protocol: $scope.restProtocol,
                    url: $scope.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('public_url', data);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}

                    }
                });
                if($scope.paymentForm.$valid) {
                    private_profile_publicurl_edit.save($scope.user_post_data.public_profile_url, function (result) {
                        $scope.edit_field = null;
                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                    console.log($scope.profileForm.$error);
                }
            };

            $scope.close_edit = function() {
                $scope.edit_field = null;
            };

            $scope.add_more_reason = function() {
                $scope.user_post_data.reasons.push('');
            };

            $scope.remove_reason = function(index) {
                $scope.user_post_data.reasons.splice(index, 1);
            };

            $scope.activate_knacks = function() {
                $scope.active_tab = 'knacks';
            };

            $scope.activate_items = function() {
                $scope.active_tab = 'items';
            };

            $scope.activate_connections = function() {
                $scope.active_r_tab = 'connections';
            };

            $scope.activate_reviews = function() {
                $scope.active_r_tab = 'reviews';
            };

            $scope.instagram_focus_out = function() {
                if ($scope.user_post_data.social_links.instagram == 'www.instagram.com/'){
                    $scope.user_post_data.social_links.instagram = '';
                }
            };

            $scope.instagram_focus_in = function() {
                if ($scope.user_post_data.social_links.instagram == ''){
                    $scope.user_post_data.social_links.instagram = 'www.instagram.com/';
                }
            };

            $scope.twitter_focus_out = function() {
                if ($scope.user_post_data.social_links.twitter == 'twitter.com/'){
                    $scope.user_post_data.social_links.twitter = '';
                }
            };

            $scope.twitter_focus_in = function() {
                if ($scope.user_post_data.social_links.twitter == ''){
                    $scope.user_post_data.social_links.twitter = 'twitter.com/';
                }
            };

            $scope.facebook_focus_out = function() {
                if ($scope.user_post_data.social_links.facebook == 'www.facebook.com/'){
                    $scope.user_post_data.social_links.facebook = '';
                }
            };

            $scope.facebook_focus_in = function() {
                if ($scope.user_post_data.social_links.facebook == ''){
                    $scope.user_post_data.social_links.facebook = 'www.facebook.com/';
                }
            };

            $scope.venmo_focus_out = function() {
                if ($scope.user_post_data.payment_venmo == 'venmo.com/'){
                    $scope.user_post_data.payment_venmo = '';
                }
            };

            $scope.venmo_focus_in = function() {
                if ($scope.user_post_data.payment_venmo == ''){
                    $scope.user_post_data.payment_venmo = 'venmo.com/';
                }
            };

            $scope.paypal_focus_out = function() {
                if ($scope.user_post_data.payment_paypal == 'paypal.com/'){
                    $scope.user_post_data.payment_paypal = '';
                }
            };

            $scope.paypal_focus_in = function() {
                if ($scope.user_post_data.payment_paypal == ''){
                    $scope.user_post_data.payment_paypal = 'paypal.com/';
                }
            };

        }]);
    return app;
});