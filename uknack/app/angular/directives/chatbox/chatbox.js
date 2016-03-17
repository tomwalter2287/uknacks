define(['angularAMD'], function(app) {
    app.directive("chatbox", ['$document', '$parse', '$rootScope', 'Message', function ($document, $parse, $rootScope, Message) {
        return {
            restrict: 'E',
            templateUrl: 'directives/chatbox/chatbox.html',
            scope: {
                receiptData: '=',
                senderData: '=',
                mode: '='
            },
            link: function ($scope, $element, $attributes) {
                $scope.activeChatbox = false;

                $scope.submit = function (new_message) {
                    if (!new_message) {
                        return;
                    }
                    $scope.Message.send({
                        sender_data: $scope.senderData,
                        receipt_data: $scope.receiptData,
                        message: new_message
                    });
                    $scope.new_message = '';
                };

                $scope.toggleChatbox = function () {
                    // create room id with order of user's ID
                    room_id = generateRoomID($scope.receiptData.owner_id, $scope.senderData.user_id);

                    $scope.Message = Message($rootScope.token, room_id);
                    $scope.activeChatbox = true;
                };

                function generateRoomID(sender, receipt){
                    if(sender > receipt){
                        return sender + '&' + receipt;
                    } else {
                        return receipt + '&' + sender;
                    }
                }

            }
        }
    }]);
});