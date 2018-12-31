angular.module("rails", ["ngRoute","ngDialog"])


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

.controller("indexCtrl", function($scope, services, ngDialog, $window)
{

    $scope.items=[];

    $scope.details = [];
    $scope.subtotal = 0;
    $scope.total = 0;
    $scope.tax = 0;
    var tax = 0.05;
    var dialog;

    var onError = function(data){

    };
    var onInvoicesLoaded = function(data){
        $scope.invoices = data;
    };

    var onItemsLoaded = function(data){
        $scope.items = data;
    };

    var onSave = function(data){

        if (data.invoice.id > 0) {
            swal({   
                title: "Was Successfully Added!",   
              type: "success",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "PDF",
              cancelButtonText: "Close",   
              closeOnConfirm: true 
          }).then((isConfirm) => {
              if (isConfirm) {


                 window.open("invoices/print/"+
                    data.invoice.id+".pdf",'_blank');

             } 
         });  

        }else{
            swal("Error", "Ocurrió un error al guardar.", "error");
        }


    };

    services.getInvoices(onInvoicesLoaded, onError);

    $scope.openModal = function(){
        services.getItems(onItemsLoaded, onError);

    }


    $scope.removeItem = function(item){

      if ($scope.details.length > 0) {
       for (var i = 0; i < $scope.details.length; i++) 
       {
        if ($scope.details[i].itemId == item.itemId)
        {
           $scope.details.splice(i, 1);

       }

   }
}
calculateTotal();
}


$scope.calculateRow = function(item){
    item.total = item.price * item.qty;
    calculateTotal();

}

var calculateTotal = function(){
    $scope.subtotal = 0;
    $scope.total = 0;

    var found = false;
    if ($scope.details.length == 0) {
        $scope.subtotal = 0;
        $scope.total = 0;
        $scope.tax = 0;
    }else{
        for (var i = 0; i < $scope.details.length; i++) {
            $scope.subtotal +=  $scope.details[i].total;

        }
        $scope.tax = $scope.subtotal * tax;
        $scope.total = $scope.subtotal + $scope.tax;
    }

}

$scope.addItem = function(item){
   var found = false;
   if ($scope.details.length == 0) {
    item.total = item.price;
    $scope.details.push(item);
}else{
    for (var i = 0; i < $scope.details.length; i++) {
        if ($scope.details[i].itemId == item.itemId){
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
    if ($scope.details == null || $scope.details.length == 0) {
      swal("Error", "Add Item Please", "error");

  }
  var parametros = {
    details: $scope.details,
    subtotal: $scope.subtotal,
    tax: $scope.tax,
    total: $scope.total,
}
// dialog = ngDialog.open({
//     template: '<div class="loading">Waiting... <img src="../images/loader.gif"></div>',
//     plain: true,
//     showClose: false,
//     closeByEscape: false,
//     closeByDocument: false
// });
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
  var fullUrl = 'invoices/save';
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
