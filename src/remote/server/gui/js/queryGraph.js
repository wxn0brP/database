const queryGraphFunc = {
    queryInput: document.querySelector("#query-graph-node"),
    outputMethodSelect: document.querySelector("#query-graph-output-method"),

    init(){
        document.querySelector("#query-graph-btn").addEventListener("click", async () => {
            const node = queryGraphFunc.queryInput.value.trim();
            const edges = await graphActions.find(node);
            db_data = edges;
            queryGraphFunc.displayEdges();
        });

        document.querySelector("#query-graph-all-btn").addEventListener("click", async () => {
            const edges = await graphActions.getAll();
            db_data = edges;
            queryGraphFunc.displayEdges();
        });
    },

    displayEdges(){
        const method = queryGraphFunc.outputMethodSelect.value;

        switch(method){
            case "table":
                if(!db_data || db_data.length == 0){
                    data_output.innerHTML = "<p>No data</p>";
                    return;
                }
                data_output.innerHTML = templates.tableData({ data: db_data });
            break;
            case "graph":
                queryGraphFunc.displayEdgesGraph();
            break;
        }
    },

    displayEdgesGraph(){
        if(!db_data || db_data.length == 0){
            data_output.innerHTML = "<p>No data</p>";
            return;
        }
        data_output.innerHTML = "";
        const { nodes, links } = queryGraphFunc.transformData(db_data);

        const div = document.createElement("div");
        div.style.height = "500px";
        div.style.width = "99%";
        data_output.appendChild(div);

        const width = div.clientWidth;
        const height = div.clientHeight;
        
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            })

        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);
        
        const g = svg.append("g");
        
        const simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink().id(d => d.id).distance(90))
            .force("charge", d3.forceManyBody().strength(-90))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius(50))
            .force("gravity", d3.forceManyBody().strength(20));
        
        const link = g.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(links)
            .enter().append("line")
            .attr("stroke-width", 2)
            .style("stroke", "var(--accent)");
        
        const node = g.append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(nodes)
            .enter().append("g");
        
        node.append("circle")
            .attr("r", 8)
            .attr("fill", "var(--accent)");
        
        node.append("text")
            .attr("dx", 12)
            .attr("dy", ".35em")
            .attr("fill", "var(--txt)")
            .text(d => d.id)
            .style("cursor", "pointer")
            .on("click", function(event, d) {
                queryGraphFunc.copyToClipboard(d.id);
            });
        
        simulation
            .nodes(nodes)
            .on("tick", () => {
                link.attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y);
        
                node.attr("transform", d => `translate(${d.x},${d.y})`);
            });
        
        simulation.force("link").links(links);
        div.appendChild(svg.node());

        const resetView = document.createElement("button");
        resetView.innerText = "Reset view";
        resetView.addEventListener("click", () => {
            svg.transition().duration(750)
                .call(zoom.transform, d3.zoomIdentity);
        });
        data_output.appendChild(resetView);
    },

    transformData(inputData){
        const nodesSet = new Set();
        
        const links = inputData.map(({ a, b }) => {
            nodesSet.add(a);
            nodesSet.add(b);
            return { source: a, target: b };
        });

        const nodes = Array.from(nodesSet).map(id => ({ id }));
        return { nodes, links };
    },

    copyToClipboard(text){
        navigator.clipboard.writeText(text).then(() => alert("Copied in clipboard!")).catch(() => {
            alert("Failed to copy in clipboard. Manually select and copy it:\n" + text);
        });
    },
}

queryGraphFunc.init();