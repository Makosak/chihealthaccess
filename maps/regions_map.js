var map = L.map( 'map', {
    center: [41.854501, -87.715496],
    minZoom: 2,
    zoom: 11
});


// Add BaseMap style
var CartoDB_Positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
  subdomains: 'abcd',
  maxZoom: 19
 }).addTo( map );



////////////////////////////////////////////////////////
// Base layer is always on: City of Chicago Boundary
////////////////////////////////////////////////////////


/*var cityBoundary
shp("./data/City_Boundary").then(function(geojson){
  L.geoJson(geojson, {
    style: myStyle1
}).addTo(map);
  cityBoundary = geojson;
});*/



/*
$.ajax({
                  url: "./data/City_Boundary.geojson",
                  beforeSend: function(xhr){
                    if (xhr.overrideMimeType)
                    {
                      xhr.overrideMimeType("application/json");
                    }
                  },
                  dataType: 'json',
                  data: null,
                  success:  function(data, textStatus, request) {
                    L.geoJson(data, { }).addTo(map);
                  }
                }); */



  // load GeoJSON from an external file
  /*$.getJSON("./data/City_Boundary.geojson", function(data){
    // data = JSON.parse(data);
    // add GeoJSON layer to the map once the file is loaded
    var testLayer = L.geoJson(data, {style: commAreasStyle}).addTo(map);
    map.fitBounds(testLayer.getBounds())
  });*/

/*  // Test geojson to show the code is good
  $.getJSON("./data/Boundaries - City.geojson", function(data){
    // data = JSON.parse(data);
    // add GeoJSON layer to the map once the file is loaded
    var testLayer = L.geoJson(data, {style: myStyle1}).addTo(map);
    //map.fitBounds(testLayer.getBounds())
  });*/



  // Test geojson to show the code is good
  $.getJSON("./data/Boundaries - City.geojson", function(data){
    // data = JSON.parse(data);
    // add GeoJSON layer to the map once the file is loaded
    var cityBoundary = L.geoJson(data, {style: myStyle1}).addTo(map);
    //map.fitBounds(testLayer.getBounds())
  });



/*var boundary = new L.geoJson();
boundary.addTo(map);

$.ajax({
dataType: "json",
url: "./data/City_Boundary.geojson",
success: function(data) {
    $(data.features).each(function(key, data) {
        boundary.addData(data);
    });
}
}).error(function() {});

*/
// Style of layers
var myStyle1 = {  // base layer of Chicago boundary - always on
    "color": "#f03b20",
    "fill": false
};

var commAreasStyle = {  // Community Area Layer Overlay
    "color": "#636363",
    "weight": 4,
    "dashArray": true,
    "opacity": 0.8,
};

var myStyle2 = { // basic layer with each unit defined
    "color": "#1c9099",
    "weight": 1,
    "opacity": 0.8
};


function coiColorCat(a) { // CDPH Category
    
    return a > (0.424)  ? '#fef0d9' :
           a > (0.115)       ? '#fdcc8a' :
           a > (-0.11279)   ? '#fc8d59' :
           a > (-0.40195)        ? '#e34a33' :
           a > (-1.54)   ? '#b30000' :
                      '#FFEDA0';
}

var classColors = {
  "Quantile" : {
    "COI_ct" : ['#f1eef6','#bdc9e1','#74a9cf','#2b8cbe','#045a8d', '#FFEDA0'],
    "HIS_ct" : [],
  },
  "CDPH" : {
    "COI_ct" : ['#fef0d9','#fdcc8a','#fc8d59','#e34a33','#b30000', '#FFEDA0'],
    "HIS_ct" : ['#b30000','#fc8d59','#fef0d9', '#FFEDA0'],

    "VCRIMERT15" : ['#ce1256','#df65b0','#d7b5d8','#f1eef6', '#FFEDA0'],
        "VCER15" :['#ce1256','#df65b0','#d7b5d8','#f1eef6', '#FFEDA0'],
            "VCSR15" :['#ce1256','#df65b0','#d7b5d8','#f1eef6', '#FFEDA0'],
               "VCSEBS15" :['#ce1256','#df65b0','#d7b5d8','#f1eef6', '#FFEDA0'],

    "PCRIMERT15" : ['#88419d','#8c96c6','#b3cde3','#edf8fb', '#FFEDA0'],
        "PCREXR15" : ['#88419d','#8c96c6','#b3cde3','#edf8fb', '#FFEDA0'],
            "PCRSPRT15" : ['#88419d','#8c96c6','#b3cde3','#edf8fb', '#FFEDA0'],
                "PCSEBS15" : ['#88419d','#8c96c6','#b3cde3','#edf8fb', '#FFEDA0'],

    "YPLL_rate" : ['#7a0177','#c51b8a','#f768a1','#fbb4b9','#feebe2', '#FFEDA0'],  

    "Lit_Qrtl" : ['#238b45','#66c2a4','#b2e2e2','#edf8fb','#FFEDA0']          

  },

  "Fisher" : {
    "COI_ct" : [],
    "VCRIMERT15" : [],
  },
}

