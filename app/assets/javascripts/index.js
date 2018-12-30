angular.module("rails", ["ngRoute"])


.config(function($routeProvider)
{
    $routeProvider.when("/", {
        templateUrl : "views/home.html",
        controller : "homeCtrl"
    })
    .when("/index", {
        templateUrl : "views/index.html",
        controller : "indexCtrl"
    })
    .otherwise({ reditrectTo : "/" });
})

.controller("indexCtrl", function($scope, services)
{

    $scope.items=[];

    $scope.details = [];
    $scope.itemSelected = {};

    var onError = function(data){

    };
    var onInvoicesLoaded = function(data){
        $scope.invoices = data;
    };

    var onItemsLoaded = function(data){
        $scope.items = data;
    };

    services.getInvoices(onInvoicesLoaded, onError);

    $scope.openModal = function(){
        services.getItems(onItemsLoaded, onError);

    }

    $scope.itemSelected = function(item){

        $scope.itemSelected = item;

    }
    $scope.removeItem = function(item){

      if ($scope.details.length > 0) {
         for (var i = 0; i < $scope.details.length; i++) 
         {
            if ($scope.details[i].id == item.id)
            {
             $scope.details.splice(i, 1);

         }

     }
 }
}



$scope.addItem = function(item){
 var found = false;
 if ($scope.details.length == 0) {
    $scope.details.push(item);
}else{
    for (var i = 0; i < $scope.details.length; i++) {
        if ($scope.details[i].id == item.id){
            $scope.details[i].qty ++;
            found = true;

        }
    }
    if (!found) {
        $scope.details.push(item);
    }
}


}

})


.controller("homeCtrl", function($scope,services)
{
    var onInvoicesLoaded = function(data){
        $scope.invoices = data;
    };

    var onError = function(data){

    };
    $scope.editItem = function(invoice){
        alert(invoice.id);
    }


    services.getInvoices(onInvoicesLoaded, onError);

})



.service('services', function services($http) {
    // AngularJS will instantiate a singleton by calling 'new' on this function


    this.getInvoices = function(callback, onError){

        var fullUrl = "invoices/getInvoices";
        var req = {
          method:'GET',
          url : fullUrl
      };

      $http(req).then(function(response) 
      {
        callback(response.data);
    }, function(error)
    {
     alert(error.data);
 })
  };

  this.getItems = function(callback, onError){

    var fullUrl = "items/getAll";
    var req = {
      method:'GET',
      url : fullUrl
  };

  $http(req).then(function(response) 
  {
    callback(response.data);
}, function(error)
{
 alert(error.data);
})
};


});
