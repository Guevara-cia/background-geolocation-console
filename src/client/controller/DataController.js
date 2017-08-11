
var onpApp = angular.module('onpApp',['datatables']);

onpApp.controller('DataController' , function($scope, $http, DTOptionsBuilder){

    $scope.locations = [];

    var idTema     = obtenerGet("idTema");

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bFilter', false)
        .withOption('bLengthChange', false)
        .withOption('bAutoWidth', false)
        .withOption('bInfo', false)
        .withOption('bSort', false)
        .withLanguage({
            "url": "3rdparty/angular/modules/angular-datatables/Spanish.json"
        })

    obtenerLocalizaciones();

    function obtenerLocalizaciones(){
        var httpUrl = "http://40.71.248.211:9000/locations?device_id=verificador2-c71c2095c80eccdc";
        $http.get(httpUrl)
            .success(function(data){
                $scope.locations = data;
                /*for(var i = 0; i < data.length; i++) {
                    $scope.locations.push(data[i]);
                }*/
            })
            .error(function(data){
                console.log("Error Data : "+data);
            });
    }

});