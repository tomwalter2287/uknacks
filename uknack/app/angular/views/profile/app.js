'use strict';
define(['app'], function (app) {
    app.register.controller('profileCtrl', [
        'localStorageService', '$rootScope', '$scope', '$state', '$cookies', '$resource', '$modal', '$stateParams',
        'restricted', 'rest',
        function (localStorageService, $rootScope, $scope, $state, $cookies, $resource, $modal, $stateParams) {
            var private_profile_resource = $resource(":protocol://:url/api/accounts/profile?social_backend=:social_backend&social_code=:social_code",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                social_backend: '@social_backend',
                social_code: '@social_code'
            });

            var register_resource = $resource(":protocol://:url/api/accounts/already_registered?uuid=:uuid",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                uuid: '@uuid'
            });

            var public_profile_resource = $resource(":protocol://:url/api/accounts/profile?user_id=:id",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            });

            init();

            function init(){
                $scope.knacks = [];           // knacks list
                $scope.knacks_total = 0;      // total knacks
                $scope.items_total = 0;      // total knacks
                $scope.single_knack = null;   // a knack to show single knack page
                $scope.edit_field = null;     // a profile field to edit
                $scope.user = null;           // profile info
                $scope.is_public = false;     // boolean if this page is for public or private profile.
                $scope.user_post_data = {}; // data to post for profile edit
                $scope.edit_item= null;       // An user's item or knack to edit
                $scope.active_tab = 'knacks';
                $scope.active_tab1 = 'connections';
                $scope.isCollegeBoxOpened = false;
                $scope.isAgeBoxOpened = false;

                $scope.user_post_data.college = 'Harvard University';
                $scope.user_post_data.full_name = 'Automn Barsby';
                $scope.user_post_data.age = null;
                if($scope.user_post_data.age==null) {
                    $scope.user_post_data.age = 'Freshman';
                }
                if($scope.user_post_data.full_name==null) {
                    $scope.user_post_data.full_name = 'Sarah Simson';
                }
                if($scope.user_post_data.college==null) {
                    $scope.user_post_data.college = '';
                }
                $scope.user_post_data.picture = 'images/users/no_avatar.png';
                $scope.user_post_data.descriptions = [];
                $scope.user_post_data.descriptions.push({description: 'I\'m an awsome knacker'});
                $scope.user_post_data.descriptions.push({description: 'Who absolutely loves what I do'});
                $scope.user_post_data.descriptions.push({description: 'I\'m fun, fair and honest'});
                $scope.user_post_data.descriptions.push({description: 'I\'ll do a great job everytime'});
                $scope.user_post_data.descriptions.push({description: 'you\'ll really love your knack'});

                $scope.user_not_found = false;

                if ($stateParams.id) {
                    $rootScope.currentMenu = 'profile';
                } else {
                    $rootScope.currentMenu = 'profile_edit';
                }

                if ($stateParams.uuid) {
                    $scope.authToken = register_resource.get({uuid: $stateParams.uuid}, function(result){
                        localStorageService.add('Authorization', 'Token ' + $scope.authToken.token);
                        localStorageService.add('rest_token', $scope.authToken.token);
                        localStorageService.add('user_id', $scope.authToken.id);
                        localStorageService.add('full_name', $scope.authToken.full_name);
                        localStorageService.add('picture', $scope.authToken.picture);

                        $rootScope.restricted();
                        localStorageService.remove('registered_email');
                        $rootScope.is_authenticated = true;
                        $state.go('private-profile');
                    }, function (error){
                        if (error.data['details'] == 'Invalid User') {
                            show_welcome_popup();
                        } else {
                            $state.go('home');
                        }
                    });
                } else {
                    $scope.restricted();

                    if ($stateParams.id) {
                        $scope.is_public = true;
                        $scope.user = public_profile_resource.get({id: $stateParams.id}, function (result) {
                            $scope.user.picture = result.picture ? result.picture : 'images/users/no_avatar.png'
                            $scope.user.college = result.college == "null" ? "" : result.college;
                            $scope.knacks_total = result.knacks.length;
                            $scope.items_total = result.items.length;
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

                        $scope.user = private_profile_resource.get({social_backend: social_backend, social_code: social_code}, function (result) {
                            if (social_backend != '' && social_code != '') {
                                localStorageService.add('Authorization', 'Token ' + result.token);
                                localStorageService.add('rest_token', result.token);
                                localStorageService.add('user_id', result.id);
                                localStorageService.add('full_name', result.full_name);
                                localStorageService.add('college', result.college);
                                localStorageService.add('picture', result.picture);
                                $rootScope.restricted();

                                delete $cookies.social_backend;
                                delete $cookies.social_code;
                            } else {

                                $scope.user.picture = result.picture ? result.picture : 'images/users/no_avatar.png'
                                $scope.user.college = result.college == "null" ? "" : result.college;
                                $scope.user_post_data = angular.copy($scope.user);
                                if($scope.user_post_data == null) {
                                    $scope.user_post_data.full_name = 'Automn Barsby';
                                    $scope.user_post_data.college = 'Harvard University';
                                    $scope.user_post_data.picture = 'images/users/no_avatar.png';

                                }
                                $scope.knacks_total = result.knacks.length;
                                $scope.items_total = result.items.length;
                            }

                            /*-----for test---------*/
                            $scope.user_post_data.age="Freshman";
                            $scope.user_post_data.descriptions = [];
                            $scope.user_post_data.descriptions.push({description: 'I\'m an awsome knacker'});
                            $scope.user_post_data.descriptions.push({description: 'Who absolutely loves what I do'});
                            $scope.user_post_data.descriptions.push({description: 'I\'m fun, fair and honest'});
                            $scope.user_post_data.descriptions.push({description: 'I\'ll do a great job everytime'});
                            $scope.user_post_data.descriptions.push({description: 'you\'ll really love your knack'});
                            // $scope.user_post_data._method = 'POST';
                        }, $scope.checkTokenError);
                    }
                }
            };

            function show_welcome_popup(){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/views/modals/register-modal.html',
                    controller: 'RegisterModalCtl',
                    windowClass: 'vcenter-modal',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        uuid: function () {
                            return $stateParams.uuid;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            }
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

            $scope.toggleAgeBox = function(age) {
                $scope.isAgeBoxOpened = false;
                $scope.user_post_data.age = age;
            };

            $scope.close_single = function(){
                $scope.single_knack = null;
            };

            $scope.edit_profile = function(field_name, evt){
                evt.preventDefault();
                evt.stopPropagation();
                if(!$scope.user_not_found)
                    $scope.edit_field = field_name;
            };

            $scope.edit_knack = function(knack_item){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/views/modals/edit-knack-modal.html',
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
            $scope.edit_item = function(item){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/views/modals/edit-item-modal.html',
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
            $scope.repost_knack = function(knack_type){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/post-knack-modal.html',
                    controller: 'PostModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        knack_type: function () {
                            return knack_type;
                        },
                        knack_action: function () {
                            return 'repost';
                        }
                    }
                });
                modalInstance.result.then(function (data) {

                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.repost_item = function(item_type){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/post-item-modal.html',
                    controller: 'PostItemModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        item_type: function () {
                            return item_type;
                        }
                    }
                });
                modalInstance.result.then(function (data) {

                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.close_edit = function(){
                $scope.edit_field = null;
            };

            $scope.add_more_description = function(){
                $scope.user_post_data.descriptions.push({});
            };

            $scope.activate_knacks = function(){
                $scope.active_tab = 'knacks';
            };
            $scope.activate_items = function(){
                $scope.active_tab = 'items';
            };

            $scope.activate_connections = function(){
                $scope.active_tab1 = 'connections';
            }
            $scope.activate_reviews = function(){
                $scope.active_tab1 = 'reviews';
            };

        }]);
    return app;
});