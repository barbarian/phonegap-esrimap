var map;

require([
"esri/map",
"dojox/mobile",
"dojox/mobile/parser",
"dojox/mobile/deviceTheme",
"esri/sniff",
"dojox/mobile/deviceTheme",
"dojo/dom",
"dijit/registry",
"dojo/on",
"dojox/mobile/ToolBarButton",
"dojox/mobile/View",
"dojo/domReady!"
],
  function(Map, mobile, parser, has, dTheme, dom, registry, on) {
    parser.parse();
    mobile.hideAddressBar();
    init();
});

function init() {
    initMobileVariables();
    registerOrientationChangeListener();
    initMap();
}

function initMap(position) {
    map = new esri.Map("map", {
        center :[ -0.1275,51.507222],
        zoom :13,
        basemap:"osm",//"streets"
    });
    dojo.connect(map, "onLoad", mapLoadHandler);
}

var watchId;
function mapLoadHandler(map) {
    mobileMapLoadHandler(map);
   // check if geolocaiton is supported
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(zoomToLocation, locationError);
    // retrieve update about the current geographic location of the device
    watchId = navigator.geolocation.watchPosition(showLocation, locationError,{ maximumAge: 10000, timeout: 10000, enableHighAccuracy: true });
  } else {
    alert("Browser doesn't support Geolocation. Visit http://caniuse.com to discover browser support for the Geolocation API.");
  }
}