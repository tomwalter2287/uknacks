'use strict';
define(['app'], function (app) {
    app.register.controller('publicCtrl', [
        'localStorageService', '$rootScope', '$scope', '$resource', '$modal', '$stateParams',
        'restricted', 'rest',
        function (localStorageService, $rootScope, $scope, $resource, $modal, $stateParams) {

            var public_profile_resource = $resource(":protocol://:url/api/accounts/profile?public_url=:public_url",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                public_url: '@public_url'
            });

            var private_profile_resource = $resource(":protocol://:url/api/accounts/profile",{
                protocol: $scope.restProtocol,
                url: $scope.restURL
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

                $scope.connections = [];

                $scope.user_not_found = false;

                if ($stateParams.public_url) {
                    $rootScope.currentMenu = 'profile';
                } else {
                    $rootScope.currentMenu = 'profile_edit';
                }

                $scope.restricted();

                if ($stateParams.public_url) {
                    $scope.is_public = true;
                    $scope.user = public_profile_resource.get({public_url: $stateParams.public_url}, function (result) {
                        result.picture = result.picture ? result.picture : 'images/users/no_avatar.png'
                        $scope.user_post_data = result;
                        if ($scope.user_post_data.social_links.facebook != ''){
                            $scope.user_post_data.social_links.facebook = 'https://' + $scope.user_post_data.social_links.facebook;
                        }
                        if ($scope.user_post_data.social_links.twitter != ''){
                            $scope.user_post_data.social_links.twitter = 'https://' + $scope.user_post_data.social_links.twitter;
                        }
                        if ($scope.user_post_data.social_links.instagram != ''){
                            $scope.user_post_data.social_links.instagram = 'https://' + $scope.user_post_data.social_links.instagram;
                        }
                        $scope.knacks = result.knacks;
                        $scope.items = result.items;

                        localStorageService.add('user_id', result.id);
                        localStorageService.add('full_name', result.full_name);
                        localStorageService.add('college', result.college);
                        localStorageService.add('picture', result.picture);
                        $rootScope.restricted();

                    }, function () {
                        $scope.user_not_found = true;
                    });
                } else {
                    $scope.user = private_profile_resource.get(function (result) {
                        result.picture = result.picture ? result.picture : 'images/users/no_avatar.png'
                        $scope.user_post_data = result;
                        if ($scope.user_post_data.social_links.facebook != ''){
                            $scope.user_post_data.social_links.facebook = 'https://' + $scope.user_post_data.social_links.facebook;
                        }
                        if ($scope.user_post_data.social_links.twitter != ''){
                            $scope.user_post_data.social_links.twitter = 'https://' + $scope.user_post_data.social_links.twitter;
                        }
                        if ($scope.user_post_data.social_links.instagram != ''){
                            $scope.user_post_data.social_links.instagram = 'https://' + $scope.user_post_data.social_links.instagram;
                        }
                        $scope.knacks = result.knacks;
                        $scope.items = result.items;

                        localStorageService.add('user_id', result.id);
                        localStorageService.add('full_name', result.full_name);
                        localStorageService.add('college', result.college);
                        localStorageService.add('picture', result.picture);
                        $rootScope.restricted();
                    }, $scope.checkTokenError);
                }

            };

            $scope.toggleCollegeBox = function() {
                $scope.isCollegeBoxOpened = !$scope.isCollegeBoxOpened;
            };

            $scope.toggleLocationBox = function() {
                $scope.isLocationBoxOpened = !$scope.isLocationBoxOpened;
            };

            $scope.close_single = function(){
                $scope.single_knack = null;
            };

            $scope.edit_profile = function(field_name, evt){

            };
            $scope.openHireModal = function() {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/hire-modal.html',
                    controller: 'HireModalCtl',
                    windowClass: 'vcenter-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.openWriteAReviewModal = function(buy_item, item_type) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/write-review-modal.html',
                    controller: 'WriteReviewModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        buy_item: function () {
                            return buy_item;
                        },
                        item_type: function () {
                            return item_type;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
            $scope.openByItemModal = function() {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/payment-modal.html',
                    controller: 'PaymentModalCtl',
                    windowClass: 'vcenter-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.contactMe = function() {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/contact-me-modal.html',
                    controller: 'ContactMeModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        contact_user: function () {
                            return {name: 'Sarah'};
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.openIndex = -1;
            $scope.toggleSocialBox = function(index, evt) {
                evt.preventDefault();
                evt.stopPropagation();
                $scope.openIndex = index;
               
            };
            $scope.openIndexInStore = -1;
            $scope.toggleSocialBoxInStore = function(index, evt) {
                evt.preventDefault();
                evt.stopPropagation();
                $scope.openIndexInStore = index;
            };
            $scope.closeSocialBox = function() {
                $scope.openIndex = -1;
                $scope.openIndexInStore = -1;
            };

            $scope.close_edit = function(){
                $scope.edit_field = null;
            };
            $scope.edit_profile = function(field_name, evt){
                evt.preventDefault();
                evt.stopPropagation();
                if(!$scope.user_not_found)
                    $scope.edit_field = field_name;
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
                $scope.active_r_tab = 'connections';
            };
            $scope.activate_reviews = function(){
                $scope.active_r_tab = 'reviews';
            };

            $scope.toggleCollegeBox = function(college) {
                $scope.isCollegeBoxOpened = !$scope.isCollegeBoxOpened;
                $scope.user_post_data.college = college;
            };

        }]);
    return app;
});