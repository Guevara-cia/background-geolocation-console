
var onpApp = angular.module('onpApp',[]);

onpApp.controller('VerificadorController' , function($scope, $timeout, $http){

    var mapZoom					= 16;
    var iniLatitud    			= -12.048271;
    var iniLongitud   			= -77.031272;

    $scope.verificadores = [];

    $scope.map = crearMapa(iniLatitud, iniLongitud, mapZoom);

    obtenerVerificadores();

    function obtenerVerificadores(){
        var image = '../images/indicador_mapa.png';
        var urlImages = 'http://dev.guevara-cia.com/images/verificador/';
        var httpUrl = "http://guevaraservicelb.iaas-guevara-cia.com/api/v2/verificadorONP/_table/verificador?api_key=8e08ccf4662257e1ee63116278a8333fb2dd494cc57b6021f95a8a397fcecfa4";
        $http.get(httpUrl)
            .success(function(data){
                var verificadores = data.resource;
                for(var i = 0; i < verificadores.length; i++){
                    var verificador = verificadores[i];
                    var marcador = crearMarcador($scope.map, verificador.latitud, verificador.longitud, verificador.user_name, image);

                    var contentString = '<div id="content">'+
                        '<div id="siteNotice">'+
                        '<h3 id="firstHeading" >'+verificador.user_name+'</h3>'+
                        '</div>'+
                        '<table>'+
                        '<tr>'+
                        '<td>'+
                        '<img src= '+ urlImages + verificador.foto + ' height="100" width="80"></img>'+
                        '<p><b>Puesto:</b> ' + verificador.puesto + '</p>' +
                        '<p><b>Equipo de Trabajo:</b> ' + verificador.equipo_trabajo + '</p>'+
                        '<p><b>Email:</b> '+verificador.correo +'</p>'+
                        '<p><b>Teléfono:</b> ' + verificador.user_phone + '</p>'+
                        '<p><a href="mapa.html?device_id=verificador2-c71c2095c80eccdc">Ver Ruta</a></p>'+
                        '</td>'+
                        '</tr>'+
                        '</table>'+
                        '</div>';

                    var infowindow = new google.maps.InfoWindow({
                    });

                    google.maps.event.addListener(marcador,'click', (function(marcador ,contentString, infowindow){
                        return function() {
                            infowindow.setContent(contentString);
                            infowindow.open($scope.map, marcador);
                            google.maps.event.addListener($scope.map,'click', function(){
                                infowindow.close();
                            });
                        };
                    })(marcador, contentString, infowindow));
                    $scope.verificadores.push(marcador);
                }
            })
            .error(function(data){
                console.log("Error : "+data);
            });
    }

});
