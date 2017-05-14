/* JS for GEOG 575 Final Project by Bob Cowling */

//function to instantiate the Leaflet map
function createMap(){
    //create the map
    var map = L.map('mapid', {
        center: [39.3293674, -95.8038467],
        zoom: 5        
    });

    
    //add dark tileset from Carto
    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      attribution: 'Dark matter'
    }).addTo(map);
        
    
    //call getData function    
    getData(map);    
    getSightings(map);                    
};    
    
    
// build an attributes array from the data ** pop must be changed to new data field values
function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("Count") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
    
    
};

//Add circle markers for point features to the map
function createPropSymbols(data, map, attributes){
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
    }).addTo(map);
    
   
};

function createPopup(properties, attribute, layer, radius){
    
   
    //add city to popup content string
    var popupContent = "<p><b>City:</b> " + properties.state + "</p>";

    //add formatted attribute to panel content string
    var month = attribute.split("_")[1];
    popupContent += "<p><b>Sightings in " + month + ":</b> " + properties[attribute] + " million</p>";

    //replace the layer popup
    layer.bindPopup(popupContent, {
        offset: new L.Point(0,-radius)
    });
};

function Popup(properties, attribute, layer, radius){
    
    this.properties = properties;
    this.attribute = attribute;
    this.layer = layer;
    this.month = attribute.split("_")[1];
    this.sightings = this.properties[attribute];
    this.content = "<p><b>City:</b> " + this.properties.State + "</p><p><b>Sightings in " + this.month + ":</b> " + this.sightings;
    this.div = $('<div class="popupGraph" style="width: 300px; height:200px;"><svg/></div>')[0];
    
    console.log(attribute);
			
			var popup = L.popup().setContent(this.div);
			layer.bindPopup(popup);
            
            var values = this.properties
            
                
            if (attribute == "Count_Q1"){
            var data = [
                {name:"Fireball ",value:values["fireball_q1"]},
                {name:"Disk ",value:values["disk_q1"]},
                {name:"Light ",value:values["light_q1"]},
                {name:"Circle ",value:values["circle_q1"]},
                {name:"Triangle ",value:values["triangle_q1"]}                  
            ];
            } else if (attribute == "Count_Q2") {
                 var data = [
                {name:"Fireball",value:values["fireball_q2"]},
                {name:"Disk",value:values["disk_q2"]},
                {name:"Light",value:values["light_q2"]},
                {name:"Circle",value:values["circle_q2"]},
                {name:"Triangle",value:values["triangle_q2"]}               
            ];
              } else if (attribute == "Count_Q3") {
                 var data = [
                {name:"Fireball",value:values["fireball_q3"]},
                {name:"Disk",value:values["disk_q3"]},
                {name:"Light",value:values["light_q3"]},
                {name:"Circle",value:values["circle_q3"]},
                {name:"Triangle",value:values["triangle_q3"]}               
            ];
              } else if (attribute == "Count_Q4") {
                 var data = [
                {name:"Fireball",value:values["fireball_q4"]},
                {name:"Disk",value:values["disk_q4"]},
                {name:"Light",value:values["light_q4"]},
                {name:"Circle",value:values["circle_q4"]},
                {name:"Triangle",value:values["triangle_q4"]}               
            ];
               
               } else if (attribute == "Count_15") {
                 var data = [
                {name:"Fireball",value:values["fireball_year"]},
                {name:"Disk",value:values["disk_year"]},
                {name:"Light",value:values["light_year"]},
                {name:"Circle",value:values["circle_year"]},
                {name:"Triangle",value:values["triangle_year"]}               
            ];
                   
            };

            var margin = {top: 20, right: 30, bottom: 40, left: 55},
                width = 250 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom,
                barHeight = height / data.length;
      

            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d){return d.value;})])                
                .range([0, width])
                .nice();
            
            var xAxis = d3.svg.axis()
                .scale(x)                
                .tickFormat(d3.format("d"))
                .ticks(data.length)                
                .orient("bottom");
    
			var svg = d3.select(this.div).select("svg")
			    .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
              .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .classed("chart", true);
            
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
    
            
           
            var bar = svg.selectAll("g.bar")
                .data(data)
                .enter()
              .append("g")
                .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
            
            bar.append("rect")
                .attr("width", function(d){return x(d.value);})
                .attr("height", barHeight - 1);
            
            bar.append("text")
                .attr("x", -1)
                .attr("y", barHeight / 2)
                .attr("dy", ".35em")
                .text(function(d) { return d.name; });
        
            svg.append("text")
            .attr("x", 180)
            .attr("y", -10)
            .style("fill", "#39FF14")
            .text(this.properties.State + ":" + " Sightings in " + this.month + ": " + this.sightings);
    
            this.bindToLayer = function(){
                this.layer.bindPopup(this.div, {
                    offset: new L.Point(0,-radius)
        });
    };
};

