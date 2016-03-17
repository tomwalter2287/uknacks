'use strict';
define(['app'], function (app) {
    app.register.controller('wantedCtrl', [
        'localStorageService', '$rootScope', '$scope', '$resource', '$modal', '$state', '$stateParams',
        'restricted', 'rest',
        function (localStorageService, $rootScope, $scope, $resource, $modal, $state, $stateParams) {

            var knack_item_resource = $resource(":protocol://:url/api/knacks/knacks?id=:id",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                id: '@id'
            });

            init();

            function init(){
                $rootScope.currentMenu = 'knacks';
                $scope.current_page = $state.current.name;
                console.log('current page -> ' + $scope.current_page);

                $scope.knacks = [];
                $scope.page = 1;
                $scope.page_size = 8;
                // $scope.item_id = $stateParams.id;
                $scope.single_knack = null;
                $scope.categories = $rootScope.knackCategories;
                $scope.sortList = ['Most Recent', 'Highest rated', 'My Connections'];
                $scope.selectedItem = 'Most recent';

                $scope.filter = {
                    'age': {
                        'from': 0,
                        'to': 60
                    },
                    'price': {
                        'from': 0,
                        'to': 240
                    },
                    'gender': '',
                    'type': 'W',
                    'sort_by': 'recently',
                    'search_text': ''
                }
                if($stateParams.id != null){
                    $scope.single_knack = {
                        title: 'Traveling to Utha this week end, need online Math tutor',
                        created_at: 'Posted 5 hours ago',
                        category_name: 'Ustudy',
                        views: 1256,
                        description: 'Hello! I’m Automn, and I go tto Harvard. I have a passion for nails. I can do your nail one a monthly basis or one time if you want to try me. Refund guaranteed if you’re not satisfied. I study Law in Harvard. Yeah I know, very far away from nails. Fashion is my passion, law is my security net. Where will I end up in lfe? Let’s see. Maybe make female lawyers beautiful to win court case. Seem pretty far fetched.',
                        schedule: 'Busy injecting tons of laws in my brain :)  Fridays and week-ends are better',
                        delivered: '5 miles',
                        cost: 25,
                        photos: ['images/sample/single/knack-single1.jpg', 'images/sample/single/knack-single1.jpg', 'images/sample/single/knack-single1.jpg', 'images/sample/single/knack-single1.jpg', 'images/sample/single/knack-single1.jpg'],
                        profile: {
                            name: 'Automn Barnsby',
                            avatar: 'images/users/user.png',
                            college: 'Harvard University',
                            skill: 'Sophomore',
                            age: 22,
                            rate: 4,
                            cost: 2014,
                            created: 'Since dec 2014',
                            last_seen: 'Last seen: 2 hours ago',
                            connections: ['images/users/user1.jpg', 'images/users/user2.jpg', 'images/users/user3.jpg', 'images/users/user4.jpg'],
                            conn_more_count: 34,
                            video_url: ''
                        },
                        reviews: [
                            {
                                avatar: 'images/users/user1.jpg',
                                name: 'Derek Wilson',
                                college: 'Fisher college',
                                rate: 4,
                                content: 'Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy.'
                            },
                            {
                                avatar: 'images/users/user2.jpg',
                                name: 'James Poter',
                                college: 'Harvard university',
                                rate: 5,
                                content: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout going to use a passage of Lorem Ipsum, you need.'
                            }
                        ]
                    };
                    /*
                    knack_item_resource.get({'id': $stateParams.id}, function(result){
                        $scope.single_knack = result.results[0];
                    }, function(error){
                        console.log(error);
                    });*/
                }

                $scope.restricted();
                
                var pKnacks = $scope.knacks;
                for(var i = 0; i < pKnacks.length; i++) {
                    var college = pKnacks[i].owner_college;
                    var title = pKnacks[i].name;
                    if(college.length > 18) {
                        var ellipsisCollege = '';
                        ellipsisCollege = college.slice(0, 17) + ' ...';
                        $scope.knacks[i].ellipsisCollege = ellipsisCollege;
                    } else {
                        $scope.knacks[i].ellipsisCollege = college;
                    }    
                    if(title.length > 55) {
                        var ellipsisTitle = title.slice(0, 54) + '...';
                        $scope.knacks[i].ellipsisTitle = ellipsisTitle;
                    } else {
                        $scope.knacks[i].ellipsisTitle = title;
                    }
                }

                showKnacks('init');
            };

            function showKnacks(type){
                if(type == 'more') {
                    $scope.page += 1;
                } else {
                    $scope.knacks = [];
                    $scope.page = 1;
                }
                var knacks_resource =  $resource(
                    ":protocol://:url/api/knacks/knacks?page=:page&page_size=:page_size&type=:type&" +
                    "gender=:gender&min_price=:min_price&max_price=:max_price&min_age=:min_age&max_age=:max_age&categories=:categories&college=:college&search_text=:search_text",
                    {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL,
                        page: $scope.page,
                        page_size: $scope.page_size,
                        gender: $scope.filter.gender,
                        min_price: $scope.filter.price.from,
                        max_price: $scope.filter.price.to,
                        min_age: $scope.filter.age.from,
                        max_age: $scope.filter.age.to,
                        type: $scope.filter.type,
                        categories: $scope.filter.selected_categories,
                        college: $scope.filter.college,
                        search_text: $scope.filter.search_text
                    }
                );
                knacks_resource.get(function (result) {
                    if (type == 'more') {
                        $scope.knacks = $scope.knacks.concat(result.results);
                    } else {
                        $scope.knacks = result.results;
                    }
                }, function (error) {
                    $scope.message = error.data;
                    console.log(error);
                });
            };

            $scope.selectItem = function(index) {
                $scope.selectedItem = $scope.sortList[index];
                $scope.isShowSortContent = false;
            };

            $scope.applyFlip = function(index) {
                $scope.isFlip = !$scope.isFlip;
            };

            $scope.showMore = function(){
                showKnacks('more');
            };

            $scope.closeSingle = function(){
                $scope.single_knack = null;
            }

            $scope.openPostModal = function (item) {
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
                        // [].push.apply($scope.knacks, data);
                        $scope.knacks.splice(0, 0, data);
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

            $scope.fullSearch = function(){
                if( $scope.filter.search_text)
                    showKnacks('init');
            };

            // Watch filters
            $scope.$watch('filter.age.from', function (newVal, oldVal) {
                var divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[0]).empty();
                angular.element(divHandles[0]).append('<div>' + newVal + '</div>');
                if(newVal!=oldVal)
                    showKnacks('init');
            }, true);
            $scope.$watch('filter.age.to', function (newVal, oldVal) {
                var divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[1]).empty();
                angular.element(divHandles[1]).append('<div>' + newVal + '</div>');
                if(newVal!=oldVal)
                    showKnacks('init');
            }, true);
            $scope.$watch('filter.price.from', function (newVal, oldVal) {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[0]).empty();
                angular.element(divHandles[0]).append('<div>$' + newVal + '</div>');
                if(newVal!=oldVal)
                    showKnacks('init');
            }, true);
            $scope.$watch('filter.price.to', function (newVal, oldVal) {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[1]).empty();
                angular.element(divHandles[1]).append('<div>$' + newVal + '</div>');
                if(newVal!=oldVal)
                    showKnacks('init');
            }, true);
            $scope.$watch('filter.college', function (newVal, oldVal) {
                if(newVal!=oldVal)
                    showKnacks('init');
            }, true);
            $scope.$watchCollection('filter.selected_categories', function(newVal, oldVal) {
                if(newVal!=oldVal)
                    showKnacks('init');
            }, true);
            $scope.$watchCollection('filter.gender', function(newVal, oldVal) {
                if(newVal!=oldVal)
                    showKnacks('init');
            }, true);
            $scope.$watchCollection('filter.sort_by', function(newVal, oldVal) {
                if(newVal!=oldVal)
                    showKnacks('init');
            }, true);

            $scope.mainLeftLoaded = function() {
                var divHandles = angular.element("#price-slider .noUi-handle");
                angular.element(divHandles[0]).append('<div>$' + $scope.filter.price.from + '</div>');
                angular.element(divHandles[1]).append('<div>$' + $scope.filter.price.to + '</div>');
                divHandles = angular.element("#age-slider .noUi-handle");
                angular.element(divHandles[0]).append('<div>' + $scope.filter.age.from + '</div>');
                angular.element(divHandles[1]).append('<div>' + $scope.filter.age.to + '</div>');
            };

            $scope.selectAllCategories = function (isSelect) {
                if (!$scope.categories) { return; }
                if (isSelect) {
                    $scope.filter.selected_categories = $scope.categories.map(function(category) { return category.id; });
                } else {
                    $scope.filter.selected_categories.splice(0, $scope.filter.selected_categories.length);
                }
            };

            $scope.isAllCategorySelected = function () {
                if (!$scope.categories) { return; }
                return angular.equals($scope.filter.selected_categories, $scope.categories.map(function(category) { return category.id; }));
            }

            $scope.flip = function(item) {
                
                if($rootScope.is_authenticated) {
                    item.flip = !item.flip;
                } else {
                    $rootScope.isGotoFeed = true;
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/loginto-flip-modal.html',
                        controller: 'LoginToFlipModalCtl',
                        windowClass: 'vcenter-modal'
                    });

                    modalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                }
            };

            $scope.flipAll = function() {
                if($rootScope.is_authenticated) {
                    angular.forEach($scope.knacks, function(knack, inx) {
                        knack.flip = !knack.flip;
                    });
                } else {
                    $rootScope.isGotoFeed = true;
                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/loginto-flip-modal.html',
                        controller: 'LoginToFlipModalCtl',
                        windowClass: 'vcenter-modal'
                    });

                    modalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                }
            };

            $scope.showIdeas = function() {
                if($scope.show_mode == 'all')
                    $scope.show_mode = 'ideas';
                else
                    $scope.show_mode = 'all';
            };

            $scope.showVideoModal = function(url) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/video-modal.html',
                    controller: 'KnackVideoModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        video_url: function () {
                            return url;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
        }]);
    return app;
});