// functions to determine colors
// Feng Wang 2015
var rgbStringToFloatArray = function(a) {
    var array = a.match(/\d+/g);
    var red = parseInt(array[0]);
    var green = parseInt(array[1]);
    var blue = parseInt(array[2]);
    
    var result = [];
    result[0] = red / 255.0;
    result[1] = green / 255.0;
    result[2] = blue / 255.0;
    
    if((red | green | blue) == 0) {
        result[3] = 0;
    } else {
        result[3] = 1.0;
    }
    
    return result;
};

var determineGLColor = function(data, result) {
    var color = 'rgb(140,150,198)';
    var array = rgbStringToFloatArray(color);
    var node_num = result.length / 4;
    for(i=0; i<node_num; ++i) {
        for(k=0; k<4; ++k) {
            result[i*4+k] = 0;
        }
    }
    for(i in data) {
        for(k=0; k<4; ++k) {
            result[data[i] *4+ k] = array[k];
        }
    }
};

(function (window, undefined) {
    var MapsLib = function (options) {

        
        var self = this;

        options = options || {};

        this.recordName = options.recordName || "result"; //for showing a count of results
        this.recordNamePlural = options.recordNamePlural || "results";
        this.searchRadius = options.searchRadius || 805; //in meters ~ 1/2 mile

        // the encrypted Table ID of your Fusion Table (found under File => About)
        this.fusionTableId = options.fusionTableId || "1S0RxiJ4dgV728CEOKGW-ZmCCoLxZAjGLq0tGkke4",
        //this.fusionTableId = options.povertyTableId || "15FyZq0hRcxUg9uCO_2DZm6vLvxKGpEwaMHs00lw",


        // Found at https://console.developers.google.com/
        // Important! this key is for demonstration purposes. please register your own.
        this.googleApiKey = options.googleApiKey || "AIzaSyBlElNqMWCzO_psyf0zwhumBViK6gRiMfY",
        
        // name of the location column in your Fusion Table.
        // NOTE: if your location column name has spaces in it, surround it with single quotes
        // example: locationColumn:     "'my location'",
        this.locationColumn = options.locationColumn || "geometry";
        
        // appends to all address searches if not present
        this.locationScope = options.locationScope || "";

        // zoom level when map is loaded (bigger is more zoomed in)
        this.defaultZoom = options.defaultZoom || 11; 

        // center that your map defaults to
        this.map_centroid = new google.maps.LatLng(options.map_center[0], options.map_center[1]);
        
        // marker image for your searched address
        if (typeof options.addrMarkerImage !== 'undefined') {
            if (options.addrMarkerImage != "")
                this.addrMarkerImage = options.addrMarkerImage;
            else
                this.addrMarkerImage = ""
        }
        else
            this.addrMarkerImage = "images/blue-pushpin.png"

        this.currentPinpoint = null;
        $("#result_count").html("");
        
        this.myOptions = {
            zoom: 11,
            center: this.map_centroid,
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        this.geocoder = new google.maps.Geocoder();
        this.map = new google.maps.Map($("#map_canvas")[0], this.myOptions);
        

        // maintains map centerpoint for responsive design
        google.maps.event.addDomListener(self.map, 'idle', function () {
            self.calculateCenter();
        });
        google.maps.event.addDomListener(window, 'resize', function () {
            self.map.setCenter(self.map_centroid);
        });
        self.searchrecords = null;

        //reset filters
        $("#search_address").val(self.convertToPlainString($.address.parameter('address')));
        var loadRadius = self.convertToPlainString($.address.parameter('radius'));
        if (loadRadius != "") 
            $("#search_radius").val(loadRadius);
        else 
            $("#search_radius").val(self.searchRadius);
        
        $(":checkbox").prop("checked", "checked");
        $("#result_box").hide();

        //-----custom initializers-----
        
        // initialize the WebGL layer on Google Maps
        {
            var update = function() {
                var width = this.canvas.width;
                var height = this.canvas.height;
                var nodes = this.nodes;
                var edges = this.edges;
                var proj = this.getProjection();
                var glNodes = this.glNodes;
                var gl = this.gl;
                var bounds = this.map.getBounds();
                var self = this;
                
                // pixel positions
                for(var i=0; i<nodes.length; ++i) {
                    if(bounds.contains(nodes[i])) {
                       var point = proj.fromLatLngToContainerPixel(nodes[i]);
                       var x = point.x;
                       var y = height - point.y;
                       x = (x * 2.0 - width) / width;
                       y = (y * 2.0 - height) / height;
                       glNodes[i] = [x,y];
                    } else {
                       glNodes[i] = [-2, -2];
                    }
                }

                var lineWidth = [3.0, 2.0];
                
                gl.viewport(0, 0, width, height);
                gl.clear(gl.COLOR_BUFFER_BIT);
                determineGLColor(self.enabledNodes, gl.nodeColorArray);

                for(var i=0; i<2; ++i) {
                    var vertex = [];
                    var color = [];
                    for(k=0; k<edges[i].length; k+=2) {
                        var start = edges[i][k];
                        var end = edges[i][k+1];
                        if(glNodes[start][0] < -1 || glNodes[end][0] < -1) {
                            continue;
                        }

                        vertex.push(glNodes[start][0]);
                        vertex.push(glNodes[start][1]);
                        vertex.push(glNodes[end][0]);
                        vertex.push(glNodes[end][1]);

                        color.push(gl.nodeColorArray[start*4+0]);
                        color.push(gl.nodeColorArray[start*4+1]);
                        color.push(gl.nodeColorArray[start*4+2]);
                        color.push(gl.nodeColorArray[start*4+3]);
                        color.push(gl.nodeColorArray[end*4+0]);
                        color.push(gl.nodeColorArray[end*4+1]);
                        color.push(gl.nodeColorArray[end*4+2]);
                        color.push(gl.nodeColorArray[end*4+3]);
                    }

                    gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer[i]);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.DYNAMIC_DRAW);
                    gl.enableVertexAttribArray(gl.positionLocation);
                    gl.vertexAttribPointer(gl.positionLocation, 2, gl.FLOAT, false, 0, 0);

                    gl.bindBuffer(gl.ARRAY_BUFFER, gl.colorBuffer[i]);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.DYNAMIC_DRAW);
                    gl.enableVertexAttribArray(gl.colorLocation);
                    gl.vertexAttribPointer(gl.colorLocation, 4, gl.FLOAT, false, 0, 0);

                    gl.lineWidth(lineWidth[i]);
                    gl.drawArrays(gl.LINES, 0, vertex.length / 2);
                }
            }
            var canvasLayerOptions = {
                map: self.map,
                resizeHandler: null,
                animate: false,
                updateHandler: update,
                resolutionScale: window.devicePixelRatio || 1
            };

            var canvasLayer = new GoogleCanvasLayer(canvasLayerOptions);
            // initialize the roads
            {
                var edges = [];
                var nodes = [];
                for(var i in roads.nodes) {
                    nodes[i] = new google.maps.LatLng(roads.nodes[i][0], roads.nodes[i][1]);
                }
                edges[0] = [];
                edges[1] = [];
                for(var i in roads.edges) { 
                    edge = roads.edges[i];
                    edges[edge[2]].push(edge[0]);
                    edges[edge[2]].push(edge[1]);
                }
                canvasLayer.edges = edges;
                canvasLayer.nodes = nodes;
                canvasLayer.glNodes = [];
            }

            var canvas = canvasLayer.canvas;
            var gl = canvas.getContext("experimental-webgl", {depth:false, alpha:true, antialias: false});
            var vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
            var fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader-gradient");

            var program = createProgram(gl, [vertexShader, fragmentShader]);
            gl.useProgram(program);

            gl.positionLocation = gl.getAttribLocation(program, "vertex_position");
            gl.colorLocation = gl.getAttribLocation(program, "vertex_color");
            gl.vertexBuffer = [];
            gl.colorBuffer = [];

            for(var i=0; i<2; ++i) {
                gl.vertexBuffer[i] = gl.createBuffer();
                gl.colorBuffer[i] = gl.createBuffer();
            }

            canvasLayer.enabledNodes = [];
            gl.nodeColorArray = [];
            for(var i=0; i<roads.nodes.length; ++i) {
                for(var k=0; k<4; ++k) {
                    gl.nodeColorArray.push(0);
                }
            }
            canvasLayer.gl = gl;
            self.roadnetworkLayer = canvasLayer;
        }


        //////////////////////////////////////////////////////////////////////
        // Test GeoJSON layer
        // https://developers.google.com/maps/documentation/javascript/datalayer
        // Array reading in de-bugging console, but not visualizing. 
        //////////////////////////////////////////////////////////////////////
        
        shp("./data/City_Boundary").then(function(geojson) {
            //do something with your geojson
            console.log(geojson);   // DEBUGGING
            // google map do not support multipolygon directly, so we need to 
            // hack the features 
            var expandedGeoJson = {
                type: geojson.type,

                features: []
            };



            for(var i in geojson.features) {
                var feature = geojson.features[i];
                switch(feature.geometry.type) {
                case "Polygon":
                    expandedGeoJson.features.push(feature);
                    break;
                case "MultiPolygon":
                    for(var k in feature.geometry.coordinates) {
                        var polygon = {
                            type: "Feature",
                            properties: feature.properties,

                            geometry: {
                                type: "Polygon",
                                coordinates: feature.geometry.coordinates[k]
                            },
                            bbox: feature.geometry.bbox
                        };


                        expandedGeoJson.features.push(polygon);
                    }
                    break;
                }
            }

            self.map.data.addGeoJson(expandedGeoJson);
            self.map.data.setStyle(function(feature) {
            var color = 'gray';
            var zIndex = 100;
            if (feature.getProperty('isColorful')) {
              color = feature.getProperty('color');
            }
            return /** @type {google.maps.Data.StyleOptions} */({
              fillColor: color,
              strokeColor: color,
              strokeWeight: 2
            });
          });

          // When the user clicks, set 'isColorful', changing the color of the letters.
          map.data.addListener('click', function(event) {
            event.feature.setProperty('isColorful', true);
          });


        });

            //map.data.loadData(geojson); 

          $("#text_search").val("");
        
        //////////////////////////////////////////////////////////////////////
        // Test KML/Fusion Layer
        // Using a poverty table -- WORKS but the points don't layer on top!!
        // Must also turn on MapsLib.povertyTableID at beginning
        //////////////////////////////////////////////////////////////////////
        //MapsLib.poverty = new google.maps.FusionTablesLayer({
        //query: {from:   MapsLib.povertyTableId, select: "geometry"}
        //});



        //-----end of custom initializers-----

        //run the default search when page loads
        self.doSearch();
        if (options.callback) options.callback(self);
    };

    //-----custom functions-----

    

    //-----end of custom functions-----

    MapsLib.prototype.submitSearch = function (whereClause, map) {
        var self = this;
        //get using all filters
        //NOTE: styleId and templateId are recently added attributes to load custom marker styles and info windows
        //you can find your Ids inside the link generated by the 'Publish' option in Fusion Tables
        //for more details, see https://developers.google.com/fusiontables/docs/v1/using#WorkingStyles
        self.searchrecords = new google.maps.FusionTablesLayer({
            query: {
                from: self.fusionTableId,
                select: self.locationColumn,
                where: whereClause
            },
            styles:[{
                markerOptions: {
                    zIndex: 100,
                    label: "blah",
                    title: "blah",
                    fillColor: "blue"
                }
            }],
            styleId: 2,
            templateId: 2
        });
        self.fusionTable = self.searchrecords;
        self.searchrecords.setMap(map);
        self.getCount(whereClause);
    };


    MapsLib.prototype.getgeoCondition = function (address, callback) {
        var self = this;
        if (address !== "") {
            if (address.toLowerCase().indexOf(self.locationScope) === -1) {
                address = address + " " + self.locationScope;
            }
            self.geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    self.currentPinpoint = results[0].geometry.location;
                    var map = self.map;

                    $.address.parameter('address', encodeURIComponent(address));
                    $.address.parameter('radius', encodeURIComponent(self.searchRadius));
                    map.setCenter(self.currentPinpoint);
                    // set zoom level based on search radius
                    if (self.searchRadius >= 1610000) map.setZoom(4); // 1,000 miles
                    else if (self.searchRadius >= 805000) map.setZoom(5); // 500 miles
                    else if (self.searchRadius >= 402500) map.setZoom(6); // 250 miles
                    else if (self.searchRadius >= 161000) map.setZoom(7); // 100 miles
                    else if (self.searchRadius >= 80500) map.setZoom(8); // 100 miles
                    else if (self.searchRadius >= 40250) map.setZoom(9); // 100 miles
                    else if (self.searchRadius >= 16100) map.setZoom(11); // 10 miles
                    else if (self.searchRadius >= 8050) map.setZoom(12); // 5 miles
                    else if (self.searchRadius >= 3220) map.setZoom(13); // 2 miles
                    else if (self.searchRadius >= 1610) map.setZoom(14); // 1 mile
                    else if (self.searchRadius >= 805) map.setZoom(15); // 1/2 mile
                    else if (self.searchRadius >= 400) map.setZoom(16); // 1/4 mile
                    else self.map.setZoom(17);

                    if (self.addrMarkerImage != '') {
                        self.addrMarker = new google.maps.Marker({
                            position: self.currentPinpoint,
                            map: self.map,
                            icon: self.addrMarkerImage,
                            animation: google.maps.Animation.DROP,
                            title: address
                        });
                    }
                    var geoCondition = " AND ST_INTERSECTS(" + self.locationColumn + ", CIRCLE(LATLNG" + self.currentPinpoint.toString() + "," + self.searchRadius + "))";
                    callback(geoCondition);
                    self.drawSearchRadiusCircle(self.currentPinpoint);
                } else {
                    alert("We could not find your address: " + status);
                    callback('');
                }
            });
        } else {
            callback('');
        }
    };

    MapsLib.prototype.doSearch = function () {
        var self = this;
        self.clearSearch();
        var address = $("#search_address").val();
        self.searchRadius = $("#search_radius").val();
        self.whereClause = self.locationColumn + " not equal to ''";
        
        //-----custom filters-----
        
        //Customized search by checkbox, connected with index.html

        var type_column = "'Type'";
        var searchType = type_column + " IN (-1,";
        if ( $("#cbType1").is(':checked')) searchType += "1,";
        if ( $("#cbType2").is(':checked')) searchType += "2,";
        if ( $("#cbType3").is(':checked')) searchType += "3,";
        if ( $("#cbType4").is(':checked')) searchType += "4,";
        if ( $("#cbType5").is(':checked')) searchType += "5,";

        self.whereClause += " AND " + searchType.slice(0, searchType.length - 1) + ")";
    
        //Customized search by text, connected with index.html and custom initializaters.


        var text_search = $("#text_search").val().replace("'", "\\'");
        if (text_search != '')
          self.whereClause += " AND 'Facility' contains ignoring case '" + text_search + "'";




        //-----end of custom filters-----

        self.getgeoCondition(address, function (geoCondition) {
            self.whereClause += geoCondition;
            self.submitSearch(self.whereClause, self.map);
        });

    };

    MapsLib.prototype.reset = function () {
        $.address.parameter('address','');
        $.address.parameter('radius','');
        window.location.reload();
    };


    MapsLib.prototype.getInfo = function (callback) {
        var self = this;
        jQuery.ajax({
            url: 'https://www.googleapis.com/fusiontables/v1/tables/' + self.fusionTableId + '?key=' + self.googleApiKey,
            dataType: 'json'
        }).done(function (response) {
            if (callback) callback(response);
        });
    };

    MapsLib.prototype.addrFromLatLng = function (latLngPoint) {
        var self = this;
        self.geocoder.geocode({
            'latLng': latLngPoint
        }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    $('#search_address').val(results[1].formatted_address);
                    $('.hint').focus();
                    self.doSearch();
                }
            } else {
                alert("Geocoder failed due to: " + status);
            }
        });
    };

    MapsLib.prototype.drawSearchRadiusCircle = function (point) {
        var self = this;
        var circleOptions = {
            strokeColor: "#4b58a6",
            strokeOpacity: 0.3,
            strokeWeight: 1,
            fillColor: "#4b58a6",
            fillOpacity: 0.10,
            map: self.map,
            center: point,
            clickable: false,
            zIndex: -1,
            radius: parseInt(self.searchRadius)
        };
        self.searchRadiusCircle = new google.maps.Circle(circleOptions);
    };

    MapsLib.prototype.query = function (query_opts, callback) {
        var queryStr = [],
            self = this;
        queryStr.push("SELECT " + query_opts.select);
        queryStr.push(" FROM " + self.fusionTableId);
        // where, group and order clauses are optional
        if (query_opts.where && query_opts.where != "") {
            queryStr.push(" WHERE " + query_opts.where);
        }
        if (query_opts.groupBy && query_opts.roupBy != "") {
            queryStr.push(" GROUP BY " + query_opts.groupBy);
        }
        if (query_opts.orderBy && query_opts.orderBy != "") {
            queryStr.push(" ORDER BY " + query_opts.orderBy);
        }
        if (query_opts.offset && query_opts.offset !== "") {
            queryStr.push(" OFFSET " + query_opts.offset);
        }
        if (query_opts.limit && query_opts.limit !== "") {
            queryStr.push(" LIMIT " + query_opts.limit);
        }
        var theurl = {
            base: "https://www.googleapis.com/fusiontables/v1/query?sql=",
            queryStr: queryStr,
            key: self.googleApiKey
        };
        $.ajax({
            url: [theurl.base, encodeURIComponent(theurl.queryStr.join(" ")), "&key=", theurl.key].join(''),
            dataType: "json"
        }).done(function (response) {
            //console.log(response);
            if (callback) callback(response);
        }).fail(function(response) {
            self.handleError(response);
        });
    };

    MapsLib.prototype.handleError = function (json) {
        if (json.error !== undefined) {
            var error = json.responseJSON.error.errors;
            console.log("Error in Fusion Table call!");
            for (var row in error) {
                console.log(" Domain: " + error[row].domain);
                console.log(" Reason: " + error[row].reason);
                console.log(" Message: " + error[row].message);
            }
        }
    };
    MapsLib.prototype.getCount = function (whereClause) {
        var self = this;
        var selectColumns = "Count()";
        self.query({
            select: selectColumns,
            where: whereClause
        }, function (json) {
            self.displaySearchCount(json);
        });
    };

    MapsLib.prototype.displaySearchCount = function (json) {
        var self = this;
        
        var numRows = 0;
        if (json["rows"] != null) {
            numRows = json["rows"][0];
        }
        var name = self.recordNamePlural;
        if (numRows == 1) {
            name = self.recordName;
        }
        $("#result_box").fadeOut(function () {
            $("#result_count").html(self.addCommas(numRows) + " " + name + " found");
        });
        $("#result_box").fadeIn();
    };

    MapsLib.prototype.addCommas = function (nStr) {
        nStr += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    };

    // maintains map centerpoint for responsive design
    MapsLib.prototype.calculateCenter = function () {
        var self = this;
        center = self.map.getCenter();
    };

    //converts a slug or query string in to readable text
    MapsLib.prototype.convertToPlainString = function (text) {
        if (text === undefined) return '';
        return decodeURIComponent(text);
    };

    MapsLib.prototype.clearSearch = function () {
        var self = this;
        if (self.searchrecords && self.searchrecords.getMap) 
            self.searchrecords.setMap(null);
        if (self.addrMarker && self.addrMarker.getMap) 
            self.addrMarker.setMap(null);
        if (self.searchRadiusCircle && self.searchRadiusCircle.getMap) 
            self.searchRadiusCircle.setMap(null);
    };

    MapsLib.prototype.findMe = function () {
        var self = this;
        var foundLocation;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var accuracy = position.coords.accuracy;
                var coords = new google.maps.LatLng(latitude, longitude);
                self.map.panTo(coords);
                self.addrFromLatLng(coords);
                self.map.setZoom(14);
                jQuery('#map_canvas').append('<div id="myposition"><i class="fontello-target"></i></div>');
                setTimeout(function () {
                    jQuery('#myposition').remove();
                }, 3000);
            }, function error(msg) {
                alert('Please enable your GPS position future.');
            }, {
                //maximumAge: 600000,
                //timeout: 5000,
                enableHighAccuracy: true
            });
        } else {
            alert("Geolocation API is not supported in your browser.");
        }
    };

    MapsLib.prototype.queryNetworkServer = function(metric, categories, points, radius) {
        var self = this;
        if(metric == 'time') {
            radius *= 60;
        }
        var serviceRequestData = {
            points: points,
            range: radius,
            categories: categories
        };

        $.ajax({
            url: "http://vaderserver0.cidse.dhcp.asu.edu:8181/api/" + metric,
            method: "POST",
            dataType: "json",
            jsonp: false,
            data: JSON.stringify(serviceRequestData),
            success: function(json) {
                self.roadnetworkLayer.enabledNodes = [];
                for(var i in json.result) {
                    for(var k in json.result[i]) {
                        for(var x in json.result[i][k]) {
                            self.roadnetworkLayer.enabledNodes.push(json.result[i][k][x]);
                        }
                    }
                }
                self.roadnetworkLayer.scheduleUpdate();
            }
        });
    }

    MapsLib.prototype.queryNetwork = function(metric, categories, radius) {
        var self = this;
        if(categories.length == 0) {
            this.enabledNodes = [];
            this.roadnetworkLayer.scheduleUpdate();
            return;
        }

        var sql = "SELECT 'Facility' as Facility, 'Geometry' as Location, 'Type' as Type FROM 1S0RxiJ4dgV728CEOKGW-ZmCCoLxZAjGLq0tGkke4 where Type IN (" + categories[0];
        for(var i=1; i<categories.length; ++i) {
            sql += "," + categories[i];
        }
        sql += ")";
        $.ajax({
            url: "https://www.googleapis.com/fusiontables/v2/query?callback=?",
            method: "GET",
            dataType: "jsonp",
            data: {
                sql: sql,
                key: "AIzaSyBlElNqMWCzO_psyf0zwhumBViK6gRiMfY"
            },
            success: function(data) {
                var coordinates = [];
                for(var i in categories) {
                    coordinates[i] = [];
                }
                for(var i = 0; i<50; ++i) {
                    var str = data.rows[i][1];
                    var type = data.rows[i][2];
                    var typeIndex = 0;
                    for(; typeIndex < categories; ++typeIndex) {
                        if(type == categories[typeIndex]) {
                          break;
                        }
                    }
                    // remove ()
                    str = str.substr(1);
                    str = str.substr(0, str.length - 1);
                    var index = str.indexOf(", ");

                    var lat = parseFloat(str.substr(0, index));
                    var lng = parseFloat(str.substr(index+2));
                    coordinates[typeIndex].push([lng, lat]);
                }
                self.queryNetworkServer(metric, categories, coordinates, radius);
            }
        });
    }
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = MapsLib;
    } else if (typeof define === 'function' && define.amd) {
        define(function () {
            return MapsLib;
        });
    } else {
        window.MapsLib = MapsLib;
    }

})(window);
