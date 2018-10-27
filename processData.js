// histogram generation
// Jonah Majumder
// 11/24/17

function fillCategories() {

    var colSelector = document.getElementById("histColSelector");
    var generateButton = document.getElementById("generateHistButton");
    generateButton.disabled = false;
    colSelector.disabled = false;

    var newOption;
    var colCount = colList.length;
    for (var i = 1; i < colCount; i++) { // i=1 to exclude player name
        newOption = document.createElement("option");
        newOption.id = "histCol_" + colList[i];
        newOption.value = colList[i];
        newOption.innerHTML = col_dict[colList[i]];
        colSelector.appendChild(newOption);
    }

    // console.log(colList);
    // console.log(data_array);
    // console.log(col_dict);

}


function prepareData() {

    var colSelector = document.getElementById("histColSelector");
    var chosenColKey = colSelector.value;
    var chosenIndex = colList.indexOf(chosenColKey);
    var playerIndex = colList.indexOf(chosenColKey);

    var player_array;
    var pre_data = [];
    var sStat, flStat, stat;
    var map = d3.map;
    var dataIsNumeric;

    // get user specified data
    for (var i = 0; i < data_array.length; i++) {
        player_array = data_array[i];
        sStat = player_array[chosenIndex];
        flStat = parseFloat(sStat);
        if (isNaN(flStat)) {
            stat = sStat;
            if (sStat.length > 0) {
                pre_data.push(sStat);
                dataIsNumeric = false;
            }
        }
        else {
            stat = flStat;
            pre_data.push(flStat);
            dataIsNumeric = true;
        }
    }

    var data = pre_data;
    // console.log(data_array);
    // console.log(data);

    var data_labels = data_array.map(function(row) {return row[0]});

    drawHist(data, data_labels);

}