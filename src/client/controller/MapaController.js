
var onpApp = angular.module('onpApp',[]);

onpApp.controller('MapaController' , function($scope, $timeout, $filter, $http){

    var mapZoom					= 16;
    var iniLatitud    			= -12.048271;
    var iniLongitud   			= -77.031272;
    var ruta = null;

    $scope.dispositivos = [];
    $scope.locations = [];

    var d = new Date();
    var fecha = $filter('date')(d, 'yyyy-MM-dd');

    $scope.fecInicio = fecha;
    $scope.fecFin = fecha;

    listarDispositivos();

    obtenerLocalizaciones('verificador2-c71c2095c80eccdc','2017-06-07T04:59:42.938Z','2017-08-07T04:59:42.938Z');

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
        var horaInicio = "";
        var horaFin = "";
        if($scope.horaInicio.length == 4)
            horaInicio = "0"+$scope.horaInicio;
        else
            horaInicio = $scope.horaInicio;
        if($scope.horaFin.length == 4)
            horaFin = "0"+$scope.horaFin;
        else
            horaFin = $scope.horaFin;

        var fecInicio = $scope.fecInicio+'T'+ horaInicio+':00.000Z';
        var fecFin = $scope.fecFin+'T'+horaFin+':00.000Z';
        window.parent.setDeviceId($scope.device_id);
        window.parent.setFecInicio(fecInicio);
        window.parent.setFecFin(fecFin);
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
        var httpUrl = "http://40.71.248.211:9000/locations?device_id="+device_id+"&start_date="+fec_inicio+"&end_date="+fec_fin;
        //var httpUrl = "http://localhost:9000/location.json";
        $http.get(httpUrl)
            .success(function(data){
                $scope.locations = [];
                if(ruta != null)
                    ruta.setMap(null);
                console.log(data.length);
                for(var i = 0; i < data.length; i++){
                    var location = data[i];
                    $scope.locations.push(new google.maps.LatLng(location.latitude, location.longitude));
                }
                ruta = crearRuta($scope.map, "#880000", $scope.locations, 4, false);
                ruta.setMap($scope.map);
            })
            .error(function(data){
                console.log("Error : "+data);
            });
    }


});