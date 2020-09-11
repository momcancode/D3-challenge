var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("./assets/data/data.csv").then(function(censusData) {

	// Step 1: Parse Data/Cast as numbers
	// ==============================
	censusData.forEach(function(data) {
		data.poverty = +data.poverty;
		data.healthcare = +data.healthcare;
	});

	// Step 2: Create scale functions
	// ==============================
	var xLinearScale = d3.scaleLinear()
		.domain([d3.min(censusData, d => d.poverty)-1, d3.max(censusData, d => d.poverty)+2])
		.range([0, width]);

	var yLinearScale = d3.scaleLinear()
		.domain([d3.min(censusData, d => d.healthcare)-1, d3.max(censusData, d => d.healthcare)+2])
		.range([height, 0]);

	// Step 3: Create axis functions
	// ==============================
	var bottomAxis = d3.axisBottom(xLinearScale);
	var leftAxis = d3.axisLeft(yLinearScale);

	// Step 4: Append Axes to the chart
	// ==============================
	chartGroup.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	chartGroup.append("g")
		.call(leftAxis);

	// Step 5: Create Circles and text inside circles
	// ==============================
	var circlesTextGroup = chartGroup.selectAll("circle")
	.data(censusData)
	.enter();
	
	var circlesGroup = circlesTextGroup
	.append("circle")
	.attr("cx", d => xLinearScale(d.poverty))
	.attr("cy", d => yLinearScale(d.healthcare))
	.attr("r", "12")
	.attr("class", "stateCircle");
	// .attr("class", d => "stateCircle " + d.abbr);

	// Include state abbreviations in the circles
	var textGroup = circlesTextGroup
	.append("text")
	.attr("x", d => xLinearScale(d.poverty))
	.attr("y", d => yLinearScale(d.healthcare))
	.attr("dy", "4")
	.text(d => d.abbr)
	.attr("class", "stateText");

	// Create axes labels
	chartGroup.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", 0 - margin.left + 40)
	.attr("x", 0 - (height / 2))
	.attr("dy", "1em")
	.attr("class", "aText")
	.text("Lacks Healthcare (%)");

	chartGroup.append("text")
	.attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
	.attr("class", "aText")
	.text("In Poverty (%)");

}).catch(function(error) {
	console.log(error);
})