//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes, properties){
    //Determine which attribute to visualize with proportional symbols
      var attribute = attributes[0];   

    //create marker options
    var options = {
        fillColor: "#39FF14",
        color: "#006400",
        weight: 1,
        opacity: 1,
        fillOpacity: .9
        
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);

    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);

    //create circle marker layer
    var layer = L.circleMarker(latlng, options);     
      
    //create new popup
    var popup = new Popup(feature.properties, attribute, layer, options.radius); 
    
    //change the content
    popup.content;

    //add popup to circle marker
    popup.bindToLayer();
    
    popup.div;


    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    
    //scale factor to adjust symbol size evenly
    var scaleFactor = 50;
    //area based on attribute value and scale factor
    var area = attValue * scaleFactor;
    //radius calculated based on area
    var radius = Math.sqrt(area/Math.PI);

    return radius;
};

//Resize proportional symbols according to new attribute values
function updatePropSymbols(map, attribute){   
    
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;           
 
            //update each feature's radius based on new attribute values            
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);
            
            //create a new popup
            var popup = new Popup(props, attribute, layer, radius);
            
            //change the content
            popup.div;

            //add popup to circle marker
            popup.bindToLayer();     
            
        };
        });    
             //update the legend
            updateLegend(map, attribute);
    };


//Create new sequence controls
function createSequenceControls(map, attributes){    
    //Step 5: click listener for buttons
    $('.skip').click(function(){
         //get the old index value
        var index = $('.range-slider').val();

        //Step 6: increment or decrement depending on button clicked
        if ($(this).attr('id') == 'forward'){
            index++;
            //Step 7: if past the last attribute, wrap around to first attribute
            index = index > 4 ? 0 : index;
        } else if ($(this).attr('id') == 'reverse'){
            index--;
            //Step 7: if past the first attribute, wrap around to last attribute
            index = index < 0 ? 4 : index;
        };
        
        //update slider
        $('.range-slider').val(index);
          
        updatePropSymbols(map, attributes[index]);
     
    });
    
    
    //input listener for slider
    $('.range-slider').on('input', function(){
        var index = $(this).val();
        updatePropSymbols(map, attributes[index]);
    });
    
    //set slider attributes
    $('.range-slider').attr({
        max: 4,
        min: 0,
        value: 0,
        step: 1
    });  
    
    $('#temporal-legend').text(this.value);
};

//Calculate the max, mean, and min values for a given attribute
function getCircleValues(map, attribute){
    //start with min at highest possible and max at lowest possible number
    var min = Infinity,
        max = -Infinity;

    map.eachLayer(function(layer){
        //get the attribute value
        if (layer.feature){
            var attributeValue = Number(layer.feature.properties[attribute]);
            // if the user presses play remove the layer from the map
            $("#play").click(function(){
            map.removeLayer(layer);
            });
            // if the user pressed stop add the layer back to the map
            $("#stop").click(function(){
            map.addLayer(layer);
            });

            //test for min
            if (attributeValue < min){
                min = attributeValue;
            };

            //test for max
            if (attributeValue > max){
                max = attributeValue;
            };
        };
    });

    //set mean
    var mean = (max + min) / 2;

    //return values as an object
    return {
        max: max,
        mean: mean,
        min: min
    };       
};

