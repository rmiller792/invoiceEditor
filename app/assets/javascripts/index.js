angular.module("rails", ["ngRoute","ngDialog"])


.config(function($routeProvider)
{
    $routeProvider.when("/", {
        templateUrl : "views/home.html",
        controller : "homeCtrl"
    })    
    $routeProvider.when("/home", {
        templateUrl : "views/home.html",
        controller : "homeCtrl"
    })
    .when("/index", {
        templateUrl : "views/index.html",
        controller : "indexCtrl"
    })
    .when("/index/:id", {
        templateUrl : "views/index.html",
        controller : "indexCtrl"
    })
    .when("/items", {
        templateUrl : "views/items.html",
        controller : "itemsCtrl"
    })

    .otherwise({ reditrectTo : "/" });
})

.controller("indexCtrl", function($scope, services, ngDialog, $window, $routeParams)
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
                 $scope.invoice_id = data.invoice.id;

             } 
         });  

        }else{
            swal("Error", "an error occurred", "error");
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
    id: $scope.invoice_id,
    details: $scope.details,
    subtotal: $scope.subtotal,
    tax: $scope.tax,
    total: $scope.total,
}

services.saveInvoice(parametros, onSave, onError);

}

var onInvoice = function(data){
    $scope.details = data.details;
    $scope.subtotal = data.invoice.subtotal;
    $scope.tax = data.invoice.tax;
    $scope.total = data.invoice.total;
}
$scope.invoice_id = 0;
var invoice_id = $routeParams.id;
if(invoice_id){
    $scope.invoice_id = invoice_id;
    params = {
        id:invoice_id
    }
    services.getInvoice(params, onInvoice, onError);
}else{
    $scope.invoice_id = 0;

}


// end controller indexCtrl
})


.controller("homeCtrl", function($scope,services, $window)
{



    var onInvoicesLoaded = function(data){
        $scope.invoices = data;
    };

    var onDelete = function(data){
        if (data.success) {

            swal("Success", "Deleted", "success");
            services.getInvoices(onInvoicesLoaded, onError);

        }else{
            swal("Error", "Error on Delete invoice", "error");

        }

    };    
    var onError = function(data){

    };

    $scope.editInvoice = function(invoice){

        $window.location.href= "#!/index/"+invoice.id;
    };
    $scope.viewPDF = function(id){

        $window.location.href= "invoices/print/"+id+".pdf";
    };
    $scope.deleteInvoice = function(invoice){
        params = {
            id: invoice.id
        }
        services.deleteInvoice(params,onDelete, onError);
    }


    services.getInvoices(onInvoicesLoaded, onError);

})


.controller("itemsCtrl", function($scope,services, $window)
{

  $scope.id = 0;
  $scope.name = "";
  $scope.price = 1;

  var onItemsLoaded = function(data){
    $scope.items = data;
};

var onSaveItem = function(data){
    if (data.success) {
        swal("Success", "Was Successfully Added!", "success");

        services.getItems(onItemsLoaded, onError);
        $('#exampleModal').modal('hide');

    }else{
        swal("Error", "Error on Add Item", "error");

    }

};    
var onError = function(data){

};

$scope.newItem = function(){
  $scope.id = 0;
  $scope.name = "";
  $scope.price = 1;
};

$scope.editItem = function(item){
        $('#exampleModal').modal('show');

      $scope.id = item.itemId;
  $scope.name = item.name;
  $scope.price = item.price;

};
  
$scope.saveItem = function(){
    params = {
        id: $scope.id,
        name: $scope.name,
        price: $scope.price
    }
    services.saveItem(params,onSaveItem, onError);
}


services.getItems(onItemsLoaded, onError);

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
this.saveItem = function(params, callback, onError){
  var fullUrl = 'items/save';
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

this.deleteInvoice = function(params, callback, onError){
  var fullUrl = 'invoices/delete';
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


this.getInvoice = function(params, callback, onError){
  var fullUrl = 'invoices/getInvoice';
      //var asJson = angular.toJson(params);
      //console.log(asJson);
      var req = {
        method: 'GET',
        url: fullUrl,
        headers: {
          'Content-Type': 'application/json'
      },
      params: params
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
