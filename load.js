// load function (programmatically generate head page elements)
// Jonah Majumder
// 10/9/17


function loadSectionSelector () {

    var thispagelink = window.location.pathname.split("/").pop();

    if (thispagelink == "") {
        thispagelink = "index.html"; // handle local usage
    }
    var pagesIndex = pages.map(function(d) {return d.link;}).indexOf(thispagelink);
    var Npages = pages.length;
    var totalChars = pages.reduce(function(tot, elem) {return tot + elem.name.length}, 0);

    var sectionDiv = document.getElementById("sectionSelector");
    sectionDiv.innerHTML = "";
    var buttonID, widthpct, l, cmd;
    var elem, marginStr, elemWidth;
    var workingWidth = sectionDiv.offsetWidth - ((Npages-1) * (2*margin_width)); // width - margins

    for (var i = 0; i < Npages; i++) {
        buttonID = "section" + i;
        
        elem = document.createElement("BUTTON");
        elem.setAttribute("id", buttonID);
        // elem.setAttribute("class", "sectionButton");
        if (i==pagesIndex){
            elem.setAttribute("class", "sectionButton thispage");
        }
        else {
            elem.setAttribute("class", "sectionButton otherpage");
        }

        cmd = 'window.location.href = "' + pages[i].link + '";';
        // console.log(cmd);
        elem.setAttribute("onclick", cmd);

        if (i==0) {
            marginStr = "0px " + margin_width + "px 0px 0px";
        }
        else if (i==Npages-1) {
            marginStr = "0px 0px 0px " + margin_width + "px";
        }
        else {
            marginStr = "0px " + margin_width + "px";
        }
        elem.style.margin = marginStr;

        elemWidth = (pages[i].name.length / totalChars) * workingWidth;

        widthStr = elemWidth + "px";
        elem.style.width = widthStr;

        elem.innerHTML = pages[i].name; // because indexed starting at 1
        
        elem.style.fontSize = (sectionDiv.offsetWidth / totalChars) + "px";

        sectionDiv.appendChild(elem);
    }

    belowSectionDiv = document.createElement("DIV");
    belowSectionDiv.setAttribute("id", "belowSectionDiv");
    sectionDiv.appendChild(belowSectionDiv);

}

function size_svg() {
    var histcont = document.getElementById("histContainer");
    var drect = histcont.getBoundingClientRect();

    var svgAspectRatio = 1.2;
    var svgWidth = drect.width * 0.95;
    var svgHeight = svgWidth / svgAspectRatio;

    var svgTop = drect.top;
    var svgLeft = drect.left;

    var margin = {top: 20, right: 30, bottom: 50, left: 60},
        width = svgWidth - margin.left - margin.right,
        height = svgHeight - margin.top - margin.bottom;

    d3.select("#histWindow").attr("width", svgWidth).attr("height", svgHeight);
}

function adjust_sections() {
    var sectionDiv = document.getElementById("sectionSelector");
    var workingWidth = sectionDiv.offsetWidth - ((pages.length-1) * (2*margin_width)); // width - margins
    var totalChars = pages.reduce(function(tot, elem) {return tot + elem.name.length}, 0);

    var sections = document.getElementsByClassName("sectionButton");

    for (var i = 0; i < sections.length; i++) {
        elemWidth = (pages[i].name.length / totalChars) * workingWidth;
        sections[i].style.width = elemWidth + "px";
        sections[i].style.fontSize = (sectionDiv.offsetWidth / totalChars) + "px";
    }
}

