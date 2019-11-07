//-------------------SET-UP, READ IN DATA, & VARIABLES--------------------------
var width =500;
var height= 500;

// Read in data
d3.csv("calvinCollegeSeniorScores.csv", function(csv) {
    for (var i=0; i<csv.length; ++i) {
		csv[i].GPA = Number(csv[i].GPA);
		csv[i].SATM = Number(csv[i].SATM);
		csv[i].SATV = Number(csv[i].SATV);
		csv[i].ACT = Number(csv[i].ACT);
    }
    var satmExtent = d3.extent(csv, function(row) { return row.SATM; });
    var satvExtent = d3.extent(csv, function(row) { return row.SATV; });
    var actExtent = d3.extent(csv,  function(row) { return row.ACT;  });
    var gpaExtent = d3.extent(csv,  function(row) {return row.GPA;   });


    var satExtents = {
	"SATM": satmExtent,
	"SATV": satvExtent
    };


    // Axis setup
    var xScale = d3.scaleLinear().domain(satmExtent).range([50, 470]);
    var yScale = d3.scaleLinear().domain(satvExtent).range([470, 30]);

    var xScale2 = d3.scaleLinear().domain(actExtent).range([50, 470]);
    var yScale2 = d3.scaleLinear().domain(gpaExtent).range([470, 30]);

    var xAxis = d3.axisBottom().scale(xScale);
    var yAxis = d3.axisLeft().scale(yScale);

    var xAxis2 = d3.axisBottom().scale(xScale2);
    var yAxis2 = d3.axisLeft().scale(yScale2);


    //Create SVGs for charts
    var chart1 = d3.select("#chart1")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height);


    var chart2 = d3.select("#chart2")
	                .append("svg:svg")
	                .attr("width",width)
	                .attr("height",height);


    // Create brush containers for both charts
    var brushContainerChart1 = chart1.append('g').attr('id', 'brush-container');
    var brushContainerChart2 = chart2.append('g').attr('id', 'brush-container');


//-------------------------BRUSHING CODE CHART 1--------------------------------
    // Create brush, cannot extend past graph
    var brushChart1 = d3.brush().extent([[-10, -10], [width + 10, height + 10]]);

    // Call start, move, & end functions for brush
    brushChart1.on('start', handleBrushStartChart1)
        .on('brush', handleBrushMoveChart1)
        .on('end', handleBrushEndChart1);

    // Assign brush to chart 1's brush container
    brushContainerChart1.call(brushChart1)

    // Begin brush, clear brush in chart 2
    function handleBrushStartChart1() {
        console.log('%cBrush START!!', 'color: green');

        brushChart2.move(brushContainerChart2, null);
    }

    // Move & update brush in both charts
    function handleBrushMoveChart1() {
        console.log('%cBrush MOVING....', 'color: blue');

        var selection = d3.event.selection;

        // Set selection to null when brush for is cleared
        if (!selection) {
            return;
        }

        // Get the boundaries of the selection
        var [[left, top], [right, bottom]] = selection;
        console.log({left, top, right, bottom})

        // From selection, highlight corresponding circles in chart 2
        d3.select('#chart2').selectAll('circle')
            .classed('selected', function(d) {
              var cx = xScale(d['SATM']);
              var cy = yScale(d['SATV']);
              return left <= cx && cx <= right && top <= cy && cy <= bottom;
            });
    }

    // End brush by clearing selection
    function handleBrushEndChart1() {
        console.log('%cBrush END!!', 'color: red');

        // Clear existing styles when the brush is reset
        if (!d3.event.selection) {
            d3.selectAll('circle').classed('selected', false);
        }
    }


//-------------------------BRUSHING CODE CHART 2--------------------------------
    // Create brush, cannot extend past graph
    var brushChart2 = d3.brush().extent([[-10, -10], [width + 10, height + 10]]);

    // Call start, move, & end functions for brush
    brushChart2.on('start', handleBrushStartChart2)
        .on('brush', handleBrushMoveChart2)
        .on('end', handleBrushEndChart2);

    // Assign brush to chart 2's brush container
    brushContainerChart2.call(brushChart2)

    // Begin brush, clear brush in chart 1
    function handleBrushStartChart2() {
        console.log('%cBrush START!!', 'color: green');

        brushChart1.move(brushContainerChart1, null);
    }

    // Move & update brush in both charts
    function handleBrushMoveChart2() {
        console.log('%cBrush MOVING....', 'color: blue');

        var selection = d3.event.selection;

        // Set selection to null when brush is cleared
        if (!selection) {
            return;
        }

        // Get the boundaries
        var [[left, top], [right, bottom]] = selection;
        console.log({left, top, right, bottom})

        // From selection, highlight corresponding circles in chart 1
        d3.select('#chart1').selectAll('circle')
            .classed('selected2', function(d) {
              var cx = xScale2(d['ACT']);
              var cy = yScale2(d['GPA']);
              return left <= cx && cx <= right && top <= cy && cy <= bottom;
            });
    }

    // End brush by clearing selection
    function handleBrushEndChart2() {
        console.log('%cBrush END!!', 'color: red');

        // Clear existing styles when the brush is reset
        if (!d3.event.selection) {
            d3.selectAll('circle').classed('selected2', false);
        }
    }


//--------------------CREATE CHART 1 AND FILL IN DATA---------------------------
	//add scatterplot points
    var temp1 = chart1.selectAll("circle")
	   .data(csv)
	   .enter()
	   .append("circle")
	   .attr("id",function(d,i) {return 'idChart1' + i;} )
	   .attr("stroke", "black")
	   .attr("cx", function(d) { return xScale(d.SATM); })
	   .attr("cy", function(d) { return yScale(d.SATV); })
	   .attr("r", 5)
	   .on("click", function(d,i){
            // First deselect all circles in chart 1
            d3.selectAll('circle')
                .classed('selected', false)

            // Show selected chart 1 circle's data in console
            // console.log(this)
            // console.log("SATM Score: " + d.SATM);
            // console.log("SATV Score: " + d.SATV);
            // console.log("ACT Score: " + d.ACT);
            // console.log("GPA: " + d.GPA);

            // Select circle with same data in chart 2
            d3.select('#idChart2' + i)
                .classed('selected', true)

            // Display SATM score on the right
            d3.select('#satm')
                .text(d.SATM)

            // Display SATV score on the right
            d3.select('#satv')
                .text(d.SATV)

            // Display ACT score on the right
            d3.select('#act')
                .text(d.ACT)

            // Display SATV score on the right
            d3.select('#gpa')
                .text(d.GPA)
       });


//--------------------CREATE CHART 2 AND FILL IN DATA---------------------------
    var temp2 = chart2.selectAll("circle")
	   .data(csv)
	   .enter()
	   .append("circle")
	   .attr("id",function(d,i) {return 'idChart2' + i;} )
	   .attr("stroke", "black")
	   .attr("cx", function(d) { return xScale2(d.ACT); })
	   .attr("cy", function(d) { return yScale2(d.GPA); })
	   .attr("r", 5)
	   .on("click", function(d,i){
            // First deselect all circles in chart 2
            d3.selectAll('circle')
                .classed('selected2', false)

            // Show selected chart 2 circle's data in console
            // console.log(this)
            // console.log("SATM Score: " + d.SATM);
            // console.log("SATV Score: " + d.SATV);
            // console.log("ACT Score: " + d.ACT);
            // console.log("GPA: " + d.GPA);

            // Select circle with same data in chart 1
            d3.select('#idChart1' + i)
                .classed('selected2', true)

            // Display SATM score on the right
            d3.select('#satm')
                .text(d.SATM)

            // Display SATV score on the right
            d3.select('#satv')
                .text(d.SATV)

            // Display ACT score on the right
            d3.select('#act')
                .text(d.ACT)

            // Display SATV score on the right
            d3.select('#gpa')
                .text(d.GPA)
       });


//--------------------CREATE AXES & LABELS FOR BOTH CHARTS----------------------
    chart1 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis) // call the axis generator
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("SATM").style('fill', 'black');

    chart1 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("SATV").style('fill', 'black');

    chart2 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(0,"+ (width -30)+ ")")
		.call(xAxis2)
		.append("text")
		.attr("class", "label")
		.attr("x", width-16)
		.attr("y", -6)
		.style("text-anchor", "end")
		.text("ACT").style('fill', 'black');

    chart2 // or something else that selects the SVG element in your visualizations
		.append("g") // create a group node
		.attr("transform", "translate(50, 0)")
		.call(yAxis2)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("GPA").style('fill', 'black');
	});