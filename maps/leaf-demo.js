var map = L.map( 'map', {
    center: [41.879250, -87.631219],
    minZoom: 2,
    zoom: 12
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

var myURL = jQuery( 'script[src$="leaf-demo.js"]' ).attr( 'src' ).replace( 'leaf-demo.js', '' );
 
var myIcon = L.icon({
    iconUrl: myURL + 'images/pin24.png',
    iconRetinaUrl: myURL + 'images/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});
 

var geo = L.geoJson({features:[]},{onEachFeature:function popUp(f,l){
        var out = [];
        if (f.properties){
            for(var key in f.properties){
              out.push(key+": "+f.properties[key]);
        }
        //l.bindPopup(out.join("<br />"));
        l.on('click', function(){console.log(out)});
    }
}}).addTo(map);

shp("./data/Parks_Aug2012").then(function(geojson){
        //do something with your geojson
  geo.addData(geojson);

//shp("./data/City_Boundary").then(function(geojson){
        //do something with your geojson
//  geo.addData(geojson);

});
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

