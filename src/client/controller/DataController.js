
var onpApp = angular.module('onpApp',['datatables']);

onpApp.controller('DataController' , function($scope, $http, DTOptionsBuilder){

    $scope.locations = [];

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
        var httpUrl = "http://localhost:9000/location.json";
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