//Update the legend with new attribute
function updateLegend(map, attribute){
    //create content for legend
    var month = attribute.split("_")[1];
    var content = "Sightings in " + month;

    //replace legend content
    $('#info').html(content);
    
    //get the max, mean, and min values as an object
    var circleValues = getCircleValues(map, attribute);
    
    for (var key in circleValues){
        //get the radius
        var radius = calcPropRadius(circleValues[key]);

        //assign the cy and r attributes
        $('#'+key).attr({
            cy: 59 - radius,
            r: radius
        });
        
         //Step 4: add legend text
        $('#'+key+'-text').text(Math.round(circleValues[key]*100)/100);
    };
};

//Example 2.7 line 1...function to create the legend
function createLegend(map, attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function (map) {
           // create the control container with a particular class name
           var container = L.DomUtil.create('div', 'legend-control-container');

           //add temporal legend div to container
           $(container).append('<div id="temporal-legend">')

           //Example 3.5 line 15...Step 1: start attribute legend svg string
           var svg = '<svg id="attribute-legend" width="160px" height="300px">';

            var circles = {
            max: 20,
            mean: 40,
            min: 60
        };
            
      /*   //loop to add each circle and text to svg string
        for (var circle in circles){
            //circle string
            svg += '<circle class="legend-circle" id="' + circle + '" cx="80" cy="80" fill="#F47821" fill-opacity="1" stroke="#000000"  />';

            //text string
            svg += '<text id="' + circle + '-text" x="90" y="' + circles[circle] + '"></text>';
        };
            
          //Step 2: loop to add each circle and text to svg string
          for (var i=0; i<circles.length; i++){
          //circle string
          svg += '<circle class="legend-circle" id="' + circles[i] + 
          '" fill="#F47821" fill-opacity="0.8" stroke="#000000" cx="60 cy="80" />';
          //text string
          svg += '<text id="' + circles[i] + '-text" x="" y="80"></text>';      
    };

        //close svg string
        svg += "</svg>";

        //add attribute legend svg to container
        $(container).append(svg);*/

        return container;
        }
    });

    map.addControl(new LegendControl());

    updateLegend(map, attributes[0]);
};

