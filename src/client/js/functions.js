function crearMapa(numLatitud, numLongitud, zoom){
    var posicionInicial        = new google.maps.LatLng(numLatitud, numLongitud);
    var tipoMapaInicial         = google.maps.MapTypeId.ROADMAP;
    var controlEstilo           = google.maps.MapTypeControlStyle.HORIZONTAL_BAR;
    var controlPosicion         = google.maps.ControlPosition.BOTTOM_CENTER;

    var mapOptions = {zoom: zoom, center: posicionInicial, mapTypeId: tipoMapaInicial, zoomControl: true, mapTypeControl: true, mapTypeControlOptions :{ style: controlEstilo, position: controlPosicion }}

    var mapa = new google.maps.Map(document.getElementById('map'), mapOptions);
    return mapa;
}

function crearMarcador(map, numLatitud, numLongitud, nomMarcador, urlIcono){
    var marcador = new google.maps.Marker({
        position: new google.maps.LatLng(numLatitud, numLongitud),
        map: map,
        title: nomMarcador,
        icon: urlIcono
    });
    return marcador;
}