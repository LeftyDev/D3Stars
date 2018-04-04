/*

    GOALS
    - Rework/write this to work for stardata.js
    - add tooltips, gradient colors, and scatterplot functionality
    - ability to modify axes and re-render graph

    *Additionally
    - implement threejs visualization

*/

//======variable initialization==================================================================

		// Initialize arrays for localites
		var listOfLocalities = [];
		var localities = {};
		
		// Initialize values for page-load render
		var energyType = "co2";
		var selectedData = "data/co2_emissions_per_capita.csv";
		var localityName = "United States";

		// Initialize Y Label variable
		var yLabel;

		// Width/height of svgs
		var W = 575;
		var H = 400;
		
		// Scale for graphs
		var w = 475;
		var h = 300;
		// Padding between each bar on chart
		var barPad = 1;
		var padding = 30;

		// Initialization of svg1
		var svg1 = d3.select("#graphHolder")
					.append("svg")
					.attr("width", W)
					.attr("height", H)
					.attr("class", "svg1");
		// Initialization of svg2
		var svg2 = d3.select("#graphHolder2")
					.append("svg")
					.attr("width", W)
					.attr("height", H)
					.attr("class", "svg2");
		
		var activeSvg = svg1; 			// Set default value of activeSvg to svg1
		var activeSvgClass = ".svg1"; 	// Set default value of activeSvgclass to .svg1
		var svgFillColor = "lime"		// Set default fill color to lime
		
		// runs analyze() with default inputs
		analyze(energyType, localityName);

//======onChange() for locality selector=========================================================
		
		// this function of d3 listens for the value in the html selection
		// list, selectionLocation, to change => then runs a function
		d3.select("#selectionLocation") 
			.on('change', function() {
				d3.select(activeSvgClass) // select all objects with activeSvgClass
					.selectAll('g') 	  // select all 'g' tags 
					.remove();			  // removes all of selection
			
				// figure out the newly selected locality
				var selectionL = document.getElementById('selectionLocation');
				localityName = selectionL.options[selectionL.selectedIndex].value;

				// re-draw bar chart for the new locality
				analyze(energyType, localityName);	
			});

//======changeActiveGraph()======================================================================
		
		// this function is called as an onclick when the user 
		// toggles the radio buttons in the html (class: graphToggle)
		function changeActiveGraph(choice){
			activeSvg = choice; // sets activeSvg to user's selection
			if (activeSvg == svg1){ 		// if user selects svg1...
				activeSvgClass = ".svg1";	// assign activeSvgClass value of .svg1 
				svgFillColor = "lime";		// and svgFillColor to lime
			} else if (activeSvg == svg2){  // if user selects svg2...
				activeSvgClass = ".svg2";	// assign activeSvgClass value of .svg2
				svgFillColor = "purple"		// and svgFillColor to purple
			} else {	// otherwise...				
						// do nothing
			}
		}

		
//======updateEnergy()===========================================================================
		
		// this function takes newEnergy as an argument, assigns energyType 
		// the value of newEnergy, then passes the new energyType to analyze()
		function updateEnergy(newEnergy) {	
			energyType = newEnergy;
			analyze(energyType, localityName);
		}		
		
//======analyze()================================================================================
		
		// this function takes as arguments e, l and handles the .csv
		// data so that it may be used effectively by drawBarChart()
		function analyze(e, l) {			
			// this array holds the file paths for the csv files
			var energyArray = ["data/co2_emissions_per_capita.csv", 
							   "data/coal_consumption.csv", 
							   "data/renewable_electricity_consumption.csv", 
							   "data/total_electricity_consumption.csv"]
			
			// these if-statements select file path to pick from the energyArray
			if (e == "co2") {
				selectedData = energyArray[0];
			} else if (e == "coal") {
				selectedData = energyArray[1];
			} else if (e == "renewable") {
				selectedData = energyArray[2];
			} else {
				selectedData = energyArray[3];
			}

			// this functions of d3, which accepts an argument data, loops through
			// the csv file, creates a "record" for each entry and pushes
			// the energyValue data from  the csv to array record.energyValues
			d3.csv(selectedData, function(data) {
				dataset = data; // assigns var dataset the value of the passed data
				for (var i=0; i<dataset.length; i++) {
					var record = dataset[i]; // assigns var record index value [i] of dataset
					record.energyValues = []; // empty array as attribute of record

					// this loops through data from 1980-2012
					for (var year=1980; year<=2012; year++) {
						var value = record[year]; // assigns var value to the year value of record
						
						// this cleans up incomplete data entries
						if (value === '--') {
							value = 0;
						}
						else if (value === 'NA') {
							value = 0;
						}
						else if (value === '(s)') {
							value = 0;
						}
						else if (value === 'W') {
							value = 0;
						}
						// push value to the record.energyValue array
						record.energyValues.push( value ); 
					}
					// push the record's locality to the record.Locality array
					localities[ record.Locality ] = record;
					listOfLocalities.push( record.Locality );
					// if the user's selected locality matches the current record.Locality...
					if (localityName == record.Locality) {
						var activeLocality = record; // assign record to activeLocality
					} else { // otherwise...
							 // do nothing
					}
				}
				// calls populateCountries(), passing the listOfLocalities
				populateCountries(listOfLocalities)
				// calls drawBarChart(), passing the activeLocality 
				drawBarChart(activeLocality);
			})
		}

