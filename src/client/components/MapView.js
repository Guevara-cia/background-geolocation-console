import React, {
  Component
} from 'react';

import { connect } from 'react-redux';

import GoogleMap from 'google-map-react';

import Styles from "../assets/styles/app.css";
import App from "./App";
import {COLORS} from '../constants';
import {
  Navigation,
  Panel
} from 'react-toolbox';
import Viewport from "./Viewport";

const API_KEY = process.env.GMAP_API_KEY || "AIzaSyA9j72oZA5SmsA8ugu57pqXwpxh9Sn4xuM";

class MapView extends Component {  

  constructor(props) {
    super(props);
    
    this.state = {
      currentPosition: undefined,
      center: { lat: -12.056112, lng: -77.036990 },
      zoom: 18
    };

    this.motionChangePolylines = [];
    this.selectedMarker = null;
    this.geofenceMarkers = {};
    this.geofenceHitMarkers = [];
    this.markers = [];
    this.map = undefined;

    /* Ruben Huamani */
    this.marcadores = [];
    /* Ruben Huamani */

    let app = App.getInstance();  

    app.on('filter', this.onFilter.bind(this));
    app.on('selectlocation', this.onSelectLocation.bind(this));
  }

  componentDidUpdate() {
    
  }

  initial(){
    alert("Carmella Bing");
  }

  onMapLoaded(event) {
    this.map = event.map;


    var marcador = new google.maps.Marker({
        zIndex: 10,
        map: this.gmap,
        title: 'Ubicación actual',
        position : new google.maps.LatLng(-12.056112, -77.036990),
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: COLORS.blue,
            fillOpacity: 1,
            strokeColor: COLORS.white,
            strokeOpacity: 1,
            strokeWeight: 6
        }
    });

    var http = require('http');
    //var verificadores = null;
    var data = '';
    var urlImages = 'http://dev.guevara-cia.com/images/verificador/'

    var optionsget = {
        host: 'guevaraservicelb.iaas-guevara-cia.com',
        port: 80,
        path: '/api/v2/verificadorONP/_table/verificador?api_key=8e08ccf4662257e1ee63116278a8333fb2dd494cc57b6021f95a8a397fcecfa4',
        method: 'GET'
    };
    var reqGet = http.request(optionsget, function (res) {
        res.on('data', function (d) {
            data += d;
        })
        .on('end', function () {
            var json = JSON.parse(data);
            var verificadores = json.resource;
            for(var i = 0; i < verificadores.length; i++){
                var verificador = verificadores[i];
                var image = '../images/indicador_mapa.png';
                var marcador = new google.maps.Marker({
                    zIndex: 10,
                    map: event.map,
                    title: verificador.user_name,
                    position : new google.maps.LatLng(verificador.latitud, verificador.longitud),
                    icon: image
                });
                //this.marcadores.push(marcador);

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
                    '</td>'+
                    '</tr>'+
                    '</table>'+
                    '</div>';

                var infowindow = new google.maps.InfoWindow({
                });

                /*google.maps.event.addListener(marcador, 'click', function(){

                });*/

                //google.maps.event.addListener(marcador,'rightclick', (function(marcador ,contentString, infowindow){
                google.maps.event.addListener(marcador,'click', (function(marcador ,contentString, infowindow){
                    return function() {
                        infowindow.setContent(contentString);
                        infowindow.open(event.mapp, marcador);
                        google.maps.event.addListener(event.map,'click', function(){
                            infowindow.close();
                        });
                    };
                })(marcador, contentString, infowindow));
            }

        })
        on('error', function (e) {
            console.error(e);
        })
        .on('uncaughtException', function (err) {
            console.error(err);
        });
    });

      reqGet.end();
    // Route polyline
    let seq = {
      repeat: '50px',
      icon: {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 1,
        fillOpacity: 0,
        strokeColor: COLORS.white,
        strokeWeight: 1,
        strokeOpacity: 1
      }
    };

    this.polyline = new google.maps.Polyline({
      map: this.map,
      zIndex: 1,
      geodesic: true,
      strokeColor: COLORS.polyline_color,
      strokeOpacity: 0.6,
      strokeWeight: 8,
      icons: [seq]
    });

