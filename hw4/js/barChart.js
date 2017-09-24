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

        this.Yaxis('#xAxis', selectedDimension, width, height, this.allData);
        this.Xaxis('#yAxis', 'year', width, height, this.allData);

        // Create the bars (hint: use #bars)

        let aScale = d3.scaleLinear()
            .domain([0, d3.max(this.allData, d => d[selectedDimension])])
            .range([0, height]);

        this.updateABarGraphWithData('#bars', selectedDimension, aScale, this.allData, width, height);


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
        let svg = d3.select(idName);

        let padding = 100;

        //let spacing = height / data.length;

        let min = d3.min(data, function (d) {
            return d[dataName];
        });
        let max = d3.max(data, function (d) {
            return d[dataName];
        });

        let ticks = this.getYears(data);

        console.log("min: " + min);
        console.log("max: " + max);

        let xScale = d3.scaleTime()
            .domain([new Date(min, 0, 1), new Date(max, 0, 1)])
            //.domain([min, max])
            //.range([0, width - padding + 20])
            .rangeRound([0,width - padding + 20], 100)
             .nice();

        console.log(ticks.length);

        let xAxis = d3.axisBottom();
        xAxis.scale(xScale)
            .ticks(d3.timeYear.every(4))
            //.ticks(20)
            //.tickPadding([10])
            //.tickValues(ticks)
            .tickFormat(d3.timeFormat("%Y"));


        // css class for the axis
        svg.classed("axis", true)
        //.attr("transform", "translate(" + 75 + "," + 355 + ")")
            .attr("transform", "translate(" + 75 + "," + 355 + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 10)
            //.attr("dy", ".35em")
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");
    }

    Yaxis(idName, dataName, width, height, data) {
        let svg = d3.select(idName);

        let padding = 45;

        // let spacing = height / data.length;

        let min = d3.min(data, function (d) {
            return d[dataName];
        });
        let max = d3.max(data, function (d) {
            return d[dataName];
        });

        console.log("min: " + min);
        console.log("max: " + max);
        let yScale = d3.scaleLinear()
            .domain([max, min])
            .range([10, height - padding])
            .nice();

        // let color = d3.scaleLinear()
        //     .domain([min, max])
        //     .range(["darkred", "lightgray", "steelblue"]);

        let yAxis = d3.axisLeft();
        yAxis.scale(yScale);

        // css class for the axis
        svg.classed("axis", true)
            .attr("transform", "translate(" + 75 + "," + 0 + ")")
            .call(yAxis);
    }

    updateABarGraphWithData(idName, dataName, scale, data, width, height) {

        //data = [70, 100, 30];

        //let data_name = 'goals';
        let svg = d3.select(idName);

        // add padding on all sides
        let padding = 75;
        let spacing = width / data.length;

        let min = d3.min(data, function (d) {
            return d[dataName];
        });
        let max = d3.max(data, function (d) {
            return d[dataName];
        });

        let aScale = d3.scaleLinear()
            .domain([min, max])
            //.range([height - padding, 10]);
            //.rangeRound([10,height - padding + 20], 10);
            .range([10, height - padding + 20]);
        //.range([0, height]);

        // svg.attr({
        //     width: width + 2 * padding,
        //     height: height + 2 * padding
        // });

        let barWidth = (width - padding) / data.length;

        data = BarChart.sortData(data, dataName);

        let bars = svg.selectAll("rect")
            .data(data);

        let newBars = bars.enter().append("rect")
            .attr("x", function (d, i) {
                return (i * barWidth) + padding;
            })
            .attr("y", function (d, i) {
                let nd = aScale(d[dataName]);
                return (height - nd - 45);
            })
            .attr("width", barWidth - 5)
            //.attr("width", barWidth)
            .attr("height", function (d) {
                let nd = d[dataName];
                return aScale(nd);
            })
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
                return (i * barWidth) + padding;
            })
            .attr("y", function (d, i) {
                let nd = aScale(d[dataName]);
                return (height - nd - 45);
            })
            .attr("width", barWidth - 5)
            //.attr("width", barWidth)
            .attr("height", function (d) {
                let nd = d[dataName];
                return aScale(nd);
            })
            .style("fill", "steelblue")
            .style("opacity", 1);
    }

    getYears(data) {
        let values = [];
        for (let i = 0, len = data.length; i < len; i++) {
            values.push(new Date(data[i].year, 0, 1));
            //values.push(data[i].year);
        }
        return values;
    };

    static sortData(data, dataName) {
        data = data.sort(function compare(a, b) {
            if (a['year'] < b['year'])
                return -1;
            else if (a['year'] > b['year'])
                return 1;
            else
                return 0;
        });
        return data;
    }

}