/** Class implementing the bar chart view. */
class BarChart {

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {



        // ******* TODO: PART I *******

        console.log(selectedDimension);


        // Create the x and y scales; make
        // sure to leave room for the axes

        // Create colorScale

        // Create the axes (hint: use #xAxis and #yAxis)
        let svg = d3.select("#barChart");

        let width = parseInt(svg.attr("width"));
        let height = parseInt(svg.attr("height"));

        this.axes('#xAxis', selectedDimension, width, height, this.allData);

        // Create the bars (hint: use #bars)

        let aScale = d3.scaleLinear()
            .domain([0, d3.max(this.allData, d => d[selectedDimension])])
            .range([0, width]);

        this.updateABarGraphWithData('#bars', aScale, this.allData);


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData() {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.

        let e = document.getElementById('dataset');

        let selectedData = e.options[e.selectedIndex].value;
        this.updateBarChart(selectedData);
    }

    Xaxis(idName, dataName, width, height, data) {

    }

    Yaxis(idName, dataName, width, height, data) {
        let svg = d3.select(idName);

        let padding = 25;

        //let width = parseInt(svg.attr("width"));
        //let height = parseInt(svg.attr("height"));

        //execute = function () {
        //let data = [0.3, -0.8, 0.01, -0.4, 1.2, 1.3, -0.2, -1.21, 0.82, 0.4, -0.2, 0.3];


        // Convert the data array to an object, so that it's easy to look up
        // data values by state names
        // let dataLookup = {};
        // data.forEach(function (stateRow) {
        //     // d3.csv will read the values as strings; we need to convert them to floats
        //     let so = stateRow[dataName];
        //     dataLookup[dataName] = parseFloat(stateRow[dataName]);
        // });

        let spacing = height / data.length;

        let min = d3.min(data, function (d) {
            return d[dataName];
        });
        let max = d3.max(data, function (d) {
            return d[dataName];
        });

        console.log("min: " + min);
        console.log("max: " + max);
        let xScale = d3.scaleLinear()
            .domain([0, 200])
            .range([0, width])
            .nice();

        console.log(width);

        // let color = d3.scaleLinear()
        //     .domain([min, max])
        //     .range(["darkred", "lightgray", "steelblue"]);

        let xAxis = d3.axisLeft();
        xAxis.scale(xScale);

        // css class for the axis
        svg.classed("axis", true)
            // moving the axis to the right place
            .attr("transform", "translate(" + 50 + "," + (padding) + ")")
            .call(xAxis);
    }

    updateABarGraphWithData(idName, scale, data) {


        let data_name = 'goals';
        let svg = d3.select(idName);

        let width = parseInt(svg.attr("width"));
        let height = parseInt(svg.attr("height"));

        // add padding on all sides
        let padding = 0;

        // svg.attr({
        //     width: width + 2 * padding,
        //     height: height + 2 * padding
        // });

        let bars = svg.selectAll("rect")
            .data(data);

        let newBars = bars.enter().append("rect")
        // .attr("x", function (d, i) {
        //     return i * 10;
        // })
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 0)
            .style("opacity", 0)
            .classed("barChart", true);

        bars.exit()
            .style("opacity", 1)
            .transition()
            .duration(3000)
            .style("opacity", 0)
            .remove();

        bars = newBars.merge(bars);

        bars.transition()
            .duration(3000)
            .attr("x", function (d, i) {
                return i * 10;
            })
            .attr("y", 0)
            .attr("width", 10)
            .attr("height", function (d) {
                return scale(d[data_name]);
            })
            .style("fill", "steelblue")
            .style("opacity", 1);


        /////////////////////////


        ////////////////////////

    }

}