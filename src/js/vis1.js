/*

~STAR-SQUAD ALPHA : GREEN HOG 1~
Caleb Potts     AKA LAZER PUG
Peyton Chester  AKA BRAIN FIST
Brian Brown     AKA 'NANA CLAM

*/


//=== VARIABLE & DATA INIT =========================================================================

// init define usableData
var usableData; 
var dataset;

// this variable holds the value in question 
var modAttribute = "mass";

// init loc arrays
var xArr = [];
var yArr = [];
var zArr = [];
changeDataFilter(); // init data filter

// this function changes our filtered data in usableData
function changeDataFilter(){
    usableData = []; // empty usable data from previous graph
    // filter new data, add to usableData array
    d3.json("src/data/data.json", function(data) 
    {
        // all outside functions that handle data
        // need to be called from within this callback function

        dataset = data; // ¯\_(ツ)_/¯
        // push Sol (the sun) to the array no matter what
        usableData.push(dataset[0]);
        for(i = 1; i < dataset.length; i++){
            // selecting only those with a non-zero value for modAttribute
            if(dataset[i][modAttribute] != 0){
                usableData.push(dataset[i]);
            }
        }

        // console usableData for testing purposes
    console.log(usableData);
    console.log(usableData[1]);

    console.log(usableData[0]["starType"].charAt(0));

    // pushToTestData(usableData);

    });
}

var testData = [];

function pushToTestData(usableData) {
    for(i = 0; i < 10; i++){
        testData.push(usableData[i]);
    }

    console.log(testData);

    d3.select("#graphHolder").selectAll("p")
        .data(testData)
        .enter()
        .append("p")
        .text("New paragraph!");
}










//=== VIS.JS 3d DRAW =========================================================================





// loop thru usable data and pull galXYZ values
for(i = 0; i<usableData.length; i++){
    xArr.push(usableData[i].galX);
    yArr.push(usableData[i].galY);
    xArr.push(usableData[i].galZ);
}

// function per visjs documentation
var data = null;
var graph = null;

function onclick(point) {
  console.log(point);
}

console.log("hi");

// Called when the Visualization API is loaded.
function drawVisualization() {

  // create the data table.
  data = new vis.DataSet();
  var sqrt = Math.sqrt;
  var pow = Math.pow;
  var random = Math.random;
  // create the animation data
  var imax = 100;
  for (var i = 0; i < usableData.length; i++) {
    var x = xArr[i];
    var y = yArr[i];
    var z = zArr[i];
    // i have no idea what this does yet
    var style = (i%2==0) ? sqrt(pow(x, 2) + pow(y, 2) + pow(z, 2)) : "#00ffff";

    // add the point to the data
    data.add({x:x,y:y,z:z,style:style});
  }

  // specify options
  var options = {
    width:  '600px',
    height: '600px',
    style: 'dot-color',
    showPerspective: true,
    showGrid: true,
    keepAspectRatio: true,
    verticalRatio: 1.0,
    legendLabel: 'distance',
    onclick: onclick,
    cameraPosition: {
      horizontal: -0.35,
      vertical: 0.22,
      distance: 1.8
    }
  };

  // create our graph
  var container = document.getElementById('graphHolder');
  graph = new vis.Graph3d(container, data, options);
}

// use for converting scientific notation to full number string
function largeNumberToString(n){
    var str, str2= '', data= n.toExponential().replace('.','').split(/e/i);
    str= data[0], mag= Number(data[1]);
    if(mag>=0 && str.length> mag){
        mag+=1;
        return str.substring(0, mag)+'.'+str.substring(mag);
    }
    if(mag<0){
        while(++mag) str2+= '0';
        return '0.'+str2+str;
    }
    mag= (mag-str.length)+1;
    while(mag> str2.length){
        str2+= '0';
    }
    return str+str2;
}