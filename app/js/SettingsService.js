angular.module('TraktTvStatus').service('settingsService', ['localStorageService', function (localStorageService) {
    var listeners = [];

    return {
        addListener : function (listener) {
            listeners.push(listener);
        },
        setSettings: function (newSettings) {
            var copiedSettings = angular.copy(newSettings);
            localStorageService.set('settings', copiedSettings);
            listeners.forEach(function(listener) {
                listener.settingsChanged && listener.settingsChanged(copiedSettings);
            })
        },
        getSettings : function() {
            return localStorageService.get('settings');
        }
    };
}]);