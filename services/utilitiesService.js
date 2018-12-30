'use strict';
angular.module("rails", ["ngRoute"])
  .service('utilitiesService', function utilitiesService() {
    // AngularJS will instantiate a singleton by calling "new" on this function

        //PRUEBAS LOCAL 
        var baseUrl = 'http://localhost:3000/';  
        

        this.getBaseUrl = function(){

            return baseUrl;

        };

        this.OnError = function(){
                swal({
                     title: 'ERROR',
                     text: 'Ha ocurrido un error',
                     type: 'Error'
                });
        };


        this.getFechaFormat = function(){
            return 'YYYY-MM-DD';
        };

        this.agregarCeros = function(n, p, c) {
        var pad_char = typeof c !== 'undefined' ? c : '0';
        var pad = new Array(1 + p).join(pad_char);
        return (pad + n).slice(-pad.length);
        };


        
  });
