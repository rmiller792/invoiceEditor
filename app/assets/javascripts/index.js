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
    $scope.subTotal = 0;
    $scope.total = 0;
    $scope.tax = 0;
        var tax = 0.05;


    var onError = function(data){

    };
    var onInvoicesLoaded = function(data){
        $scope.invoices = data;
    };

    var onItemsLoaded = function(data){
        $scope.items = data;
    };

    var onSave = function(data){
        alert("yeii")
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


$scope.calculateRow = function(item){
    item.total = item.price * item.qty;
    calculateTotal();

}

 var calculateTotal = function(){
    $scope.subTotal = 0;
    $scope.total = 0;

    var found = false;
    if ($scope.details.length == 0) {
        $scope.subTotal = 0;
        $scope.total = 0;
        $scope.tax = 0;
    }else{
        for (var i = 0; i < $scope.details.length; i++) {
            $scope.subTotal +=  $scope.details[i].total;

        }
       $scope.tax = $scope.subTotal * tax;
       $scope.total = $scope.subTotal + $scope.tax;
    }

}

$scope.addItem = function(item){
 var found = false;
 if ($scope.details.length == 0) {
    item.total = item.price;
    $scope.details.push(item);
}else{
    for (var i = 0; i < $scope.details.length; i++) {
        if ($scope.details[i].id == item.id){
            $scope.details[i].qty ++;
            $scope.details[i].total = $scope.details[i].qty * $scope.details[i].price;
            found = true;

        }
    }
    if (!found) {
        item.total = item.price;

        $scope.details.push(item);
    }

}
    calculateTotal();


}

$scope.save = function(){
      var parametros = {
    details: $scope.details,
    subTotal: $scope.subTotal,
    tax: $scope.tax,
    total: $scope.total,
  }
  services.saveInvoice(parametros, onSave, onError);

}


// end controller indexCtrl
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

this.saveInvoice = function(params, callback, onError){
  var fullUrl = baseUrl+'invoices/save';
  var asJson = angular.toJson(params);
  console.log(asJson);
  var req = {
    method: 'POST',
    url: fullUrl,
    headers: {
      'Content-Type': 'application/json'
    },
    data: asJson
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
