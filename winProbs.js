// getWinProb.js

// https://www.pro-football-reference.com/play-index/win_prob.cgi?request=1&score_differential=-3
//&vegas_line=10&quarter=1&minutes=3&seconds=00&field=team&yds_from_goal=40&down=1&yds_to_go=10


sample_gamestruct = {
	"score_differential": "-3",
	"vegas_line": "10",
	"quarter": "3", // 5 is OT
	"minutes": "4",
	"seconds": "2",
	"field": "team", // whether the team with the ball is on their own or opp side of field
	"yds_from_goal": "30", // yds from nearest goal line (can be own)
	"down": "3",
	"yds_to_go": "5",

};

function addMeters() {
	var mainContainer = document.getElementById("contentContainer");

	var newmeter;

	for (var i = 0; i < Nmeters; i++) {
		genMeterHere(mainContainer, [meterSize, meterSize]);
	}

}

function resizeMeters() {
	var frame, meter;
	for (var i = 0; i < Nmeters; i++) {
		frame = document.getElementById("frame" + i);
		meter = frame.contentWindow.document.getElementById("meter");

		meter.setAttribute("width", meterSize-20);
		meter.setAttribute("height", meterSize-20);

		positionElements(meters);

	}

}

function makeProbURL(gamestruct) {
	var base = "https://www.pro-football-reference.com/play-index/win_prob.cgi?request=1";
	var url = base;

	var key_list = Object.keys(gamestruct);

	for (var i = 0; i < key_list.length; i++) {
		url = url + "&" + key_list[i] + "=" + gamestruct[key_list[i]];
	}

	return url;
}

function getWinProb(gamestruct) {
	var url = makeProbURL(gamestruct);
	var htmlString;
	var newurl = "http://www.whateverorigin.org/get?url=" + encodeURIComponent(url) + "&callback=?";
	console.log(newurl);

	var scrapePromise = new Promise ((resolve, reject) => {
		resolve($.getJSON(newurl)); // pass this to then fn
	});

	scrapePromise.then((req) => {
		var resp = req["responseJSON"];
		return resp["contents"];
	});

}