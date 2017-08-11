
var onpApp = angular.module('onpApp',[]);

onpApp.controller('VerificadorController' , function($scope, $timeout, $http){

    var mapZoom					= 16;
    var iniLatitud    			= -12.048271;
    var iniLongitud   			= -77.031272;

    $scope.dispositivos = [];
    $scope.locations = [];

    listarDispositivos();

    $scope.map = crearMapa(iniLatitud, iniLongitud, mapZoom);

    var puntoActual = crearMarcador($scope.map, iniLatitud, iniLongitud, 'Ubicación actual','');


    $scope.refrescarMapa = function(){
        if($scope.device_id == undefined)
            alert("Seleccione un dispositivo");
        obtenerLocalizaciones($scope.device_id);
    }

    function listarDispositivos(){
        var httpUrl = "http://40.71.248.211:9000/devices?";
        //var httpUrl = "http://localhost:9000/devices.json";
        $http.get(httpUrl)
            .success(function(data){
                console.log("Lisa Ann");
                $scope.dispositivos = data;
            })
            .error(function(data){
                console.log("Error : "+data);
            });
    }

    function obtenerLocalizaciones(device_id){
        var httpUrl = "http://40.71.248.211:9000/locations?device_id="+device_id;
        //var httpUrl = "http://localhost:9000/location.json";
        $http.get(httpUrl)
            .success(function(data){
                console.log("Puntos : "+data.length);
            })
            .error(function(data){
                console.log("Error : "+data);
            });
    }


});