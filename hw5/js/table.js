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
        goals.push(d3.max(this.tableElements, d => d.value[this.goalsConcededHeader]));
        goals.push(d3.max(this.tableElements, d => d.value[this.goalsMadeHeader]));

        /** Setup the scales*/
        this.goalScale = d3.scaleLinear()
            .domain([0, d3.max(goals, d => d)])
            //.range([this.cell.buffer, this.cell.width * 2 - this.cell.buffer]);
            .range([this.cell.buffer, this.cell.width * 2]);


        /** Used for games/wins/losses*/
        this.gameScale = null;

        /**Color scales*/
        let colorMax = [];
        colorMax.push(d3.max(this.tableElements, d => d.value["Wins"]));
        colorMax.push(d3.max(this.tableElements, d => d.value["Losses"]));
        colorMax.push(d3.max(this.tableElements, d => d.value["Result"].ranking));


        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
            .range([
                "#ece2f0",
                '#016450'
            ])
            .domain([0, d3.max(colorMax, d => d)]);

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/

        this.deltaMin = d3.min(this.tableElements, d => d.value["Delta Goals"]);
        this.deltaMax = d3.max(this.tableElements, d => d.value["Delta Goals"]);

        this.goalColorScale = d3.scaleLinear()
        //.domain([d3.min(goals, d => d), 0, d3.max(goals, d => d)])
            .domain([this.deltaMin, 0, this.deltaMax])
            .range(["#cb181d", "lightgray", "#034e7b"]);
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
        let headers = d3.select("#matchTable").select("tr");

        headers.selectAll("td")
            .on("click", function () {
                table.sortCallBack(table, this.innerText, "single");
            })
            .on("dblclick", function () {
                table.sortCallBack(table, this.innerText, "double");
            });

        let table = this;
        headers.selectAll("th")
            .on("click", function (d) {
                table.sortCallBack(table, this.innerText, "single");
            })
            .on("dblclick", function () {
                table.sortCallBack(table, this.innerText, "double");
            });

        console.log(headers);

        // Clicking on headers should also trigger collapseList() and updateTable(). 


    }

    sortCallBack(table, title, clickType) {

        // Clear of all games
        table.collapseList();

        let tableElements = table.tableElements;
        let criteria;

        title = title.replace(/\s/g, '');
        switch (title) {
            case "Team":
                criteria = "key";
                break;
            case "Goals":
                criteria = "Goals Made";
                break;
            case "Round/Result":
                criteria = "Result";
                break;
            case "Wins":
                criteria = "Wins";
                break;
            case "Losses":
                criteria = "Losses";
                break;
            case "TotalGames":
                criteria = "TotalGames";
                break;
        }

        if (criteria === "key") {
            tableElements.sort(function (x, y) {
                if(clickType === "double")
                    return d3.descending(x[criteria], y[criteria]);
                return d3.ascending(x[criteria], y[criteria]);
            });
        }
        else if (criteria === "Result") {
            tableElements.sort(function (x, y) {
                if(clickType === "double")
                    return d3.descending(x.value[criteria].ranking, y.value[criteria].ranking);
                return d3.ascending(x.value[criteria].ranking, y.value[criteria].ranking);
            });
        }
        else {
            tableElements.sort(function (x, y) {
                if(clickType === "double")
                    return d3.descending(x.value[criteria], y.value[criteria]);
                return d3.ascending(x.value[criteria], y.value[criteria]);
            });
        }
        table.updateTable();
    }

    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        let tr = d3.select("tbody").selectAll("tr")
            .data(this.tableElements);

        tr.exit().remove();

        let tree = this.tree;
        let newTr = tr.enter()
            .append("tr")
            .on("mouseover", function (d, i) {
                tree.updateTree(d);
            })
            .on("mouseout", function () {
                tree.clearTree();
            });

        tr = newTr.merge(tr);

        //Append th elements for the Team Names
        this.populateTeamCells(tr);

        //Append td elements for the remaining columns.
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        let goalsMadeHeader = 'Goals Made';
        let goalsConcededHeader = 'Goals Conceded';

        let td = tr.selectAll("td").data(function (d) {
            /* create data array here */
            console.log(d);
            let res = [
                //{'type': d.value['aggregate'], 'vis': 'text', 'value': d.key},
                {
                    'type': d.value['type'],
                    'vis': 'goals',
                    'value': [d.value[goalsMadeHeader], d.value[goalsConcededHeader], d.value["Delta Goals"]]
                },
                {'type': d.value['type'], 'vis': 'text', 'value': [d.value["Result"].label]},
                {'type': d.value['type'], 'vis': 'bar', 'value': [d.value["Wins"]]},
                {'type': d.value['type'], 'vis': 'bar', 'value': [d.value["Losses"]]},
                {'type': d.value['type'], 'vis': 'bar', 'value': [d.value["TotalGames"]]}
            ];
            return res;
        });

        td.exit().remove();

        let newTd = td.enter().append('td');
        td = newTd.merge(td);

        //Create diagrams in the goals column
        //Set the color of all games that tied to light gray
        this.goalsDiagram(td);

        //Add scores as title property to appear on hover
        //Populate cells (do one type of cell at a time )
        this.populateAggregateCells(td);
    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******

        //Only update list for aggregate clicks, not game clicks
        //console.log(this.tableElements[i]);
        if (this.tableElements[i].value["type"] === "game") {
            return;
        }
        else if (this.tableElements[i].value["type"] !== "game" &&
            this.tableElements[i + 1].value["type"] === "game") {
            let games = this.tableElements[i].value["games"].slice();

            // REMOVE GAMES
            for (let j = 0; j < games.length; j++) {
                let game = games[j];
                game.key = game.key.substr(1, game.key.length);
                this.tableElements.splice(i + 1, 1);
            }
        }
        else {
            let games = this.tableElements[i].value["games"].slice();

            // ADD GAMES
            for (let j = 0; j < games.length; j++) {
                let game = games[j];
                game.key = "x" + game.key;
                this.tableElements.splice(i + j + 1, 0, game);
            }
        }
        this.updateTable();
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {

        // ******* TODO: PART IV *******

        let games = this.tableElements;

        // REMOVE GAMES
        for (let j = 0; j < games.length; j++) {
            let game = games[j];
            if (game.value["type"] === "game") {
                game.key = game.key.substr(1, game.key.length);
                this.tableElements.splice(j, 1);
            }
        }

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

    goalsDiagram(td) {

        let allGoals = td.filter(function (d) {
            return d.vis === "goals";
        });

        let goalsTeam = allGoals.selectAll("svg")
            .data(function (d) {
                return [d];
            });

        /********** For Team **************/
        goalsTeam.exit().remove();
        goalsTeam = goalsTeam.enter();

        goalsTeam = goalsTeam.append("svg").merge(goalsTeam);

        goalsTeam.attr("width", this.cell.width * 2 + 20)
            .attr("height", this.cell.height + 5);

        this.drawGameGoalVis(goalsTeam);

    }

    drawTeamGoalVis(goals) {
        let goalScale = this.goalScale;
        let goalColorScale = this.goalColorScale;

        let deltaMin = this.deltaMin;
        let deltaMax = this.deltaMax;

        this.drawDeltaGoals(goals, goalScale, goalColorScale);


        this.drawTeamGoalsMade(goals, goalScale, goalColorScale, deltaMax);
        this.drawTeamGamesConsided(goals, goalScale, goalColorScale, deltaMin);

    }

    drawGameGoalVis(goals) {
        let goalScale = this.goalScale;
        let goalColorScale = this.goalColorScale;

        let deltaMin = this.deltaMin;
        let deltaMax = this.deltaMax;

        this.drawDeltaGoals(goals, goalScale, goalColorScale);

        this.drawGameGoalsMade(goals, goalScale, goalColorScale, deltaMax);
        this.drawGameGoalsCon(goals, goalScale, goalColorScale, deltaMin);
    }

    drawGameGoalsMade(goals, goalScale, goalColorScale, deltaMax) {
        this.drawGame(goals, goalScale, goalColorScale, deltaMax, "made");
    }

    drawGameGoalsCon(goals, goalScale, goalColorScale, deltaMin) {
        this.drawGame(goals, goalScale, goalColorScale, deltaMin, "con");
    }

    drawGame(goals, goalScale, goalColorScale, deltaMin, type) {
        let height = 20;
        let width = 20;
        let y = 0;

        let pie = d3.pie();

        pie.value(function (d) {
            return 10;
        });

        let pieData = pie([100]);
        let arc = d3.arc();

        arc.outerRadius(5);
        arc.innerRadius(3);

        let groupArea = goals
            .append("g")
            .attr("height", height)
            .attr("width", function (d) {
                return goalScale(Math.abs(d.value[2])) - 15;
            })
            .attr("x", function (d) {
                return goalScale(d.value[0]);
            })
            .attr("y", function (d) {
                return 5;
            })
            .attr("transform", function (d) {
                let value = d.value[1];
                if (type === "made") {
                    value = d.value[0];
                }
                return ("translate(" + goalScale(value) + "," + 5 + ")");
            });

        let groups = groupArea.selectAll("g")
            .data(function (d) {

                return pie([d]);
            })
            .enter()
            .append("g")
            .attr("x", function (d) {
                return 0;
            })
            .attr("y", function (d) {
                return 0;
            })
            .style("fill", function (d) {
                //return goalColorScale(d.data.value[2]);
                let value = d.value[1];
                if (type === "made") {
                    value = d.value[0];
                }
                return value === 0 ? goalColorScale(0) : goalColorScale(deltaMin);
            });

        groups.append("path")
            .attr("d", d3.arc()
                .outerRadius(5)
                .innerRadius(function (d) {
                    if (d.data["type"] === "aggregate") {
                        return 0;
                    }
                    return 3;
                }));
    }

    populateAggregateCells(td) {

        let barTd = td.selectAll("svg")
            .data(function (d) {
                return [d];
            });
        barTd.exit().remove();
        barTd = barTd.enter();

        barTd = barTd.append("svg").merge(barTd);

        let bars = barTd.filter(function (d) {
            return d.vis === 'bar';// && d.type === "aggregate";
        });

        // bars = barTd.selectAll("svg")
        //     .data(function (d) {
        //         return [d];
        //     });

        // bars.exit().remove();
        // bars = bars.enter();
        //
        // bars = bars.append("svg").merge(bars);

        bars.attr("width", this.cell.width + 20)
            .attr("height", this.cell.height + 5);


        let colorScale = this.aggregateColorScale;

        let rect = bars.selectAll("rect")
            .data(function (d) {
                return [d];
            });

        rect.exit().remove();

        rect = rect
            .enter()
            .append("rect")
            .merge(rect);

        rect.attr("height", 20)
            .attr("width", function (d) {
                return d.value[0] * 10;
            })
            .style("fill", function (d) {
                return colorScale(d.value[0]);
            });


        let text = bars.selectAll("text")
            .data(function (d) {
                return [d];
            });

        text.exit().remove();

        text = text.enter().append("text").merge(text);

        text.text(function (d) {
            return d.value[0];
        })
            .attr("transform", function (d) {
                return "translate(" + (d.value[0] * 10 - 5) + "," + 10 + ")";
            })
            .attr("dy", ".35em")
            .style("fill", "white")
            .style("text-anchor", "middle")
            .style("font-size", "10px");

        // Population of text cells
        this.populateTextCells(td);
    }

    drawDeltaGoals(goals, goalScale, goalColorScale) {

        let deltaGoals = goals.append("rect")
            .attr("height", function (d) {
                if (d.value["type"] === "game") {
                    return 3;
                }
                return 10;
            })
            .attr("width", function (d) {
                if (d.value["type"] === "game") {
                    return goalScale(Math.abs(d.value[2])) - 15 - 6;
                }
                return goalScale(Math.abs(d.value[2])) - 15;
            })
            .attr("x", function (d) {
                if (d.value["type"] === "game") {
                    return goalScale(d3.min([d.value[0], d.value[1]])) + 3;

                }
                return goalScale(d3.min([d.value[0], d.value[1]]));
            })
            .attr("y", function (d) {
                if (d.value["type"] === "game") {
                    return 3;
                }
                return 0;
            })
            .style("fill", function (d) {
                return goalColorScale(d.value[2]);
            });
    }

    // drawTeamGoalsMade(goals, goalScale, goalColorScale, deltaMax) {
    //     let goalsMade = goals.append("circle")
    //         .attr("cx", function (d) {
    //             return goalScale(d.value[0]);
    //         })
    //         .attr("cy", function (d) {
    //             return 5;
    //         })
    //         .attr("r", function (d) {
    //             return 5;
    //         })
    //         .attr("title", function (d) {
    //             return d.value[0];
    //         })
    //         .style("fill", function (d) {
    //
    //             return d.value[2] === 0 ? goalColorScale(0) : goalColorScale(deltaMax);
    //         });
    // }
    //
    // drawTeamGamesConsided(goals, goalScale, goalColorScale, deltaMin) {
    //     let goalsCon = goals.append("circle")
    //         .attr("cx", function (d) {
    //             return goalScale(d.value[1]);
    //         })
    //         .attr("cy", function (d) {
    //             return 5;
    //         })
    //         .attr("r", function (d) {
    //             return 5;
    //         })
    //         .attr("title", function (d) {
    //             return d.value[1];
    //         })
    //         .style("fill", function (d) {
    //             return d.value[2] === 0 ? goalColorScale(0) : goalColorScale(deltaMin);
    //         });
    // }

    populateTextCells(td) {
        let text = td.filter(function (d) {
            return d.vis === 'text';
        });

        text.exit().remove();

        text = text.enter().append("text").merge(text);

        text.text(function (d) {
            return d.value;
        });
    }

    populateTeamCells(tr) {

        let table = this;
        let th = tr.selectAll("th").data(function (d, i) {
            //console.log("i " + i);
            return [[d, i]];
        });

        th.exit().remove();

        th = th.enter()
            .append("th")
            .merge(th);

        th.text(function (d) {
            return d[0].key;
        }).on("click", function (d) {
            table.updateList(d[1]);
        })

    }
}
