/** Class representing a Tree. */
class Tree {
    /**
     * Creates a Tree Object
     * parentNode, children, parentName,level,position
     * @param {json[]} json - array of json object with name and parent fields
     */
    constructor(json) {

        this.nodeList = [];
        for (let i = 0; i < json.length; i++) {
            let node = new Node(json[i].name, json[i].parent);
            if (node.parentName === "root") {
                this.root = node;
            }
            this.nodeList.push(node);
        }
        //console.log(this.root.name + " : " + this.root.parentName)
    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {

        for (let i = 0; i < this.nodeList.length; i++) {
            //console.log(this.nodeList[i]);
            let currentNode = this.nodeList[i];
            for (let j = 1; j < this.nodeList.length; j++) {
                let nextNode = this.nodeList[j];
                if (currentNode.name === nextNode.parentName) {
                    currentNode.addChild(this.nodeList[j]);
                    nextNode.parentNode = currentNode;
                }
            }
        }

        //Assign Positions and Levels by making calls to assignPosition() and assignLevel()
        this.root.position = 0;
        this.assignLevelAndPosition(this.root, 0);
        this.assignPosition(this.root, 0);

        for (let i = 0; i < this.nodeList.length; i++) {
            let currentNode = this.nodeList[i];
            console.log(currentNode.position + ", " + currentNode.level);
        }
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        let queue = [node];
        let n;

        while (queue.length > 0) {

            n = queue.shift();
            //callback(n.value);
            //node.level = level;

            let children = n.children;

            for (let i = 0; i < children.length; i++) {
                let nextNode = children[i];
                nextNode.position = i;
                //this.assignLevelAndPosition(nextNode, level + 1);
                queue.push(nextNode);
            }
        }

    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevelAndPosition(node, level) {
        node.level = level;
        //node.position = position;

        let children = node.children;

        for (let i = 0; i < children.length; i++) {
            let nextNode = children[i];
            //nextNode.position = level + i;
            this.assignLevelAndPosition(nextNode, level + 1);
        }
    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        let svg = d3.select("svg");

        svg.selectAll("circle")
            .data(this.nodeList)
            .enter().append("circle")
            .attr("cx", function (d) {
                return (d.  level + 1) * 200;
            })
            .attr("cy", function (d) {
                return (d.position + 1) * 200;
            })
            .attr("r", function (d) {
                return 60;
            });

        svg.selectAll("text")
            .data(this.nodeList)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", function (d, i) {
                return (d.level + 1) * 200;
            })
            .attr("y", function (d, i) {
                return (d.position + 1) * 200;
            })
            .text(function (d, i) {
                //return d.position + ", " + d.level;
                return d.name;
            });


        //
        // svg.selectAll("circle")
        //     .data(this.nodeList)
        //     .enter().append("circle")
        //
        //     .attr("cx", function (d) {
        //         return d.position * 100 + 50
        //     })
        //     .attr("cy", function (d) {
        //         return d.level * 100 + 50
        //     })
        //     .attr("r", function (d) {
        //         return 30;
        //     });
        //     //.style("fill", "steelblue");
    }

}