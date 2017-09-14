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
        this.assignLevelAndPosition(this.root, 0, 0);
        this.assignPosition(this.root, 0);
    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {
        let queue = [node];
        let n;

        let currLevel = 0;
        let pos = 0;
        while (queue.length > 0) {

            n = queue.shift();

            if(currLevel !== n.level) {
                pos = n.parentNode.position;
                currLevel = n.level;
            }
            n.position = pos;// + n.level;
            pos++;

            let children = n.children;

            for (let i = 0; i < children.length; i++) {
                let nextNode = children[i];
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

        let count = 0;
        for (let i = 0; i < children.length; i++) {
            let nextNode = children[i];
            count += this.assignLevelAndPosition(nextNode, level + 1);
        }
        return children.length;
    }

    /**
     * Function that renders the tree
     */
    renderTree() {
        let svg = d3.select("svg");

        let xDist = 220;
        let yDist = 120;
        let nodeRadius = 45;
        svg.selectAll(".line")
            .data(this.nodeList)
            .enter()
            .append("line")
            .attr("x1", function (d) {
                return (d.level + 1) * xDist
            })
            .attr("y1", function (d) {
                return (d.position + 1) * yDist
            })
            .attr("x2", function (d) {
                if (d.parentNode !== null) {
                    return (d.parentNode.level + 1) * xDist;
                }
                return ((d.level + 1) * xDist);
            })
            .attr("y2", function (d) {
                    if (d.parentNode !== null) {
                        return (d.parentNode.position + 1) * yDist;
                    }
                    return ((d.position + 1) * yDist);
                }
            );

        svg.selectAll("circ")
            .data(this.nodeList)
            .enter().append("circle")
            .attr("cx", function (d) {
                return (d.level + 1) * xDist;
            })
            .attr("cy", function (d) {
                return (d.position + 1) * yDist;
            })
            .attr("r", function (d) {
                return nodeRadius;
            });

        svg.selectAll("text")
            .data(this.nodeList)
            .enter().append("text")
            .attr("class", "label")
            .attr("x", function (d) {
                return (d.level + 1) * xDist;
            })
            .attr("y", function (d) {
                return (d.position + 1) * yDist;
            })
            .text(function (d) {
                return d.name;// + " " + d.position + ", " + d.level;
            });
    }

}