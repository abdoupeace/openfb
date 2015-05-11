angular.module('sociogram.controllers', [])

    .controller('AppCtrl', function ($scope, $state, OpenFB) {

        $scope.logout = function () {
            OpenFB.logout();
            $state.go('app.login');
        };

        $scope.revokePermissions = function () {
            OpenFB.revokePermissions().then(
                function () {
                    $state.go('app.login');
                },
                function () {
                    alert('Revoke permissions failed');
                });
        };

    })

    .controller('LoginCtrl', function ($scope, $location, OpenFB) {

        $scope.facebookLogin = function () {

            OpenFB.login('email,read_stream,publish_stream,user_friends,user_birthday').then(
                function () {
                    $location.path('/app/person/me/feed');
                },
                function () {
                    alert('OpenFB login failed');
                });
        };

    })

    .controller('NotCtrl', function ($scope, $cordovaLocalNotification) {

        $scope.add = function() {
            var alarmTime = new Date();
            alarmTime.setMinutes(alarmTime.getMinutes() + 1);
            $cordovaLocalNotification.add({
                id: "1234",
                date: alarmTime,
                message: "This is a message",
                title: "This is a title",
                autoCancel: true,
                sound: null
            }).then(function () {
                console.log("The notification has been set");
            });
        };
 
        $scope.isScheduled = function() {
            $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
                alert("Notification 1234 Scheduled: " + isScheduled);
            });
        }
        

          $scope.addNotification = function () {
            $cordovaLocalNotification.add({
              id: 'some_notification_id'
              // parameter documentation:
              // https://github.com/katzer/cordova-plugin-local-notifications#further-informations-1
            }).then(function () {
              console.log('callback for adding background notification');
            });
          };

          $scope.cancelNotification = function () {
            $cordovaLocalNotification.cancel('some_notification_id').then(function () {
              console.log('callback for cancellation background notification');
            });
          };

          $scope.cancelAllNotification = function () {
            $cordovaLocalNotification.cancelAll().then(function () {
              console.log('callback for canceling all background notifications');
            });
          };

          $scope.checkIfIsScheduled = function () {
            $cordovaLocalNotification.isScheduled('some_notification_id').then(function (isScheduled) {
              console.log(isScheduled);
            });
          };

          $scope.getNotificationIds = function () {
            $cordovaLocalNotification.getScheduledIds().then(function (scheduledIds) {
              console.log(scheduledIds);
            });
          };

          $scope.checkIfIsTriggered = function () {
            $cordovaLocalNotification.isTriggered('some_notification_id').then(function (isTriggered) {
              console.log(isTriggered);
            });
          };

          $scope.getTriggeredIds = function () {
            $cordovaLocalNotification.getTriggeredIds().then(function (triggeredIds) {
              console.log(triggeredIds);
            });
          };

          $scope.notificationDefaults = $cordovaLocalNotification.getDefaults();

          $scope.setDefaultOptions = function () {
            $cordovaLocalNotification.setDefaults({ autoCancel: true });
          };


          $rootScope.$on("$cordovaLocalNotification:canceled", function(e,notification) {
          });

          $rootScope.$on("$cordovaLocalNotification:clicked", function(e,notification) {
          });

          $rootScope.$on("$cordovaLocalNotification:triggered", function(e,notification) {
          });

          $rootScope.$on("$cordovaLocalNotification:added", function(e,notification) {
          });



    })

    .controller('ProfileCtrl', function ($scope, OpenFB) {
        OpenFB.get('/me').success(function (user) {
            $scope.user = user;
        });
    })

    .controller('PersonCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId).success(function (user) {
            $scope.user = user;
        });
    })

    .controller('FriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/me/friends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert("friendsctrl" + data.error.message);
            });
    })

    .controller('MutualFriendsCtrl', function ($scope, $stateParams, OpenFB) {
        OpenFB.get('/' + $stateParams.personId + '/mutualfriends', {limit: 50})
            .success(function (result) {
                $scope.friends = result.data;
            })
            .error(function(data) {
                alert(data.error.message);
            });
    })

    .controller('FeedCtrl', function ($scope, $stateParams, OpenFB, $ionicLoading) {

        $scope.show = function() {
            $scope.loading = $ionicLoading.show({
                content: 'Loading feed...'
            });
        };
        $scope.hide = function(){
            $scope.loading.hide();
        };

        function loadFeed() {
            $scope.show();
            OpenFB.get('/' + $stateParams.personId + '/home', {limit: 10})
                .success(function (result) {
                    $scope.hide();
                    $scope.items = result.data;
                    // Used with pull-to-refresh
                    $scope.$broadcast('scroll.refreshComplete');
                })
                .error(function(data) {
                    $scope.hide();
                    alert("FeedCtrl " + data.error.message);
                });
        }

        $scope.doRefresh = loadFeed;

        loadFeed();

    });