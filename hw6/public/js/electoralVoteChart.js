class ElectoralVoteChart {
    /**
     * Constructor for the ElectoralVoteChart
     *
     * @param shiftChart an instance of the ShiftChart class
     */
    constructor(shiftChart) {
        this.shiftChart = shiftChart;

        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divelectoralVotes = d3.select("#electoral-vote").classed("content", true);

        //Gets access to the div element created for this chart from HTML
        this.svgBounds = divelectoralVotes.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 150;

        //creates svg element within the div
        this.svg = divelectoralVotes.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);

        this.yearScale = d3.scaleLinear()
            .range([50, this.svgWidth - 50])
            //.range([this.cell.buffer, this.cell.width * 2 - this.cell.buffer]);
            .domain([1940, 2012]);
    }

    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass(party) {
        if (party == "R") {
            return "republican";
        }
        else if (party == "D") {
            return "democrat";
        }
        else if (party == "I") {
            return "independent";
        }
    }


    /**
     * Creates the stacked bar chart, text content and tool tips for electoral vote chart
     *
     * @param electionResult election data for the year selected
     * @param colorScale global quantile scale based on the winning margin between republicans and democrats
     */

    update(electionResult, colorScale) {

        // ******* TODO: PART II *******

        //Group the states based on the winning party for the state;
        //then sort them based on the margin of victory

        // Grouping by winning party


        let electionResultsByParty = d3.nest()
            .key(function (d) {
                return d["State_Winner"];
            })
            .entries(electionResult);

        console.log(electionResultsByParty);

        let cleanResults = [];

        for (let prty in electionResultsByParty) {
            console.log("list: ");
            console.log(electionResultsByParty[prty].values);
            cleanResults = cleanResults.concat(electionResultsByParty[prty].values)
        }


        cleanResults = cleanResults.sort(function (x, y) {
            return d3.ascending(x["RD_Difference"], y["RD_Difference"]);
        });


        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .electoralVotes class to style your bars.


        let rect = this.svg.selectAll("rect")
            .data(cleanResults);

        rect.exit().remove();

        // rect = rect.selectAll("g").enter()
        //     .attr("transform", function (d) {
        //         return "translate(" + d["Total_EV"] + "," + 10 + ")";
        //     }).merge(rect);

        //newRect.exit().remove();

        let rectEnter = rect.enter().append("rect");

        let another = rectEnter
            .attr("x", function (d, i) {
                return i * d["Total_EV"];
            })
            .attr("y", 0)
            .attr("width", function (d) {
                return d["Total_EV"];
            })
            .attr("height", 20)
            .attr("class", "electoralVotes");
        rect = rectEnter.merge(another);



        //Display total count of electoral votes won by the Democrat and Republican party
        //on top of the corresponding groups of bars.
        //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        //Just above this, display the text mentioning the total number of electoral votes required
        // to win the elections throughout the country
        //HINT: Use .electoralVotesNote class to style this text element

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

        //******* TODO: PART V *******
        //Implement brush on the bar chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.


    };


}
