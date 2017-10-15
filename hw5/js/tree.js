/** Class implementing the tree view. */
class Tree {
    /**
     * Creates a Tree Object
     */
    constructor() {
        this.links = null;
    }

    /**
     * Creates a node/edge structure and renders a tree layout based on the input data
     *
     * @param treeData an array of objects that contain parent/child information.
     */
    createTree(treeData) {

        // ******* TODO: PART VI *******

        let height = 800;
        let width = 300;

        //Create a tree and give it a size() of 800 by 300. 
        let treemap = d3.tree().size([height, width]);

        let root = d3.stratify()
            .id(function(d) {
                return d.id.replace( /^\D+/g, '');//d.id.substr(len - 1, len - 1);
            })
            .parentId(function(d) {
                return d.ParentGame;
            })(treeData);


        //Add nodes and links to the tree.
        let data = d3.hierarchy(root, function (d) {
            return d.children;
        });

        data = treemap(data);

        let margin = {top: 20, right: 90, bottom: 30, left: 90};

        let nodes = data.descendants();
        let links = data.descendants().slice(1);

        nodes.forEach(function (d) {
           d.y = d.y + 100;
        });

        let treeg = d3.select("#tree");
        let link = treeg.selectAll(".link")
            .data(links);

        link.exit().remove();

        let newLink = link
            .enter().append("path")
            .attr("class", function (d) {
                return "link";
                //return d.data.data["Team"] === "Argentina"
                //    || d.data.data["Team"] === "Argentina" ? "link selected" : "link";
            })
            .attr("d", function (d) {
                return "M" + d.y + "," + d.x
                    + "C" + (d.y + d.parent.y) / 2 + "," + d.x
                    + " " + (d.y + d.parent.y) / 2 + "," + d.parent.x
                    + " " + d.parent.y + "," + d.parent.x;
            });
        link = newLink.merge(link);
        this.links = link;

        let node = treeg.selectAll(".node")
            .data(nodes)
            .enter().append("g")
            .attr("class", function (d) {
                let clss = (d.data.data["Wins"] > 0) ? "winner" : "node";
                return clss + " circle";
            })
            .attr("transform", function(d) {
                return "translate(" + d.y + "," + d.x + ")"; });

        // adds the circle to the node
        node.append("circle")
            .attr("r", 10);

        // adds the text to the node
        node.append("text")
            .attr("dy", ".35em")
            .attr("x", function(d) { return d.children ? -13 : 13; })
            .attr("class", function (d) {
                return "winner text";
            })
            .style("text-anchor", function(d) {
                return d.children ? "end" : "start"; })
            .text(function(d) {
                return d.data.data.Team;
            });
    };

    /**
     * Updates the highlighting in the tree based on the selected team.
     * Highlights the appropriate team nodes and labels.
     *
     * @param row a string specifying which team was selected in the table.
     */
    updateTree(row) {
        // ******* TODO: PART VII *******
        console.log(row);

        if(row.key.substr(0,0) === "x"){

        }
        else {
            this.links.attr("class", function (d) {
                let data = d.data.data;
                if(data["Team"] === row.key && +data["Wins"] === 1){
                    return "link selected";
                }
                return "link";
            })
        }

    }

    /**
     * Removes all highlighting from the tree.
     */
    clearTree() {
        // ******* TODO: PART VII *******

        // You only need two lines of code for this! No loops! 
    }
}
