'use strict';
define(['app'], function (app) {
    app.register.controller('messagesCtrl', [
        'localStorageService', '$rootScope', '$scope', '$resource',
        '$modal', '$stateParams', 'Message',
        'restricted', 'rest',
        function (localStorageService, $rootScope, $scope, $resource,
                  $modal, $stateParams, Message) {

            var private_profile_resource = $resource(":protocol://:url/api/accounts/profile",{
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            var messages_resource = $resource(":protocol://:url/api/chat/messages?companion=:companion",{
                protocol: $scope.restProtocol,
                url: $scope.restURL,
                companion: '@companion'
            });

            var contacts_resource = $resource(":protocol://:url/api/chat/message_contacts",{
                protocol: $scope.restProtocol,
                url: $scope.restURL
            });

            var private_profile_edit_resource = $resource(":protocol://:url/api/accounts/profile/edit",{
                protocol: $scope.restProtocol,
                url: $scope.restURL
            }, {
                save: {
                    method: 'PUT',
                    transformRequest: function(data, headersGetterFunction) {
                        if (data === undefined)
                          return data;

                        var fd = new FormData();
                        fd.append("social_links", JSON.stringify(data.social_links));
                        fd.append("descriptions", JSON.stringify(data.descriptions));
                        angular.forEach(data, function(value, key) {
                          if (value instanceof FileList) {
                            if (value.length == 1) {
                              fd.append(key, value[0]);
                            } else {
                              angular.forEach(value, function(file, index) {
                                fd.append(key + '_' + index, file);
                              });
                            }
                          } else {
                              if( key != "social_links" && key != "descriptions") {
                                  fd.append(key, value);
                              }
                          }
                        });
                        return fd;
                    },
                    headers: {'Content-Type': undefined}
                }
            });

            init();

            function init(){
                $scope.edit_field = null;     // a profile field to edit
                //$scope.user = null;           // profile info
                $scope.is_public = false;     // boolean if this page is for public or private profile.
                $scope.user_post_data = null; // data to post for profile edit
                $scope.edit_item= null;       // An user's item or knack to edit
                $scope.Message = null;
                $scope.selected_user = null;
                // $scope.old_messages = null;

                $scope.restricted();

                $rootScope.currentMenu = 'profile_edit';
                /*
                $scope.user = private_profile_resource.get(function(result){
                    $scope.user.picture = result.picture ? result.picture:'images/users/no_avatar.png'
                    $scope.user.college = result.college == "null" ? "": result.college;
                    $scope.user_post_data = angular.copy($scope.user);

                    // $scope.user_post_data._method = 'POST';
                }, $scope.checkTokenError);
                */
                /*
                $scope.contacts = contacts_resource.get(function(result){
                    $scope.contacts = result.results;
                }, $scope.checkTokenError);
                */

                /*----Front-end test by Hideo---*/
                var user = [];
                user.full_name = 'Automn Barnsby';
                user.picture = 'images/users/user-profile.png';
                user.college = 'Harvard University';
                user.age = 22;
                $scope.user = user;
                var reasonList = [{'reason': 'I\'m really ambicious'},
                                  {'reason': 'My passion is what I\'m offering'},
                                  {'reason': 'I\'ll never late and do everything on time'},
                                  {'reason': 'I\'m super hard working'},
                                  {'reason': 'My cat is really funny and love her'}];
                $scope.reasonList = reasonList;

                $scope.nowContainer = 'messages';
                $scope.new_message_count = 1;
                $scope.new_notification_count = 7;
                $scope.new_connection_count = 34;
                $scope.isConnectedIcon = -1;
                var contacts = [
                                    {   
                                        'picture': 'images/users/user1.jpg', 
                                        'full_name': 'Katy Perry', 
                                        'is_online': true, 
                                        'last_received_at': 'Today 9:30 AM', 
                                        'last_message': 'Hey Jess! I saw your profile and I\'m really interested in your...', 
                                        'state_text': 'Connected with you',
                                        'state': 'connected'
                                    },
                                    {
                                        'picture': 'images/users/user1.jpg', 
                                        'full_name': 'Katy Perry', 
                                        'is_online': false, 
                                        'last_received_at': 'Today 9:30 AM', 
                                        'last_message': 'Hey Jess! I saw your profile and I\'m really interested in your...', 
                                        'state_text': 'Bought your knack',
                                        'state': 'item'
                                    },
                                    {
                                        'picture': 'images/users/user1.jpg', 
                                        'full_name': 'Katy Perry', 
                                        'is_online': true, 
                                        'last_received_at': 'Today 9:30 AM', 
                                        'last_message': 'Hey Jess! I saw your profile and I\'m really interested in your...', 
                                        'state_text': 'Bought your item',
                                        'state': 'knack'
                                    },
                                    {
                                        'picture': 'images/users/user1.jpg', 
                                        'full_name': 'Katy Perry', 
                                        'is_online': false, 
                                        'last_received_at': 'Today 9:30 AM', 
                                        'last_message': 'Hey Jess! I saw your profile and I\'m really interested in your...', 
                                        'state_text': 'Connected with you',
                                        'state': 'connected'
                                    }
                                ];
                $scope.contacts = contacts;       

                $scope.profile_user.user_id = 9;

                var old_messages = [];
                var message1 = new Object();
                message1.sender = new Object();
                message1.sender.id = 1;
                message1.body = "Hey Jess! I saw your profile and I'm really interested in your knacks. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default  model text, and a searchfor lorem";
                message1.sender.picture = "images/users/user1.jpg";     
                message1.sender.full_name = "Katy Perry";
                message1.sender.college = 'Harvard University';
                message1.created_at = 'Today 9:30AM';
                old_messages.push(message1);
                var message2 = new Object();
                message2.sender = new Object();
                message2.sender.id = 9;
                message2.body = 'Hey Katy! I\'m supre glad you liked my knacks. Let me know Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for \'lorem ipsum\' will uncover many web sites still in their infancy. Various version have';
                message2.sender.picture = "images/users/user1.jpg";     
                message2.sender.full_name="Katy Perry";
                message2.sender.college = 'Harvard University';
                message2.created_at = 'Today 9:30AM';
                old_messages.push(message2);
                $scope.old_messages = old_messages;

                var Message = new Object();
                Message.collection = [];
                var message_1 = new Object();
                message_1.data = new Object();
                message_1.data.message = "How is it going today?"
                message_1.data.sender_data = new Object();
                message_1.data.sender_data.user_id = 1;
                message_1.data.sender_data.picture = "images/users/user1.jpg";
                message_1.data.sender_data.full_name = "Katy Perry";
                message_1.data.sender_data.college = 'Harvard University';
                message_1.timeStamp = "Today 9:30 AM";
                Message.collection.push(message_1);
                $scope.Message = Message;

                $scope.nowState = 'item';


                /*---------End Front-end test--------*/
            };
            /*-----------Start Front-end test---------*/
            $scope.toggleConnect = function(contact, evt) {
                evt.preventDefault();
                evt.stopPropagation();
                if(contact.state == 'connected') {
                    contact.state = 'disconnected';
                } else {
                    contact.state = 'connected';
                }
            };

            /*------------End Front-end Test----------*/
            $scope.edit_profile = function(field_name, evt){
                evt.preventDefault();
                evt.stopPropagation();
                if(!$scope.user_not_found)
                    $scope.edit_field = field_name;
            };

            $scope.save_profile = function(){
                if($scope.profileForm.$valid) {
                    private_profile_edit_resource.save($scope.user_post_data, function (user) {
                        $scope.user = user;
                        if(user.college == "null")
                            $scope.user.college = null;
                        $scope.edit_field = null;
                        localStorageService.set('full_name', $scope.user.full_name);
                        localStorageService.set('college', $scope.user.college);
                        localStorageService.set('picture', $scope.user.picture);

                        $rootScope.restricted();
                    }, function (error) {
                        $scope.message = error.data;
                        console.log(error);
                    });
                } else {
                   console.log($scope.profileForm.$error);
                }
            }

            $scope.close_edit = function(){
                $scope.edit_field = null;
            }

            $scope.add_more_description = function(){
                $scope.user_post_data.descriptions.push({});
            }

            $scope.select_contact = function(user){
                /*
                var room_id = generateRoomID(user.id, $rootScope.profile_user.user_id);
                $scope.selected_user = user;
                $scope.Message = Message($rootScope.token, room_id);

                $scope.old_messages = messages_resource.get({'companion': user.id}, function(result){
                    $scope.old_messages = result.results;
                }, $scope.checkTokenError);
                */

                /*--------Front-end test------------*/
                if($scope.nowContainer=='notifications') {
                    if (user.state == 'item') {
                        $scope.nowState = 'item';
                    } else if (user.state == 'knack') {
                        $scope.nowState = 'knack';
                    } else {
                        $scope.nowState = 'connected';
                    }
                }    
                /*----------End test-----------------*/

            }
            /* Websocket chat */
            //$scope.username = 'anonymous';
            //
            //$scope.Message = Message($rootScope.token);
            //
            $scope.submit = function(new_message) {
                /*
                if (!new_message || !$scope.Message) { return; }
                $scope.Message.send({
                    sender_data: $rootScope.profile_user,
                    receipt_data: $scope.selected_user,
                    message: new_message
                });
                */
                /*-------Front-end test--------*/
                var message_1 = new Object();
                message_1.data = new Object();
                message_1.data.message = new_message;
                message_1.data.sender_data = new Object();
                message_1.data.sender_data.user_id = 9;
                message_1.data.sender_data.picture = "images/users/user1.jpg";
                message_1.data.sender_data.full_name = "Katy Perry";
                message_1.data.sender_data.college = 'Harvard University';
                message_1.timeStamp = "Today 9:30 AM";
                $scope.Message.collection.push(message_1);
                /*-------End front-end test-----*/
                $scope.new_message = '';
            };
            function generateRoomID(sender, receipt){
                if(sender > receipt){
                    return sender + '&' + receipt;
                } else {
                    return receipt + '&' + sender;
                }
            }

        }]);
    return app;
});