function getSightings(map) {
    
    //$('#play').html('<img src="img/play.png" height="30.75" width="30.75">');
   var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            // create the control container div with a particular class name
            var container = L.DomUtil.create('div', 'sequence-control-container');

             //create range input element (slider)
            $(container).append('<input class="range-slider" type="range">');
           
                     
             //add skip buttons
            $(container).append('<button class="skip" id="reverse" title="Reverse">Reverse</button>');
            $(container).append('<button class="skip" id="forward" title="Forward">Skip</button>');
            $(container).append('<button class="play" id="play" title="Play">Play</button>');
            $(container).append('<button class="pause" id="pause" title="Pause">Pause</button>');
            $(container).append('<button class="stop" id="stop" title="Stop">Stop</button>');
            $(container).append('<span class="note" id="info"</span>');
            
            
             //kill any mouse event listeners on the map
            $(container).on('mousedown dblclick', function(e){
                L.DomEvent.stopPropagation(e);
            });
            
            return container;
        }
       });
           map.addControl(new SequenceControl()); 
    //create range input element (slider)
    //$('#panel').append('<input class="range-slider" type="range">');
   //create buttons for the slider
    //$('#panel').append('<button class="skip" id="reverse">Reverse</button>');
    //$('#panel').append('<button class="skip" id="forward">Skip</button>');
    //replace button content with images
    $('#reverse').html('<img src="img/reverse.png" height="33" width="59">');
    $('#forward').html('<img src="img/forward.png" height="33" width="59">');
    $('#play').html('<img src="img/play.png" height="30.75" width="30.75">');
    $('#pause').html('<img src="img/pause2.png" height="30.75" width="30.75">');
    $('#stop').html('<img src="img/stop.png" height="29.75" width="29.75">');
    
      var CARTOCSS = [
  
          'Map {',
          '-torque-time-attribute: "date_time";',
          '-torque-aggregation-function: "count(cartodb_id)";',
          '-torque-frame-count: 760;',
          '-torque-animation-duration: 15;',
          '-torque-resolution: 2',
          '}',
          '#layer {',
  'marker-width: 5;',
  'marker-fill: #3cff00;',
  'marker-fill-opacity: 0.9;',
  'marker-line-width: 1;',
  'marker-line-color: #FFF;',
  'marker-line-opacity: 1;',
  'comp-op: lighter;',
'}',
'#layer[frame-offset=1] {',
  'marker-width: 13;',
  'marker-fill-opacity: .9;',
'}',
'#layer[frame-offset=2] {',
  'marker-width: 15;',
  'marker-fill-opacity: .8;',
'}',
'#layer[frame-offset=3] {',
  'marker-width: 17;',
  'marker-fill-opacity: .7;',
'}',
'#layer[frame-offset=4] {',
  'marker-width: 19;',
  'marker-fill-opacity: .6;',
'}'
      ].join('\n');
   
  var torqueLayer = new L.TorqueLayer({
    user       : 'wesweaver',
    table      : 'ufo_sightings_2015',
    zIndex: 100,
    cartocss: CARTOCSS,
    type: torque  
  });
  torqueLayer.error(function(err){
    for(error in err){
      console.warn(err[error]);
    }
  });
  
  var time = torqueLayer.getStep();

var torqueTime = $('#torque-time');
    $("#torque-slider").slider({
        min: 0,
        max: torqueLayer.options.steps,
        value: 0,
        step: 1,
        slide: function(event, ui){
          var step = ui.value;
          torqueLayer.setStep(step);
        }
    });
    
var torqueTime = $('#torque-time');
   torqueLayer.on('change:time', function(changes) {
  $("#torque-slider" ).slider({ value: changes.step });
  var month_year = changes.time.toString().substr(4).split(' ');
  torqueTime.text(month_year[0] + " - " + month_year[2]);
  $("#display-msg2").show();       
});


    
$("#pause").click(function(){
    torqueLayer.pause();
});

$('#play').click(function(){
    torqueLayer.addTo(map);
    torqueLayer.play();
    $("#torque-time").show();
    $("#info").hide();   
    $("#display-msg1").hide();
    
});
    
$('#stop').click(function(){
    torqueLayer.stop();
    torqueLayer.remove();
    $("#torque-time").hide();
    $("#info").show();
    $("#display-msg2").hide();
    $("#display-msg1").show();
});    


}

function clearLayer(map, attribute) {
    map.eachLayer(function(layer) {
        if (layer.feature) { //&& layer.feature.properties[attribute])
            var json_layer = layer;
            map.removeLayer(json_layer);
        };
    });
};

//click anywhere to close infowindow
$(document).click (function (e) {
    if (e.target != $('#infowindow')[0]) {
        $('#infowindow').hide();
    }
});

//Function to retrieve the data and place it on the map
//Import GeoJSON data
function getData(map){
    //load the data
    $.ajax("data/ufo.geojson", {
        dataType: "json",
        success: function(response){
            
            //create an attributes array
            var attributes = processData(response);
            
            //call functions to create proportional symbols and sequence controls
            createPropSymbols(response, map, attributes);
            createSequenceControls(map, attributes);
            createLegend(map, attributes);
                
         
        }
    });
    

};

$(document).ready(createMap);

        


