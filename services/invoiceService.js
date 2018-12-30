'use strict';
angular.module("rails", ["ngRoute"])
  .service('invoiceService', function invoiceService(utilitiesService, $http) {
    // AngularJS will instantiate a singleton by calling 'new' on this function

    var baseUrl = utilitiesService.getBaseUrl();

    this.getInvoices = function(callback, onError){

        var fullUrl = baseUrl+'invoices/getAll';
        var req = {
          method:'GET',
          url : fullUrl
        };
        $http(req).success(callback).error(onError);
    };

  
  });