var classIntervals = {
  "Quantile" : {
    "COI_ct" : [0.424, 0.115, -0.11279, -0.40195, -1.54],
    "VCRIMERT15" : [],
  },
  "CDPH" : {
    "COI_ct" : [0.424, 0.115, -0.11279, -0.40195, -1.54],
    "HIS_ct" : [46.4, 33.7, 6.7],

    "PCRIMERT15" :[0.0385, 0.0249, 0.0152, 0],
    "PCREXR15" :[1.41, 0.914, 0.559, 0],
    "PCRSPRT15" :[0.0359, 0.0251, 0.0179, 0.00509],
    "PCSEBS15" :[0.0374, 0.0246, 0.0155, 0.000166],

    "VCRIMERT15" :[0.0454, 0.0183, 0.0111, 0],
    "VCER15" :[1.74, 0.704, 0.422, 0],
    "VCSR15" :[0.0359, 0.0251, 0.0179, 0.00509],
    "VCSEBS15" :[0.82, -0.326, -0.634, -1.1],

    "YPLL_rate" : [7882, 4825, 3467, 2390, 0],

    "Lit_Qrtl" : [3,2,1,0]

  },
  "Fisher" : {
    "COI_ct" : [],
  },
}


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
    state.shapeStore[state.Scale][state.activeLayer].resetStyle(e.target);
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
        mouseout: resetHighlightTract,
        dblclick: zoomToFeature
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


    // Data Dashboard Default -- when nothing is selected:
    document.getElementById("dataDashboard").innerHTML = '<h4>Statistics & Data Visuzalizations </h4>' +  (props ?
        '<b>' + props.COMMUNITY + ' (ID: ' + props.AREA_NUMBE + ')'
        : 'Get information about a specific areal unit (tract, zip, community) by hovering over it.') ;
};





