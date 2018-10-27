// javascript scraper using cheerio and request
// Jonah Majumder
// 10/5/17

var col_dict = {};
var colList = [];
var data_array = [];

function strJoin(sArr, delim) {
	if (typeof(delim) == 'undefined') {delim = ''}
	
	var s = "";
	for (i=0; i < sArr.length; i++) {
		s += sArr[i];
		if (i < sArr.length - 1){
			s += delim;
		}
	}
	return s;
}


baseurl = "https://www.pro-football-reference.com";

//var year = 2016;
//statType = "rushing";

function defURL(base, year, statType) {
	url = strJoin([base, "years", year, statType], "/") + ".htm";
	return url;
}

function parseTable(tableElem) {
	var headElem = tableElem.getElementsByTagName("thead")[0];
	var headLength = headElem.children.length;
	var head = headElem.children[headLength-1];
	var headArr = head.children;

	// var col_hdrs = {};
	var col, categoryName;
	// var colList = [];
	for (var i = 0; i < headArr.length; i++) {
		col = headArr[i].getAttribute("data-stat");
		if (i > 0) {
			colList.push(col);
		}
		categoryName = headArr[i].getAttribute("aria-label");
		col_dict[col] = categoryName;
	}

	col_dict = fixColDict(col_dict);

	var body = tableElem.getElementsByTagName("tbody")[0].rows;
	// var data_array = [];
	var player_array, player_data;
	for (var i = 0; i < body.length; i++) {

		player_array = [];
		if (body[i].className != "thead") {

			player_data = body[i].children;
			for (var j = 1; j < player_data.length; j++) {
				if (player_data[j].children.length > 0){
					player_array.push(player_data[j].children[0].innerHTML);
				}
				else {
					player_array.push(player_data[j].innerHTML);
				}
			}
		}

		if (player_array.length > 0) {
			data_array.push(player_array);
		}
		// console.log("Player " + i + " done.")
	}


	return;
}

//var express = require("express");
//var fs = require("file-system");
//var request = require("request");
//var cheerio = require("cheerio");

function formatHistWindow(cols, data) {
	var histWindow = document.getElementById("histWindow");

}

function string2doc (htmlString) {
	var el = document.createElement( "html" );
	el.innerHTML = htmlString;
	return el;
}

function scrapeURL(url) {
	console.log("Scraping from url " + url + ".");
	var htmlString;
	var newurl = "https://www.whateverorigin.org/get?url=" + encodeURIComponent(url) + "&callback=?";
	disableGetButton(true);
	clearData();
	var elem, table;

	var scrapePromise = new Promise ((resolve, reject) => {
		$.getJSON(newurl).then( function(body, status) {	
			htmlString = body.contents;
			resolve(htmlString);
		});
	});

	scrapePromise.then((html) => {
		elem = string2doc(html);
		table = elem.getElementsByTagName("table")[0];
		parseTable(table);
		disableGetButton(false);
		fillCategories();
		return elem;
	});

}


function getURL() {
	var year = document.getElementById("yearSelect").value;
	var statType = document.getElementById("typeSelect").value;
	return defURL(baseurl, year, statType);
}

function disableGetButton(disable) {
	var button = document.getElementById("getDataButton");
	button.disabled = disable;
	return;
}

function clearData() {

	var colSelector = document.getElementById("histColSelector");
    var generateButton = document.getElementById("generateHistButton");
    generateButton.disabled = true;
    colSelector.disabled = true;

	data_array = [];
	colList = [];
	col_dict = {};

	while (colSelector.hasChildNodes()) {
        colSelector.removeChild(colSelector.lastChild);
    }

}

function fixColDict(dict) {

	dict = changeValueIfPresent(dict, "ranker", "Rank");
	dict = changeValueIfPresent(dict, "player", "Player");
	dict = changeValueIfPresent(dict, "team", "Team");
	dict = changeValueIfPresent(dict, "age", "Age");
	dict = changeValueIfPresent(dict, "pos", "Position");
	dict = changeValueIfPresent(dict, "otd", "Misc TDs");
	dict = changeValueIfPresent(dict, "alltd", "Total TDs");
	dict = changeValueIfPresent(dict, "qb_rec", "Wins");	

	dict = changeValueIfPresent(dict, "ditd", "Int. TDs");
	dict = changeValueIfPresent(dict, "frtd", "Fumble TDs");
	dict = changeValueIfPresent(dict, "krtd", "KR TDs");
	dict = changeValueIfPresent(dict, "prtd", "PR TDs");
	dict = changeValueIfPresent(dict, "rectd", "Rec. TDs");
	dict = changeValueIfPresent(dict, "rushtd", "Rush TDs");

	dict = changeValueIfPresent(dict, "fantasy_pos", "Position");
	dict = changeValueIfPresent(dict, "fantasy_rank_overall", "Fantasy Rank");
	dict = changeValueIfPresent(dict, "fantasy_rank_pos", "Positional Rank");
	return dict;

}

function changeValueIfPresent(dict, key, value) {
	if (dict[key] != undefined) {
		dict[key] = value;
	}
	return dict;

}
