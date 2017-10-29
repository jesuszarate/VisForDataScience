class YearChart {

    /**
     * Constructor for the Year Chart
     *
     * @param electoralVoteChart instance of ElectoralVoteChart
     * @param tileChart instance of TileChart
     * @param votePercentageChart instance of Vote Percentage Chart
     * @param electionInfo instance of ElectionInfo
     * @param electionWinners data corresponding to the winning parties over mutiple election years
     */
    constructor(electoralVoteChart, tileChart, votePercentageChart, electionWinners) {

        //Creating YearChart instance
        this.electoralVoteChart = electoralVoteChart;
        this.tileChart = tileChart;
        this.votePercentageChart = votePercentageChart;
        // the data
        this.electionWinners = electionWinners;

        // Initializes the svg elements required for this chart
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart").classed("fullView", true);

        //fetch the svg bounds
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;

        //add the svg to the div
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);

        /** Setup the scales*/
        this.yearScale = d3.scaleLinear()
            .range([50, this.svgWidth - 50])
            //.range([this.cell.buffer, this.cell.width * 2 - this.cell.buffer]);
            .domain([1940, 2012]);
    };


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass(data) {
        if (data == "R") {
            return "yearChart republican";
        }
        else if (data == "D") {
            return "yearChart democrat";
        }
        else if (data == "I") {
            return "yearChart independent";
        }
    }

    /**
     * Creates a chart with circles representing each election year, populates text content and other required elements
     * for the Year Chart
     */
    update() {

        //Domain definition for global color scale
        let domain = [-60, -50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50, 60];

        //Color range for global color scale
        let range = ["#063e78", "#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef", "#fcbba1", "#fc9272", "#fb6a4a",
            "#de2d26", "#a50f15", "#860308"];

        //ColorScale be used consistently by all the charts
        this.colorScale = d3.scaleQuantile()
            .domain(domain)
            .range(range);

        // ******* TODO: PART I *******

        // Create the chart by adding circle elements representing each election year
        //The circles should be colored based on the winning party for that year
        //HINT: Use the .yearChart class to style your circle elements
        //HINT: Use the chooseClass method to choose the color corresponding to the winning party.
        let circleRadius = 25;
        let reference = this;

        let node = this.svg.selectAll(".node")
            .data(this.electionWinners)
            .enter().append("g")
            .attr("transform", function (d) {
                return "translate(" + reference.yearScale(d["YEAR"]) + "," + (circleRadius + 5) + ")";
            });

        //Append text information of each year right below the corresponding circle
        //HINT: Use .yeartext class to style your text elements
        // adds the text to the node


        //Style the chart by adding a dashed line that connects all these years.
        //HINT: Use .lineChart to style this dashed line
        this.renderLines(this.svg, this.yearScale, circleRadius);
        this.renderNodes(node, this.yearScale, circleRadius, this.colorScale);

        //line = newLine.merge(line);


        //Clicking on any specific year should highlight that circle and  update the rest
        // of the visualizations
        //HINT: Use .highlighted class to style the highlighted circle

        //Election information corresponding to that year should be loaded and passed to
        // the update methods of other visualizations


        //******* TODO: EXTRA CREDIT *******

        //Implement brush on the year chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.

    };

    renderNodes(node, scale, radius, colorScale) {
        let reference = this;
        node.append("circle")
            .attr("r", function (d) {
                return radius;
            })
            .attr("class", function (d) {
                return reference.chooseClass(d["PARTY"])
            })
            .on("click", function (d) {
                //let data = reference.loadElectionResults(d["YEAR"]);
                reference.nodeSelected(d["YEAR"], reference);

                d3.csv("data/year_timeline_" + d["YEAR"] + ".csv", function (error, yearTimeline) {
                    reference.electoralVoteChart.update(yearTimeline, colorScale);
                    reference.tileChart.update(yearTimeline, colorScale);
                    reference.votePercentageChart.update(yearTimeline, colorScale);
                });
            })
            .on("mouseover", function (d) {
                reference.nodeMouseOver(d["YEAR"], reference);
            });

        node.append("text")
            .attr("dy", "2.5em")
            .attr("class", "yeartext")
            .text(function (d) {
                return d["YEAR"];
            });
    }


    nodeMouseOver(year, reference) {
        let node = this.svg.selectAll(".node")
            .data(this.electionWinners)
            .enter();
        node.selectAll("circle")
            .attr("class", function (d) {
                let clss = reference.chooseClass(d["PARTY"]);
                return d["YEAR"] === year ? clss + " highlighted" : clss;
            });
    }

    nodeSelected(year, reference) {
        let node = this.svg.selectAll(".node")
            .data(this.electionWinners)
            .enter();
        node.selectAll("circle")
            .attr("class", function (d) {
                let clss = reference.chooseClass(d["PARTY"]);
                return d["YEAR"] === year ? clss + " selected" : clss;
            });
    }

    renderLines(svg, scale, radius) {

        svg.selectAll(".line")
            .data(this.electionWinners)
            .enter()
            .append("line")
            .attr("class", "lineChart")
            .attr("x1", function (d) {
                return scale(+d['YEAR']) + radius;
            })
            .attr("y1", radius + 5)
            .attr("x2", function (d) {
                return scale(+d['YEAR'] + 4) - radius;
            })
            .attr("y2", radius + 5);
    }

}