// Data Dashboard when Hover is initiated
info.updateTract = function (props) {
    this._div.innerHTML = '<h4> ' +  (props ?
        '<b>' + '</h4>'
        : 'Hover over an area');

    document.getElementById("dataDashboard").innerHTML = '<h3>Statistics & Data Visuzalizations </h3>'
        + ' Information about each selected areal unit (tract, zip, or community) is shown here. <hr>' 
        +  (props ? '<p>'
        + ' <h5> Demographics Factors </h5> '   
        + ' Population in 2014: ' + props.Pop2014  + '<br>'  
        + ' 0-5 Years Pop %: ' + props.Less5_popP + '<br>'     
        + ' White %: ' + props.Wht14P + '<br>'
        + ' Black %: ' + props.Blk14P + '<br>'
        + ' Asian %: ' + props.AS14P + '<br>'               
        + ' Hispanic & Latino %: ' + props.Hisp14P + '<br>'
        + ' <h5> Socioeconomic Factors </h5> '     
        + ' Per Capita Income: $' + props.PerCInc14 + '<br>'             
        + ' Poverty %: ' + props.Pov14Prc + '<br>'
        + ' Childhood Poverty %: ' + props.ChldP_4Prc + '<br>'        
        + ' Unemployed (in 2014): ' + props.UNEMPP + '<br>'
        + ' Economic Hardship: ' + props.Hicat_ct + '<br>'
        + ' Childhood Opportunity: ' + props.COI_cat_ct + '<br>'       
        + ' Property Crime (Count): ' + props.Property_C + '<br>'  
        + ' Violent Crime (Count): ' + props.Violent_C + '<br>'  
        + ' Premature Mortality Rate: ' + props.YPLL_rate 

        






        : 'Hover over an area to get information about it.');



     /////////////////////////////////////////////////////
     // BAR Chart
     /////////////////////////////////////////////////////

    // Make sure to remove old chart before drawing new chart
    $(".chart").empty();

    var data = [];
    var features = state.shapeStore[state.Scale].geojson.features; // don't need attribute here
    var riskIndicators = ['COI_ct', 'HIS_ct'];
    // var height = 100;

    // $('.chart').height(riskIndicators.length * height);
    // Loop through risk indicators and generate a chart for each indicator
    for(var riskIndex = 0; riskIndex < riskIndicators.length; riskIndex++){

      var min = features[0].properties[riskIndicators[riskIndex]],
      max = features[0].properties[riskIndicators[riskIndex]];

      for (var i = 0; i < features.length; i++) {

        // Get COI value and store it in the data array
        value = features[i].properties[riskIndicators[riskIndex]];
        data.push(value);

        // Update min and max for x domain using value
        if(value < min)
          min = value;
        else if(value > max)
          max = value;
      };

      //var formatCount = d3.format(",.0f");

      var margin = {top: 10, right: 30, bottom: 30, left: 30},
      // Use chart class width to determine chart width
      width = $('.chart').width() - margin.left - margin.right,
      // Use 'Healthy Regions' container to determine height
      height = $('.chart').height() / riskIndicators.length - margin.top - margin.bottom;

      // Select Chart area and append svg with specified dims
      // and append the g to contain all elements shifted by margins
      var svg = d3.select(".chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
          .style("fill", function(d, i){return color(d3.mean(d));})
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

     /////////////////////////////////////////////////////
          
    }
};

info.addTo(map);


////////////////////////////////////////////////////////
// Parks Layer
////////////////////////////////////////////////////////


function loadClinics(){
L.geoJSON(".data/Clinics").addTo(map);
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
/////////////////////


var state = {
  Scale: "Tract",
  DataClassification: "CDPH",
  shapeLoaded: {
    "Tract" : [false, false],
    "Zipcode": [false, false],
    "CommArea" : [false, false]
  },
  shapeFiles: {
    "Tract" : "./data/ChiHealth_final",
    "Zipcode": "./data/CDPHTractsFinal_Clipped",
    "CommArea" : "./data/CommAreas"
  },
  shapeStore : {},
  activeLayer : ""
};


function load(attribute){
  if(!state.shapeLoaded[state.Scale][0]){
    // Need to add reading from geojson directly here.
    // tried shp -> $.getJSON but not reading, & no error.
    shp(state.shapeFiles[state.Scale]).then(function(geojson){
      state.shapeStore[state.Scale] = {};
      state.shapeStore[state.Scale][attribute] = {};
      state.shapeStore[state.Scale][attribute] = L.geoJson(geojson, 
      {
          style: featureStyle, 
          onEachFeature: onEachFeatureTract 

      }).addTo(map);
      state.shapeStore[state.Scale].geojson = geojson;
      state.shapeLoaded[state.Scale] = [true, true];
    });
  }
  else{
    if(state.shapeLoaded[state.Scale][1]){
      
      // reloadExistingLayers(state.shapeStore[state.Scale][attribute]);
      map.removeLayer(state.shapeStore[state.Scale][attribute]);

      state.shapeLoaded[state.Scale][1] = false;
    }
    else{
      if(!state.shapeStore[state.Scale][attribute]){
        state.shapeStore[state.Scale][attribute] = L.geoJson(state.shapeStore[state.Scale].geojson, 
        {
            style: featureStyle, 
            onEachFeature: onEachFeatureTract 

        }).addTo(map);
      }
      else{
        state.shapeStore[state.Scale][state.activeLayer].setStyle(featureStyle);
        state.shapeStore[state.Scale][attribute].addTo(map);
      }
      state.shapeLoaded[state.Scale][1] = true;
    }
  }

}

function color(a) {
  var colors = classColors[state.DataClassification][state.activeLayer],
  intervals = classIntervals[state.DataClassification][state.activeLayer];

  for(var i = 0; i < intervals.length; i++){
    if ( a > intervals[i] ) {
      return colors[i];
    } 
  }
  return colors[colors.length-1];
}

function featureStyle (feature) {
  return {
      fillColor: color(feature.properties[state.activeLayer]),
      weight: 1,
      opacity: 1,
      color: 'white',
      dashArray: '1',
      fillOpacity: 0.7
  };
}

function buttonClick(attribute) {

  // Adding a layer (No layers active)
  if(!state.activeLayer){
    state.activeButton = $('#' + attribute + '-button');
    state.activeLayer = attribute;
  }
  // Remove current layer and add new layer
  else if(state.activeLayer != attribute){
    // Remove current layer from map
    load(state.activeLayer);
    // map.removeLayer(state.shapeStore[state.Scale][state.activeLayer].layer)
    
    // Remove active state from button
    state.activeButton.removeClass('active');
    
    // Set current attribute as active layer
    state.activeLayer = attribute;
    state.activeButton = $('#' + attribute + '-button');
  }
  // Remove current layer
  else{
    state.activeLayer = '';
  }
  
  load(attribute);
}



/*function classifyData(DataClassification) {

  DataClassification = state.DataClassification
  state.DataClassification = newClassification


if(state.activeLayer != state.DataClassification){
  console.log("Not the Same ");

  // Remove current layer and add new layer with

    // Remove current layer from map
    load(state.activeLayer);

    // Change classification to button click


}
else {

  // Don't do anything. 
  console.log('Same ');
}
}*/

function classifyData(dataClassification) {

  if(dataClassification != state.DataClassification){
    state.DataClassification = dataClassification;
    console.log("Not the Same ");

    if(state.activeLayer != ''){
      state.shapeStore[state.Scale][state.activeLayer].setStyle(featureStyle);
    }

    // Remove current layer and add new layer with

      // Remove current layer from map
      // load(state.activeLayer);

      // Change classification to button click


  }
  else {

    // Don't do anything. 
    console.log('Same ');
  }
}

function changeScale(Scale) {

// 
if(Scale != state.Scale){
    // Check if scale request is different from existing
    console.log("Not the Same ");

    // Check to see if already loaded, then view
    if(state.activeLayer != ''){
      map.removeLayer(state.shapeStore[state.Scale][state.activeLayer]);
      state.shapeLoaded[state.Scale][1] = false;

      state.Scale = Scale;
      load(state.activeLayer)
    } 



    // Remove current layer and add new layer with




      // Remove current layer from map
      // load(state.activeLayer);

      // Change classification to button click
  }
  else {

    // Don't do anything. 
    console.log('Same ');
  }

}

function resetMapView(){
  map.setView([41.854501, -87.715496], 11)
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