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




var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

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

function hisStyleCat(feature) { //CDPH Coding
    return {
        fillColor: hisColorCat(feature.properties.HIS_ct),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
}

function hisColor(a) { //Equal intervel
    
    return a > 60  ? '#810f7c' :
           a > 45  ? '#8856a7' :
           a > 30   ? '#8c96c6' :
           a > 15   ? '#b3cde3' :
           a > 0   ? '#edf8fb' :
                      '#FFEDA0';
}

function hisColorCat(a) { //CDPH Coding
  
    return a > (46.4)  ? '#b30000' :
           a > (33.7)   ? '#fc8d59' :
           a > (6.7)   ? '#fef0d9' :
                      '#f7f7f7';
}


function coiStyleEq(feature) { //Parks with more acres have darker color
    return {
        fillColor: coiColorEq(feature.properties.COI_ct),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
}

function coiStyleCat(feature) { //Parks with more acres have darker color
    return {
        fillColor: coiColorCat(feature.properties.COI_ct),
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.7
    };
}


function coiColorEq(a) { // Equal Interval
    
    return a > 0.63  ? '#f6eff7' :
           a > 0.08  ? '#bdc9e1' :
           a > (-0.45)   ? '#67a9cf' :
           a > (-0.99)   ? '#1c9099' :
           a > (-1.54)   ? '#016c59' :
                      '#FFEDA0';
}

function coiColorCat(a) { // CDPH Category
    
    return a > (0.424)  ? '#fef0d9' :
           a > (0.115)       ? '#fdcc8a' :
           a > (-0.11279)   ? '#fc8d59' :
           a > (-0.40195)        ? '#e34a33' :
           a > (-1.54)   ? '#b30000' :
                      '#FFEDA0';
}


/*
coiScale

min -1.54 
max 1.17


*/

function highlightFeature(e) {
    var layer = e.target;

    var props = layer.feature.properties;
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

function highlightFeatureTract(e) {
    var layer = e.target;

    var props = layer.feature.properties;
    info.updateTract(layer.feature.properties);

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

function resetHighlightTract(e) {
    //commAreas.layer.resetStyle(e.target);


    // Steptoe: layer below is not defined
    // need to call object which contains layers as above
    // layer.resetStyle(e.target);
    COI2tracts.layer.resetStyle(e.target);
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

function onEachFeatureTract(feature, layer) {
    layer.on({
        mouseover: highlightFeatureTract,
        mouseout: resetHighlightTract
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

    document.getElementById("testingHover").innerHTML = '<h4>Community Area</h4>' +  (props ?
        '<b>' + props.COMMUNITY + ' (ID: ' + props.AREA_NUMBE + ')'
        : 'Hover over an area');
};

info.updateTract = function (props) {
    this._div.innerHTML = '<h4>Community Area ID: ' +  (props ?
        '<b>' + props.COMMAREA + '</h4>'
        : 'Hover over an area');

    document.getElementById("testingHover").innerHTML = '<h4>Results for Selected Tract: </h4>' 
        +  (props ? '<p>'
        + ' Household Income Diversity Index: ' + props.HIS_ct + '<br>'
        + ' Childhood Opportunity Index: ' + props.COI_ct + '<br>'
        + ' Years Lost: ' + props.YEARS_LOST + '<br>'
        + ' Population in 2012: ' + props.Pop2012 + '<br>'
        + ' Population Change (since 2010): ' + props.PopChange + '<br>'


        : 'Hover over an area');

    var data = [];
    var features = COI2tracts.geojson.features;
    var min = features[0].properties.COI_ct, max = features[0].properties.COI_ct;
    for (var i = 0; i < features.length; i++) {

      // Get COI value and store it in the data array
      value = features[i].properties.COI_ct;
      data.push(value);

      // Update min and max for x domain using value
      if(value < min)
        min = value;
      else if(value > max)
        max = value;
    };

    var formatCount = d3.format(",.0f");

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
    // Use chart class width to determine chart width
    width = $('.chart').width() - margin.left - margin.right,
    // Use 'Healthy Regions' container to determine height
    height = $('.well').height() - margin.top - margin.bottom;

    // Scale x values to have domain between min/max
    // and bind pixel range from 0->width
    var x = d3.scale.linear()
    .domain([min, max])
    .range([0, width]);

    // Bin the data into specified number of histbins
    data = d3.layout.histogram().bins(x.ticks(5))(data);

    // Scale y values to have domain between min/max of bin sizes
    // and bind pixel range from height->0
    var y = d3.scale.linear()
    .domain(d3.extent(data, function(d){ return d.length}))
    .range([height, 0]);

    // Setup xAxis using x scale from above, on the bottom,
    // with set # of tick marks
    var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(7);

    // Make sure to remove old chart before drawing new chart
    $(".chart").empty();

    // Select Chart area and append svg with specified dims
    // and append the g to contain all elements shifted by margins
    var svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set minimum bar pixel height for very small bin count
    var minBarHeight = 18;

    // Append a bar for each item provided as data and translate into x,y position
    var bar = svg.selectAll(".bar") // initiate data join by defining selection to which we join the data
        .data(data) // join the data
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d, i) {
          // Check if bar height is smaller than min height, if so use min
          var yTrans = ((height - y(d.y) < minBarHeight) ? (height - minBarHeight) : y(d.y));
          return "translate(" + x(d3.min(d)) + "," + yTrans + ")";
        });

    // Append a rect with fill based on the mean value of the data it represents,
    // set height with bin count and set width with COI value range it reps
    bar.append("rect")
        .style("fill", function(d, i){return coiColorCat(d3.mean(d));})
        .attr("x", 1)
        .attr("width", function(d, i){
          //Calculate width using max and min value range
          d.width = x(d3.max(d)) - x(d3.min(d));
          return d.width - 1;
        })
        .attr("height", function(d, i) { return d3.max([minBarHeight, height - y(d.y)]); });

    // Append the bin count as text below the top of the bar centered
    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", function(d){ return d.width / 2;})
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

    // Append the xAxis to the chart
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
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
          onEachFeature: onEachFeatureTract 

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


var HIS2tracts = {},
HIS2tractsLoaded = [false, false]; //[init(button click at all), on/off]


function loadHIS2(){
  if(!HIS2tractsLoaded[0]){
    shp("./data/CDPHTractsFinal_Clipped").then(function(geojson){
      HIS2tracts.layer = L.geoJson(geojson, 
      {
          style: hisStyleCat, 
          onEachFeature: onEachFeatureTract  

      }).addTo(map);
      HIS2tracts.geojson = geojson;
      HIS2tractsLoaded = [true, true];
    });
  }
  else{
    if(HIS2tractsLoaded[1]){
      reloadExistingLayers(HIS2tracts);
      HIS2tractsLoaded[1] = false;
    }
    else{
      HIS2tracts.layer.addTo(map);
      HIS2tractsLoaded[1] = true;
    }
  }

}

var COI1tracts = {},
COI1tractsLoaded = [false, false]; //[init(button click at all), on/off]

function loadCOI1(){
  if(!COI1tractsLoaded[0]){
    shp("./data/CDPHTractsFinal_Clipped").then(function(geojson){
      COI1tracts.layer = L.geoJson(geojson, 
      {
          style: coiStyleEq, 
          onEachFeature: onEachFeatureTract 

      }).addTo(map);
      COI1tracts.geojson = geojson;
      COI1tractsLoaded = [true, true];
    });
  }
  else{
    if(COI1tractsLoaded[1]){
      reloadExistingLayers(COI1tracts);
      COI1tractsLoaded[1] = false;
    }
    else{
      COI1tracts.layer.addTo(map);
      COI1tractsLoaded[1] = true;
    }
  }

}


var COI2tracts = {},
COI2tractsLoaded = [false, false]; //[init(button click at all), on/off]

function loadCOI2(){
  if(!COI2tractsLoaded[0]){
    shp("./data/CDPHTractsFinal_Clipped").then(function(geojson){
      COI2tracts.layer = L.geoJson(geojson, 
      {
          style: coiStyleCat, 
          onEachFeature: onEachFeatureTract 

      }).addTo(map);
      COI2tracts.geojson = geojson;
      COI2tractsLoaded = [true, true];
    });
  }
  else{
    if(COI2tractsLoaded[1]){
      reloadExistingLayers(COI2tracts);
      COI2tractsLoaded[1] = false;
    }
    else{
      COI2tracts.layer.addTo(map);
      COI2tractsLoaded[1] = true;
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
