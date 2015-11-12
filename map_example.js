var nodes;
var edges;
var map;
var node_num;
function rgbStringToFloatArray(a) {
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
}

function determineGLColor(data, result) {
    var color = 'rgb(0, 0, 255)';
    var array = rgbStringToFloatArray(color);
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
}

$(document).ready(function() {
//create the map
        map = L.map('map').setView([41.8369, -87.6847], 12);
        L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 15,
            minZoom: 9
        }).addTo(map);
        
        //preprocess the nodes
        edges = [];
        nodes = roads.nodes;
        edges[0] = [];
        edges[1] = [];
        for(var i in roads.edges) {
            var edge = roads.edges[i];
            edges[edge[2]].push(edge[0]);
            edges[edge[2]].push(edge[1]);
        }
        node_num = nodes.length;

        $.ajax({
            url: "https://www.googleapis.com/fusiontables/v2/query?callback=?",
            method: "GET",
            dataType: "jsonp",
            data: {
                sql: "SELECT 'Facility' as Facility, 'Geometry' as Location, 'Type' as Type FROM 1S0RxiJ4dgV728CEOKGW-ZmCCoLxZAjGLq0tGkke4 where Type=5",
                key: "AIzaSyBlElNqMWCzO_psyf0zwhumBViK6gRiMfY"
            },
            success: function (data) {
                var categories = [5];
                var coordinates = [];
                for(i in data.rows) {
                    str = data.rows[i][1];
                    // remove ()
                    str = str.substr(1);
                    str = str.substr(0, str.length - 1);
                    index = str.indexOf(", ");

                    lat = parseFloat(str.substr(0, index));
                    lng = parseFloat(str.substr(index+2));
                    coordinates.push([lng, lat]);
                }
                coordinates = [coordinates];
                var serviceRequestData = {
                    points: coordinates,
                    range: 60*5,
                    categories: categories
                };
                console.log(serviceRequestData);

                $.ajax({
                    url: "http://vaderserver0.cidse.dhcp.asu.edu:8181/api/time",
                    method: "POST",
                    dataType: "json",
                    jsonp: false,
                    data: JSON.stringify(serviceRequestData),
                    success: function(json) {
                        // prepare the canvas
                        var southWest, northEast;
                        var southWestPoint, northEastPoint;
                        var bounds = map.getBounds();
                        southWest = bounds.getSouthWest();
                        northEast = bounds.getNorthEast();
                
                        southWestPoint = map.latLngToLayerPoint(southWest);
                        northEastPoint = map.latLngToLayerPoint(northEast);
                        width = northEastPoint.x - southWestPoint.x;
                        height = southWestPoint.y - northEastPoint.y;
                
                        var overlay = new L.ImageOverlay('', new L.LatLngBounds(southWest, northEast), {
                            pacity: 0.9,
                            interactive: true,
                            zIndexOffset: 999
                        });
                        map.addLayer(overlay);

                        var canvas = document.createElement('canvas');
                        $(canvas).attr("style", $(overlay._image).attr("style"));
                        $(canvas).css({position: 'absolute'});

                        canvas.width = width;
                        canvas.height = height;

                        overlay._image.parentElement.replaceChild(canvas, overlay._image);
                        overlay._image = canvas;
                        var gl = canvas.getContext("webgl", {depth:false, alpha:true, antialias: false});

                        var glNodes = [];
                        for(var i=0; i<nodes.length; ++i) {
                            var point = map.latLngToLayerPoint(nodes[i]);
                            var x = point.x - southWestPoint.x;
                            var y = southWestPoint.y - point.y;
                            x = (x * 2.0 - width) / width;
                            y = (y * 2.0 - height) / height;
                            glNodes.push([x, y]);
                        }

                        // draw the map
                        var vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader");
                        var fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader-gradient");

                        var program = createProgram(gl, [vertexShader, fragmentShader]);
                        gl.useProgram(program);

                        var positionLocation = gl.getAttribLocation(program, "vertex_position");
                        var colorLocation = gl.getAttribLocation(program, "vertex_color");

                        var vertexBuffer = [];
                        var colorBuffer = [];
                        for(var i=0; i<2; ++i) {
                            vertexBuffer[i] = null;
                            colorBuffer[i] = null;
                        }
                        var lineWidth = [6.0, 5.0];
                        var nodeColorArray = [];
                        L.marker([json.points[0][0][1], json.points[0][0][0]]).addTo(map);
                        determineGLColor(json.result[0][0], nodeColorArray);

                        for(var i=0; i<2; ++i) {
                            var vertex = [];
                            var color = [];
                            for(var k=0; k<edges[i].length; k+=2) {
                                var start = edges[i][k];
                                var end = edges[i][k+1];
                        
                                vertex.push(glNodes[start][0]);
                                vertex.push(glNodes[start][1]);
                                vertex.push(glNodes[end][0]);
                                vertex.push(glNodes[end][1]);

                                color.push(nodeColorArray[start*4+0]);
                                color.push(nodeColorArray[start*4+1]);
                                color.push(nodeColorArray[start*4+2]);
                                color.push(nodeColorArray[start*4+3]);
                                color.push(nodeColorArray[end*4+0]);
                                color.push(nodeColorArray[end*4+1]);
                                color.push(nodeColorArray[end*4+2]);
                                color.push(nodeColorArray[end*4+3]);
                            }

                            vertexBuffer[i] = gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer[i]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);
                            gl.enableVertexAttribArray(positionLocation);
                            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

                            colorBuffer[i] = gl.createBuffer();
                            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer[i]);
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.DYNAMIC_DRAW);
                            gl.enableVertexAttribArray(colorLocation);
                            gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

                            gl.lineWidth(lineWidth[i]);
                            gl.drawArrays(gl.LINES, 0, edges[i].length);
                        }
                    }
                });
            }
        })
});
