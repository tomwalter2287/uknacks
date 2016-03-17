'use strict';

define(['angularAMD'], function(app) {
    app.controller('PostModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$modal', 'knack', '$stateParams',
            'localStorageService', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $modal, knack, $stateParams) {
                $scope.knack = {
                    anonymous: false,
                    username: '',
                    name: '',
                    category: '',
                    description: '',
                    photo0: '',
                    photo1: '',
                    photo2: '',
                    photo3: '',
                    photo4: '',
                    video: '',
                    schedule: '',
                    willing_to_travel: false,
                    price: '',
                    type: 'O',
                    miles: 'On Campus',
                    how_charge: 'Flat Fee'
                };
                $scope.photo_selected = true;
                $scope.category_selected = true;
                $scope.current_name = $state.current.name;
                $scope.posted_knack = false;

                $rootScope.cropper0 = {};
                $rootScope.cropper0.sourceImage = null;
                $rootScope.cropper0.croppedImage   = null;
                $rootScope.cropper1 = {};
                $rootScope.cropper1.sourceImage = null;
                $rootScope.cropper1.croppedImage   = null;
                $rootScope.cropper2 = {};
                $rootScope.cropper2.sourceImage = null;
                $rootScope.cropper2.croppedImage   = null;
                $rootScope.cropper3 = {};
                $rootScope.cropper3.sourceImage = null;
                $rootScope.cropper3.croppedImage   = null;
                $rootScope.cropper4 = {};
                $rootScope.cropper4.sourceImage = null;
                $rootScope.cropper4.croppedImage   = null;

                $rootScope.bounds = {};
                $rootScope.bounds.left = 0;
                $rootScope.bounds.right = 0;
                $rootScope.bounds.top = 0;
                $rootScope.bounds.bottom = 0;

                if (knack) {
                    $scope.knack = knack;
                    $scope.knack_type = knack.type == 'O' ? 'Offered' : 'Wanted';
                    $scope.category_name = $scope.knack.category_name;
                } else {
                    $scope.knack_type = 'Offered';
                    $scope.category_name = 'Category Selection';
                    if ($state.current.name == 'knack-offered') {
                        $scope.knack.type = 'O';
                        $scope.knack_type = 'Offered';
                    }
                    else if ($state.current.name == 'knack-wanted') {
                        $scope.knack.type = 'W';
                        $scope.knack_type = 'Wanted';
                    }
                }

                var post_resource = $resource(":protocol://:url/api/knacks/knacks/", {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL
                    }, {
                        save: {
                            method: 'POST',
                            transformRequest: transFormRequestHandler,
                            headers: {'Content-Type': undefined}
                        }
                    }
                );

                $scope.post_knack = function () {
                    if ($scope.postForm.$valid) {
                        $scope.show_name = 'knack-offered';
                        $scope.knack.photo0 = $rootScope.cropper0.croppedImage == null ? '' : $rootScope.cropper0.croppedImage;
                        $scope.knack.photo1 = $rootScope.cropper1.croppedImage == null ? '' : $rootScope.cropper1.croppedImage;
                        $scope.knack.photo2 = $rootScope.cropper2.croppedImage == null ? '' : $rootScope.cropper2.croppedImage;
                        $scope.knack.photo3 = $rootScope.cropper3.croppedImage == null ? '' : $rootScope.cropper3.croppedImage;
                        $scope.knack.photo4 = $rootScope.cropper4.croppedImage == null ? '' : $rootScope.cropper4.croppedImage;
                        if ($scope.category_name == 'Category Selection'){
                            $scope.category_selected = false;
                            return;
                        }
                        $scope.category_selected = true;
                        if (!$scope.knack.photo0 && !$scope.knack.photo1 && !$scope.knack.photo2 && !$scope.knack.photo3 && !$scope.knack.photo4){
                            $scope.photo_selected = false;
                            return;
                        }
                        $scope.photo_selected = true;
                        $scope.posted_knack = true;

                        post_resource.save($scope.knack, function (knack) {
                            $modalInstance.close(knack);
                        }, function (error) {
                            $scope.message = error.data;
                            console.log(error);
                        });
                    }
                };

                $scope.createMoreKnacks = function () {
                    $scope.posted_knack = false;
                };

                $scope.openInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p>Show off how cool, helpful or unique your knack willwith an awesome 20 second elevator pitch!' +
                                    '<br/> Just use your phone or webcam, record your pitch and upload it here.</p>' +
                                    '<p>Knackers with pitches are more likely to get hired than those without, so be sure to upload your pitches.</p>';
                                return message;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                };


                $scope.openAnonymouseInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p class="anonymously-text">When you post a knack anonymously, your name and photo will be hidden from the public. Also, your knack will not be linked to your profile.<br><br>NOTE: Customers are more likely to hire knackers who they can both see and verify. please choose wisely when posting anonymously.</p>';
                                return message;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

                $scope.headline_focus_in = function() {
                    if ($scope.knack.name == ''){
                        $scope.knack.name = 'I\'ll help you write an excellent thesis for your paper';
                    }
                };

                $scope.description_focus_in = function() {
                    if ($scope.knack.description == ''){
                        $scope.knack.description = 'Busy working this week? No time to research + write your paper? I\'m an experienced English TA, and writing coach who\'s fun, affordable + available to help help you with your essays and papers. Juts message to get started!';
                    }
                }

                $scope.schedule_focus_in = function() {
                    if ($scope.knack.schedule == ''){
                        $scope.knack.schedule = 'I have class in the morning so anytime after 2pm is good';
                    }
                }
            }]);

    app.controller('EditKnackModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$modal', 'knack_item', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $modal, knack_item) {
                $scope.knack = {
                    anonymous: false
                };

                $rootScope.cropper0 = {};
                $rootScope.cropper0.sourceImage = null;
                $rootScope.cropper0.croppedImage   = null;
                $rootScope.cropper1 = {};
                $rootScope.cropper1.sourceImage = null;
                $rootScope.cropper1.croppedImage   = null;
                $rootScope.cropper2 = {};
                $rootScope.cropper2.sourceImage = null;
                $rootScope.cropper2.croppedImage   = null;
                $rootScope.cropper3 = {};
                $rootScope.cropper3.sourceImage = null;
                $rootScope.cropper3.croppedImage   = null;
                $rootScope.cropper4 = {};
                $rootScope.cropper4.sourceImage = null;
                $rootScope.cropper4.croppedImage   = null;

                $rootScope.bounds = {};
                $rootScope.bounds.left = 0;
                $rootScope.bounds.right = 0;
                $rootScope.bounds.top = 0;
                $rootScope.bounds.bottom = 0;

                if (knack_item) {
                    $scope.knack = angular.copy(knack_item);
                    $scope.knack_type = $scope.knack.type == 'O' ? 'Offered' : 'Wanted';
                    $scope.category_name = $scope.knack.category_name;
                }

                var edit_resource = $resource(":protocol://:url/api/knacks/knacks/:id", {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL,
                        id: $scope.knack.id
                    }, {
                        save: {
                            method: 'PUT',
                            transformRequest: transFormRequestHandler,
                            headers: {'Content-Type': undefined}
                        }
                    }
                );

                $scope.save_knack = function () {
                    if ($scope.postForm.$valid) {
                        $scope.knack.photo0 = $rootScope.cropper0.croppedImage||$scope.knack.photo0;
                        $scope.knack.photo1 = $rootScope.cropper1.croppedImage||$scope.knack.photo1;
                        $scope.knack.photo2 = $rootScope.cropper2.croppedImage||$scope.knack.photo2;
                        $scope.knack.photo3 = $rootScope.cropper3.croppedImage||$scope.knack.photo3;
                        $scope.knack.photo4 = $rootScope.cropper4.croppedImage||$scope.knack.photo4;
                        edit_resource.save($scope.knack, function (knack) {
                            $modalInstance.close(knack);
                        }, function (error) {
                            $scope.message = error.data;
                            console.log(error);
                        });
                    }
                };

                $scope.openInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p>Show off how cool, helpful or unique your knack willwith an awesome 20 second elevator pitch!' +
                                    '<br/> Just use your phone or webcam, record your pitch and upload it here.</p>' +
                                    '<p>Knackers with pitches are more likely to get hired than those without, so be sure to upload your pitches.</p>';
                                return message;
                            }
                        }
                    });

                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                };

                $scope.openAnonymouseInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p class="font-4">When you post anonymously your name and photo will  hidden from the public.<br><br>Note: People are less likely to hire knackers that they  can’t see and verify. So choose wisely when posting anonymously.</p>';
                                return message;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);

    app.controller('MakeKnackMineModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', 'knack_item', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, knack_item) {
                $scope.knack = angular.copy(knack_item);
                /*
                 var edit_resource = $resource(":protocol://:url/api/knacks/knacks/:id", {
                 protocol: $scope.restProtocol,
                 url: $scope.restURL,
                 id: $scope.knack.id
                 }, {
                 save: {
                 method: 'PUT',
                 transformRequest: transFormRequestHandler,
                 headers: {'Content-Type': undefined}
                 }
                 }
                 );

                 $scope.save_knack = function () {
                 if ($scope.postForm.$valid) {
                 edit_resource.save($scope.knack, function (knack) {
                 $modalInstance.close(knack);
                 }, function (error) {
                 $scope.message = error.data;
                 console.log(error);
                 });
                 }
                 };*/
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);

    app.controller('PostItemModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$modal', 'item', '$stateParams',
            'localStorageService', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $modal, item, $stateParams) {
                $scope.posted_item = false;
                $scope.current_page = $state.current.name;


                if (item) {
                    $scope.item = item;
                    $scope.knack_type = item.type == 'O' ? 'Offered' : 'Wanted';
                } else {
                    $scope.item = {
                        anonymous: 'yes'
                    };

                    if ($state.current.name == 'item-offered') {
                        $scope.item.type = 'O';
                    } else if ($state.current.name == 'item-wanted') {
                        $scope.item.type = 'W';
                    }
                }


                var post_resource = $resource(":protocol://:url/api/items/items/", {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL
                    }, {
                        save: {
                            method: 'POST',
                            transformRequest: transFormRequestHandler,
                            headers: {'Content-Type': undefined}
                        }
                    }
                );

                $scope.post_item = function () {
                    if ($scope.postForm.$valid) {
                        $scope.posted_item = true;
                        post_resource.save($scope.item, function (knack) {
                            $modalInstance.close(knack);
                        }, function (error) {
                            $scope.message = error.data;
                            console.log(error);
                        });
                    }
                };

                $scope.sellMoreItems = function () {
                    $scope.posted_item = false;
                };

                $scope.openInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p>Show off how cool, helpful or unique your knack willwith an awesome 20 second elevator pitch!' +
                                    '<br/> Just use your phone or webcam, record your pitch and upload it here.</p>' +
                                    '<p>Knackers with pitches are more likely to get hired than those without, so be sure to upload your pitches.</p>';
                                return message;
                            }
                        }
                    });
                };

                $scope.openAnonymouseInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p class="font-4">When you post anonymously your name and photo will  hidden from the public.<br><br>Note: People are less likely to hire knackers that they  can’t see and verify. So choose wisely when posting anonymously.</p>';
                                return message;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);
    app.controller('EditItemModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', 'item', '$modal', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, item, $modal) {
                $scope.item = {
                    anonymous: 'yes'
                };

                if (item) {
                    $scope.item = angular.copy(item);
                }

                $scope.item_type = $scope.item.type == 'O' ? 'Offered' : 'Wanted';

                var edit_resource = $resource(":protocol://:url/api/items/items/:id", {
                        protocol: $scope.restProtocol,
                        url: $scope.restURL,
                        id: $scope.item.id
                    }, {
                        save: {
                            method: 'PUT',
                            transformRequest: transFormRequestHandler,
                            headers: {'Content-Type': undefined}
                        }
                    }
                );

                $scope.save_item = function () {
                    if ($scope.postForm.$valid) {
                        edit_resource.save($scope.item, function (item) {
                            $modalInstance.close(item);
                        }, function (error) {
                            $scope.message = error.data;
                            console.log(error);
                        });
                    }
                };

                $scope.openInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p>Show off how cool, helpful or unique your knack willwith an awesome 20 second elevator pitch!' +
                                    '<br/> Just use your phone or webcam, record your pitch and upload it here.</p>' +
                                    '<p>Knackers with pitches are more likely to get hired than those without, so be sure to upload your pitches.</p>';
                                return message;
                            }
                        }
                    });
                };

                $scope.openAnonymouseInfoModal = function () {
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/info-modal.html',
                        controller: 'InfoModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                var message =
                                    '<p class="font-4">When you post anonymously your name and photo will  hidden from the public.<br><br>Note: People are less likely to hire knackers that they  can’t see and verify. So choose wisely when posting anonymously.</p>';
                                return message;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);
    app.controller('KnackVideoModalCtl',
        ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', '$sce', 'video_url', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, $sce, video_url) {
                $scope.video_url = video_url;
                $scope.config = {
                    sources: [
                        {src: $sce.trustAsResourceUrl("http://static.videogular.com/assets/videos/videogular.mp4"), type: "video/mp4"}
                    ],
                    tracks: [
                        {
                            src: "",
                            kind: "subtitles",
                            srclang: "en",
                            label: "English",
                            default: ""
                        }
                    ],
                    theme: "common/videogular-themes-default/videogular.css",
                    plugins: {
                        controls: {
                            autoHide: true,
                            autoHideTime: 5000
                        }
                    }
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }]);
    app.controller('LoginModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal',
                '$http', '$state', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, $state, localStorageService) {
            $scope.user = {
				email: '',
				password: ''
			};
            var AuthToken =  $resource(":protocol://:url/api/accounts/login/", {
    			protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            var SocialAuth = $resource(":protocol://:url/api/accounts/fb_login/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            $scope.socialLogin = function() {
                //SocialAuth.get(function(){
                //    $modalInstance.close();
                //    $rootScope.restricted();
                //}, function(error) {
                //    $scope.message = error.data;
                //});
                window.location.href=$scope.restProtocol + '://' + $scope.restURL + '/social/login/facebook/';
            };

            $scope.login = function () {

                $scope.authToken = AuthToken.save($scope.user, function(){

					localStorageService.add('Authorization', 'Token ' + $scope.authToken.token);
					localStorageService.add('rest_token', $scope.authToken.token);
					localStorageService.add('user_id', $scope.authToken.id);
                    localStorageService.add('full_name', $scope.authToken.full_name);
                    localStorageService.add('picture', $scope.authToken.picture);

                    $modalInstance.close();
                    $rootScope.restricted();

                    // $state.go($state.current, {}, {reload: true});
                    // $state.go('knack-offered', {}, {reload: true});
                    // window.location.href='/#/knacks/offered';
                    // window.location.href='/#/';

                    //window.location.href='/#/private-profile';
                    //$state.go('private-profile');

                    //if($rootScope.isGoToFeed) {
                    //    $state.go('feed-knacks');
                    //}
				},function(error) {
					$scope.message = error.data;
				});
            };

            $scope.registerModal = function () {
                $modalInstance.dismiss('cancel');

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/register-email-modal.html',
                    controller: 'RegisterEmailModalCtl',
                    windowClass: 'vcenter-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.forgotPasswordModal = function () {
                $modalInstance.dismiss('cancel');

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/forgot-pwd-modal.html',
                    controller: 'ForgotPwdModalCtl',
                    windowClass: 'vcenter-modal'
                });

                modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.openInfoModal = function () {
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/info-modal.html',
                    controller: 'InfoModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
        }]);
    app.controller('RegisterModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', 'localStorageService', 'uuid', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, localStorageService, uuid) {

            $scope.user = {
                uuid: uuid,
                password: ''
            };
            var AuthToken =  $resource(":protocol://:url/api/accounts/login/", {
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            $scope.socialLogin = function() {
                window.location.href=$scope.restProtocol + '://' + $scope.restURL + '/social/login/facebook/';
            };

            $scope.login = function () {
                $scope.authToken = AuthToken.save($scope.user, function(){
                    localStorageService.add('Authorization', 'Token ' + $scope.authToken.token);
                    localStorageService.add('rest_token', $scope.authToken.token);
                    localStorageService.add('user_id', $scope.authToken.id);
                    localStorageService.add('full_name', $scope.authToken.full_name);
                    localStorageService.add('picture', $scope.authToken.picture);

                    $modalInstance.close();
                    $rootScope.restricted();
                    localStorageService.remove('registered_email');
                    $rootScope.is_authenticated = true;
                    $state.go('private-profile');
                    // $state.go($state.current, {}, {reload: true});
                    // $state.go('knack-offered', {}, {reload: true});

                    // window.location.href='/#/';
                },function(error) {
                    $scope.message = error.data;
                });
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.$on('$routeChangeStart', function(){
                $modalInstance.close();
            });
        }]);

        app.controller('RegisterEmailModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$modal', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $modal, localStorageService) {
            $scope.user = {
				email: $rootScope.new_email
			};
            var RegisterEmail =  $resource(":protocol://:url/api/accounts/register_email/", {
    			protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            $scope.register = function () {

                $scope.email = RegisterEmail.save($scope.user, function(data){
					localStorageService.add('registered_email', data.email);
                    $modalInstance.close();
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/thanks-modal.html',
                        controller: 'ThanksModalCtl',
                        windowClass: 'vcenter-modal'
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
				},function(error) {
					$scope.message = error.data;
				});

                //$modalInstance.dismiss('cancel');
            };

            $scope.openLoginModal = function () {
                $modalInstance.dismiss('cancel');

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/register-modal.html',
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

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.openInfoModal = function () {
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/info-modal.html',
                    controller: 'InfoModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
        }]);

        app.controller('ForgotPwdModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$modal', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $modal, localStorageService) {

                $scope.requestReset = function () {

                };

                $scope.openLoginModal = function () {
                    $modalInstance.dismiss('cancel');

                    var modalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/register-modal.html',
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

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };

            }]);

        app.controller('PaymentModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal', '$http', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, localStorageService) {
            
            var paymentItemList = [];
            var item1 = new Object();
            item1.detail = "Send money instantly for free";
            item1.img = 'images/venmo.png';
            var item2 = new Object();
            item2.detail = "Paypal also accepts credit cards";
            item2.img = 'images/paypal.png';
            var item3 = new Object();
            item3.detail = "Pay cash on campus";
            item3.img = 'images/cash.png';
            paymentItemList.push(item1);
            paymentItemList.push(item2);
            paymentItemList.push(item3);
            $scope.paymentItemList = paymentItemList;
            $scope.activeIndex = -1;
            $scope.activeOption = function(index) {
                $scope.activeIndex = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.paidCash = function () {

                $modalInstance.dismiss('cancel');
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/agreed-modal.html',
                    controller: 'AgreedModalCtl',
                    windowClass: 'vcenter-modal'
                });

                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
        }]);
        app.controller('HireModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal', '$http', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, localStorageService) {
            
            var paymentItemList = [];
            var item1 = new Object();
            item1.detail = "Send money instantly for free";
            item1.img = 'images/venmo.png';
            var item2 = new Object();
            item2.detail = "Paypal also accepts credit cards";
            item2.img = 'images/paypal.png';
            var item3 = new Object();
            item3.detail = "Pay cash on campus";
            item3.img = 'images/cash.png';
            paymentItemList.push(item1);
            paymentItemList.push(item2);
            paymentItemList.push(item3);
            $scope.paymentItemList = paymentItemList;
            $scope.activeIndex = -1;
            $scope.activeOption = function(index) {
                $scope.activeIndex = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.paidCash = function () {

                $modalInstance.dismiss('cancel');
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/agreed-modal.html',
                    controller: 'AgreedModalCtl',
                    windowClass: 'vcenter-modal'
                });

                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
        }]);
        app.controller('WriteReviewModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'buy_item', 'item_type', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, buy_item, item_type) {
            var ratingItemList = [ {'rate_val':'1/5', 'rate_title': 'Sucked'},
                                   {'rate_val':'2/5', 'rate_title': 'Was okay'},
                                   {'rate_val':'3/5', 'rate_title': 'Good'},
                                   {'rate_val':'4/5', 'rate_title': 'Liked it'},
                                   {'rate_val':'5/5', 'rate_title': 'Loved it!'}  ];
            $scope.buy_item = buy_item;
            $scope.item_type = item_type;
            $scope.ratingItemList = ratingItemList;
            $scope.isSelected = -1;
            $scope.selectItem = function(index) {
                $scope.isSelected = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.postFunc = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
        app.controller('ContactMeModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal', '$http', 'localStorageService', 'contact_user', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, localStorageService, contact_user) {
            $scope.contact_user = angular.copy(contact_user);
            $scope.sent_message = false;
            $scope.sendMessage = function () {
                $scope.sent_message = true;
            };
            $scope.continue = function () {
                $scope.sent_message = false;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
        app.controller('AgreedModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService) {
            var ratingItemList = [ {'rate_val':'1/5', 'rate_title': 'Sucked'},
                                   {'rate_val':'2/5', 'rate_title': 'Was okay'},
                                   {'rate_val':'3/5', 'rate_title': 'Good'},
                                   {'rate_val':'4/5', 'rate_title': 'Liked it'},
                                   {'rate_val':'5/5', 'rate_title': 'Loved it!'}  ];
            $scope.ratingItemList = ratingItemList;
            $scope.isSelected = -1;
            $scope.selectItem = function(index) {
                $scope.isSelected = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.postFunc = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
        app.controller('ThanksModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService) {
            $scope.isSelected = -1;
            $scope.selectItem = function(index) {
                $scope.isSelected = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.postFunc = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
        app.controller('InfoModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'message', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, message) {
            var ratingItemList = [ {'rate_val':'1/5', 'rate_title': 'Sucked'},
                                   {'rate_val':'2/5', 'rate_title': 'Was okay'},
                                   {'rate_val':'3/5', 'rate_title': 'Good'},
                                   {'rate_val':'4/5', 'rate_title': 'Liked it'},
                                   {'rate_val':'5/5', 'rate_title': 'Loved it!'}  ];
                    
            $scope.ratingItemList = ratingItemList;
            $scope.isSelected = -1;
            $scope.message = message;

            $scope.selectItem = function(index) {
                $scope.isSelected = index;
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.postFunc = function () {
                $modalInstance.dismiss('cancel');
            };

        }]);

        app.controller('BusinessModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', '$state', 'business_model', 'rest', 'tokenError',
            function ($scope, $rootScope, $resource, $modalInstance, $http, $state, business_model) {
            $scope.business = business_model;

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
   app.controller('LoginToModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal',
                '$http', 'localStorageService', 'rest', '$state', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, localStorageService, $state) {

            $scope.gotoLogin = function () {
                $rootScope.isGoToFeed = true;
                $modalInstance.dismiss('cancel');
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/login-modal.html',
                    controller: 'LoginModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.gotoSignup = function () {
                $modalInstance.dismiss('cancel');
                $rootScope.isGoToFeed = true;
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/register-email-modal.html',
                    controller: 'RegisterEmailModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);

   app.controller('LoginToFlipModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$modal',
                '$http', 'localStorageService', 'rest', '$state', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $modal, $http, localStorageService, $state) {

            $scope.gotoLogin = function () {
                $rootScope.isGoToFeed = true;
                $modalInstance.dismiss('cancel');
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/login-modal.html',
                    controller: 'LoginModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );
            };
            $scope.gotoSignup = function () {
                $modalInstance.dismiss('cancel');
                $rootScope.isGoToFeed = true;
                var submodalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'views/modals/register-email-modal.html',
                    controller: 'RegisterEmailModalCtl',
                    windowClass: 'vcenter-modal',
                    resolve: {
                        message: function() {
                            var message = '<p>Uknack lets students create fun and fulfilling business together. To protect the integrity of our community, and the safety of our members, we ask that everyone signs up with their .edu email addresses. Thank you!</p>';
                            return message;
                        }
                    }
                });
                submodalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('Modal dismissed at: ' + new Date());
                    }
                );

            };
            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        }]);
        app.controller('CroppingModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'message', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, message) {

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.cropFunc = function () {
                $modalInstance.close(this.$parent.cropper0.croppedImage);
            };                 
        }])
        app.controller('ProfileCroppingModalCtl',
            ['$scope', '$rootScope', '$resource', '$modalInstance', '$http', 'localStorageService', 'message', 'rest', 'restricted',
            function ($scope, $rootScope, $resource, $modalInstance, $http, localStorageService, message) {

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.cropFunc = function () {
                $modalInstance.close(this.$parent.cropper0.croppedImage);
                var private_picture_edit = $resource(":protocol://:url/api/accounts/profile/picture/edit",{
                    protocol: this.$parent.restProtocol,
                    url: this.$parent.restURL
                }, {
                    save: {
                        method: 'PUT',
                        transformRequest: function(data, headersGetterFunction) {
                            if (data === undefined)
                                return data;
                            var fd = new FormData();
                            fd.append('picture', data['picture']);
                            fd.append('full_name', data['full_name']);
                            return fd;
                        },
                        headers: {'Content-Type': undefined}
                    }
                });

                var data = {
                    'picture': this.$parent.cropper0.croppedImage,
                    'full_name': localStorageService.get('full_name')
                };
                private_picture_edit.save(data, function (result) {
                    localStorageService.add('picture', result.picture);
                    $rootScope.restricted();
                }, function (error) {
                    $scope.message = error.data;
                    console.log(error);
                });
            };
        }]);


        var transFormRequestHandler = function (data, headersGetterFunction) {
            if (data === undefined)
                return data;

            var fd = new FormData();
            angular.forEach(data, function (value, key) {
                if (value instanceof FileList) {
                    if (value.length == 1) {
                        fd.append(key, value[0]);
                    } else {
                        angular.forEach(value, function (file, index) {
                            fd.append(key + '_' + index, file);
                        });
                    }
                } else {
                    fd.append(key, value);
                }
            });

            return fd;
        }
    return app;
});