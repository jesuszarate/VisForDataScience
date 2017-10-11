/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject;

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData.slice(); //

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';


        let goals = [];
        goals.push(d3.max(this.teamData, d => d.value[this.goalsConcededHeader]));
        goals.push(d3.max(this.teamData, d => d.value[this.goalsMadeHeader]));

        /** Setup the scales*/
        this.goalScale = d3.scaleLinear()
            .domain([0, d3.max(goals, d => d)])
            .range([this.cell.buffer, this.cell.width * 2 - this.cell.buffer]);


        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
            .range([
                "#ece2f0",
                '#016450'
            ])
            // ([
            //     "rgb(203, 208, 217)",
            //     "rgb(172, 189, 194)",
            //     "rgb(109, 149, 145)",
            //     "rgb(112, 153, 149)",
            //     "rgb(76, 123, 115)",
            //     "rgb(57, 115, 102)",
            //     "rgb(41, 97, 79)"])
            .domain([
                d3.min(this.tableElements, function (d) {
                    //console.log(d.value["Wins"]);
                    return d.value["Wins"];
                }),
                d3.max(this.tableElements, function (d) {
                    //console.log(d.value["Wins"]);
                    return d.value["Wins"];
                })
            ]);

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null;
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains

        // Create the x axes for the goalScale.


        this.Xaxis("#goalHeader", "none", this.cell.width, this.cell.height, "none");

        //add GoalAxis to header of col 1.

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 


    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let tr = d3.select("tbody").selectAll("tr")
            .data(this.tableElements)
            .enter()
            .append("tr");

        //Append th elements for the Team Names
        let th = tr.selectAll("th").data(function (d) {
            return [d.key];
        })
            .enter()
            .append("th")
            .text(function (d) {
                return d;
            });

        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        let goalsMadeHeader = 'Goals Made';
        let goalsConcededHeader = 'Goals Conceded';

        let td = tr.selectAll("td").data(function (d) {
            /* create data array here */
            console.log(d);
            return [
                //{'type': d.value['aggregate'], 'vis': 'text', 'value': d.key},
                {
                    'type': d.value['aggregate'],
                    'vis': 'goals',
                    'value': [d.value[goalsMadeHeader], d.value[goalsConcededHeader], d.value["Delta Goals"]]
                },
                {'type': d.value['aggregate'], 'vis': 'text', 'value': [d.value["Result"].label]},
                {'type': d.value['aggregate'], 'vis': 'bar', 'value': [d.value["Wins"]]},
                {'type': d.value['aggregate'], 'vis': 'bar', 'value': [d.value["Losses"]]},
                {'type': d.value['aggregate'], 'vis': 'bar', 'value': [d.value["TotalGames"]]}
            ];
        })
            .enter()
            .append('td');


        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )



        // Population of bar cells
        let bars = td.filter(function (d) {
            return d.vis === 'bar';
        })
            .append("svg")
            .attr("width", this.cell.width + 20)
            .attr("height", this.cell.height + 5);


        let colorScale = this.aggregateColorScale;
        let rect = bars.append("rect")
            .attr("height", 20)
            .attr("width", function (d) {
                return d.value[0] * 10;
            })
            .style("fill", function (d) {
                return colorScale(d.value[0]);
            });
        //.classed("aggregate", true);


        let text = bars
            .append("text")
            .text(function (d) {
                return d.value[0];
            })
            // We need to move the label to the middle of the slice. Our arc generator
            // is smart enough to know how to do this. Notice that arc.centroid gives us the center of the visible wedge.
            .attr("transform", function (d) {
                console.log(d.value[0] * 10 - 10);
                return "translate(" + (d.value[0] * 10  - 5) + "," + 10 + ")";
            })
            // Finally some extra text styling to make it look nice:
            .attr("dy", ".35em")
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", "10px");


        // let rectText = bars.append("text")
        //     .text(function (d) {
        //         console.log(d.value[0]);
        //         return d.value[0];
        //     })
        //     .attr("transform", function (d) {
        //         return "translate(" + 0  + "," + 0 + ")";
        //     });

        // Population of text cells
        td.filter(function (d) {
            return d.vis === 'text';
        })
            .text(function (d) {
                return d.value;
            });


        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks

    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******

    }


    Xaxis(idName, dataName, width, height, data, scale) {
        let svg = d3.select(idName)
            .append("svg")
            .attr("width", width * 2 + 20)
            .attr("height", height);

        let xAxis = d3.axisBottom();
        xAxis.scale(this.goalScale);

        // css class for the axis
        svg.classed("axis", true)
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .call(xAxis);
    }

}
