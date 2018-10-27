// winMeter.js

function positionElements () {
var parentsvg = document.getElementById("meter");
var parentdims = [parseInt(parentsvg.getAttribute("width")), parseInt(parentsvg.getAttribute("height"))];

var meterWorkingRadius = 0.4 * Math.min(parentdims[0], parentdims[1]);
var dialOuterRad = 0.8 * meterWorkingRadius;
var dialInnerRad = 0.05 * parentdims[1];

// size and position meter border circles
var outerCircle = document.getElementById("outerBorder");
var innerCircle = document.getElementById("innerBorder");

outerCircle.setAttribute("cx", parentdims[0]/2);
outerCircle.setAttribute("cy", parentdims[1]/2);
innerCircle.setAttribute("cx", parentdims[0]/2);
innerCircle.setAttribute("cy", parentdims[1]/2);
outerCircle.setAttribute("r", meterWorkingRadius + 5);
innerCircle.setAttribute("r", meterWorkingRadius);


// create ticks around border
var tix = document.getElementById("tix");
var tickOuterRadius = meterWorkingRadius;
var tickInnerRadius = 0.9*meterWorkingRadius;
var tickMiddleRadius = 0.5*tickOuterRadius + 0.5*tickInnerRadius;

var rangeArray = [...Array(21).keys()];
var majorLocs = [...Array(11).keys()].map(elem => elem*2);

var tickPcts = rangeArray.map(elem => elem/rangeArray[rangeArray.length-1]);
var tickAngles = tickPcts.map(pct => (1 - pct)*Math.PI);
var tickOuter = tickAngles.map(theta => [parentdims[0]/2 + tickOuterRadius*Math.cos(theta),
	parentdims[1]/2 - tickOuterRadius*Math.sin(theta)]);
var tickInner = tickAngles.map(theta => [parentdims[0]/2 + tickInnerRadius*Math.cos(theta),
	parentdims[1]/2 - tickInnerRadius*Math.sin(theta)]);
var tickMiddle = tickAngles.map(theta => [parentdims[0]/2 + tickMiddleRadius*Math.cos(theta),
	parentdims[1]/2 - tickMiddleRadius*Math.sin(theta)]);

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

// create dial path element
var dial = document.getElementById("dial");
var bzFrac = 0.25;

var dstr = "";
dstr += "M " + parentdims[0]/2 + "," + parentdims[1]/2 + " ";
dstr += "m " + (-1*dialInnerRad) + ",0 ";
dstr += "c " + (-bzFrac*dialInnerRad) + "," + (bzFrac*dialOuterRad) + " ";
dstr += ((2+bzFrac)*dialInnerRad) + "," + (bzFrac*dialOuterRad) + " ";
dstr += (2*dialInnerRad) + ",0 ";
dstr += "l " + (-1*dialInnerRad) + "," + (-1*dialOuterRad) + " ";
dstr += "z ";
// console.log(dstr);
dial.setAttribute("d", dstr);

var dialPin = document.getElementById("dialPin");
dialPin.setAttribute("cx", parentdims[0]/2);
dialPin.setAttribute("cy", parentdims[1]/2);
dialPin.setAttribute("r", 0.3*dialInnerRad);


// position team labels
var home = document.getElementById("homeTeamCont");
var away = document.getElementById("awayTeamCont");

var homeLabel = document.getElementById("homeTeamLabel");
var awayLabel = document.getElementById("awayTeamLabel");

// set the font sizes ahead so that we can calculate size
var labelFSize = 0.32 * parentdims[0] / 3;
homeLabel.setAttribute("font-size", labelFSize);
awayLabel.setAttribute("font-size", labelFSize);

// calculate text width
var homeWidth = homeLabel.getBBox().width;
var homeHeight = homeLabel.getBBox().height;
var awayWidth = awayLabel.getBBox().width;
var awayHeight = awayLabel.getBBox().height;


home.setAttribute("y", 0.625 * parentdims[1]);
away.setAttribute("y", 0.625 * parentdims[1]);
homeLabel.setAttribute("y", 0.725 * parentdims[1] + homeHeight/3);
awayLabel.setAttribute("y", 0.725 * parentdims[1] + awayHeight/3);

home.setAttribute("x", 0.05 * parentdims[0]);
away.setAttribute("x", 0.55 * parentdims[0]);
homeLabel.setAttribute("x", 0.25 * parentdims[0] - homeWidth/2);
awayLabel.setAttribute("x", 0.75 * parentdims[0] - awayWidth/2);

home.setAttribute("width", 0.4 * parentdims[0]);
away.setAttribute("width", 0.4 * parentdims[0]);
home.setAttribute("height", 0.2 * parentdims[1]);
away.setAttribute("height", 0.2 * parentdims[1]);

home.setAttribute("stroke-width", 2 + Math.min(...parentdims)/75);
away.setAttribute("stroke-width", 2 + Math.min(...parentdims)/75);
home.setAttribute("rx", 2 + Math.min(...parentdims)/75);
away.setAttribute("rx", 2 + Math.min(...parentdims)/75);
home.setAttribute("ry", 2 + Math.min(...parentdims)/75);
away.setAttribute("ry", 2 + Math.min(...parentdims)/75);

}

function rotateDialToPercentage (pct) {
	var parentsvg = document.getElementById("meter");
	var parentdims = [parseInt(parentsvg.getAttribute("width")), parseInt(parentsvg.getAttribute("height"))];

	var validatedPct = Math.min(Math.max(pct, 0), 100);
	var angle = validatedPct/100*180 - 90;

	var dial = document.getElementById("dial");
	dial.setAttribute("transform", "rotate(" + angle + "," + parentdims[0]/2 + "," + parentdims[1]/2 + ")");
}





