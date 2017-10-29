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

        let I_PopularPercentage;
        let D_PopularPercentage;
        let R_PopularPercentage;
        for (let res in electionResult) {
            if (electionResult[res].I_PopularPercentage !== undefined) {
                I_PopularPercentage = electionResult[res].I_PopularPercentage;
                I_PopularPercentage = +I_PopularPercentage.substring(0, I_PopularPercentage.length - 1);
            }
            if (electionResult[res].D_PopularPercentage !== undefined) {
                D_PopularPercentage = electionResult[res].D_PopularPercentage;
                D_PopularPercentage = +D_PopularPercentage.substring(0, D_PopularPercentage.length - 1);
            }
            if (electionResult[res].R_PopularPercentage !== undefined) {
                R_PopularPercentage = electionResult[res].R_PopularPercentage;
                R_PopularPercentage = +R_PopularPercentage.substring(0, R_PopularPercentage.length - 1);
            }
        }

        let percentageData = [
            {"Party": "I", "percentage": I_PopularPercentage},
            {"Party": "D", "percentage": D_PopularPercentage},
            {"Party": "R", "percentage": R_PopularPercentage}];

        this.svg.selectAll("rect").remove();

        let reference = this;
        let rect = this.svg.selectAll("rect")
            .data(percentageData);

        rect.exit().remove();

        let rectEnter = rect.enter().append("rect");

        this.createRectangle(rectEnter, this.svgWidth);
    };


    createRectangle(rect, width) {
        let prev = 0;
        let reference = this;
        rect.attr("x", function (d) {
            let curr = prev;
            prev += (d["percentage"] / 100) * width;
            return curr;
        })
            .attr("width", function (d) {
                return (d["percentage"] / 100) * width;
            })
            .attr("class", function (d) {
                return "votePercentage " + reference.chooseClass(d["Party"]);
            })
            .attr("height", 50);
    }
}