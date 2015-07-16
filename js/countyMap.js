var width = 600,
  height = width * (450 / 580),
  svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

// Define increments for data scale
var min = 84, //Floor for the first step
  mid = 100,
  max = 116, //Anything above the max is the final step
  steps = 9, //Final step represents anything at or above max
  increment = (max - min) / (steps - 1);

// Create distinct colors for each increment based on two base colors
var colors = [],
  borderColor = '#fff', //Color of borders between states
  noDataColor = '#ddd', //Color applied when no data matches an element
  lowBaseColor = '#FFCE00', //Color applied at the end of the scale with the lowest values
  midBaseColor = '#FFAA93',
  highBaseColor = '#FF0068', //Color applied at the end of the scale with the highest values
  scaleColor = d3.scale.linear()
    .domain([0, (steps - 1) / 2, steps - 1])
    .range([lowBaseColor, midBaseColor, highBaseColor])
    .interpolate(d3.interpolateHcl); //Don't like the colors you get? Try interpolateHcl or interpolateHsl!

// Create basic legend and add generated colors to the 'colors' array
// Should replace this with D3.js Axis
for (var c = 0; c < steps; c++) {
  colors.push(scaleColor(c));
}

var tooltip = d3.select('body').append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('opacity', 0),

  dataFormat = {
    percentage: d3.format('%'),
    ones: d3.format('$d'),
    tens: d3.format('$,.2f'),
    hundreds: d3.format('$,.5r'),
    thousands: d3.format('$s')
  };

var projection = d3.geo.albersUsa()
    .scale(width*1.2)
    .translate([width / 2, height - height * 0.6]);

var path = d3.geo.path()
    .projection(projection);

var mapColor = d3.scale.linear()
    .domain([min, mid, max])
    .range([lowBaseColor, midBaseColor, highBaseColor]);

var map = svg.append('g')
    .attr('class', 'counties');

var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(0,' + (height - height * 0.1) + ')');

// Set params and queue map files
var dataPath = 'data/real-purchasing-power-2013.csv',
    legendDataType = dataFormat.ones,
    tooltipDataType = dataFormat.tens,
    observation = 'rpp-in-100-dollars';

queue()
    .defer(d3.json, 'data/us.json')
    .defer(d3.csv, dataPath)
    .await(ready);

// Map-building functions
function ready(error, us, data) {
    if (error) return console.error(error);

    map.selectAll('path')
        .data(topojson.feature(us, us.objects.counties).features)
    .enter().append('path')
        .attr('d', path)
        .attr('fill', noDataColor)
        .attr('id', function(d){return 'county' + d.id;});

    data.forEach(function(d){
        d3.select('#county' + d.county)
            .style('fill', mapColor(parseFloat(d[observation])))
            .on('mouseover', function(){ return addTooltip(d.name, parseFloat(d[observation])); })
            .on('mouseout', function(d){ tooltip.transition().duration(200).style('opacity',0); });
    });

    map.append('path')
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr('fill', 'none')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .attr('d', path);

    drawLegend();
}

var adjustment = d3.scale.linear()
                .domain([0, width])
                .range([0, 150]);

function addTooltip(label, number){
  tooltip.transition()
    .duration(200)
    .style('opacity', 0.9);
  tooltip.html(
    label + ': ' + (number ? tooltipDataType(number) : 'No Data')
  )
    .style('left', (d3.event.pageX - adjustment(d3.event.pageX)) + 'px')
    .style('top', (d3.event.pageY + 50) + 'px');
}

function drawLegend() {
    var legendData = [{'color': noDataColor, 'label': 'No Data'}],
        legendDomain = [],
        legendScale,
        legendAxis;

    for (var i = 0, j = colors.length; i < j; i++){
        var fill = colors[i];
        var label = legendDataType(min + increment*i) + ((i === j - 1) ? '+' : '-' + legendDataType(min + increment*(i+1)));
        legendData[i+1]= {'color': fill, 'label': label};
    }

    for (var k = 0, x = legendData.length; k < x; k++){
        legendDomain.push(legendData[k].label);
    }

    legendScale = d3.scale.ordinal()
        .rangeRoundBands([0,width], 0.2)
        .domain(legendDomain);

    legendAxis = d3.svg.axis()
        .scale(legendScale)
        .orient('bottom');

    legend.call(legendAxis);

    legend.selectAll('rect')
        .data(legendData)
    .enter()
        .append('rect')
        .attr('x', function(d){return legendScale(d.label);})
        .attr('y', -30)
        .attr('height', 30)
        .attr('class', 'legend-item')
        .transition()
        .duration(700)
        .attrTween('width', function(){return d3.interpolate(0,legendScale.rangeBand());})
        .attrTween('fill', function(d){return d3.interpolate('#fff',d.color);});
}
