
var onpApp = angular.module('onpApp',[]);

onpApp.controller('VerificadorController' , function($scope, $timeout, $filter, $http){

    var mapZoom					= 16;
    var iniLatitud    			= -12.048271;
    var iniLongitud   			= -77.031272;

    $scope.dispositivos = [];
    $scope.locations = [];

    var d = new Date();
    var fecha = $filter('date')(d, 'yyyy-MM-dd');

    $scope.fecInicio = fecha;
    $scope.fecFin = fecha;

    listarDispositivos();

    $scope.map = crearMapa(iniLatitud, iniLongitud, mapZoom);

    var puntoActual = crearMarcador($scope.map, iniLatitud, iniLongitud, 'Ubicación actual','');


    $scope.refrescarMapa = function(){
        if($scope.device_id == undefined) {
            alert("Seleccione un dispositivo");
            return;
        }
        if($scope.fecInicio == '') {
            alert("Ingrese Fecha Inicio");
            return;
        }
        if($scope.fecFin == '') {
            alert("Ingrese Fecha Fin");
            return;
        }
        var fecInicio = $scope.fecInicio+'T'+ $scope.horaInicio+':00.000Z';
        var fecFin = $scope.fecFin+'T'+$scope.fecFin+':00.000Z';
        obtenerLocalizaciones($scope.device_id, fecInicio, fecFin);
    }

    function listarDispositivos(){
        var httpUrl = "http://40.71.248.211:9000/devices?";
        //var httpUrl = "http://localhost:9000/devices.json";
        $http.get(httpUrl)
            .success(function(data){
                $scope.dispositivos = data;
            })
            .error(function(data){
                console.log("Error : "+data);
            });
    }

    function obtenerLocalizaciones(device_id, fec_inicio, fec_fin){
        var httpUrl = "http://40.71.248.211:9000/locations?device_id="+device_id+"&start_date="+fec_inicio+"&end_date="+fecFin;
        //var httpUrl = "http://localhost:9000/location.json";
        $http.get(httpUrl)
            .success(function(data){
                $scope.locations = [];
                //ruta.setMap(null);
                console.log(data.length);
                for(var i = 0; i < data.length; i++){
                    var location = data[i];
                    $scope.locations.push(new google.maps.LatLng(location.latitude, location.longitude));
                }
                var ruta = crearRuta($scope.map, "#880000", $scope.locations, 4, false);
                ruta.setMap($scope.map);
            })
            .error(function(data){
                console.log("Error : "+data);
            });
    }


});