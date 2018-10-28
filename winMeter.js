// winMeter.js

function genMeterHere (parent, svgdims) {
var xmlns = "http://www.w3.org/2000/svg";

if ((typeof(svgdims) === "undefined") || (svgdims.length != 2)) {
	var svgdims = [100, 100];
}

// make svg itself
var svg = document.createElementNS(xmlns, "svg");

var existingMeters = document.getElementsByClassName("meter");

svg.setAttribute("id", "meter" + existingMeters.length);
svg.setAttribute("class", "meter");
svg.setAttribute("width", svgdims[0]);
svg.setAttribute("height", svgdims[1]);

parent.appendChild(svg);

var meterWorkingRadius = 0.4 * Math.min(svgdims[0], svgdims[1]);
var dialOuterRad = 0.8 * meterWorkingRadius;
var dialInnerRad = 0.05 * svgdims[1];

// meter border circles
var outerCircle = document.createElementNS(xmlns, "circle");
outerCircle.setAttribute("class", "outerBorder");
var innerCircle = document.createElementNS(xmlns, "circle");
innerCircle.setAttribute("class", "innerBorder");

outerCircle.setAttribute("stroke", "grey");
innerCircle.setAttribute("stroke", "grey");
outerCircle.setAttribute("stroke-width", 1);
innerCircle.setAttribute("stroke-width", 1);
outerCircle.setAttribute("fill", "silver");
innerCircle.setAttribute("fill", "white");

outerCircle.setAttribute("cx", svgdims[0]/2);
outerCircle.setAttribute("cy", svgdims[1]/2);
innerCircle.setAttribute("cx", svgdims[0]/2);
innerCircle.setAttribute("cy", svgdims[1]/2);
outerCircle.setAttribute("r", meterWorkingRadius + 5);
innerCircle.setAttribute("r", meterWorkingRadius);

svg.appendChild(outerCircle);
svg.appendChild(innerCircle);

// create ticks around border
var gtick = document.createElementNS(xmlns, 'g');
svg.appendChild(gtick);

var tix = document.createElementNS(xmlns, 'path');
tix.setAttribute("class", "tix");
tix.setAttribute("stroke", "black");

var tickOuterRadius = meterWorkingRadius;
var tickInnerRadius = 0.9*meterWorkingRadius;
var tickMiddleRadius = 0.5*tickOuterRadius + 0.5*tickInnerRadius;

var rangeArray = [...Array(21).keys()];
var majorLocs = [...Array(11).keys()].map(elem => elem*2);

var tickPcts = rangeArray.map(elem => elem/rangeArray[rangeArray.length-1]);
var tickAngles = tickPcts.map(pct => (1 - pct)*Math.PI);
var tickOuter = tickAngles.map(theta => [svgdims[0]/2 + tickOuterRadius*Math.cos(theta),
	svgdims[1]/2 - tickOuterRadius*Math.sin(theta)]);
var tickInner = tickAngles.map(theta => [svgdims[0]/2 + tickInnerRadius*Math.cos(theta),
	svgdims[1]/2 - tickInnerRadius*Math.sin(theta)]);
var tickMiddle = tickAngles.map(theta => [svgdims[0]/2 + tickMiddleRadius*Math.cos(theta),
	svgdims[1]/2 - tickMiddleRadius*Math.sin(theta)]);

var dstr = "";
for (var i = 0; i < tickOuter.length; i++) {
	dstr += "M " + tickOuter[i][0] + "," + tickOuter[i][1] + " ";
	if (majorLocs.includes(i)) {
		dstr += "L " + tickInner[i][0] + "," + tickInner[i][1] + " ";
	}
	else {
		dstr += "L " + tickMiddle[i][0] + "," + tickMiddle[i][1] + " ";
	}
}
tix.setAttribute("d", dstr);

gtick.appendChild(tix);

// create dial path element and little "pin" in middle
var dial = document.createElementNS(xmlns, 'path');
dial.setAttribute("class", "dial");

dial.setAttribute("fill", "lightgrey");
dial.setAttribute("stroke", "grey");

var bzFrac = 0.25;
var dstr = "";
dstr += "M " + svgdims[0]/2 + "," + svgdims[1]/2 + " ";
dstr += "m " + (-1*dialInnerRad) + ",0 ";
dstr += "c " + (-bzFrac*dialInnerRad) + "," + (bzFrac*dialOuterRad) + " ";
dstr += ((2+bzFrac)*dialInnerRad) + "," + (bzFrac*dialOuterRad) + " ";
dstr += (2*dialInnerRad) + ",0 ";
dstr += "l " + (-1*dialInnerRad) + "," + (-1*dialOuterRad) + " ";
dstr += "z ";
dial.setAttribute("d", dstr);

var dialPin = document.createElementNS(xmlns, 'circle')
dialPin.setAttribute("class", "dialPin");
dialPin.setAttribute("cx", svgdims[0]/2);
dialPin.setAttribute("cy", svgdims[1]/2);
dialPin.setAttribute("r", 0.3*dialInnerRad);

dialPin.setAttribute("stroke", "black");
dialPin.setAttribute("stroke-width", 2);

svg.appendChild(dial);
svg.appendChild(dialPin);

// make team labels
var ghome = document.createElementNS(xmlns, "g");
var gaway = document.createElementNS(xmlns, "g");
svg.appendChild(ghome);
svg.appendChild(gaway);

var homeRect = document.createElementNS(xmlns, "rect");
var awayRect = document.createElementNS(xmlns, "rect");

homeRect.setAttribute("class", "homeTeamRect");
awayRect.setAttribute("class", "awayTeamRect");

var homeText = document.createElementNS(xmlns, "text");
var awayText = document.createElementNS(xmlns, "text");

homeText.setAttribute("class", "homeTeamText");
awayText.setAttribute("class", "awayTeamText");

ghome.appendChild(homeRect);
ghome.appendChild(homeText);

gaway.appendChild(awayRect);
gaway.appendChild(awayText);

homeText.setAttribute("font-family", "Verdana");
awayText.setAttribute("font-family", "Verdana");

// change this for teams!!!!!!!!!!
// ----------------------------------------
homeRect.setAttribute("stroke", "black");
awayRect.setAttribute("stroke", "black");
homeRect.setAttribute("fill", "lightgrey");
awayRect.setAttribute("fill", "lightgrey");
homeText.innerHTML = "TM1";
awayText.innerHTML = "TM2";
// ----------------------------------------

// set the font sizes ahead so that we can calculate size
var labelFSize = 0.32 * svgdims[0] / 3;
homeText.setAttribute("font-size", labelFSize);
awayText.setAttribute("font-size", labelFSize);

// calculate text width
var homeWidth = homeText.getBBox().width;
var homeHeight = homeText.getBBox().height;
var awayWidth = awayText.getBBox().width;
var awayHeight = awayText.getBBox().height;

homeRect.setAttribute("y", 0.625 * svgdims[1]);
awayRect.setAttribute("y", 0.625 * svgdims[1]);
homeText.setAttribute("y", 0.725 * svgdims[1] + homeHeight/3);
awayText.setAttribute("y", 0.725 * svgdims[1] + awayHeight/3);

homeRect.setAttribute("x", 0.05 * svgdims[0]);
awayRect.setAttribute("x", 0.55 * svgdims[0]);
homeText.setAttribute("x", 0.25 * svgdims[0] - homeWidth/2);
awayText.setAttribute("x", 0.75 * svgdims[0] - awayWidth/2);

homeRect.setAttribute("width", 0.4 * svgdims[0]);
awayRect.setAttribute("width", 0.4 * svgdims[0]);
homeRect.setAttribute("height", 0.2 * Math.min(...svgdims));
awayRect.setAttribute("height", 0.2 * Math.min(...svgdims));

homeRect.setAttribute("stroke-width", 2 + Math.min(...svgdims)/75);
awayRect.setAttribute("stroke-width", 2 + Math.min(...svgdims)/75);
homeRect.setAttribute("rx", 2 + Math.min(...svgdims)/75);
awayRect.setAttribute("rx", 2 + Math.min(...svgdims)/75);
homeRect.setAttribute("ry", 2 + Math.min(...svgdims)/75);
awayRect.setAttribute("ry", 2 + Math.min(...svgdims)/75);


}

function rotateDialToPercentage (svg) {
	var svgdims = [parseInt(svg.getAttribute("width")), parseInt(svg.getAttribute("height"))];

	var validatedPct = Math.min(Math.max(pct, 0), 100);
	var angle = validatedPct/100*180 - 90;

	var dial = parent.getElementById("dial");
	dial.setAttribute("transform", "rotate(" + angle + "," + svgdims[0]/2 + "," + svgdims[1]/2 + ")");
}





