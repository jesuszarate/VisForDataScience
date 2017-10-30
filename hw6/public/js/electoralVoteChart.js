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

        let Max = d3.max(electionResult, d => +d["Total_EV"]);
        let Min = d3.min(electionResult, d => +d["Total_EV"]);

        //console.log(this.svgWidth);
        let scale = d3.scaleLinear()
            .range([0, this.svgWidth])
            .domain([0, 500]);

        let electionResultsByParty = {"I": [], "D": [], "R": []};

        electionResult.forEach(function (state) {
            electionResultsByParty[state["State_Winner"]].push(state);
        });

        for (let key in electionResultsByParty) {
            let party = electionResultsByParty[key];

            electionResultsByParty[key] = party.sort(function (x, y) {
                return d3.ascending(+x["RD_Difference"], +y["RD_Difference"]);
            });
        }

        let ICount = electionResultsByParty["I"].length;
        let RCount = ICount + electionResultsByParty["R"].length;
        let DCount = RCount + electionResultsByParty["D"].length;


        let cleanResults = this.joinArrays(electionResultsByParty);

        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .electoralVotes class to style your bars.
        let reference = this;

        this.svg.selectAll("g").remove();

        let h = this.svgHeight / 3;
        let brush = d3.brushX().extent([[0,h+20 ],[this.svgWidth,100+30]]).on("end", this.brushed);

        this.svg.selectAll("g")
            .attr("class", "brush")
            .style("fill", "gray")
            .call(brush);


        let groupNumber = [1];
        let bars = this.svg.selectAll("g")
            .data(groupNumber);


        let prev = 0;
        let barsEnter = bars.enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(" + 0 + "," + 0 + ")";
            });

        bars = bars.merge(barsEnter);

        //-------------------------------------------------------
        //bars.selectAll("rect").remove();

        let rect = bars.selectAll("rect")
            .data(cleanResults);

        rect.exit().remove();

        let rectEnter = rect.enter().append("rect");

        let IPos = 0;
        let DPos = 0;
        let RPos = 0;

        let previus = 0;
        let another = rectEnter
            .attr("x", function (d, i) {
                let curr = previus;
                previus += scale(+d["Total_EV"]);
                if (i === ICount)
                    IPos = curr;
                if (i === DCount)
                    DPos = curr;
                if (i === RCount)
                    RPos = curr;
                return curr;
            })
            .attr("y", reference.svgHeight / 2)
            .attr("width", function (d) {

                return scale(+d["Total_EV"]);
            })
            .style("fill", function (d) {
                if (d["State_Winner"] === "I")
                    return "#45AD6A";
                return (colorScale(+d["RD_Difference"]));
            })
            .attr("height", 50)
            .attr("class", function (d) {
                return "electoralVotes";
            });
        rect = rectEnter.merge(another);

        bars.merge(barsEnter);

        //Display total count of electoral votes won by the Democrat and Republican party
        //on top of the corresponding groups of bars.
        //HINT: Use the .electoralVoteText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        let midpoint = this.svg.append("rect")
            .attr("x", function (d, i) {
                return reference.svgWidth / 2;
            })
            .attr("y", 70)
            .attr("width", function (d) {
                return 3;
            })
            .attr("height", 60)
            .classed("middlePoint", true);

        //Just above this, display the text mentioning the total number of electoral votes required
        // to win the elections throughout the country
        //HINT: Use .electoralVotesNote class to style this text element

        this.svg.selectAll("text").remove();

        let middleText = "Electorial Vote (270 needed to win)";
        this.svg.append("text")
            .attr("x", (reference.svgWidth / 2) - (middleText.length * 7))
            .attr("y", 40)
            .attr("class", "electoralVoteText")
            .text(middleText);

        this.svg.append("text")
            .attr("x", IPos)
            .attr("y", 40)
            .attr("class", function (d) {
                return "electoralVoteText" + reference.chooseClass("I")
            })
            .text(ICount);

        this.svg.append("text")
            .attr("x", DPos)
            .attr("y", 40)
            .attr("class", function (d) {
                return "electoralVoteText" + reference.chooseClass("D")
            })
            .text(DCount);

        this.svg.append("text")
            .attr("x", RPos)
            .attr("y", 40)
            .attr("fill", this.chooseClass("R"))
            .attr("class", function (d) {
                return "electoralVoteText" + reference.chooseClass("R")
            })
            .text(RCount);


        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

        //******* TODO: PART V *******
        //Implement brush on the bar chart created above.
        //Implement a call back method to handle the brush end event.
        //Call the update method of shiftChart and pass the data corresponding to brush selection.
        //HINT: Use the .brush class to style the brush.

        this.svg.append("g")
        //.attr("class", "brush")
            .call(brush);

        bars.exit().remove();




    };

    brushed(){
        alert("here");
    }

    joinArrays(arr) {
        let indArra = [];
        let resultArr = [];
        for (let key in arr) {
            let party = arr[key];
            resultArr = resultArr.concat(party);
            indArra = indArra.concat(this.getValues(party));
        }
        return resultArr;
    }

    getValues(arr) {
        let res = [];
        for (let key in arr) {
            let party = arr[key];
            let num = party["RD_Difference"];
            res.push(num);
        }
        return res;
    }

}
