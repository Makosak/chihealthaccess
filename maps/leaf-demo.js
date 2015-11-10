var map = L.map( 'map', {
    center: [41.854501, -87.715496],
    minZoom: 2,
    zoom: 11
});

//var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
//  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
//  subdomains: 'abcd',
//  maxZoom: 19
// });


// Add BaseMap style
var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo( map );

////////////////////////////////////////////////////////
// Base layer is always on: City of Chicago Boundary
////////////////////////////////////////////////////////
var cityBoundary
shp("./data/City_Boundary").then(function(geojson){
  L.geoJson(geojson, {
    style: myStyle1
}).addTo(map);
  cityBoundary = geojson;
});


// Style of layers
var myStyle1 = {  // base layer of Chicago boundary - always on
    "color": "#a6bddb",
    "opacity": 0.3
};

var myStyle2 = { // basic layer with each unit defined
    "color": "#1c9099",
    "weight": 5,
    "opacity": 0.8
};

////////////////////////////////////////////////////////
// Parks Layer
////////////////////////////////////////////////////////

/*$('#parks').click(function(){
  loadParks();
})*/

var parks = {},
parksLoaded = [false, false]; //[init(button click at all), on/off]

function loadParks(){
  if(!parksLoaded[0]){
    shp("./data/Parks_Aug2012").then(function(geojson){
      parks.layer = L.geoJson(geojson, {
          style: myStyle2 }).addTo(map);
      parks.geojson = geojson;
      parksLoaded = [true, true];
    });
  }
  else{
    if(parksLoaded[1]){
      reloadExistingLayers(parks);
      parksLoaded[1] = false;
    }
    else{
      parks.layer.addTo(map);
      parksLoaded[1] = true;
    }
  }

}


////////////////////////////////////////////////////////
// Reset: take off active layer and show base map layer
////////////////////////////////////////////////////////

function reloadExistingLayers(geojson){
/*  lcontrol = L.control.layers(cityBoundary, parks).addTo(map);
  lcontrol.removeLayer(geojson);
  cityBoundary = geojson;*/
  map.removeLayer(geojson.layer);
  //geo.clearLayers();
  //L.geoJson(cityBoundary).addTo(map);
}


//var url = "./data/files/pandr"
/*var url = "./data/Parks_Aug2012";
shp(url).then(function(data){
  console.log(data);
  data.features.forEach(function(feature, i){
    // Add a marker to the map
    feature.marker = new google.maps.Marker({
      position:new google.maps.LatLng(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0]
      ),
      title:feature.properties.TOWN
    });
    feature.marker.setMap(map);

    console.log(feature.geometry.coordinates[1]+ ", " + feature.geometry.coordinates[0]);
    // Create the info window
    //console.log(feature.properties);
    var out = [];
    
  });
});*/

