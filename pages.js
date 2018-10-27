// pages.js
// set page names and links here, and then they will be used by all pages
var pages = [
	{name: "Histograms", link: "index.html"},
	{name: "Feature2", link: "feature2.html"},
];


function getPageData() {
	var thispage = window.location.pathname.split("/").pop();
	var pagesIndex = pages.map(function(d) {return d.link;}).indexOf(thispage);
}