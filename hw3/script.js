/**
 * Makes the first bar chart appear as a staircase.
 *
 * Note: use only the DOM API, not D3!
 */
function staircase() {
    // ****** TODO: PART II ******
    orderBarChart('barChart_a');
    orderBarChart('barChart_b');
}

//if (document.readyState === "complete") { changeData(); }

function orderBarChart(idName) {
    let barChart = document.getElementById(idName).firstElementChild;
    let heights = getAllHeights(barChart.children);

    let children = barChart.children;

    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        child.setAttribute("height", heights[i]);

    }
}

function getAllHeights(children) {

    let bars = [];
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        bars[i] = child.getAttribute("height");
    }
    return bars.sort(function (a, b) {
        return a - b
    });
}

/**
 * Render the visualizations
 * @param error
 * @param data
 */
function update(error, data) {
    if (error !== null) {
        alert('Could not load the dataset!');
    } else {
        // D3 loads all CSV data as strings;
        // while Javascript is pretty smart
        // about interpreting strings as
        // numbers when you do things like
        // multiplication, it will still
        // treat them as strings where it makes
        // sense (e.g. adding strings will
        // concatenate them, not add the values
        // together, or comparing strings
        // will do string comparison, not
        // numeric comparison).

        // We need to explicitly convert values
        // to numbers so that comparisons work
        // when we call d3.max()

        for (let d of data) {
            d.a = +d.a;
            d.b = +d.b;
        }
    }

    // Set up the scales
    let aScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.a)])
        .range([0, 150]);
    let bScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.b)])
        .range([0, 150]);
    let iScale = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, 110]);


    // ****** TODO: PART III (you will also edit in PART V) ******

    // Select and update the 'a' bar chart bars
    updateABarGraphWithData("#barChart_a", aScale, data);

    // Select and update the 'b' bar chart bars
    updateBBarGraphWithData("#barChart_b", bScale, data);

    // Select and update the 'a' line chart path using this line generator

    let aLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.a));

    updateLineChart("#lineChart_a", aLineGenerator, data);

    // Select and update the 'b' line chart path (create your own generator)
    let bLineGenerator = d3.line()
        .x((d, i) => iScale(i))
        .y((d) => aScale(d.b));

    updateLineChart("#lineChart_b", bLineGenerator, data);

    // Select and update the 'a' area chart path using this area generator
    // Select and update the 'b' area chart path (create your own generator)
    let aAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.a));

    let bAreaGenerator = d3.area()
        .x((d, i) => iScale(i))
        .y0(0)
        .y1(d => aScale(d.b));


    updateLineChart("#areaChart_a", aAreaGenerator, data);
    updateLineChart("#areaChart_b", bAreaGenerator, data);


    // Select and update the scatterplot points
    updateScatterChart("#scatterPlot", aScale, bScale, data);

    // ****** TODO: PART IV ******
    registerHoverOverBar("barChart_a");
    registerHoverOverBar("barChart_b");

    registerScatterPointClick("#scatterPlot")
}

function registerHoverOverBar(idName) {
    let element = document.getElementById(idName);
    element.onmouseover = function () {
        onHoverOverBar(idName);
    };

    element.onmouseout = function (idName) {
        onHoverLeaveBar(idName);
    }
}

function onHoverOverBar(idName) {
    let element = document.getElementById(idName);
    let rect = event.target;
    rect.style.fill = "teal";

}

function onHoverLeaveBar(idName) {
    let element = document.getElementById(idName);
    let rect = event.target;
    rect.style.fill = "steelblue";
}

function registerScatterPointClick(idName) {
    let svg = d3.select(idName);
    let circle = svg.selectAll('circle')
        .on('click', function (d) {
            console.log("x: " + d.a + ", y: " + d.b);
        })
}

function updateScatterChart(idName, xScale, yScale, data) {
    let svg = d3.select(idName);
    let circle = svg.selectAll('circle')
        .data(data);

    let newCircle = circle.enter().append("circle")
        .attr("cx", function (d) {
            //return xScale(d.a);
            return 0;
        })
        .attr("cy", function (d) {
            //return yScale(d.b);
            return 0;
        })
        .attr("r", 5)
        .style("opacity", 0);

    circle.exit()
        .style("opacity", 1)
        .transition()
        .duration(3000)
        .style("opacity", 0)
        .remove();

    circle = newCircle.merge(circle);

    circle.transition()
        .duration(3000)
        // .attr("x", function (d, i) {
        //     return i * 10;
        // })
        .attr("cx", function (d) {
            return xScale(d.a);
        })
        .attr("cy", function (d) {
            return yScale(d.b);
        })
        // .on('click', function (d) {
        //     console.log("x: " + d.a + ", y: " + d.b);
        // })
        .style("fill", "steelblue")
        .style("opacity", 1);

}

function updateLineChart(idName, generator, data) {
    let svg = d3.select(idName);
    svg.selectAll('path')
        .attr("d", generator(data));
}

function updateABarGraphWithData(idName, scale, data) {

    let svg = d3.select(idName);

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
            return scale(d.a);
        })
        .style("fill", "steelblue")
        .style("opacity", 1);
}

function updateBBarGraphWithData(idName, scale, data) {
    let svg = d3.select(idName);

    // the data binding
    let bars = svg.selectAll("rect")
        .data(data);

    let newBars = bars.enter().append("rect")
    // .attr("x", function (d, i) {
    //     return i * 10;
    // })
        .attr("y", 0)
        .attr("width", 10)
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
            return scale(d.b);
        })
        .style("fill", "steelblue")
        .style("opacity", 1);
}


/**
 * Load the file indicated by the select menu
 */
function changeData() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        randomSubset();
    }
    else {
        d3.csv('data/' + dataFile + '.csv', update);
    }
}

/**
 *   Load the file indicated by the select menu, and then slice out a random chunk before passing the data to update()
 */
function randomSubset() {
    let dataFile = document.getElementById('dataset').value;
    if (document.getElementById('random').checked) {
        d3.csv('data/' + dataFile + '.csv', function (error, data) {
            let subset = [];
            for (let d of data) {
                if (Math.random() > 0.5) {
                    subset.push(d);
                }
            }
            update(error, subset);
        });
    }
    else {
        changeData();
    }
}