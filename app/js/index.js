'use strict';

angular.module('TraktTvStatus', ['ui.bootstrap', 'LocalStorageModule', 'ui.router']);

angular.module('TraktTvStatus').run(['$rootScope', 'settingsService', 'settingsModalService', function ($rootScope, settingsService, settingsModalService) {
    var settings = settingsService.getSettings();
    if (!settings) {
        var defaultSettings = {
            hideWatched: true,
            username: null,
            apiKey: null,
            ignoredShows: []
        };
        settingsModalService.showSettings(defaultSettings, false).then(
            function (result) {
                settingsService.setSettings(result);
            }
        );
    } else {
        $rootScope.settings = settings;
    }

    settingsService.addListener({
        settingsChanged: function () {
            console.log('Update settings...');
        }
    });

}]);

angular.module('TraktTvStatus').filter('showFilter', function () {
    return function (input, settings) {
        console.log('before');
        if (!input) {
            return input;
        }
        return input.filter(function (item) {
            return !(settings.hideWatched && item.progress && item.progress.percentage == 100) &&
                settings.ignoredShows.indexOf(item.show.imdb_id) == -1;
        });

    };
});

angular.module('TraktTvStatus').controller('ShowListController', ['$scope', 'settingsModalService', 'settingsService', '$q', function ($scope, settingsModalService, settingsService, $q) {

    $scope.settings = settingsService.getSettings();

    settingsService.addListener({
        settingsChanged: function (newSettings) {
            $scope.settings = newSettings;
        }
    });

    this.loading = true;
    this.shows = null;

    var self = this;
    $scope.loadShowList = function () {
        if (!$scope.settings) {
            self.loading = false;
            return
        }
        self.loading = true;


        var trakt = require("node-trakt");
        trakt.init($scope.settings.apiKey);

        var deferred = $q.defer();
        trakt.userProgressWatched({ username: $scope.settings.username}, function (err, data) {
            deferred.resolve(data);
        });
        deferred.promise.then(function (data) {
            self.shows = angular.copy(data);
            self.loading = false;
        });
    };

    $scope.toggleShowCompleted = function() {
        $scope.settings.hideWatched = !$scope.settings.hideWatched;
        settingsService.setSettings($scope.settings);
    };

    $scope.ignoreShow = function (showObject) {
        $scope.settings.ignoredShows.push(showObject.show.imdb_id);
        settingsService.setSettings($scope.settings);
    };

    $scope.loadShowList();

    $scope.showSettings = function () {
        settingsModalService.showSettings($scope.settings, true, true).then(
            function (result) {
                $scope.settings = result;
                settingsService.setSettings(result);
            }
        );
    };
}]);

