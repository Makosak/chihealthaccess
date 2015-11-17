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
    "color": "#f03b20",
    "fill": false
};

var commAreasStyle = {  // base layer of Chicago boundary - always on
    "color": "#636363",
    "weight": 4,
    "dashArray": true,
    "opacity": 10
};

var myStyle2 = { // basic layer with each unit defined
    "color": "#1c9099",
    "weight": 1,
    "opacity": 0.8
};

function getColor(a) { //Parks with more acres have darker color
    
    return a > 500  ? '#006837' :
           a > 100  ? '#31a354' :
           a > 10   ? '#78c679' :
           a > 1   ? '#c2e699' :
           a > 0   ? '#ffffcc' :
                      '#FFEDA0';
}

function acreStyle(feature) { //Parks with more acres have darker color
    return {
        fillColor: getColor(feature.properties.ACRES),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
}

function hisStyle(feature) { //Parks with more acres have darker color
    return {
        fillColor: hisColor(feature.properties.HIS_ct),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
}

function hisColor(a) { //Parks with more acres have darker color
    
    return a > 60  ? '#006837' :
           a > 45  ? '#31a354' :
           a > 30   ? '#78c679' :
           a > 15   ? '#c2e699' :
           a > 0   ? '#ffffcc' :
                      '#FFEDA0';
}


function coiStyle(feature) { //Parks with more acres have darker color
    return {
        fillColor: coiColor(feature.properties.COI_ct),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
}

function coiColor(a) { //Parks with more acres have darker color
    
    return a > 0.63  ? '#016c59' :
           a > 0.08  ? '#1c9099' :
           a > (-0.45)   ? '#67a9cf' :
           a > (-0.99)   ? '#bdc9e1' :
           a > (-1.54)   ? '#f6eff7' :
                      '#FFEDA0';
}


function highlightFeature(e) {
    var layer = e.target;

    info.update(layer.feature.properties);

    layer.setStyle({
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
        
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    commAreas.layer.resetStyle(e.target);
    info.update();
    console.log("resetHighlight");
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        doubleclick: zoomToFeature
    });
}

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Community Area</h4>' +  (props ?
        '<b>' + props.COMMUNITY + ' (ID: ' + props.AREA_NUMBE + ')'
        : 'Hover over an area');
};

info.addTo(map);


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
      parks.layer = L.geoJson(geojson, 
      {
          style: acreStyle, 
          

      }).addTo(map);
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


var commAreas = {},
commAreasLoaded = [false, false]; //[init(button click at all), on/off]

function loadCommAreas(){
  if(!commAreasLoaded[0]){
    shp("./data/CommAreas").then(function(geojson){
      commAreas.layer = L.geoJson(geojson, 
      {
          style: commAreasStyle, 
          onEachFeature: onEachFeature

      }).addTo(map);
      commAreas.geojson = geojson;
      commAreasLoaded = [true, true];
    });
  }
  else{
    if(commAreasLoaded[1]){
      reloadExistingLayers(commAreas);
      commAreasLoaded[1] = false;
    }
    else{
      commAreas.layer.addTo(map);
     commAreasLoaded[1] = true;
    }
  }

}

var HIStracts = {},
HIStractsLoaded = [false, false]; //[init(button click at all), on/off]

function loadHIS(){
  if(!HIStractsLoaded[0]){
    shp("./data/CDPHTractsFinal_Clipped").then(function(geojson){
      HIStracts.layer = L.geoJson(geojson, 
      {
          style: hisStyle, 

      }).addTo(map);
      HIStracts.geojson = geojson;
      HIStractsLoaded = [true, true];
    });
  }
  else{
    if(HIStractsLoaded[1]){
      reloadExistingLayers(HIStracts);
      HIStractsLoaded[1] = false;
    }
    else{
      HIStracts.layer.addTo(map);
      HIStractsLoaded[1] = true;
    }
  }

}

var COItracts = {},
COItractsLoaded = [false, false]; //[init(button click at all), on/off]

function loadCOI(){
  if(!COItractsLoaded[0]){
    shp("./data/CDPHTractsFinal_Clipped").then(function(geojson){
      COItracts.layer = L.geoJson(geojson, 
      {
          style: coiStyle, 

      }).addTo(map);
      COItracts.geojson = geojson;
      COItractsLoaded = [true, true];
    });
  }
  else{
    if(COItractsLoaded[1]){
      reloadExistingLayers(COItracts);
      COItractsLoaded[1] = false;
    }
    else{
      COItracts.layer.addTo(map);
      COItractsLoaded[1] = true;
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


