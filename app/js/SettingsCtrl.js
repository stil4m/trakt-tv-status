angular.module('TraktTvStatus').controller('SettingsCtrl', ['$scope', 'settings', '$timeout', 'showIgnoredShows', 'localStorageService', function ($scope, settings, $timeout, showIgnoredShows, localStorageService) {
    var sha1 = require('sha1');

    var timeoutId = null;

    $scope.formSettings = settings;
    $scope.tmpSettings = angular.copy(settings);
    $scope.state = {};
    $scope.showIgnoredShows = showIgnoredShows;
    $scope.shows = localStorageService.get('shows');

    function watchWithTimeout(key, callback, emptyCallback) {
        $scope.$watch(key, function(newValue) {
            if (newValue) {
                $scope.state.checking = true;
                console.log($scope.state.checking);
                if (timeoutId) {
                    $timeout.cancel(timeoutId);
                }
                timeoutId = $timeout(function () {
                    callback(newValue);
                }, 700);
            } else {
                emptyCallback();
            }
        }, true);
    }

    watchWithTimeout('tmpSettings.apiKey',
        function(newApiKey) {
            var trakt = require("node-trakt");
            trakt.init(newApiKey);

            trakt.serverTime(function (err, data) {
                $scope.$apply(function () {
                    $scope.state.checking = false;
                    if (!data.error) {
                        settings.apiKey = newApiKey;
                    } else {
                        settings.apiKey = null;
                    }
                });
            });
        },
        function() {
            settings.apiKey = null;
        }
    );

    watchWithTimeout('tmpSettings.username',
        function(newUsername) {
            var trakt = require("node-trakt");
            trakt.init(settings.apiKey);

            trakt.userProfile({username: newUsername}, function (err, data) {
                $scope.$apply(function () {
                    $scope.state.checking = false;
                    if (!data.error) {
                        settings.username = newUsername;
                    } else {
                        settings.username = null;
                    }
                });
            });
        },
        function() {
            settings.username = null;
        }
    );

    $scope.submitSettings = function () {
        if (settings.username && settings.apiKey) {
            $scope.$close();
        }
    };

    $scope.hasShow = function(showId) {
        return $scope.shows.filter(function(showObject) {
            return showObject.show.imdb_id == showId;
        }).length > 0;
    };

    $scope.showName = function(showId) {
        return $scope.shows.filter(function(showObject) {
            return showObject.show.imdb_id == showId;
        })[0].show.title;
    };


    $scope.removeIgnoredShow = function(ignoredShow) {
        var index=  $scope.formSettings.ignoredShows.indexOf(ignoredShow);
        $scope.formSettings.ignoredShows.splice(index, 1);
    };

}]);