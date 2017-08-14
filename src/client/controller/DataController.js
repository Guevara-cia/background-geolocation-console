
var onpApp = angular.module('onpApp',['datatables']);

onpApp.controller('DataController' , function($scope, $http, DTOptionsBuilder){

    $scope.locations = [];

    var pdevice_id     = obtenerGet("device_id");
    var pfec_inicio     = obtenerGet("fec_inicio");
    var pfec_fin       = obtenerGet("fec_fin");

    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('bFilter', false)
        .withOption('bLengthChange', false)
        .withOption('bAutoWidth', false)
        .withOption('bInfo', false)
        .withOption('bSort', false)
        .withLanguage({
            "url": "3rdparty/angular/modules/angular-datatables/Spanish.json"
        })

    if(pdevice_id == undefined || pdevice_id == '')
        pdevice_id = "";
    if(pfec_inicio == undefined || pfec_inicio == '' )
        pfec_inicio = ""
    if(pfec_fin == undefined || pfec_fin == '')
        pfec_fin = "";

    obtenerLocalizaciones(pdevice_id, pfec_inicio, pfec_fin);

    function obtenerLocalizaciones(device_id, fec_inicio, fec_fin){
        var httpUrl = "http://40.71.248.211:9000/locations?device_id="+device_id+"&start_date="+fec_inicio+"&end_date="+fec_fin;
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