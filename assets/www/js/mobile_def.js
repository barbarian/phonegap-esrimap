var clientHeight;
var isPortrait;
var isiPad;
var isiPhone;
var statusBarHeight;
var headerGeom;

function initMobileVariables(){
    isPortrait = window.matchMedia("(orientation: portrait)").matches;
    isiPad = navigator.userAgent.match(/iPad/i);
    isiPhone = navigator.userAgent.match(/iPhone/i);
    headerGeom = dojo.position(dojo.byId("header"));
    statusBarHeight = 20;
    clientHeight = document.body.clientHeight;
}
function orientationChangeEx(){
    if (map) {
      map.resize();
      map.reposition();
    }
}
function orientationChanged() {
    orientationChanged();
    if (isiPhone != null) {
      // iPhone
      if (isPortrait) {
        // portrait ----> landscape mode
        addjustMapHeight();
        isPortrait = false;
      } else {
        // landscape ----> portrait mode
        dojo.byId("map").style.height = (window.innerHeight + statusBarHeight) + "px";
        isPortrait = true;
      }
    } else if (isiPad != null) {
      // iPad
      addjustMapHeight();
    }
    if (map) {
      map.resize();
      map.reposition();
    }
}
function mobileMapLoadHandler(map) {
  // check device type
  if (isiPhone) {
    dojo.byId("map").style.height = (clientHeight + statusBarHeight) + "px";
  }
  if (isiPad != null) {
    addjustMapHeight();
  }
  loadMapViewTransition();
}

function addjustMapHeight() {
    dojo.byId("map").style.height = (window.innerHeight - headerGeom.h) + "px";
  }

  function hideAddressBar() {
    // Set a timeout...
    setTimeout(function () {
      // Hide the address bar!
      window.scrollTo(0, 1);
    }, 0);
  }
function registerOrientationChangeListener(){
 // onorientationchange doesn't always fire in a timely manner in Android so check for both orientationchange and resize
  var supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
  window.addEventListener(orientationEvent, function () {
    orientationChanged();
  }, false);
}
function loadMapViewTransition() {
    dojo.connect(dijit.byId('mapView'), 'onAfterTransitionIn', null, function (moveTo, dir, transition, context, method) {
      map.reposition();
    });
}

//location
var pt;
var graphic;
var currLocation;
function zoomToLocation(location) {
pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
 addGraphic(pt);
 map.centerAndZoom(pt, 16);
}

function showLocation(location) {
  pt = esri.geometry.geographicToWebMercator(new esri.geometry.Point(location.coords.longitude, location.coords.latitude));
  if (!graphic) {
    addGraphic(pt);
  } else {
    //move the graphic if it already exists
    graphic.setGeometry(pt);
  }
  map.centerAt(pt);
}

function locationError(error) {
  //error occurred so stop watchPosition
  if (navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Location not provided");
      break;

    case error.POSITION_UNAVAILABLE:
      alert("Current location not available");
      break;

    case error.TIMEOUT:
      alert("Timeout");
      break;

    default:
      alert("unknown error");
      break;
  }
}

// Add a pulsating graphic to the map
function addGraphic(pt) {
  var symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE, 12, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([210, 105, 30, 0.5]), 8), new dojo.Color([210, 105, 30, 0.9]));
  graphic = new esri.Graphic(pt, symbol);
  map.graphics.add(graphic);
}