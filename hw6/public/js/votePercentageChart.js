/** Class implementing the votePercentageChart. */
class VotePercentageChart {

    /**
     * Initializes the svg elements required for this chart;
     */
    constructor() {
        this.margin = {top: 30, right: 20, bottom: 30, left: 50};
        let divvotesPercentage = d3.select("#votes-percentage").classed("content", true);

        //fetch the svg bounds
        this.svgBounds = divvotesPercentage.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 200;

        //add the svg to the div
        this.svg = divvotesPercentage.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight)

    }


    /**
     * Returns the class that needs to be assigned to an element.
     *
     * @param party an ID for the party that is being referred to.
     */
    chooseClass(data) {
        if (data == "R") {
            return "republican";
        }
        else if (data == "D") {
            return "democrat";
        }
        else if (data == "I") {
            return "independent";
        }
    }

    /**
     * Renders the HTML content for tool tip
     *
     * @param tooltip_data information that needs to be populated in the tool tip
     * @return text HTML content for toop tip
     */
    tooltip_render(tooltip_data) {
        let text = "<ul>";
        tooltip_data.result.forEach((row) => {
            text += "<li class = " + this.chooseClass(row.party) + ">" + row.nominee + ":\t\t" + row.votecount + "(" + row.percentage + "%)" + "</li>"
        });

        return text;
    }

    /**
     * Creates the stacked bar chart, text content and tool tips for Vote Percentage chart
     *
     * @param electionResult election data for the year selected
     */
    update(electionResult) {

        //for reference:https://github.com/Caged/d3-tip
        //Use this tool tip element to handle any hover over the chart
        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function () {
                return [0, 0];
            })
            .html((d) => {
                /* populate data in the following format*/
                let tooltip_data = {
                    "result": [
                        {
                            "nominee": d.D_Nominee_prop,
                            "votecount": d.D_Votes_Total,
                            "percentage": d.D_PopularPercentage,
                            "party": "D"
                        },
                        {
                            "nominee": d.R_Nominee_prop,
                            "votecount": d.R_Votes_Total,
                            "percentage": d.R_PopularPercentage,
                            "party": "R"
                        },
                        {
                            "nominee": d.I_Nominee_prop,
                            "votecount": d.I_Votes_Total,
                            "percentage": d.I_PopularPercentage,
                            "party": "I"
                        }
                    ]
                };
                //pass this as an argument to the tooltip_render function then,
                //return the HTML content returned from that method.

                return this.tooltip_render(tooltip_data);
            });


        // ******* TODO: PART III *******

        //Create the stacked bar chart.
        //Use the global color scale to color code the rectangles.
        //HINT: Use .votesPercentage class to style your bars.

        //Display the total percentage of votes won by each party
        //on top of the corresponding groups of bars.
        //HINT: Use the .votesPercentageText class to style your text elements;  Use this in combination with
        // chooseClass to get a color based on the party wherever necessary

        //Display a bar with minimal width in the center of the bar chart to indicate the 50% mark
        //HINT: Use .middlePoint class to style this bar.

        //Just above this, display the text mentioning details about this mark on top of this bar
        //HINT: Use .votesPercentageNote class to style this text element

        //Call the tool tip on hover over the bars to display stateName, count of electoral votes.
        //then, vote percentage and number of votes won by each party.

        //HINT: Use the chooseClass method to style your elements based on party wherever necessary.

        let percentageData = [electionResult[0], electionResult[1], electionResult[2]];

        this.svg.selectAll("rect").remove();

        let reference = this;

        //-----------------------------------------------
        this.svg.selectAll("g").remove();

        let tile = this.svg.selectAll("g")
            .data(percentageData);

        tile.exit().remove();

        let prev = 0;
        let tileEnter = tile.enter().append("g")
            .call(tip)
            .attr("transform", function (d, i) {
                let curr = prev;
                let party =  reference.getPopularPercentage(d, i);
                prev += (party / 100) * reference.svgWidth;
                return "translate(" + curr + "," + 130 + ")";
            })
            .on("mouseover", tip.show)
            .on("mouseleave", tip.hide);

        this.createRectangle(tileEnter, reference.svgWidth);
        tile.merge(tileEnter);

    };

    getPopularPercentage(d, i){
        let percentage = d[this.getParty(i) + "_PopularPercentage"];
        return +percentage.substring(0, percentage.length - 1);
    }

    getParty(num) {
        if (num === 0) {
            return "I";
        }
        if (num === 1) {
            return "D";
        }
        if (num === 2) {
            return "R";
        }
    }

    createRectangle(rect, width) {
        let prev = 0;
        let reference = this;
        rect.append("rect")
            .attr("y", 40)
            .attr("width", function (d, i) {
                return (reference.getPopularPercentage(d, i) / 100) * width;
            })
            .attr("class", function (d, i) {
                return "votePercentage " + reference.chooseClass(reference.getParty(i));
            })
            .attr("height", 50);

        let label = rect.append("text")
            .attr("class", function (d, i) {
                return "votesPercentageText " + reference.chooseClass(reference.getParty(i));
            });

        label.append("tspan")
            .attr("x", function (d, i) {
                return ((reference.getPopularPercentage(d, i) / 100) * width)/2;
            })
            .attr("y", 0)
            .text(function (d, i) {
                return d[reference.getParty(i) + "_Nominee_prop"];
            });


        label.append("tspan")
            .attr("x", function (d, i) {
                return ((reference.getPopularPercentage(d, i) / 100) * width)/4;
            })
            .attr("y", 30)
            .text(function (d, i) {
                return d[reference.getParty(i) + "_PopularPercentage"];
            })
            // .style("fill", function (d, i) {
            //     return reference.chooseClass(i);
            // })

    }
}