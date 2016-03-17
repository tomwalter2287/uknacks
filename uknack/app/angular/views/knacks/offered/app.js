'use strict';
define(['app'], function (app) {
    app.register.controller('offeredCtrl', [
        'localStorageService', '$rootScope', '$scope', '$resource', '$modal', '$state', '$stateParams', '$window', '$timeout',
        'restricted', 'rest',
        function (localStorageService, $rootScope, $scope, $resource, $modal, $state ,$stateParams, $window, $timeout) {
            init();

            function init(){
                $rootScope.currentMenu = 'knacks';
                $scope.current_page = $state.current.name;

                $scope.all_knacks = [];
                $scope.knacks = [];
                $scope.knack_ideas = [];

                $scope.page = 1;
                $scope.page_size = 8;
                $scope.show_mode = 'all';

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
                    'type': 'O',
                    'sort_by': 'recently',
                    'search_text': '',
                    'selected_categories': []
                };
                if($stateParams.id != null){
                    $scope.single_knack = {
                        name: 'Traveling to Utha this week end, need online Math tutor',
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

                    var knacks_resource =  $resource(":protocol://:url/api/knacks/knack_ideas",
                        {
                            protocol: $scope.restProtocol,
                            url: $scope.restURL
                        }
                    );
                    knacks_resource.get(function (result) {
                        var knack = $.grep(result.results, function(e) {
                            return e.id == $stateParams.id;
                        });
                        $scope.single_knack = knack[0];
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                }

                $scope.restricted();

                var knacks_resource =  $resource(":protocol://:url/api/knacks/knack_ideas",
                    {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL
                    }
                );
                knacks_resource.get(function (result) {
                    $scope.knack_ideas = result.results;
                }, function (error) {
                    $scope.message = error.data;
                    console.log(error);
                });

                showKnacks('init');
                if($rootScope.isIdea == 'ideas') {
                   setTimeout(function() {
                        $scope.show_mode = 'ideas';
                        $scope.all_knacks = $scope.knack_ideas;
                   }, 1000);
                }   
            }

            function showKnacks(type) {
                if(type == 'more') {
                    $scope.page += 1;
                } else {
                    $scope.all_knacks = [];
                    $scope.page = 1;
                }
                var knacks_resource =  $resource(
                    ":protocol://:url/api/knacks/knacks?page=:page&page_size=:page_size&type=:type&" +
                    "gender=:gender&min_price=:min_price&max_price=:max_price&min_age=:min_age&max_age=:max_age&categories=:categories&college=:college&year=:year&search_text=:search_text",
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
                        year: $scope.filter.year,
                        search_text: $scope.filter.search_text
                    }
                );
                knacks_resource.get(function (result) {
                    if(type == 'more') {
                        $scope.knacks = result.results;
                        $scope.all_knacks = $scope.all_knacks.concat($scope.knacks);
                    } else {
                        $scope.knacks = result.results;
                        $scope.all_knacks = $scope.knacks;
                    }
                }, function (error) {
                    $scope.message = error.data;
                    console.log(error);
                });
            }

            $scope.selectItem = function(index) {
                $scope.selectedItem = $scope.sortList[index];
                $scope.isShowSortContent = false;
            };

            $scope.showMore = function(){
                showKnacks('more');
            };

            $scope.closeSingle = function(){
                $scope.single_knack = null;
            };

            $scope.openBusinessModal = function (business_model) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/business-modal.html',
                    controller: 'BusinessModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        business_model: function () {
                            return business_model;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

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
                        // [].push.apply($scope.all_knacks, data);
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
            $scope.$watch('filter.year', function (newVal, oldVal) {
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
            };

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

            //$scope.videoIndex = -1;
            //$scope.showKnackVideo = function(url) {
                //evt.preventDefault();
                //evt.stopPropagation();
                //$scope.videoIndex = index;
            //};

            /*
            $scope.hideKnackVideo = function() {
                //$scope.videoIndex = -1;
            };*/

            $scope.flipAll = function() {
                if($rootScope.is_authenticated) {
                    angular.forEach($scope.all_knacks, function(knack, inx) {
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
                if($scope.show_mode == 'all') {
                    $scope.show_mode = 'ideas';
                    $scope.all_knacks = $scope.knack_ideas;
                    $rootScope.isIdea == 'ideas';
                }
                else {
                    $scope.show_mode = 'all';
                    $scope.all_knacks = $scope.knacks;
                    $rootScope.isIdea == 'all';
                }
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

            $scope.test = function() {
                console.log(1);
            };

        }]);
    return app;
});