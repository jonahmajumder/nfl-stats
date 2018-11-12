// definitions.js

// set "global" page names and links in this object
var pages = [
    {name: "Histograms", link: "index.html"},
    {name: "NFL Scoreboard", link: "winProbs.html"},
];

var XMLNS = "http://www.w3.org/2000/svg";

var margin_width = 4;

function decimalPlaces(num, places) {
	places = Math.round(places);
	fctr = 10**places;
	return Math.round(num*fctr)/fctr;
}