//======populateCountries()======================================================================
		
		// this function populates the selection list in the html with all localities
		function populateCountries(l) {
			// checks to see if the localities have already been added to
			// the selection list (without this, it would keep adding it)
			if (listOfLocalities.length <= 233) { 
				d3.select('#selectionLocation')
				.selectAll('option')
				.data(listOfLocalities)
				.enter()
				.append('option')
				.html(function(d) { return d; })
				.attr('value', function(d) { return d; })
			} else { // if it has already been added...
					 // do nothing
			}
		}
		
//======drawBarChart()===========================================================================
		
		// this function takes loc(locality information) as an argument,
		// and dynamically draws the barchart depending on what .csv file
		// is most recently selected by the user
		function drawBarChart(loc) {
			// adjusts the value of yLabel to reflect the selected .csv
			if (energyType == "co2") {
				yLabel = "CO2 Emissions per Capita";
			} else if (energyType == "coal") {
				yLabel = "Coal Consumption";
			} else if (energyType == "renewable") {
				yLabel = "Renewable Electricity Consumed";
			} else {
				yLabel = "Total Electricity Consumed";
			}
			
			// sets the scale of the Y-Axis to a function of the max energyValues present
			var yScale = d3.scale.linear()
						.domain([0, d3.max(loc.energyValues, function(d) { return d*1; })])
						.rangeRound([0, h - padding]);
			var yAxisScale = d3.scale.linear()
						.domain([d3.max(loc.energyValues, function(d) { return d*1; }), 0])
						.rangeRound([0, h - padding]);
			// sets the scale of the X-axis to be a range of years from 1980-2012
			var xAxisScale = d3.time.scale()
						.domain([new Date(1980, 1, 1), new Date(2012, 1, 1)])
						.range([0, 474]);
			// defines var xAxis as the X-axis of the graph
			var xAxis = d3.svg.axis()
						.scale(xAxisScale)
						.orient("bottom");
			// defines var yAxis as the Y-axis of the graph
			var yAxis = d3.svg.axis()
						.scale(yAxisScale)
						.orient("left");
			// this checks to see if any child elements have been written to
			// the activeSvgClass... If so, there is already a graph there that
			// can be manipulated, but if not, we need to draw a new one
			if(document.querySelector(activeSvgClass).childElementCount == 0) {
				// Bars being drawn
				activeSvg.selectAll("rect")
					.data(loc.energyValues)
					.enter()
					.append("rect")
					.attr("x", function(d, i) {
						return i * (w / (loc.energyValues.length - 1));
					})
					.attr("y", function(d){
						return h - yScale(d);
					})
					.attr("width", w / loc.energyValues.length - barPad)
					.attr("height", function(d){
						return yScale(d);
					})
					.attr("transform", "translate(100,10)")
					.attr("fill", svgFillColor);
				// Axes being drawn
				activeSvg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(100,40)")
					.call(yAxis)
				activeSvg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(100,310)")
					.call(xAxis);
				// Title being drawn
				activeSvg.append("text")
					.attr("x", 350 )
					.attr("y", 15 )
					.attr("class", "label" )
					.style("text-anchor", "middle")
					.text(yLabel + " for " + loc.Locality);
				// X-axis label being drawn
				activeSvg.append("text")
					.attr("x", 350 )
					.attr("y", 350 )
					.attr("class", "label" )
					.style("text-anchor", "middle")
					.text("Year");
				// Y-axis label being drawn
				activeSvg.append("text")
					.attr("transform", "rotate(-90)")
					.attr("x", -165 )
					.attr("y", 30 )
					.attr("class", "label" )
					.style("text-anchor", "middle")
					.text(yLabel);
			} else { // if there hasn't been a chart drawn already...
				// this section will modify the existing chart to
				// reflect the new location and energy data being passed
				activeSvg.selectAll("rect")
					.data(loc.energyValues)
					.transition()  // allows for animation ease
					.duration(250) // specifies .25 second ease
					.attr("x", function(d, i) {
						return i * (w / (loc.energyValues.length - 1));
					})
					.attr("y", function(d){
						return h - yScale(d) ;
					})
					.attr("width", w / loc.energyValues.length - barPad)
					.attr("height", function(d){
						return yScale(d);
					})
					.attr("transform", "translate(100,10)")
					.attr("fill", svgFillColor);
				// Removes the Axes and Labels..
				activeSvg.selectAll(".axis")
					.remove();
				activeSvg.selectAll(".label")
					.remove();
				// Draws the new Y-axis
				activeSvg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(100,40)")
					.call(yAxis)
				// Draws the new X-axis
				activeSvg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(100,310)")
					.call(xAxis);
				// Applies new Chart Title
				activeSvg.append("text")
					.attr("x", 350 )
					.attr("y", 15 )
					.attr("class", "label" )
					.style("text-anchor", "middle")
					.text(yLabel + " for " + loc.Locality);
				// Applies the xLabel
				activeSvg.append("text")
					.attr("x", 350 )
					.attr("y", 350 )
					.attr("class", "label" )
					.style("text-anchor", "middle")
					.text("Year");
				// Applies the new yLabel
				activeSvg.append("text")
					.attr("transform", "rotate(-90)")
					.attr("x", -165 )
					.attr("y", 30 )
					.attr("class", "label" )
					.style("text-anchor", "middle")
					.text(yLabel);
			}	
		};