    // Blue current location marker
    this.currentLocationMarker = new google.maps.Marker({
      zIndex: 10,
      map: this.map,
      title: 'Ubicación actual',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: COLORS.blue,
        fillOpacity: 1,
        strokeColor: COLORS.white,
        strokeOpacity: 1,
        strokeWeight: 6
      }
    });
    // Light blue location accuracy circle
    this.locationAccuracyCircle = new google.maps.Circle({
      map: this.map,
      zIndex: 9,
      fillColor: COLORS.light_blue,
      fillOpacity: 0.4,
      strokeOpacity: 0
    });

    this.getCurrentPosition();
    this.renderMarkers();
  }

  onSelectLocation(location) {
    if (this.selectedMarker) {
      this.selectedMarker.setIcon(this.buildLocationIcon(this.selectedMarker.location));
      this.selectedMarker.setZIndex(1);
    }
    if (location === null) {
      this.selectedMarker = null;
      return;
    }
    let marker = this.markers.find((marker) => {
      return marker.location.uuid === location.uuid;
    });
    if (!marker) {
      marker = this.geofenceHitMarkers.find((marker) => {
        return marker.location && marker.location.uuid === location.uuid;
      });
    }
    if (marker) {
      this.selectedMarker = marker;
      //marker.setFillColor('#000000');
      marker.setZIndex(100);
      marker.setIcon(this.buildLocationIcon(location, {
        strokeColor: COLORS.red,
        strokeWeight: 2,
        selected: true
      }));
    }
  }
  onMarkerClick(marker) {
    App.getInstance().setLocation(this.location);
  }

  getCurrentPosition() {
    var me = this;
    return;

    window.navigator.geolocation.getCurrentPosition(function(location) {
      me.setState({
        currentPosition: location,
        center: {
          lat: location.coords.latitude,
          lng: location.coords.longitude
        }
      });
    });
  }

  onFilter(filter) {
    let map = (filter.value) ? this.map : null;
    switch(filter.name) {
      case 'showMarkers':        
        this.markers.forEach((marker) => {
          marker.setMap(map);
        });

        this.marcadores.forEach((marker) =>{
            marker.setMap(map);
        })

        break;
      case 'showPolyline':
        this.polyline.setMap(map);
        this.motionChangePolylines.forEach((polyline) => {
          polyline.setMap(map);
        });
        break;
      case 'showGeofenceHits':
        this.geofenceHitMarkers.forEach((marker) => {
          marker.setMap(map);
        });
        break;
    }
  }

  renderMarkers() {
    let app = App.getInstance();

    if (!app.isWatching()) {
      this.clearMarkers();
    }
    let length = this.props.locations.length;
    if (!length) { return; }

    let settings = app.getState();

    this.polyline.setMap((settings.showPolyline) ? this.map : null);

    let motionChangePosition = null;
    let searchingForMotionChange = false;
    
    // Iterate in reverse order to create polyline points from oldest->latest.  We DO NOT want this.props.locations.reverse()!!!
    for (var n=length-1; n!=0; n--) {
      let location = this.props.locations[n];
      let latLng = new google.maps.LatLng(location.latitude, location.longitude);
      if (location.geofence) {
        this.buildGeofenceMarker(location, {
          map: (settings.showGeofenceHits) ? this.map : null
        });
      } else {
        let marker = this.buildLocationMarker(location, {
          map: (settings.showMarkers) ? this.map : null
        });
        this.markers.push(marker);
      }    
      this.polyline.getPath().push(latLng);

      if (location.event === 'motionchange') {
        if (!location.is_moving) {
          searchingForMotionChange = true;
          motionChangePosition = latLng;
        } else if (searchingForMotionChange) {
          searchingForMotionChange = false;
          this.motionChangePolylines.push(this.buildMotionChangePolyline(motionChangePosition, latLng));
        }
      }
    };
    let currentPosition = this.props.locations[0];
    let latLng = new google.maps.LatLng(currentPosition.latitude, currentPosition.longitude);
    this.map.setCenter(latLng);
    this.currentLocationMarker.setPosition(latLng);
    this.locationAccuracyCircle.setCenter(latLng);
    this.locationAccuracyCircle.setRadius(currentPosition.accuracy);
  }

  buildMotionChangePolyline(stationaryPosition, movingPosition) {
    let settings = App.getInstance().getState();
    let seq = {
      repeat: '25px',
      icon: {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        scale: 1,
        fillColor: COLORS.white,
        fillOpacity: 0,
        strokeColor: COLORS.white,
        strokeWeight: 1,
        strokeOpacity: 1
      }
    };
    return new google.maps.Polyline({
      map: (settings.showPolyline) ? this.map : null,
      zIndex: 1001,
      geodesic: true,
      strokeColor: COLORS.green,
      fillColor: COLORS.red,
      icons: [seq],
      strokeOpacity: 1,
      strokeWeight: 8,
      path: [stationaryPosition, movingPosition]
    });
  }

  buildGeofenceMarker(location, options) {
    let geofence = location.geofence;
    let circle = this.geofenceMarkers[geofence.identifier];
    if (!circle) {
      let center = undefined;
      let radius = 200;
      // If the geofence contains information about its center & radius in #extras...
      if (geofence.extras && geofence.extras.center) {
        center = new google.maps.LatLng(geofence.extras.center.latitude, geofence.extras.center.longitude);
        radius = geofence.extras.radius;
        if (typeof(radius) === 'string') { radius = parseInt(radius, 10);}
      } else {
        center = new google.maps.LatLng(location.latitude, location.longitude);
      }
      circle = new google.maps.Circle({
        zIndex: 2000,
        fillOpacity: 0,
        strokeColor: COLORS.black,
        strokeWeight: 1,
        strokeOpacity: 1,
        radius: radius,
        center: center,
        map: options.map
      });
      this.geofenceMarkers[geofence.identifier] = circle;
      this.geofenceHitMarkers.push(circle);
    }
    var color, heading;
    if (geofence.action === 'ENTER') {
      color = COLORS.green;
    } else if (geofence.action === 'DWELL') {
      color = COLORS.gold;
    } else {
      color = COLORS.red;
    }
    let circleLatLng = circle.getCenter();
    let locationLatLng = new google.maps.LatLng(location.latitude, location.longitude);
    let distance = google.maps.geometry.spherical.computeDistanceBetween (circleLatLng, locationLatLng);

    var heading = google.maps.geometry.spherical.computeHeading(circleLatLng, locationLatLng);
    let circleEdgeLatLng = google.maps.geometry.spherical.computeOffset(circleLatLng, circle.getRadius(), heading);

    var geofenceEdgeMarker = new google.maps.Marker({
      zIndex: 2000,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        fillColor: color,
        fillOpacity: 0.7,
        strokeColor: COLORS.black,
        strokeWeight: 1,
        strokeOpacity: 1
      },
      map: options.map,
      position: circleEdgeLatLng
    });
    this.geofenceHitMarkers.push(geofenceEdgeMarker);

    var locationMarker = this.buildLocationMarker(location, {
      showHeading: true,
      zIndex: 2000,
      map: options.map,
      fillColor: color
    });
    this.geofenceHitMarkers.push(locationMarker);

    var polyline = new google.maps.Polyline({
      map: options.map,
      zIndex: 2000,
      geodesic: true,
      strokeColor: COLORS.black,
      strokeOpacity: 1,
      strokeWeight: 1,
      path: [circleEdgeLatLng, locationMarker.getPosition()]
    });
    this.geofenceHitMarkers.push(polyline);
  }

  // Build a bread-crumb location marker.
  buildLocationMarker(location, options?){
    options = options || {};
    let zIndex = options.zIndex || 1;
    let latLng = new google.maps.LatLng(location.latitude, location.longitude);
    let marker = new google.maps.Marker({
      zIndex: zIndex,
      icon: this.buildLocationIcon(location, options),
      location: location,
      map: options.map,
      position: new google.maps.LatLng(location.latitude, location.longitude)
    });

    marker.addListener('click', this.onMarkerClick);
    return marker;
  }

  buildLocationIcon(location, options) {
    options = options || {};
    let anchor    = undefined;
    let fillColor = COLORS.polyline_color;
    let scale     = options.scale || 2;
    let path      = google.maps.SymbolPath.FORWARD_CLOSED_ARROW;

    if (location.geofence) {
      path = google.maps.SymbolPath.FORWARD_CLOSED_ARROW;
      anchor = new google.maps.Point(0, 2.6);
      scale = 3;
      switch (location.geofence.action) {
        case 'ENTER':
          fillColor = COLORS.green;
          break;
        case 'EXIT':
          fillColor = COLORS.red;
          break;
        case 'DWELL':
          fillColor = COLORS.gold;
          break;
      }
    }
    let fillOpacity = 1;
    
    if (location.event === 'motionchange') {
      if (!location.is_moving) {
        anchor = undefined;
        path = google.maps.SymbolPath.CIRCLE;
        scale = 10;
        fillOpacity = 0.7;
        fillColor = COLORS.red;
      } else {
        path = google.maps.SymbolPath.FORWARD_OPEN_ARROW;
        fillColor = COLORS.green;
        scale = 3;
        fillOpacity = 1;
      }
    }
    if (options.selected) {
      scale *= 2;
    }
    
    return {
      path: path,
      rotation: location.heading,
      scale: scale,
      anchor: anchor,
      fillColor: options.fillColor || fillColor,
      fillOpacity: options.fillOpacity || fillOpacity,
      strokeColor: options.strokeColor || COLORS.black,
      strokeWeight: options.strokeWeight || 1,
      strokeOpacity: options.strokeOpacity || 1
    }
  }

  clearMarkers(){
    /*this.markers.forEach((marker) => {
      google.maps.event.clearInstanceListeners(marker);
      marker.setMap(null);
    });
    this.markers = [];

    this.geofenceMarkers = {};
    this.geofenceHitMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    this.geofenceHitMarkers = [];

    this.polyline.setPath([]);
    this.motionChangePolylines.forEach((polyline) => {
      polyline.setMap(null);
    });
    this.motionChangePolylines = [];*/
  }

  render(){

    if (this.map) {
      this.renderMarkers();
    }

    return(
        <div className={Styles.map}>
          <GoogleMap ref="map" bootstrapURLKeys={{key:API_KEY, libraries:"geometry"}} className="map" center={this.state.center} zoom={15} onGoogleApiLoaded={this.onMapLoaded.bind(this)}>
          </GoogleMap>
        </div>
    );
  }
}

const mapStateToProps = function(store) {
  return {
    locations: store.locations
  };
};

export default connect(mapStateToProps)(MapView);

