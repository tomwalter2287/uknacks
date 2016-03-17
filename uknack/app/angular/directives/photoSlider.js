define(['angularAMD'], function(app) {
    app.directive("photoSlider", ['$timeout', function ($timeout) {
        return {
            restrict: 'AE',
            link: function ($scope, $element, $attributes) {
                $timeout(function() {
                    var options = {
                        item: 1,
                        thumbItem: 5,
                        pager: $attributes.gallery && $attributes.gallery == 'false' ? false : true,
                        gallery: $attributes.gallery && $attributes.gallery == 'false' ? false : true
                    };
                    $($element).lightSlider(options);
                }, 100);
            }
        }
    }]);
});