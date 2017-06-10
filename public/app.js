var app = angular.module('instacart', ['ui.router', 'ui.bootstrap']);

app.config(function ($sceProvider, $locationProvider, $stateProvider, $urlRouterProvider) {
    'use strict';
    $locationProvider.html5Mode(true);
    $sceProvider.enabled(false);

    $stateProvider
        .state('main', {
            url: '/',
            views: {
                'main': {
                    templateUrl: '/public/main.html',
                    controller: 'MainCtrl as $ctrl'
                }
            }
        });
        $urlRouterProvider.otherwise('/');
  });

app.controller('MainCtrl', function($uibModal, $document) {
    this.modalService = $uibModal;
    this.openApplyModal = function($event) {
        var modalInstance = $uibModal.open({
            animation: false,
            size: 'lg',
            appendTo: $document.find('main'),
            templateUrl: '/public/apply-modal.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
        }); 

        modalInstance.result.then(function () {
            debugger;
        });
    }
});

app.controller('ModalInstanceCtrl', function ($uibModalInstance) {
    this.user = {};

    this.ok = function () {
        debugger;
        $uibModalInstance.close();
    };

    this.cancel = function () {
        $uibModalInstance.dismiss();
    };
});


