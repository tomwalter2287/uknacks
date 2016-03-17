define(['angularAMD'], function(app) {
    app.directive('fdInput', ['$timeout', '$modal', function ($timeout, $modal) {
	    return {
	        link: function (scope, element, attrs) {
	            element.on('change', function  (evt) {
	                var files = evt.target.files;
	                
                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/cropping-modal.html',
                        controller: 'CroppingModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                return null;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
	            });
	        }
	    }
    }]);
    app.directive('fdInput1', ['$timeout', '$modal', function ($timeout, $modal) {
        return {
            link: function (scope, element, attrs) {
                element.on('change', function  (evt) {
                    var files = evt.target.files;

                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/cropping-modal1.html',
                        controller: 'CroppingModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                return null;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                });
            }
        }
    }]);
    app.directive('fdInput2', ['$timeout', '$modal', function ($timeout, $modal) {
        return {
            link: function (scope, element, attrs) {
                element.on('change', function  (evt) {
                    var files = evt.target.files;

                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/cropping-modal2.html',
                        controller: 'CroppingModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                return null;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                });
            }
        }
    }]);
    app.directive('fdInput3', ['$timeout', '$modal', function ($timeout, $modal) {
        return {
            link: function (scope, element, attrs) {
                element.on('change', function  (evt) {
                    var files = evt.target.files;

                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/cropping-modal3.html',
                        controller: 'CroppingModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                return null;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                });
            }
        }
    }]);
    app.directive('fdInput4', ['$timeout', '$modal', function ($timeout, $modal) {
        return {
            link: function (scope, element, attrs) {
                element.on('change', function  (evt) {
                    var files = evt.target.files;

                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/cropping-modal4.html',
                        controller: 'CroppingModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                return null;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.log(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                });
            }
        }
    }]);
    app.directive('profileFdInput', ['$timeout', '$modal', '$resource', function ($timeout, $modal, $resource) {
        return {
            link: function (scope, element, attrs) {
                element.on('change', function  (evt) {
                    var files = evt.target.files;

                    var submodalInstance = $modal.open({
                        animation: true,
                        templateUrl: 'views/modals/profile-cropping-modal.html',
                        controller: 'ProfileCroppingModalCtl',
                        windowClass: 'vcenter-modal',
                        resolve: {
                            message: function () {
                                return null;
                            }
                        }
                    });
                    submodalInstance.result.then(function (data) {
                            console.info(data);
                        }, function () {
                            console.info('Modal dismissed at: ' + new Date());
                        }
                    );
                });
            }
        }
    }]);
});
