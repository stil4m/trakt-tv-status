angular.module('TraktTvStatus').service('settingsModalService', ['$modal', '$q', function ($modal, $q) {
    return {
        showSettings: function (inputSettings, allowCancel, showIgnoredShows) {
            var settings = angular.copy(inputSettings);

            var deferred = $q.defer();
            $modal.open({
                templateUrl: 'modal.setup.html',
                controller: 'SettingsCtrl',
                resolve: {
                    settings: function () {
                        return settings;
                    },
                    showIgnoredShows: function () {
                        return showIgnoredShows;
                    }
                },
                keyboard: allowCancel,
                backdrop: allowCancel ? true : 'static'
            }).result.then(
                function () {
                    deferred.resolve(settings);
                }
            );
            return deferred.promise;
        }
    };
}]);