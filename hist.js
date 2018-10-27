// non-specific function to draw a histogram. optionally provide data labels that
// will show up when you hover over the bars

function descendingLabeledDataComparison(a,b) {
	if (a.value < b.value) {
		return 1;
	}
	else if (a.value > b.value) {
		return -1;
	}
	else {
		return 0;
	}

}


function drawHist(dataset, data_labels) {

if (typeof(data_labels) === "undefined") {
	var use_labels = false;
}
else {
	use_labels = true;
}

var dataIsNumeric = true;

if (isNaN(dataset[0])) {
	dataIsNumeric = false;
	var upperdataset = dataset.map(function(d) {return d.toUpperCase();});
	var opts = upperdataset.filter(function(d, i, self) {return (self.indexOf(d) === i);}).sort();
	// console.log(opts);
}

var histcont = document.getElementById("histContainer");
var drect = histcont.getBoundingClientRect();

histcont.innerHTML = '<svg id="histWindow"></svg>';

var svgAspectRatio = 1.2;
var svgWidth = drect.width * 0.95;
var svgHeight = svgWidth / svgAspectRatio;

// console.log('svg dims: ' + svgWidth + ' x ' + svgHeight);

var svgTop = drect.top;
var svgLeft = drect.left;

var margin = {top: 20, right: 30, bottom: 50, left: 60},
	width = svgWidth - margin.left - margin.right,
	height = svgHeight - margin.top - margin.bottom;

var ttdiv = d3.select("#histContainer").append("div")
	.attr("class", "tooltip")
	.attr("id", "histToolTip")
	.style("opacity", 0);

var svg = d3.select("#histWindow").attr("width", svgWidth).attr("height", svgHeight)
    .attr("class", "bar-chart")
    .append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLinear()
	.rangeRound([0, width]);

if (dataIsNumeric){
	xScale.domain(d3.extent(dataset));
}
else {
	xScale.domain([0, opts.length]);
}

var data_with_labels;
if (use_labels) {
	data_with_labels = dataset.map(function(d,i) {return {value: d, label: data_labels[i]};});
}
else {
	data_with_labels = dataset.map(function(d,i) {return {value: d, label: ""};});
}


var histgen = d3.histogram()
.domain(xScale.domain())
; // returns histogram generator

if (dataIsNumeric) {
	histgen.value(function(elem) {return elem.value;});
	histgen.thresholds(10);
}
else {
	histgen.value(function(elem) {return opts.indexOf(elem.value);});
	histgen.thresholds(opts.length);
}

// console.log(data_with_labels.map(function(elem) {return opts.indexOf(elem.value);}));

var bindata = histgen(data_with_labels); // returns array of bins with labels

var bin, labelstr, labels = [];
if (use_labels) {
	for (var i = 0; i < bindata.length; i++) {
		labelstr = ":";
		bin = bindata[i];
		bin.sort(descendingLabeledDataComparison);
		for (var j = 0; j < bin.length; j++) {
			labelstr = labelstr + "<br/>&bull; " + bin[j].label;
			if (dataIsNumeric) {
				labelstr = labelstr + ': ' + bin[j].value;
			}
		}
		labels.push(labelstr);
	}
}
else {
	var labels = bindata.map(function() {return "";});
}

function correctBinEdges(bindata) {
	var incr = bindata[1].x1 - bindata[1].x0;
	bindata[0].x0 = bindata[0].x1 - incr;
	return bindata;
}

bindata = correctBinEdges(bindata);

var bincounts = bindata.map(function(bin) {return bin.length}) // get length of each bin
var binleftedges = bindata.map(function(bin) {return bin.x0})

var yScale = d3.scaleLinear()
			.domain([0, d3.max(bincounts)])
    		.range([height, 0]);

var axlbl_size = "10pt";

var xax = svg.append("g")
	.attr("class", "axis")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(xScale));



// auto adjust the xScale so the beginning and end coincide with tick marks
// this will be auto adjusted to the nearest 1,2, or 5 * 10^n
xIncr = xScale.ticks()[1]-xScale.ticks()[0];
if (dataIsNumeric) {
	xUpperLim = (Math.ceil(d3.max(dataset) / xIncr) + 1) * xIncr;
	xLowerLim = (Math.floor(d3.min(dataset) / xIncr) - 1) * xIncr;
}
else {
	xUpperLim = opts.length;
	xLowerLim = 0;
	xScale.ticks(0, opts.length, 1);
}
xScale.domain([xLowerLim, xUpperLim])
xax.call(d3.axisBottom(xScale));


xax.append("text")
	.attr("fill", "black")
	.attr("x", width/2)
	.attr("y", 35)
	.attr("font-size", axlbl_size)
	.text("Value");

console.log(d3.select("#histWindow").selectAll("g"));

var yax = svg.append("g")
	.attr("class", "axis")
	.call(d3.axisLeft(yScale));

// auto adjust the yScale so the top coincides with a tick mark
yIncr = yScale.ticks()[1]-yScale.ticks()[0];
yUpperLim = Math.ceil(d3.max(bincounts) / yIncr) * yIncr;
yScale.domain([0, yUpperLim])
yax.call(d3.axisLeft(yScale));

yax.append("text")
	.attr("fill", "black")
	.attr("transform", "rotate(-90)")
	.attr("text-anchor", "middle")
	.attr("x", -height/2)
	.attr("y", -40)
	.attr("font-size", axlbl_size)
	.text("Frequency");

var barPadding = 5;
var barWidth = xScale(binleftedges[2]) - xScale(binleftedges[1]);

// actual histogram creation. needs:
// - "bincounts" (counts per bin, essentially we just need a bar graph of this)
// - "binlocs" (locations of each bin, which in a histogram are just from bin edges)
// - "data in each bin to display in tooltip"

var xloc, yloc, ttstr;
var barChart = svg.selectAll("rect")
    .data(bincounts) // the histogram bincounts
    .enter() // creating the rectangles
    .append("rect")
    .attr("height", function(d) {
        return height - yScale(d);
    })
    .attr("y", function(d) { // d in callback is the element of data
        return yScale(d);
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) { // i in callback is the index in data
         var translate = [xScale(binleftedges[i]) + barPadding/2, 0];
         return "translate("+ translate +")";
    })
    .on("mouseover", function(d, i) {
    	ttdiv.transition()
 		.duration(200)
 		.style("opacity", .9);
 		ttstr = labels[i];
 		xloc = svgLeft + xScale(binleftedges[i]) + margin.left + barWidth/2;
 		yloc = svgTop + yScale(d) + margin.top;
 		if (dataIsNumeric) {
 			ttdiv.html("<u>" + bindata[i].x0 + " to " + bindata[i].x1 + "</u>" + ttstr);
 		}
 		else {
 			ttdiv.html("<u>" + opts[i] + "</u>" + ttstr);
 		}
 		ttdiv.style("top", yloc + "px");
 		ttdiv.style("left", xloc + "px");
    })
    .on("mouseout", function(d) {
    	ttdiv.transition()
 		.duration(200)
 		.style("opacity", 0);
    })
    ;

loadSectionSelector();

}