'use strict';
define(['app', 'WOW', 'owl.carousel'], function(app, WOW, owlCarousel) {
    app.register.controller('indexCtrl', [
        'localStorageService',
        '$scope',
        '$rootScope', '$modal', '$timeout', '$state',
        function(localStorageService, $scope, $rootScope, $modal, $timeout, $state) {
            $rootScope.currentMenu = "home";
            $scope.knacks = [];

            if (typeof WOW === 'function') {
				new WOW({
					boxClass:     'wow',      // default
					animateClass: 'animated', // default
					offset:       0          // default
				}).init();
			}

            $timeout(function(){jQuery('.tweet_list').owlCarousel({
	            loop:true,
				margin:0,
				responsiveClass:true,
				nav:false,
				dots: true,
				autoplay: true,
				autoplayTimeout: 20000,
				autoHeight: false,
				smartSpeed: 400,
				responsive:{
					0: {
						items:1
					},
					768: {
						items:2
					},
					1200: {
						items:3
					}
				}
	        });});/**/

            $scope.getStart = function () {
                $timeout(function() {
                    if(!$rootScope.is_authenticated) {
                        angular.element("#id-sign-up").triggerHandler('click');
                    } else {
                        $state.go("knack-offered");
                    }
                }, 0);
            };
            $scope.openLoginModal = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/login-modal.html',
                    controller: 'LoginModalCtl',
                    windowClass: 'vcenter-modal'
                });
                modalInstance.result.then(function (data) {
                        console.log(data);
                        $state.go('private-profile');
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.knacks.push(
                {
                    id: 1,
                    name: 'Computer Repair - Let a girl give your laptop some Luv',
                    thumb_photo: ['images/knacks/grid/item1.jpg', 'images/knacks/grid/item6.jpg', 'images/knacks/grid/item5.jpg', 'images/knacks/grid/item4.jpg'],
                    rate: 4,
                    category_name: 'Technology',
                    description: 'Hey everyone, I am Automn, yeah like the season. I am currently offering computer repair. I charge $65/hr or a flat fee if the issue is...',
                    type: 'knack',
                    price: 65,
                    flip: false,
                    profile: {
                        name: 'Derek Wilson',
                        avatar: 'images/users/user.png',
                        college: 'Fisher college',
                        skill: 'Sophomore',
                        age: 22,
                        rate: 4,
                        cost: 2014,
                        created: 'Since dec 2014',
                        last_seen: 'Last seen: 2 hours ago',
                        connections: ['images/users/user1.jpg', 'images/users/user2.jpg', 'images/users/user3.jpg', 'images/users/user4.jpg'],
                        conn_more_count: 34,
                        video_url: 'video/video.mp4'
                    }
                },
                {
                    id: 2,
                    name: 'Papers and essays - 24 hour return',
                    thumb_photo: ['images/knacks/grid/item2.jpg', 'images/knacks/grid/item1.jpg', 'images/knacks/grid/item6.jpg', 'images/knacks/grid/item5.jpg'],
                    rate: 5,
                    category_name: 'Computers',
                    description: 'Need help writing your paper? Look no further. Lemme help you get it done quickly and well. 24hr turnaround guarantee....',
                    type: 'knack',
                    price: 120,
                    flip: false,
                    profile: {
                        name: 'Mark Johnson',
                        avatar: 'images/users/user.png',
                        college: 'Boston university',
                        skill: 'Sophomore',
                        age: 22,
                        rate: 4,
                        cost: 2014,
                        created: 'Since dec 2014',
                        last_seen: 'Last seen: 2 hours ago',
                        connections: ['images/users/user1.jpg', 'images/users/user2.jpg', 'images/users/user3.jpg', 'images/users/user4.jpg'],
                        conn_more_count: 34,
                        video_url: 'video/video.mp4'
                    }
                },
                {
                    id: 3,
                    name: 'I can design your website in less than a week',
                    thumb_photo: ['images/knacks/grid/item3.jpg', 'images/knacks/grid/item2.jpg', 'images/knacks/grid/item1.jpg', 'images/knacks/grid/item6.jpg'],
                    rate: 4,
                    category_name: 'Creative',
                    description: 'Everybody need a website nowadays, even if you’re just still in school. I design beautiful websites for small businesses',
                    type: 'knack',
                    price: 250,
                    flip: false,
                    profile: {
                        name: 'Jessica Morgan',
                        avatar: 'images/users/user.png',
                        college: 'Harvard university',
                        skill: 'Sophomore',
                        age: 22,
                        rate: 4,
                        cost: 2014,
                        created: 'Since dec 2014',
                        last_seen: 'Last seen: 2 hours ago',
                        connections: ['images/users/user1.jpg', 'images/users/user2.jpg', 'images/users/user3.jpg', 'images/users/user4.jpg'],
                        conn_more_count: 34,
                        video_url: 'video/video.mp4'
                    }
                },
                {
                    id: 4,
                    name: 'Commuting from Quincy to Boston University',
                    thumb_photo: ['images/knacks/grid/item4.jpg', 'images/knacks/grid/item3.jpg', 'images/knacks/grid/item2.jpg', 'images/knacks/grid/item1.jpg'],
                    rate: 4,
                    category_name: 'Delivery',
                    description: 'I communte every morning at 7am from Quincy to Boston University. I can drop you anywhere near campus.',
                    type: 'knack',
                    price: 5,
                    flip: false,
                    profile: {
                        name: 'Luke Miller',
                        avatar: 'images/users/user.png',
                        college: 'Stanford university',
                        skill: 'Sophomore',
                        age: 22,
                        rate: 4,
                        cost: 2014,
                        created: 'Since dec 2014',
                        last_seen: 'Last seen: 2 hours ago',
                        connections: ['images/users/user1.jpg', 'images/users/user2.jpg', 'images/users/user3.jpg', 'images/users/user4.jpg'],
                        conn_more_count: 34,
                        video_url: 'video/video.mp4'
                    }
                },
                {
                    id: 5,
                    name: 'Commuting from Quincy to Boston University',
                    thumb_photo: ['images/knacks/grid/item5.jpg', 'images/knacks/grid/item4.jpg', 'images/knacks/grid/item3.jpg', 'images/knacks/grid/item2.jpg'],
                    rate: 4,
                    category_name: 'Delivery',
                    description: 'I communte every morning at 7am from Quincy to Boston University. I can drop you anywhere near campus.',
                    type: 'knack',
                    price: 5,
                    flip: false,
                    profile: {
                        name: 'Luke Miller',
                        avatar: 'images/users/user.png',
                        college: 'Stanford university',
                        skill: 'Sophomore',
                        age: 22,
                        rate: 4,
                        cost: 2014,
                        created: 'Since dec 2014',
                        last_seen: 'Last seen: 2 hours ago',
                        connections: ['images/users/user1.jpg', 'images/users/user2.jpg', 'images/users/user3.jpg', 'images/users/user4.jpg'],
                        conn_more_count: 34,
                        video_url: 'video/video.mp4'
                    }
                }
            );

            $scope.flip = function(item) {
                item.flip = !item.flip;
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
            $scope.hideMenubar = function() {
                $rootScope.isMenubarOpen = false;
            }
    }]);
});