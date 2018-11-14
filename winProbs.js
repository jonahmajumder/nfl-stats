// getWinProb.js

// https://www.pro-football-reference.com/play-index/win_prob.cgi?request=1&score_differential=-3
//&vegas_line=10&quarter=1&minutes=3&seconds=00&field=team&yds_from_goal=40&down=1&yds_to_go=10


sample_gamestruct = {
	"score_differential": -3,
	"vegas_line": 12,
	"quarter": 3, // 5 is OT
	"minutes": 4,
	"seconds": 2,
	"field": "team", // whether the team with the ball is on their own or opp side of field
	"yds_from_goal": 30, // yds from nearest goal line (can be own) - i.e. yard line
	"down": 3,
	"yds_to_go": 5,
};

function norm_cdf(x, mu, sigma) {
	return 0.5 * (1 + math.erf((x - mu) / (sigma * Math.sqrt(2))));
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

function makeWinProbmise(gamestruct) {
	var url = makeProbURL(gamestruct);
	var htmlString;
	var newurl = "http://www.whateverorigin.org/get?url=" + encodeURIComponent(url) + "&callback=?";
	
	return new Promise ((resolve, reject) => {
		resolve($.getJSON(newurl)); // pass this to then fn
	});
}

function parseWinProbmise(response) {
	var resphtml = string2doc(response["contents"]);
	var datadiv = resphtml.getElementsByClassName("p402_premium")[0];
	var h3text = [...datadiv.getElementsByTagName("h3")].map(h => h.innerHTML);
	var gamedata = {};
	h3text.map(
		function(string) {
			var parts = string.split(":");
			gamedata[parts[0].trim()] = parseFloat(parts[1].trim());
		}
	);
	var win_prob = gamedata["Win Probability"];

	return new Promise((resolve, reject) => {
		resolve(win_prob);
	});
}

function winProb(gamestruct, prob_function) {
	makeWinProbmise(gamestruct).then(resp => parseWinProbmise(resp))
	.then(prob_function);
	return "returned";
}

function lineGamestruct(line) {
	return {"vegas_line": line};
}

function line2winProb(line) {
	winProb(lineGamestruct(line), console.log);
	return "returned";
}

function line2winProb_analytical(line) {
	mu = 0; // 0 is still 50%
	sigma = 13.2; // value I determined
	return decimalPlaces(100 * (1 - norm_cdf(line, mu, sigma)), 3);
}

var info;

function getNFLScores() {
	var url = "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard";
	var newurl = "http://www.whateverorigin.org/get?url=" + encodeURIComponent(url) + "&callback=?";
	var games;

	$.getJSON(url, function(data) {
		var JSONcontents = data;
		setTitle(JSONcontents["week"]["number"]);
		games = JSONcontents["events"];
		info = game_info(games);
		addGameMeters(info);
		return info;
	});
	// var scrapePromise = new Promise ((resolve, reject) => {
	// 	resolve($.getJSON(newurl)); // pass this to then fn
	// });

	// scrapePromise.then((resp) => {
	// 	var JSONcontents = JSON.parse(resp["contents"]);
	// 	// setTitle(JSONcontents["week"]["number"]);
	// 	// games = JSONcontents["events"];
	// 	// info = game_info(games);
	// 	// addGameMeters(info);
	// 	// console.log(info);
	// });

}

function game_info(games) {
	var game_info = Array(games.length);
	var totalSec, teams, sec, min, period, gmstate, competiton, scores, winningTm, losingTm,
		competitors, possTmScore, otherTmScore, scoreDiff, sit,
		oddstr, focusTmCode, focusTmLine,
		h, t, a;
	for (var i = 0; i < games.length; i++) {
		game_info[i] = {};

		teams = games[i]["shortName"].split("@");
		game_info[i]["awayTeamCode"] = teams[0].trim();
		game_info[i]["homeTeamCode"] = teams[1].trim();

		gamestruct = {};
		totalSec = games[i]["status"]["clock"]
		sec = totalSec % 60;
		min = (totalSec - sec)/60;

		gamestruct["minutes"] = min;
		gamestruct["seconds"] = sec;
		gamestruct["quarter"] = games[i]["status"]["period"];

		competition = games[i]["competitions"][0];
		competitors = competition["competitors"];
		
		game_info[i]["homeTeamScore"] = parseFloat(competitors[dictIndex(competitors, "homeAway", "home")]["score"]);
		game_info[i]["awayTeamScore"] = parseFloat(competitors[dictIndex(competitors, "homeAway", "away")]["score"]);
		
		gmstate = games[i]["status"]["type"]["state"];
		game_info[i]["game_status"] = gmstate;
		if (gmstate == "in"){
			possIdx = dictIndex(competitors, "id", competition["situation"]["possession"]);
			if (possIdx == -1) {
				possIdx = dictIndex(competitors, "id", competition["situation"]["lastPlay"]["team"]["id"]);
			}

			sit = competition["situation"];
			if (sit["yardline"] > 50) {
				gamestruct["field"] = "team";
				gamestruct["yds_from_goal"] = 100 - sit["yardLine"];
			}
			else {
				gamestruct["field"] = "opp";
				gamestruct["yds_from_goal"] = sit["yardLine"];
			}
			gamestruct["down"] = sit["down"];
			gamestruct["yds_to_go"] = sit["distance"];
			possTmScore = parseFloat(competitors[possIdx]["score"]);
			otherTmScore = parseFloat(competitors[1-possIdx]["score"]);
			gamestruct["score_differential"] = possTmScore - otherTmScore;

			// console.log(sit);
			h = sit["lastPlay"]["probability"]["homeWinPercentage"];
			t = sit["lastPlay"]["probability"]["tiePercentage"];
			a = sit["lastPlay"]["probability"]["awayWinPercentage"];

			game_info[i]["awayTeamWinProb"] = 0*h + 50*t + 100*a;
		}
		else if (gmstate == "post") {
			scores = competitors.map(c => parseFloat(c["score"]))
			winningTm = competitors[scores.indexOf(Math.max(...scores))];
			losingTm = competitors[1-scores.indexOf(Math.max(...scores))];
			game_info[i]["winnerCode"] = winningTm["team"]["abbreviation"];
			game_info[i]["winnerScore"] = parseFloat(winningTm["score"]);
			game_info[i]["loserCode"] = losingTm["team"]["abbreviation"];
			game_info[i]["loserScore"] = parseFloat(losingTm["score"]);

			game_info[i]["awayTeamWinProb"] = 100*(competitors[dictIndex(competitors, "homeAway", "away")]["winner"]);
		}
		else if (gmstate == "pre") {
			oddstr = competition["odds"][0]["details"];
			focusTmCode = oddstr.split(" ")[0];
			focusTmLine = parseFloat(oddstr.split(" ")[1]);
			focusTmHomeAway = competitors[competitors.map(c=>c["team"]["abbreviation"]).indexOf(focusTmCode)]["homeAway"];

			if (focusTmHomeAway == "away") {
				game_info[i]["awayTeamWinProb"] = line2winProb_analytical(focusTmLine);
			}
			else {
				game_info[i]["awayTeamWinProb"] = line2winProb_analytical(-1*focusTmLine);
			}
		}
		game_info[i]["gamestruct"] = gamestruct;
	}
	return game_info;
}

function addGameMeters(game_info) {
	var mainContainer = document.getElementById("meterContainer");

	var newMeter;
	for (var i = 0; i < game_info.length; i++) {
		newMeter = genMeterHere(mainContainer, [meterSize, meterSize]);

		setMeterTeams(newMeter, game_info[i]["homeTeamCode"], game_info[i]["awayTeamCode"]);
		setMeterPercentage(newMeter, game_info[i]["awayTeamWinProb"]);

		if (game_info[i]["game_status"] == "post") {
			setMeterScore(newMeter, game_info[i]["winnerCode"],
				game_info[i]["winnerScore"], game_info[i]["loserScore"])
		}

		adjust_sections();
	}

}

function testAddMeters() {
	var mainContainer = document.getElementById("meterContainer");

	var newMeter;
	var teamCodes = Object.keys(teams);
	var Nmeters = Math.floor(teamCodes.length/2);

	for (var i = 0; i < Nmeters; i++) {
		newMeter = genMeterHere(mainContainer, [meterSize, meterSize]);

		setMeterTeams(newMeter, teamCodes[2*i], teamCodes[2*i+1]);
		setMeterPercentage(newMeter, Math.random()*100);
	}

}

function setTitle(weekNo) {
	var title = document.getElementById("meterHeader");
	title.style.fontSize = (window.innerWidth / 25) + "px";
	title.innerHTML = "Week " + weekNo + " NFL Games";

}

function dictIndex(dictarray, key, testVal) {
	var arr = [...dictarray]; // make sure it is mappable
	var keyvalmap = arr.map(dict => dict[key]);
	var matchInd = keyvalmap.indexOf(testVal);
	return matchInd;
}
