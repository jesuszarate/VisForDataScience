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


    // TODO: Select and update the scatterplot points
    updateScatterChart("#scatterPlot", aScale, iScale, data);

    // ****** TODO: PART IV ******

}

function updateScatterChart(idName, xScale, yScale, data){
    let svg = d3.select(idName);
    svg.selectAll('circle')
        .data(data)
        .attr("cx", function (d) {
            return xScale(d.a);
        })
        .attr("cy", function (d) {
            return yScale(d.b);
        });

}

function updateLineChart(idName, generator, data) {
    let svg = d3.select(idName);
    svg.selectAll('path')
        .attr("d", generator(data));
}

function updateABarGraphWithData(idName, scale, data) {
    let svg = d3.select(idName);

    let rects = svg.selectAll("rect")
        .data(data)
        .attr("height", function (d) {
            return scale(d.a);
        });

}

function updateBBarGraphWithData(idName, scale, data) {
    let svg = d3.select(idName);

    let rects = svg.selectAll("rect")
        .data(data)
        .attr("height", function (d) {
            return scale(d.b);
        });

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